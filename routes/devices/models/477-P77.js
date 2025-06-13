const dataConv = require('../../dataConv.js');
const initializeSettings = require('../../settings.js');


async function check477(vb, printer) {
    let connection;

    try {
        const settings = await initializeSettings();
        const { db } = settings;

        connection = await db.promise().getConnection();

        let ye, ma, cy, bk;

        if (printer.model == "477") {
            ye = Math.max(Math.round((vb[1].value * 69) / vb[0].value) * 100, 0);
            ma = Math.max(Math.round((vb[3].value * 69) / vb[2].value) * 100, 0);
            cy = Math.max(Math.round((vb[5].value * 69) / vb[4].value) * 100, 0);
            bk = Math.max(Math.round((vb[7].value * 100) / vb[6].value) * 100, 0);
        } else {
            ye = Math.max(Math.round((vb[1].value * 160) / vb[0].value) * 100, 0);
            ma = Math.max(Math.round((vb[3].value * 160) / vb[2].value) * 100, 0);
            cy = Math.max(Math.round((vb[5].value * 160) / vb[4].value) * 100, 0);
            bk = Math.max(Math.round((vb[7].value * 200) / vb[6].value) * 100, 0);
        }

        const [Ye, yeCh] = dataConv(vb[8].value, printer.model);
        const [Ma, maCh] = dataConv(vb[9].value, printer.model);
        const [Cy, cyCh] = dataConv(vb[10].value, printer.model);
        const [Bk, bkCh] = dataConv(vb[11].value, printer.model);

        await connection.query("UPDATE printer SET drum = ? WHERE ID = ?", [1, printer.ID]);
        await connection.query("UPDATE black SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [bk, Math.round((vb[7].value * 100) / vb[6].value), Bk, bkCh, printer.ID]);
        await connection.query("UPDATE yellow SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [ye, Math.round((vb[1].value * 100) / vb[0].value), Ye, yeCh, printer.ID]);
        await connection.query("UPDATE magenta SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [ma, Math.round((vb[3].value * 100) / vb[2].value), Ma, maCh, printer.ID]);
        await connection.query("UPDATE cyan SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [cy, Math.round((vb[5].value * 100) / vb[4].value), Cy, cyCh, printer.ID]);

    } catch (error) {
        console.error("Errore in check477:", error);
    } finally {
        if (connection) {
            try {
                await connection.release();
            } catch (e) {
                console.error('Errore durante il rilascio della connessione:', e);
            }
        }
    }
}

module.exports = check477;