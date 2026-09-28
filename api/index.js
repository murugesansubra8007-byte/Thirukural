const app = require('../server/src/app');
const db = require('../server/src/db');

let ready = db.hydrate();

module.exports = (req, res) => {
  ready
    .then(() => app(req, res))
    .catch((err) => {
      console.error('Server init failed:', err);
      res.status(500).json({ error: 'Server init failed' });
    });
};