const mysql = require('mysql2/promise');

const stubPool = {
  query: async () => [],
  end: async () => {},
  promise() {
    return { query: async () => [[], []] };
  }
};

const db = { ...stubPool };
let dbAvailable = false;
let pool;

(async function initPool() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'nh_printchecker',
      waitForConnections: true,
      connectionLimit: 10,
    });
    await pool.getConnection();
    dbAvailable = true;
    db.query = pool.query.bind(pool);
    db.end = pool.end.bind(pool);
    db.promise = () => pool;
  } catch (err) {
    console.warn('Database connection failed, running without DB:', err.code);
  }
})();

async function takeSettings(pool) {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM setting');
    return rows;
  } catch (err) {
    console.error('Error fetching settings:', err);
    return [];
  }
}

takeSettings(db).catch(() => {});

let daysBack = 15;
let veryOld = 60;
let below = 5000;
let interval = 600000;

module.exports = {
  db,
  dbAvailable,
  daysBack,
  veryOld,
  below,
  interval,
};
