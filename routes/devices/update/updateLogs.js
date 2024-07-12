const initializeSettings = require('../../settings.js');
const { format } = require('date-fns');


async function updateLogs(printer, toner, note, type) {
    const settings = await initializeSettings();
    const { db } = settings;
    let printerInfo = await db.promise().query("SELECT * FROM printer WHERE ID = " + printer);
    let now = new Date();
    let formattedDate = format(now, 'yyyy-MM-dd HH:mm:ss');
    let values = "('"+ printerInfo[0][0].society + "', '" + printer + "', '" + printerInfo[0][0].model + "', '" + toner + "', '" + formattedDate + "', '" + note + "', '" + type +"')";
    
    await db.promise().query("INSERT INTO logs (society, printer, model, toner, data, note, type) VALUES " + values);
    //non funziona devo capire che mi restituisce il query ti aspetto per farlo
}



module.exports = updateLogs;