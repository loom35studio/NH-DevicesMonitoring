const initializeSettings = require('../../settings.js');
const fs = require('fs').promises;

// GENERA LISTA STAMPANTI USANDO IL DATABASE
async function takeDevicesFromDB() {
  let deviceList = [];
  const settings = await initializeSettings();
  const { db } = settings;

  let connection;

  try {
      connection = await db.promise().getConnection();

      // Recupera tutte le stampanti in una singola query
      let [printers] = await connection.query('SELECT * FROM printer');

      if (printers.length === 0) {
          return deviceList; // Restituisce una lista vuota se non ci sono stampanti
      }

      // Ottieni tutti i toner in un'unica query per ciascun tipo di toner
      const [blackToners, cyanToners, yellowToners, magentaToners] = await Promise.all([
          connection.query('SELECT * FROM black'),
          connection.query('SELECT * FROM cyan'),
          connection.query('SELECT * FROM yellow'),
          connection.query('SELECT * FROM magenta')
      ]);

      // Mappa i risultati dei toner per ID stampante
      let blackMap = blackToners[0].reduce((map, toner) => (map[toner.ID] = toner, map), {});
      let cyanMap = cyanToners[0].reduce((map, toner) => (map[toner.ID] = toner, map), {});
      let yellowMap = yellowToners[0].reduce((map, toner) => (map[toner.ID] = toner, map), {});
      let magentaMap = magentaToners[0].reduce((map, toner) => (map[toner.ID] = toner, map), {});

      // Combina i dati delle stampanti e dei toner
      printers.forEach(printer => {
          const id = printer.ID;
          const printerToners = [
              printer,
              yellowMap[id] || {},
              magentaMap[id] || {},
              cyanMap[id] || {},
              blackMap[id] || {}
          ];
          deviceList.push(printerToners);
      });

  } catch (e) {
      console.error(e);
  } finally {
      // Rilascia la connessione
      if (connection) {
          try {
              await connection.release();
          } catch (e) {
              console.error('Errore durante il rilascio della connessione:', e);
          }
      }
  }

  console.log("Lista stampanti generata");
  return deviceList;
}

// USA LISTA GENERATA DAL DB PER SALVARLE SU UN FILE JSON
async function convertDevicesToJSON() {
    let deviceList = await takeDevicesFromDB();

    let jsonContent = JSON.stringify(deviceList, null, 2);

    try {
        await fs.writeFile('printers.json', jsonContent);
        console.log('File salvato con successo');
    } catch (err) {
        console.error('Errore durante la scrittura del file', err);
    }
}

module.exports = convertDevicesToJSON;
