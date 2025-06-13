const mysql = require("mysql2");

const stubPool = {
  query: async () => {},
  promise() {
    return { query: async () => [[], []] };
  },
  end: async () => {}
};

const db = { ...stubPool };
let dbAvailable = false;

(function initPool() {
  const pool = mysql.createPool({
    multipleStatements: true,
    host: "localhost",
    user: "root",
    password: "NextHub01!",
    database: "nh_printchecker",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.warn("Database connection failed, running without DB:", err.code);
      return;
    }

    dbAvailable = true;
    db.query = pool.query.bind(pool);
    db.promise = pool.promise.bind(pool);
    db.end = pool.end.bind(pool);
    if (connection) connection.release();
  });
})();

// db.connect((err) => {
//     if (err) {
//       console.log("Errore durante la connessione al database:", err);
//     } else {
//       console.log("Connessione stabilita al database");
//     }
// });


// Test database connection and return settings if available
async function takeSettings(pool) {
  try {
    const [rows] = await pool.promise().query("SELECT * FROM setting");
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
 
