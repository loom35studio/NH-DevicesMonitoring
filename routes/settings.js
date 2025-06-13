require('dotenv').config()
const mysql = require("mysql2");
const fs = require('fs').promises;

let db = mysql.createPool({
    multipleStatements: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSW,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    idleTimeout: 10
});

async function takeSettings(db) {
  let connection;

  try {
      connection = await db.promise().getConnection();
      const [settingsRows] = await connection.query("SELECT * FROM setting");

      return settingsRows.reduce((settings, row) => {
          settings[row.setting] = row.value;
          return settings;
      }, {});
  } catch (error) {
      console.error("Errore durante l'ottenimento delle impostazioni:", error);
      return {};
  } finally {
      if (connection) {
          try {
              await connection.release();
          } catch (error) {
              console.error('Errore durante il rilascio della connessione:', error);
          }
      }
  }
}

async function writeSettings() {
  let settings = await takeSettings(db);
  const jsonString = JSON.stringify(settings, null, 2);
  console.log(settings);
  fs.writeFile('settings.json', jsonString, (err) => {
      if (err) {
        console.log('Errore durante la scrittura del file', err);
      } else {
        console.log('File salvato con successo');
      }
  });
}

writeSettings();

async function initializeSettings() {
  let settings;
  try {
      const data = await fs.readFile('settings.json', 'utf8');
      settings = JSON.parse(data);
  } catch (err) {
      console.log('Errore durante la lettura del file', err);
      return next(err); // Passa l'errore al gestore degli errori
  }

  return {
      db,
      daysBack: settings.daysBack,
      veryOld: settings.veryOld,
      below: settings.below,
      interval: settings.interval
  };
}
module.exports = initializeSettings;
 