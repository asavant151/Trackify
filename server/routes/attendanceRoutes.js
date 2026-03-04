const express = require('express');
const router = express.Router();
const { punchIn, breakStart, breakEnd, punchOut, myRecords, allRecords } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/auth');

router.post('/punch-in', protect, punchIn);
router.post('/break-start', protect, breakStart);
router.post('/break-end', protect, breakEnd);
router.post('/punch-out', protect, punchOut);
router.get('/my-records', protect, myRecords);
router.get('/all', protect, admin, allRecords);

module.exports = router;
