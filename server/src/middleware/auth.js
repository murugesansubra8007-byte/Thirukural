const jwt = require('jsonwebtoken');
const config = require('../../config');

function sign(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    config.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'தொடர் தேவை | Authentication required' });
  try {
    req.user = jwt.verify(token, config.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'முறையற்ற தொடர் | Invalid or expired token' });
  }
}

function adminRequired(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'நிர்வாகி மட்டுமே அணுக முடியும் | Admin access required' });
  }
  next();
}

function adminOnly(req, res, next) {
  return authRequired(req, res, () => adminRequired(req, res, next));
}

module.exports = { sign, authRequired, adminRequired, adminOnly };