const puppeteer = require('puppeteer');
const dataConv = require('../../dataConv.js');
const initializeSettings = require('../../settings.js');

async function checkMFP(vb, printer) {
    let connection;

    try {
        const settings = await initializeSettings();
        const { db } = settings;

        connection = await db.promise().getConnection();

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

        await connection.query("UPDATE black SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [bkPages, bkPerc, bk, bkCh, printer.ID]);
        await connection.query("UPDATE yellow SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [ylPages, ylPerc, ye, yeCh, printer.ID]);
        await connection.query("UPDATE magenta SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [maPages, maPerc, ma, maCh, printer.ID]);
        await connection.query("UPDATE cyan SET pages = ?, percentage = ?, date = ?, changed = ? WHERE printerID = ?", [cyPages, cyPerc, cy, cyCh, printer.ID]);

    } catch (error) {
        console.error("Errore in checkMFP:", error);
    } finally {
        if (connection) {
            try {
                await connection.release();
            } catch (e) {
                console.error('Errore durante il rilascio della connessione:', e);
            }
        }
    }
}

async function MFPData(printer) {
    let browser;
    let page;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--ignore-certificate-errors']
        });

        page = await browser.newPage();

        try {
            await page.goto(`https://${printer.ip}/hp/device/InternalPages/Index?id=SuppliesStatus`, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });
        } catch (error) {
            console.error(`${printer.name} ${printer.model}: Errore di navigazione:`, error);
            return "pagina non funzionante";
        }

        try {
            await page.waitForSelector('#YellowCartridge1-FirstInstallDate', { timeout: 20000 });
        } catch (error) {
            console.error(`${printer.name} ${printer.model}: Errore di attesa del selettore:`, error);
            return "elemento non trovato";
        }

        try {
            const colorList = await page.evaluate(() => {
                const getElementText = (selector) => {
                    const element = document.querySelector(selector);
                    return element ? element.innerHTML : null;
                };

                return {
                    yellow: getElementText('#YellowCartridge1-FirstInstallDate'),
                    magenta: getElementText('#MagentaCartridge1-FirstInstallDate'),
                    cyan: getElementText('#CyanCartridge1-FirstInstallDate'),
                    black: getElementText('#BlackCartridge1-FirstInstallDate')
                };
            });
            return colorList;
        } catch (error) {
            console.error('Errore durante il recupero dei dati:', error);
            return "errore durante il recupero dei dati";
        }
    } catch (error) {
        console.error('Errore nella funzione MFPData:', error);
        return "errore durante il recupero dei dati";
    } finally {
        if (page) {
            try {
                await page.close();
            } catch (pageCloseError) {
                console.error('Errore durante la chiusura della pagina:', pageCloseError);
            }
        }
        if (browser) {
            try {
                await browser.close();
            } catch (browserCloseError) {
                console.error('Errore durante la chiusura del browser:', browserCloseError);
            }
        }
    }
}



module.exports = checkMFP;