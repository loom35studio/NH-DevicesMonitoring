const express = require('express');
const router = express.Router();
const printerList = require('../printerList.js');
const generateTxt = require('../generateTxt.js');
const initializeSettings = require('../settings.js');

router.get('/', async function(req, res, next) {
    try {
        const settings = await initializeSettings();
        const { db } = settings;
        // Recupera l'elenco di tutte le stampanti
        let allPrinters = await printerList();
        
        // Genera il testo delle stampanti
        let textPrinters = await generateTxt(allPrinters);

        // Recupera i log dal database
        let logs = await db.promise().query("SELECT * FROM logs");
        
        // Renderizza la pagina con i dati raccolti
        res.render('logs', { printer: allPrinters, txt: textPrinters, log: logs });

    } catch (error) {
        console.error("Errore nella gestione della rotta /:", error);
        next(error); // Passa l'errore al middleware di gestione degli errori
    }
});
router.post('/', async function(req, res, next) {
})

module.exports = router;
  