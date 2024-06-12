const initializeSettings = require('../settings.js');
const updateLogs = require('../update/updateLogs.js');


async function updateStock(req) {
  const settings = await initializeSettings();
  const { db } = settings;
  let printer = req.body.printerName;
  let action = req.body.tonerAction;
  let toner = req.body.tonerSelection;
  let note = req.body.note;
  let type = "manuale"
  if (action == "insert") {
      console.log("insert");
      db.query("UPDATE " + toner + " SET stock = stock + 1 WHERE printerID = " + printer);
      updateLogs(printer, toner, note, type);
  } else if (action == "remove") {
      db.query("UPDATE " + toner + " SET stock = stock - 1 WHERE printerID = " + printer + " AND stock > 0");
  }
}

module.exports = updateStock;
