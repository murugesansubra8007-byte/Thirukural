const app = require('./src/app');
const config = require('./config');
const db = require('./src/db');

db.load();

app.listen(config.PORT, () => {
  console.log(`Kuralagam API running → http://localhost:${config.PORT}`);
  console.log(`Admin login with ${config.ADMIN_EMAIL} / ${config.ADMIN_PASSWORD}`);
});