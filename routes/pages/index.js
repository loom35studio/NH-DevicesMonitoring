const express = require('express');
const generateTxt = require('../generateTxt.js');
const updateStock = require('../devices/update/updateStock.js');
const fs = require('fs').promises;

const router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        let deviceList; let textPrinters;
        
        try {
            const data = await fs.readFile('printers.json', 'utf8');
            deviceList = JSON.parse(data);
        } catch (err) {
            console.log('Errore durante la lettura del file', err);
            return next(err);
        }

        textPrinters = await generateTxt(deviceList);

        res.render('index', { printer: deviceList, txt: textPrinters});
    } catch (error) {
        console.error("Errore nella gestione della rotta /:", error);
        next(error);
    }
});

router.post('/', async function(req, res, next) {
    try {
        await updateStock(req);
        res.redirect('/');
        // res.redirect('/#device-' + req.body.printerName);
    } catch (error) {
        console.error("Errore durante l'aggiornamento dello stock:", error);
        next(error);
    }
});



module.exports = router;  