const { Pool } = require('pg');

const stubPool = {
  query: async () => [],
  end: async () => {},
  promise() {
    return { query: async () => [[], []] };
  }
};

const db = { ...stubPool };
let dbAvailable = false;

(function initPool() {
  const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'nh_printchecker',
    port: 5432,
  });

  pool.connect().then(client => {
    dbAvailable = true;
    db.query = pool.query.bind(pool);
    db.end = pool.end.bind(pool);
    db.promise = () => ({
      query: async (sql, params) => {
        const res = await pool.query(sql, params);
        return [res.rows, res.fields];
      }
    });
    client.release();
  }).catch(err => {
    console.warn('Database connection failed, running without DB:', err.code);
  });
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
