const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
    phone: { type: String },
    parentPhone: { type: String },
    department: { type: String },
    employeeId: { type: String, required: true, unique: true },
    shiftStart: { type: String, default: '09:00' }, // standard format HH:mm
    shiftEnd: { type: String, default: '17:00' },
    hourlyRate: { type: Number, default: 0 },
    latePenaltyRate: { type: Number, default: 0 } // Penalty amount per minute or flat rate
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
