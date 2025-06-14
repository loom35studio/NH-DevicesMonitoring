const initializeSettings = require('../../settings.js');
const updateLogs = require('./updateLogs.js');
const convertDevicesToJSON = require("../generate/deviceList.js");


async function updateStock(req) {
  const settings = await initializeSettings();
  const { db } = settings;
  try {
    connection = await db.promise().getConnection();

    let printer = req.body.printerName;
    let action = req.body.tonerAction;
    let toner = req.body.tonerSelection;
    let note = req.body.note;
    let type = "manuale";
    // console.log(req.body);

    if (action == "insert") {
        await connection.query("UPDATE " + toner + " SET stock = stock + 1 WHERE printerID = " + printer)
        console.log("query inserimento riuscita");
        updateLogs(printer, toner, note, type);
    } else if (action == "remove") {
        await connection.query("UPDATE " + toner + " SET stock = stock - 1 WHERE printerID = " + printer + " AND stock > 0")
        console.log("query inserimento riuscita")
    }
  } catch (e) {
    console.error("Errore durante l'aggiornamento dello stock:", e);
  }
}



module.exports = updateStock;
