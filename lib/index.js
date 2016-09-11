'use strict';

var _fs = require('fs');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _url = require('url');

var _querystring = require('querystring');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = process.env.NOISE_TARGET_URL;
var origin = process.env.NOISE_ORIGIN;
var referer = process.env.NOISE_REFERER;

var _parse = (0, _url.parse)(url);

var host = _parse.host;
var path = _parse.path;
var protocol = _parse.protocol;

var maxAmount = process.env.NOISE_MAX_AMOUNT || 30;
var maxTimeframe = process.env.NOISE_MAX_TIMEFRAME || 600;

var NAMES = (0, _path.resolve)(__dirname, '../data/names.ascii.txt');
var SURNAMES = (0, _path.resolve)(__dirname, '../data/surnames.ascii.txt');
var DOMAINS = (0, _path.resolve)(__dirname, '../data/domains.txt');
var USER_AGENTS = (0, _path.resolve)(__dirname, '../data/useragents.txt');
var PASSWORDS = (0, _path.resolve)(__dirname, '../data/passwords.ascii.txt');
var CREDENTIALS_LOG = (0, _path.join)(process.cwd(), 'credentials.log');
var RESPONSES_LOG = (0, _path.join)(process.cwd(), 'responses.log');

var identity = function identity(a) {
  return a;
};
var fileLines = {};
var pickRandomLine = function pickRandomLine(file) {
  if (!fileLines[file]) {
    fileLines[file] = (0, _fs.readFileSync)(file, 'utf8').split('\n');
    fileLines[file].pop();
  }
  return fileLines[file][Math.floor(Math.random() * fileLines[file].length)];
};

var generateCredentials = function generateCredentials() {
  var name = pickRandomLine(NAMES).toLowerCase().replace(/\s/, '.');
  var surname = Math.random() < 0.8 ? pickRandomLine(SURNAMES).toLowerCase().replace(/\s/, '.') : null;
  var user = surname ? Math.random() < 0.6 ? name + '.' + surname : name[0] + surname : name;
  var domain = pickRandomLine(DOMAINS);
  var password = pickRandomLine(PASSWORDS);
  var email = user + '%40' + domain;
  return { email: email, password: password };
};

var send = function send() {
  var _generateCredentials = generateCredentials();

  var email = _generateCredentials.email;
  var password = _generateCredentials.password;

  var credentials = email.replace('%40', '@') + ',' + password;
  var ua = pickRandomLine(USER_AGENTS);
  var data = 'Email=' + email + '&Senha=' + password;
  var headers = {
    Host: host,
    Connection: 'keep-alive',
    'Content-Length': Buffer.byteLength(data),
    'Cache-Control': 'max-age=0',
    'User-Agent': ua,
    Origin: origin,
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    Referer: referer,
    'Accept-Language': 'en-US,en;q=0.8,pt;q=0.6'
  };
  var options = {
    protocol: protocol,
    host: host,
    path: path,
    port: 80,
    method: 'POST',
    headers: headers
  };
  var req = _http2.default.request(options);
  req.on('response', function (res) {
    var _res$headers = res.headers;
    var date = _res$headers.date;
    var server = _res$headers.server;

    console.log('req:', credentials);
    console.log('res:', res.statusCode, (0, _querystring.stringify)({ date: date, server: server }, ', ', null, { encodeURIComponent: identity }));
    (0, _fs.appendFileSync)(RESPONSES_LOG, res.statusCode + ',' + (0, _querystring.stringify)(res.headers) + '\n');
    (0, _fs.appendFileSync)(CREDENTIALS_LOG, credentials + '\n');
    res.resume();
  });
  req.on('error', function (err) {
    console.log('Failed to send credentials (' + credentials + '), skipping.');
  });
  req.write(data);
  req.end();
};

var sendSome = function sendSome(amount, timeframe) {
  amount = Math.ceil(amount);
  timeframe = Math.ceil(timeframe);
  console.log('\nScheduling', amount, 'requests during the next', timeframe, 'seconds.\n');
  for (var i = 0; i < amount; i++) {
    setTimeout(send, Math.random() * timeframe * 1000);
  }
  // At the end of this timeframe, schedule the next one.
  setTimeout(function () {
    sendSome(Math.random() * maxAmount, Math.random() * maxTimeframe);
  }, timeframe * 1000);
};

sendSome(Math.random() * maxAmount, Math.random() * maxTimeframe);