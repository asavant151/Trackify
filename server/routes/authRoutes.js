const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getAllUsers, updateProfile, updateEmployee } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, admin, getAllUsers);
router.put('/employee/:id', protect, admin, updateEmployee);
router.put('/profile', protect, updateProfile);

module.exports = router;
