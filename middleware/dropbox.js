module.exports = (req, res, next) => {
  if (req.signedCookies && req.signedCookies.dropbox) {
    req.dropboxToken = req.signedCookies.dropbox.accessToken;
    next();
  } else {
    return res.redirect('/auth/dropbox');
  }
};
