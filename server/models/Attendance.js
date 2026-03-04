const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    punchIn: { type: Date },
    punchOut: { type: Date },
    breaks: [
        {
            breakStart: { type: Date },
            breakEnd: { type: Date },
            duration: { type: Number } // in minutes
        }
    ],
    totalWorkHours: { type: Number, default: 0 },
    totalBreakTime: { type: Number, default: 0 },
    status: { type: String, enum: ['Present', 'Late', 'On Leave', 'Half Day', 'Absent'] },
    lateMinutes: { type: Number, default: 0 },
    penaltyAmount: { type: Number, default: 0 },
    earnedSalary: { type: Number, default: 0 },
    ipAddress: { type: String },
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
