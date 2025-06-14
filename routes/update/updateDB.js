const snmp = require("net-snmp");
const { db, dbAvailable } = require('../settings.js');
const getOids = require('../oids.js');
const check477 = require('./update477.js');
const checkMFP = require('./updateMFP.js');
const checkBlacks = require('./updateBlacks.js');


async function updateDB() {
    if (!dbAvailable) {
        console.warn('Database not available, skipping updateDB');
        return;
    }

    let printersOnline = 0;
    let printers = [];
    let maxId = 0;
    try {
        const [printerRows] = await db.promise().query('SELECT * FROM printer');
        printers = printerRows;
        const [maxRows] = await db.promise().query('SELECT MAX(ID) AS maxid FROM printer');
        maxId = maxRows[0]?.maxid || 0;
    } catch (err) {
        console.error(err);
        return;
    }

    for (let i = 0; i < maxId; i++) {
        const printer = printers[i];
        if (!printer) continue;
        let oids = getOids(printer);
        let session= snmp.createSession( printer.ip, "public" );
        session.get( oids, function (e,vb) {
            try {
                if(vb == undefined) {
                    db.query("UPDATE printer SET error = ? WHERE ID = ?", [1, printer.ID]); 
                } else {
                    db.query("UPDATE printer SET error = ? WHERE ID = ?", [0, printer.ID]);
                    printersOnline++;
                    // console.log(printersOnline);
                    check(vb, printer);
                }
            } catch (e) {
                db.query("UPDATE printer SET error = ? WHERE ID = ?", [1, printer.ID]);
                //session.trap ( snmp.TrapType.LinkDown, console.log("Trap error: "+e),[] );                
            }
        });
    }
    await console.log("Database aggiornato " + printersOnline);
}

function check(vb, printer) {
    switch (printer.model) {
        case "477":
            check477(vb, printer);
            break;
        case "P77":
            check477(vb, printer);
            break;
        case "MFP":
            checkMFP(vb, printer);
            break;
        case "XEROX":
            checkBlacks(vb, printer);
            break;
        case "OTHER":
            checkBlacks(vb, printer);
            break;
    }
}

module.exports = updateDB;