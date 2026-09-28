const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sign } = require('../middleware/auth');

const router = express.Router();
const users = () => db.collection('users');

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt };
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'பெயர், மின்னஞ்சல், கடவுச்சொல் தேவை' });
  }
  if (String(password).length < 4) {
    return res.status(400).json({ error: 'கடவுச்சொல் குறைந்தது 4 எழுத்துகள் இருக்க வேண்டும்' });
  }
  if (users().findOne((u) => String(u.email).toLowerCase() === String(email).toLowerCase())) {
    return res.status(409).json({ error: 'இந்த மின்னஞ்சல் ஏற்கனவே பயன்பாட்டில் உள்ளது' });
  }
  const user = await users().insert({
    name,
    email,
    passwordHash: bcrypt.hashSync(String(password), 10),
    role: 'user',
  });
  res.json({ token: sign(user), user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'மின்னஞ்சல், கடவுச்சொல் தேவை' });
  const user = users().findOne(
    (u) => String(u.email).toLowerCase() === String(email).toLowerCase()
  );
  if (!user || !bcrypt.compareSync(String(password), user.passwordHash)) {
    return res.status(401).json({ error: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்' });
  }
  res.json({ token: sign(user), user: publicUser(user) });
});

router.get('/me', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not signed in' });
  try {
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('../config');
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users().findOne((u) => u.id === payload.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: publicUser(user) });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;