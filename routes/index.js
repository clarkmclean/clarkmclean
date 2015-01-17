var express = require('express');
var fs    = require("fs");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  	res.render('index', { title: 'Express', "files":  fs.readdirSync('public/gallery')});
});

/* GET number mixer. */
router.get('/number-mixer', function(req, res) {
  	res.render('number-mixer', { title: 'Number-Mixer'});
});
module.exports = router;
