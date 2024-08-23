const express = require('express');
const generateTxt = require('../generateTxt.js');
const updateStock = require('../devices/update/updateStock.js');
const convertDevicesToJSON = require("../devices/generate/deviceList.js");
const fs = require('fs').promises;

const router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        let deviceList; 
        let textPrinters;

        try {
            const data = await fs.readFile('printers.json', 'utf8');
            deviceList = JSON.parse(data);
        } catch (err) {
            console.log('Errore durante la lettura del file', err);
            return next(err);
        }

        const sortByName = (devices) => {
            return devices.sort((a, b) => {
                const nameA = a[0].name.toUpperCase();
                const nameB = b[0].name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        };

        deviceList = sortByName(deviceList);
        
        textPrinters = await generateTxt(deviceList);
        res.render('index', { printer: deviceList, txt: textPrinters });
    } catch (error) {
        console.error("Errore nella gestione della rotta /:", error);
        next(error);
    }
});

router.post('/', async function(req, res, next) {
    try {
        await updateStock(req);

        console.log("Conversione JSON in corso...");
        await convertDevicesToJSON();
        console.log("Conversione JSON completata");

        console.log("Funzione updateStock completata");
        res.redirect('/');
    } catch (error) {
        console.error("Errore durante l'aggiornamento dello stock:", error);
        next(error); // Passa l'errore al middleware di gestione degli errori
    }
    // updateStock(req)
    //     .then(() => {
    //         console.log("conversione json");
    //         convertDevicesToJSON();
    //     })
    //     .then(() => {
    //         console.log("Funzione updateStock completata");
    //         res.redirect('/'); // Eseguito solo dopo che updateStock è completata
    //     })
    //     .catch((error) => {
    //         console.error("Errore durante l'aggiornamento dello stock:", error);
    //         next(error); // Passa l'errore al middleware di gestione degli errori
    //     });
});

module.exports = router;  