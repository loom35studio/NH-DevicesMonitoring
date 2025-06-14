var express = require('express');
const updateDB = require('../update/updateDB');
const settings = require('../settings.js');

var router = express.Router();

updateDB();
setInterval(updateDB, settings.interval);

router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
