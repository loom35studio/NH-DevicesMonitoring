var express = require('express');
const generateTxt = require('../generateTxt.js')

var router = express.Router();


router.get('/', async function(req, res, next) {
    let= deviceList; let textPrinters;
    
    try {
        const data = await fs.readFile('printers.json', 'utf8');
        deviceList = JSON.parse(data);
    } catch (err) {
        console.log('Errore durante la lettura del file', err);
        return next(err);
    }

    textPrinters = await generateTxt(printerList);
    res.render('admin', {printer: allPrinters, txt: textPrinters, commits: commit});     
})

router.post('/', async function(req, res, next) {
})

module.exports = router;
  