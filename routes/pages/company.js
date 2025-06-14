var express = require('express');
const settings = require('../settings.js');
const printerList = require('../printerList.js');
const generateTxt = require('../generateTxt.js');
const updateStock = require('../update/updateStock.js');
const updateDB = require('../update/updateDB');
const simpleGit = require('simple-git');

var router = express.Router();

updateDB();
setInterval(updateDB, settings.interval);

router.get('/:society', async function(req, res, next) {
  const git = simpleGit();
  const allPrinters = await printerList();
  const society = req.params.society;
  const printers = allPrinters.filter(p =>
    p[0].society && p[0].society.toLowerCase() === society.toLowerCase()
  );
  const textPrinters = await generateTxt(printers);

  const log = await git.log();
  const commits = log.all.map(commit => ({
    hash: commit.hash,
    date: commit.date,
    message: commit.message,
    author: commit.author_name
  }));

  res.render('company', { printer: printers, txt: textPrinters, commits, company: society });
});

router.post('/:society', async function(req, res, next) {
  updateStock(req);
  res.redirect('/company/' + req.params.society + '#device-' + req.body.printerName);
});

module.exports = router;
