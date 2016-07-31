const dropbox = require('node-dropbox');
const filter = require('lodash/fp/filter');
const flow = require('lodash/fp/flow');
const map = require('lodash/fp/map');
const get = require('lodash/fp/get');
const first = require('lodash/fp/first');
const camelCase = require('camelcase-keys');
const debug = require('debug')('travelbug:models:gpx');
const promisify = require('promisify-node');
const parseGpx = promisify(require('gpx-parse').parseGpx);

const getAll = (token, path = '/apps/gpslogger for android') =>
  new Promise((resolve, reject) =>
    dropbox.api(token)
      .getMetadata(path, (err, data) => {
      if (err) return reject(`Error reading path: ${path}`);
      resolve(data.body.contents);
    })
  );

const filterGpxExtension = flow(
  filter(f => f.path.endsWith('.gpx')),
  map(m => camelCase(m))
);

const logReturn = d => {
  debug(d)
  return d;
};

exports.getAll = (token) =>
  getAll(token)
  .then(filterGpxExtension)
  .then(logReturn);

const getFile = (token, path) =>
  new Promise((resolve, reject) => {
    dropbox.api(token).getFile(path, (err, file) => {
      if (err) return reject(err);
      resolve(file);
    });
  });

const gpxFileToJson = file =>
  parseGpx(
    flow(
      get('body')
    )(file)
  );

const cleanGpxJson = flow(
  get('tracks'),
  first,
  get('segments'),
  first,
  map(({lat, lon, elevation, time}) => ({lat, lon, elevation, time}))
);

exports.get = (token, path) =>
  getFile(token, path)
  .then(gpxFileToJson)
  .then(cleanGpxJson)
  .then(logReturn);
