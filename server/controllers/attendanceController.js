const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { sendWhatsAppMessage } = require('../services/whatsappService');
const moment = require('moment');

const getTodayRecord = async (userId) => {
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
    return await Attendance.findOne({ userId, date: { $gte: startOfDay, $lte: endOfDay } });
};

const notifyParent = async (userId, bodyFunc) => {
    const user = await User.findById(userId);
    if (user && user.parentPhone) {
        const message = bodyFunc(user);
        await sendWhatsAppMessage(user.parentPhone, message);
    }
};

const punchIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const { location } = req.body;
        const user = await User.findById(userId);
        let attendance = await getTodayRecord(userId);

        const now = new Date();

        if (attendance) {
            if (attendance.punchIn) return res.status(400).json({ message: 'Already punched in today.' });
        } else {
            let status = 'Present';
            let lateMinutes = 0;
            let penaltyAmount = 0;

            if (user.shiftStart) {
                const [shiftHour, shiftMin] = user.shiftStart.split(':').map(Number);
                const expectedStart = moment(now).set({ hour: shiftHour, minute: shiftMin, second: 0, millisecond: 0 });

                if (moment(now).isAfter(expectedStart)) {
                    lateMinutes = moment(now).diff(expectedStart, 'minutes');
                    if (lateMinutes > 5) { // 5 mins grace period
                        status = 'Late';
                        if (user.latePenaltyRate) {
                            penaltyAmount = user.latePenaltyRate; // Flat penalty for being late
                        }
                    } else {
                        lateMinutes = 0; // within grace period
                    }
                }
            }

            attendance = new Attendance({
                userId,
                date: now,
                status,
                lateMinutes,
                penaltyAmount
            });
        }

        attendance.punchIn = now;
        attendance.location = location;
        attendance.ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        await attendance.save();

        await notifyParent(userId, (user) => `Hello,\nYour child ${user.name} has:\n✔ Arrived at ${moment(now).format('hh:mm A')}\n- Trackify System`);

        res.status(200).json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const breakStart = async (req, res) => {
    try {
        const userId = req.user.id;
        const attendance = await getTodayRecord(userId);

        if (!attendance || !attendance.punchIn) return res.status(400).json({ message: 'Must punch in first.' });

        const openBreak = attendance.breaks.find(b => !b.breakEnd);
        if (openBreak) return res.status(400).json({ message: 'Already on break.' });

        const now = new Date();
        attendance.breaks.push({ breakStart: now });
        await attendance.save();

        await notifyParent(userId, (user) => `Hello,\nYour child ${user.name} has:\n☕ Started Break at ${moment(now).format('hh:mm A')}\n- Trackify System`);

        res.status(200).json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const breakEnd = async (req, res) => {
    try {
        const userId = req.user.id;
        const attendance = await getTodayRecord(userId);

        if (!attendance) return res.status(400).json({ message: 'No attendance record.' });

        const openBreak = attendance.breaks.find(b => !b.breakEnd);
        if (!openBreak) return res.status(400).json({ message: 'Not on break.' });

        const now = new Date();
        openBreak.breakEnd = now;
        openBreak.duration = moment(now).diff(moment(openBreak.breakStart), 'minutes');

        attendance.totalBreakTime += openBreak.duration;

        await attendance.save();

        await notifyParent(userId, (user) => `Hello,\nYour child ${user.name} has:\n🔁 Ended Break at ${moment(now).format('hh:mm A')}\n- Trackify System`);

        res.status(200).json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const punchOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const attendance = await getTodayRecord(userId);

        if (!attendance || !attendance.punchIn) return res.status(400).json({ message: 'Must punch in first.' });
        if (attendance.punchOut) return res.status(400).json({ message: 'Already punched out.' });

        // Close any open break
        const openBreak = attendance.breaks.find(b => !b.breakEnd);
        const now = new Date();
        if (openBreak) {
            openBreak.breakEnd = now;
            openBreak.duration = moment(now).diff(moment(openBreak.breakStart), 'minutes');
            attendance.totalBreakTime += openBreak.duration;
        }

        attendance.punchOut = now;

        const grossMinutes = moment(now).diff(moment(attendance.punchIn), 'minutes');
        const netMinutes = grossMinutes - attendance.totalBreakTime;
        // Prevent negative hours if they punch out immediately without breaks logic error
        attendance.totalWorkHours = Math.max(0, netMinutes / 60);

        const user = await User.findById(userId);
        if (user && user.hourlyRate) {
            // Earned Salary = (WorkHours * HourlyRate) - Flat PenaltyAmount
            // Make sure earned salary isn't negative
            const grossSalary = attendance.totalWorkHours * user.hourlyRate;
            attendance.earnedSalary = Math.max(0, grossSalary - attendance.penaltyAmount);
        }

        await attendance.save();

        await notifyParent(userId, (user) => {
            const hours = Math.floor(netMinutes / 60);
            const mins = Math.floor(netMinutes % 60);
            return `Hello,\nYour child ${user.name} has:\n🚪 Left Office at ${moment(now).format('hh:mm A')}\n\nTotal Working Hours: ${hours}h ${mins}m\n- Trackify System`;
        });

        res.status(200).json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const myRecords = async (req, res) => {
    try {
        const records = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const allRecords = async (req, res) => {
    try {
        const { date, employeeId, status } = req.query;
        let query = {};

        if (date) {
            const d = new Date(date);
            query.date = { $gte: moment(d).startOf('day').toDate(), $lte: moment(d).endOf('day').toDate() };
        }
        if (employeeId) {
            query.userId = employeeId;
        }
        if (status) {
            query.status = status;
        }

        const records = await Attendance.find(query).populate('userId', 'name email employeeId department').sort({ date: -1 });
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { punchIn, breakStart, breakEnd, punchOut, myRecords, allRecords };
