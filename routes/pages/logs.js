const express = require('express');
const generateTxt = require('../generateTxt.js');
const initializeSettings = require('../settings.js');
const fs = require('fs').promises;

const router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        let deviceList; let textPrinters; let logs;
        const settings = await initializeSettings();
        const { db } = settings;
    
        try {
            const data = await fs.readFile('printers.json', 'utf8');
            deviceList = JSON.parse(data);
        } catch (err) {
            console.log('Errore durante la lettura del file', err);
            return next(err);
        }
        
        textPrinters = await generateTxt(deviceList);
        logs = await db.promise().query("SELECT * FROM logs");

        res.render('logs', { printer: deviceList, txt: textPrinters, log: logs });

    } catch (error) {
        console.error("Errore nella gestione della rotta /:", error);
        next(error);
    }
});
router.post('/', async function(req, res, next) {
})

module.exports = router;
  