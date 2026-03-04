const Leave = require('../models/Leave');
const User = require('../models/User');
const { sendWhatsAppMessage } = require('../services/whatsappService');
const moment = require('moment');

const applyLeave = async (req, res) => {
    try {
        const { fromDate, toDate, reason } = req.body;
        const userId = req.user.id;

        const leave = await Leave.create({ userId, fromDate, toDate, reason });

        const user = await User.findById(userId);
        if (user && user.parentPhone) {
            await sendWhatsAppMessage(user.parentPhone, `Hello,\nYour child ${user.name} has applied for leave from ${moment(fromDate).format('YYYY-MM-DD')} to ${moment(toDate).format('YYYY-MM-DD')}.\nReason: ${reason}\n- Trackify System`);
        }

        res.status(201).json(leave);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const allLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('userId', 'name email employeeId department').sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const approveLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "approved" | "rejected"

        const leave = await Leave.findById(id).populate('userId');
        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        leave.status = status;
        await leave.save();

        if (leave.userId && leave.userId.parentPhone) {
            await sendWhatsAppMessage(leave.userId.parentPhone, `Hello,\nYour child ${leave.userId.name}'s leave request has been ${status}.\n- Trackify System`);
        }

        res.status(200).json(leave);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const myLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { applyLeave, allLeaves, approveLeave, myLeaves };
