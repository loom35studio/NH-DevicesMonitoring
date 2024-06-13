const express = require('express');
const initializeSettings = require('../settings.js');
const printerList = require("../printerList.js");
const generateTxt = require('../generateTxt.js');
const updateStock = require('../update/updateStock.js');
const updateDB = require('../update/updateDB'); 

const router = express.Router();
timedUpdate();
async function timedUpdate() {
    const settings = await initializeSettings();
    const { interval } = settings;

    updateDB();
    setInterval(updateDB, interval);
}

router.get('/', async function(req, res, next) {
    let allPrinters = await printerList();
    let textPrinters = await generateTxt(allPrinters);

    res.render('index', { printer: allPrinters, txt: textPrinters});
});

router.post('/', async function(req, res, next) {
    updateStock(req);
    res.redirect('/#device-' + req.body.printerName);
});



module.exports = router;  