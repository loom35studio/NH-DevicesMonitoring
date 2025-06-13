const initializeSettings = require("./settings.js");

async function generateTxt(printers) {
    let textPrinters = "";

    const timeElapsed = Date.now();
    let today = new Date(timeElapsed);
    textPrinters += "NextHub - Report Stampanti " + today.toLocaleDateString() + "\n\n";

    textPrinters += "PEWEX: \n";
    textPrinters += await societyDivider("Pewex", printers);
    textPrinters += "\nELITE: \n";
    textPrinters += await societyDivider("Elite", printers);

    console.log("✅ Generazione lista stampanti in TXT riuscita");
    return textPrinters;
}

async function societyDivider(society, printers) {
    const settings = await initializeSettings();
    const { below } = settings;
    let tempText = "";
    let printerName = "";

    printers.forEach(prnt => {
        if(prnt[0].society == society) {
            let ye, ma, cy, bk;
            let tempYe, tempMa, tempCy, tempBk;

            if (prnt[0].model == "MFP" || prnt[0].model == "XEROX" || prnt[0].model == "P77") {
                printerName = prnt[0].name + " " + prnt[0].model;
            } else { printerName = prnt[0].name; }
            
            if (prnt[0].error == 1) {
                tempText += printerName + tabsCalculator(printerName) + "NON RAGGIUNGIBILE\n";
            } else {
                if (prnt[0].model != "XEROX" && prnt[0].model != "OTHER") {
                    if(prnt[1] != undefined) {ye = prnt[1].pages;}
                    if(prnt[2] != undefined) {ma = prnt[2].pages;}
                    if(prnt[3] != undefined) {cy = prnt[3].pages;}
                    if(prnt[4] != undefined) {bk = prnt[4].pages;}

                    if (ye <= below && prnt[1].stock < 1 && ye != null) {tempYe = true;}
                    if (ma <= below && prnt[2].stock < 1 && ma != null) {tempMa = true;}
                    if (cy <= below && prnt[3].stock < 1 && cy != null) {tempCy = true;}
                    if (bk <= below && prnt[4].stock < 1 && bk != null) {tempBk = true;}
                }
                if (prnt[0].model == "MFP") {
                    if(tempBk || tempCy || tempMa || tempYe){
                        tempText += printerName + tabsCalculator(printerName);
                        if (tempYe){tempText += "Giallo " + ye + " (" + prnt[1].percentage + "%) ";}
                        if (tempMa){tempText += "Magenta " + ma + " (" + prnt[2].percentage + "%) ";}
                        if (tempCy){tempText += "Ciano " + cy + " (" + prnt[3].percentage + "%) ";}
                        if (tempBk){tempText += "Nero " + bk + " (" + prnt[4].percentage + "%) ";}
                        tempText += "\n";
                    }
                } else if (prnt[0].model == "477" || prnt[0].model == "P77") {
                    if(tempBk || tempCy || tempMa || tempYe){
                        tempText += printerName + tabsCalculator(printerName);
                        if (tempYe){tempText += "Giallo " + ye + " ";}
                        if (tempMa){tempText += "Magenta " + ma + " ";}
                        if (tempCy){tempText += "Ciano " + cy + " ";}
                        if (tempBk){tempText += "Nero " + bk + " ";}
                        tempText += "\n";
                    }
                }
                if (prnt[0].model == "XEROX" || prnt[0].model == "OTHER"){
                    if (prnt[4].percentage < 50 && prnt[4].stock < 1 && prnt[4].percentage != null) {
                        tempText += printerName + tabsCalculator(printerName);
                        tempText += "Nero " + prnt[4].percentage + "% ";
                        tempText += "\n";
                    }
                }
            }

        }
    });
    return tempText;
}

function tabsCalculator(name) {
    const tabsNumber = name.length;
    if (tabsNumber < 8) return "\t\t\t";
    if (tabsNumber < 16) return "\t\t";
    if (tabsNumber < 24) return "\t";
    return " ";
}

  
module.exports = generateTxt;