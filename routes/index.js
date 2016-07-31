var express = require('express');
var router = express.Router();
var debug = require('debug')('travelbug:routes');
var dropbox = require('node-dropbox');
var dropboxSession = require('../middleware/dropbox');
var camelCase = require('camelcase-keys');
var gpx = require('../models/gpx');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/log', (req, res) => {
  debug('/log', req.body);
  res.send();
})

router.get('/auth/dropbox', (req, res) => {
  debug('querystrings', req.query)
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  if (!req.query.code) {
    dropbox.Authenticate(
      process.env.DROPBOX_KEY,
      process.env.DROPBOX_SECRET,
      `${protocol}://${req.get('host')}/auth/dropbox`,
      (err, url) => {
        if (err || !url) {
          return res.status(500).send('Error generating url for dropbox');
        }
        debug('url1', url);
        res.redirect(307, url);
    });
  } else if (req.query.code) {
    dropbox.AccessToken(
      process.env.DROPBOX_KEY,
      process.env.DROPBOX_SECRET,
      req.query.code,
      `${protocol}://${req.get('host')}/auth/dropbox`,
      (err, account) => {
        if (err) {
          return res.status(500).send('Error Authenticating');
        }

        res
        .cookie('dropbox', camelCase(account), {signed: true})
        .redirect('/logs');
      }
    );
  } else {
    res.status(500).send('Error authenticating with dropbox');
  }

});

router.get('/logs', dropboxSession, (req, res) => {
  gpx.getAll(req.dropboxToken)
  .then((r) => res.send(r))
  .catch(e => {
    debug(e);
    res.status(500).send('Error gettings sessions');
  });
});

router.get('/logs/:path', dropboxSession, (req, res) => {
  if (!req.params.path.endsWith('.gpx')) {
    return res.status(404).status('not found');
  }

  gpx.get(req.dropboxToken, req.params.path)
  .then((f) => res.send(f))
  .catch(e => {
    debug(e);
    res.status(500).send(`Error getting session ${req.params.path}`);
  })
});

module.exports = router;
