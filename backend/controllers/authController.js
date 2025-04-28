const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const JWT_SECRET = process.env.JWT_SECRET;

exports.validateRegister = [
  body('username').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  const [[exists]] = await db.query('SELECT 1 FROM Users WHERE username=?', [username]);
  if (exists) return res.status(409).json({ error: 'Username already taken' });

  const hashed = await bcrypt.hash(password, 12);
  await db.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashed]);
  res.status(201).json({ message: 'User registered successfully' });
});

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query('SELECT id, password FROM Users WHERE username = ?', [username]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

  const user = rows[0];
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});