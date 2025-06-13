const { db, dbAvailable } = require('./settings.js');


async function printerList() {
  if (!dbAvailable) {
    console.warn('Database not available, returning empty printer list');
    return [];
  }

  const allPrinters = [];
  let maxID = 0;
  try {
    const [rows] = await db.promise().query('SELECT MAX(ID) AS maxid FROM printer');
    maxID = rows[0]?.maxid || 0;
  } catch (e) {
    console.error(e);
    return allPrinters;
  }

  for (let i = 1; i <= maxID; i++) {
    let printer, toner_black, toner_cyan, toner_yellow, toner_magenta;
    try {
      printer = await db.promise().query("SELECT * FROM printer WHERE ID = " + i);
    } catch (e) {console.error(e) }
    try {
      toner_black = await db.promise().query("SELECT * FROM black WHERE ID = " + i);
    } catch (e) {console.error(e) }
    try {
      toner_cyan = await db.promise().query("SELECT * FROM cyan WHERE ID = " + i);
    } catch (e) {console.error(e) }
    try {
      toner_yellow = await db.promise().query("SELECT * FROM yellow WHERE ID = " + i);
    } catch (e) {console.error(e) }
    try {
      toner_magenta = await db.promise().query("SELECT * FROM magenta WHERE ID = " + i);
    } catch (e) {console.error(e) }

    const printer_toners = [
      printer[0][0],
      toner_yellow[0][0],
      toner_magenta[0][0],
      toner_cyan[0][0],
      toner_black[0][0]
    ];
    allPrinters.push(printer_toners);
  }
  // console.log(allPrinters[0]);
  console.log("Lista stampanti generata");
  return allPrinters;
}

module.exports = printerList;