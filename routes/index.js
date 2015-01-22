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
/* GET radial-scroll demo. */
router.get('/radial-scroll', function(req, res) {
  	res.render('radial-scroll-demo', { title: 'Scroll in Circle'});
});
module.exports = router;
