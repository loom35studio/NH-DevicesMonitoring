const snmp = require("net-snmp");
const initializeSettings = require('../../settings.js');
const getOids = require('../../oids.js');
// MODEL LIST
const check477 = require('../models/477-P77.js');
const checkMFP = require('../models/MFP.js');
const checkXEROX = require('../models/XEROX.js');
const checkOTHER = require('../models/OTHER.js');

async function updateDevicesOnDB() {
    let printersOnline = 0;
    const settings = await initializeSettings();
    const { db } = settings;

    let connection;

    try {
        connection = await db.promise().getConnection();
        let [printers] = await connection.query('SELECT * FROM printer');

        let updatePromises = printers.map(printer => {
            return new Promise((resolve, reject) => {
                let oids = getOids(printer);
                let session = snmp.createSession(printer.ip, "public");

                const closeSession = () => {
                    if (session) {
                        session.close();
                        session = null;
                    }
                };

                session.get(oids, async function (error, vb) {
                    try {
                        if (error || vb === undefined) {
                            await connection.query("UPDATE printer SET error = ? WHERE ID = ?", [1, printer.ID]);
                        } else {
                            await connection.query("UPDATE printer SET error = ? WHERE ID = ?", [0, printer.ID]);
                            printersOnline++;
                            check(vb, printer);
                        }
                    } catch (e) {
                        await connection.query("UPDATE printer SET error = ? WHERE ID = ?", [1, printer.ID]);
                    } finally {
                        closeSession();
                        resolve();
                    }
                });

                // Timeout per chiudere la sessione SNMP se impiega troppo tempo
                setTimeout(() => {
                    if (session) {
                        closeSession();
                    }
                }, 10000);
            });
        });

        await Promise.all(updatePromises);

    } catch (e) {
        console.error(e);
    } finally {
        if (connection) {
            try {
                await connection.release();
            } catch (e) {
                console.error('Errore durante il rilascio della connessione:', e);
            }
        }
    }

    console.log("Database aggiornato. Stampanti online: " + printersOnline);
}

function check(vb, printer) {
    switch (printer.model) {
        case "477":
        case "P77":
            check477(vb, printer);
            break;
        case "MFP":
            checkMFP(vb, printer);
            break;
        case "XEROX":
            checkXEROX(vb, printer);
            break;
        case "OTHER":
            checkOTHER(vb, printer);
            break;
    }
}

module.exports = updateDevicesOnDB;