const mysql = require("mysql2");

let db = mysql.createPool({
    multipleStatements: true,
    host: "localhost",
    user: "root",
    password: 'Kulo123!',
    database: "nh_printchecker",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function takeSettings(db) {
  try {
      const [settingsRows] = await db.promise().query("SELECT * FROM setting");
      return settingsRows.reduce((settings, row) => {
          settings[row.key] = row.value;
          return settings;
      }, {});
  } catch (error) {
      console.error("Errore durante l'ottenimento delle impostazioni:", error);
      return {};
  }
}

async function initializeSettings() {
  const settings = await takeSettings(db);

  return {
      db,
      daysBack: parseInt(settings.daysBack) || 15,
      veryOld: parseInt(settings.veryOld) || 60,
      below: parseInt(settings.below) || 5000,
      interval: parseInt(settings.interval) || 600000
  };
}

// let daysBack = 15;
// let veryOld = 60;
// let below = 5000;
// let interval = 600000;

module.exports = initializeSettings;
 