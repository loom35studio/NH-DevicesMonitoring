const initializeSettings = require('./settings.js');


// EX PRINTERLIST
// async function printerList() {
//   let allPrinters = [];
  
//   let maxID;
//   try {
//     maxID = await db.promise().query('SELECT MAX(ID) AS maxid FROM printer');
//   } catch (e) {
//     console.error(e);
//   }
//   maxID = maxID[0][0].maxid + 1;
//   for (i = 1; i < maxID + 1; i ++) {
//     let printer, toner_black, toner_cyan, toner_yellow, toner_magenta;
//     try {
//       printer = await db.promise().query("SELECT * FROM printer WHERE ID = " + i);
//     } catch (e) {console.error(e) }
//     try {
//       toner_black = await db.promise().query("SELECT * FROM black WHERE ID = " + i);
//     } catch (e) {console.error(e) }
//     try {
//       toner_cyan = await db.promise().query("SELECT * FROM cyan WHERE ID = " + i);
//     } catch (e) {console.error(e) }
//     try {
//       toner_yellow = await db.promise().query("SELECT * FROM yellow WHERE ID = " + i);
//     } catch (e) {console.error(e) }
//     try {
//       toner_magenta = await db.promise().query("SELECT * FROM magenta WHERE ID = " + i);
//     } catch (e) {console.error(e) }

//       printer_toners = [printer[0][0], toner_yellow[0][0], toner_magenta[0][0], toner_cyan[0][0], toner_black[0][0]];
//       allPrinters.push(printer_toners);
//   }
//   // console.log(allPrinters[0]);
//   console.log("Lista stampanti generata");
//   return allPrinters;
// }


async function printerList() {
  let allPrinters = [];
  const settings = await initializeSettings();
  const { db } = settings;
  
  try {
    // Recupera tutte le stampanti in una singola query
    let printers = await db.promise().query('SELECT * FROM printer');
    printers = printers[0]; // Ottieni il risultato delle stampanti

    if (printers.length === 0) {
      return allPrinters; // Restituisce una lista vuota se non ci sono stampanti
    }

    // Ottieni tutti i toner in un'unica query per ciascun tipo di toner
    const [blackToners, cyanToners, yellowToners, magentaToners] = await Promise.all([
      db.promise().query('SELECT * FROM black'),
      db.promise().query('SELECT * FROM cyan'),
      db.promise().query('SELECT * FROM yellow'),
      db.promise().query('SELECT * FROM magenta')
    ]);

    // Mappa i risultati dei toner per ID stampante
    const blackMap = blackToners[0].reduce((map, toner) => (map[toner.ID] = toner, map), {});
    const cyanMap = cyanToners[0].reduce((map, toner) => (map[toner.ID] = toner, map), {});
    const yellowMap = yellowToners[0].reduce((map, toner) => (map[toner.ID] = toner, map), {});
    const magentaMap = magentaToners[0].reduce((map, toner) => (map[toner.ID] = toner, map), {});

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
      allPrinters.push(printerToners);
    });

  } catch (e) {
    console.error(e);
  }

  console.log("Lista stampanti generata");
  return allPrinters;
}
module.exports = printerList;