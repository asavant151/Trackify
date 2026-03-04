const express = require('express');
const router = express.Router();
const { applyLeave, allLeaves, approveLeave, myLeaves } = require('../controllers/leaveController');
const { protect, admin } = require('../middleware/auth');

router.post('/apply', protect, applyLeave);
router.get('/all', protect, admin, allLeaves);
router.put('/approve/:id', protect, admin, approveLeave);
router.get('/my-leaves', protect, myLeaves);

module.exports = router;
