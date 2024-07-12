const updateDevicesOnDB= require('./devices/update/updateList.js'); 
const convertDevicesToJSON = require("./devices/generate/deviceList.js");
const settingsList = require("./settings.js");


async function timedUpdate() {
    const settings = await settingsList();
    const { interval } = settings;

    console.log('------------------------------------------------');
    console.log(`⏳ Inizio update lista device: ${new Date().toISOString()} `);
    const startTime = Date.now();

    try {
        await updateDevicesOnDB();
        await convertDevicesToJSON();
    } catch (err) {
        console.error('⛔ Errore durante l\'aggiornamento della lista:', err);
    } finally {
        const endTime = Date.now();
        console.log(`✅ Fine update lista device: ${new Date().toISOString()}`);
        console.log(`🕒 Durata dell'aggiornamento: ${endTime - startTime}ms`);
        console.log('------------------------------------------------');
        setTimeout(timedUpdate, 0);
    }
}

timedUpdate();

module.exports = timedUpdate;