var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST maker. */
router.post('/maker', function(req, res, next) {
  console.log('/maker', req.body);
  res.render('index', { title: 'Maker' });
});

module.exports = router;
