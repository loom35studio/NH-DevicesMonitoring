const initializeSettings = require('../../settings.js');
const updateLogs = require('./updateLogs.js');
const convertDevicesToJSON = require("../generate/deviceList.js");


async function updateStock(req, res, next) {
  try {
    const settings = await initializeSettings();
    const { db } = settings;
    let printer = req.body.printerName;
    let action = req.body.tonerAction;
    let toner = req.body.tonerSelection;
    let note = req.body.note;
    let type = "manuale";
    console.log(req.body);

    if (action == "insert") {
      try {
        db.query("UPDATE " + toner + " SET stock = stock + 1 WHERE printerID = " + printer);
        updateLogs(printer, toner, note, type);
      } catch (e) {
        console.log("Errore Query: " + e);
      } finally {
        await convertDevicesToJSON();
      }
    } else if (action == "remove") {
      try {
        db.query("UPDATE " + toner + " SET stock = stock - 1 WHERE printerID = " + printer + " AND stock > 0");
        updateLogs(printer, toner, note, type);
      } catch (e) {
        console.log("Errore Query: " + e);
      } finally {
        await convertDevicesToJSON();
      }
    }

    console.log("aggiornamento JSON");
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = updateStock;
