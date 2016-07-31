var express = require('express');
var router = express.Router();
var Dropbox = require('dropbox');
var dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST maker. */
router.post('/maker', function(req, res, next) {
  console.log('/maker', req.body);
  dbx.filesListFolder({path: '/Apps/GPS Logger for Android'})
  .then(response => {
    res.send(response);
  })
  .catch(e => {
    res.send(e);
  })
});

module.exports = router;
