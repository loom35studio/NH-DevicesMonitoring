const puppeteer = require('puppeteer');
const initializeSettings = require('../../settings.js');

async function checkXEROX(vb, printer){
    const settings = await initializeSettings();
    const { db } = settings;

    connection = await db.promise().getConnection();
    //let date = await data(printer);
    await connection.query("UPDATE printer SET drum = ? WHERE ID = ?", [(Math.round((vb[3].value*100)/vb[2].value)), printer.ID]);
    await connection.query("UPDATE black SET pages = ?, percentage = ?, date = ? WHERE printerID = ?", [vb[4].value, (Math.round((vb[1].value*100)/vb[0].value)), null, printer.ID]);
}


async function data(printer) {
    let browser =  await puppeteer.launch({
        headless: 'new',
        args: [ '--ignore-certificate-errors' ]
    });

    const page =  await browser.newPage();
    
    if(printer.model == "XEROX"){
        try {
            await page.goto('https://' + printer.ip + '/home/index.html#hashSupplies/hashHome');
        } catch {
            return "pagina non funzionante";
        }
    
        // attendere cartucce
        await page.waitForSelector('.xux-textOmittable-false');
        let blackDate =  await page.evaluate( () => {
            let black = document.querySelector('.xux-textOmittable-false').textContent;
            return black;
        });
        console.log(await blackDate);
        await browser.close();
        return(blackDate);
    }
}

module.exports = checkXEROX;