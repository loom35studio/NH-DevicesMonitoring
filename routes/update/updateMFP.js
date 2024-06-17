const puppeteer = require('puppeteer');
const dataConv = require('../dataConv.js');
const initializeSettings = require('../settings.js');

async function checkMFP(vb, printer) {
    try {
        const settings = await initializeSettings();
        const { db } = settings;

        const dates = await MFPData(printer);
        const [ye, yeCh] = dataConv(dates.yellow, printer.model);
        const [ma, maCh] = dataConv(dates.magenta, printer.model);
        const [cy, cyCh] = dataConv(dates.cyan, printer.model);
        const [bk, bkCh] = dataConv(dates.black, printer.model);

        const bkPerc = Math.max(Math.round((vb[1].value * 100) / vb[0].value), 0);
        const ylPerc = Math.max(Math.round((vb[7].value * 100) / vb[6].value), 0);
        const maPerc = Math.max(Math.round((vb[5].value * 100) / vb[4].value), 0);
        const cyPerc = Math.max(Math.round((vb[3].value * 100) / vb[2].value), 0);

        const bkPages = Math.max(Math.round((vb[1].value * 86) / vb[0].value) * 100, 0);
        const ylPages = Math.max(Math.round((vb[7].value * 69) / vb[6].value) * 100, 0);
        const maPages = Math.max(Math.round((vb[5].value * 69) / vb[4].value) * 100, 0);
        const cyPages = Math.max(Math.round((vb[3].value * 69) / vb[2].value) * 100, 0);

        await db.promise().query("UPDATE black SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [bkPages, bkPerc, bk, bkCh, printer.ID]);
        await db.promise().query("UPDATE yellow SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [ylPages, ylPerc, ye, yeCh, printer.ID]);
        await db.promise().query("UPDATE magenta SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [maPages, maPerc, ma, maCh, printer.ID]);
        await db.promise().query("UPDATE cyan SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [cyPages, cyPerc, cy, cyCh, printer.ID]);

    } catch (error) {
        console.error("Errore in checkMFP:", error);
    }

}

async function MFPData(printer) {
    let browser =  await puppeteer.launch({
        headless: 'new',
        args: [ '--ignore-certificate-errors' ]
    });
    
    const page =  await browser.newPage();

    // trova la pagina
    try {
        await page.goto('https://' + printer.ip + '/hp/device/InternalPages/Index?id=SuppliesStatus');
    } catch (error) {
        console.error(printer.name + " " + printer.model + " non funzionante:", error);
    }

    // attendere cartucce
    try {
        let colorList =  await page.evaluate( () => {
            let colors = {
                "yellow" : document.querySelector( '#YellowCartridge1-FirstInstallDate' ).innerHTML,
                "magenta" : document.querySelector( '#MagentaCartridge1-FirstInstallDate' ).innerHTML,
                "cyan" : document.querySelector( '#CyanCartridge1-FirstInstallDate' ).innerHTML,
                "black" : document.querySelector( '#BlackCartridge1-FirstInstallDate' ).innerHTML,
            };
            return (colors);
        });
        await browser.close();
        return(colorList);
    } catch (error) {
        console.error("Errore in MFPData:", error);
    }

}

module.exports = checkMFP;