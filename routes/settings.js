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
      console.log("Result from DB:", settingsRows); // Log dei risultati della query
      return settingsRows.reduce((settings, row) => {
          settings[row.setting] = row.value;
          return settings;
      }, {});
  } catch (error) {
      console.error("Errore durante l'ottenimento delle impostazioni:", error);
      return {};
  }
}

let settings = takeSettings(db);

async function initializeSettings() {
  if (!db) {
    db = mysql.createPool({
        multipleStatements: true,
        host: 'localhost',
        user: 'root',
        password: 'Kulo123!',
        database: 'nh_printchecker',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
  }

  //console.log("daysBack: " + settings.daysBack + " VeryOld: " + settings.VeryOld + " Interval: " + settings.interval + " below: " + settings.below);
  return {
      // db,
      // daysBack: parseInt(settings.daysBack),
      // veryOld: parseInt(settings.veryOld),
      // below: parseInt(settings.below),
      // interval: parseInt(settings.interval)

      db,
      daysBack: settings.daysBack,
      veryOld: settings.veryOld,
      below: settings.below,
      interval: 60000
  };
}

// let daysBack = 15;
// let veryOld = 60;
// let below = 5000;
// let interval = 600000;

module.exports = initializeSettings;
 