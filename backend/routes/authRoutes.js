const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { validateRegister, register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', validateRegister, asyncHandler(register));
router.post('/login', asyncHandler(login));

module.exports = router;