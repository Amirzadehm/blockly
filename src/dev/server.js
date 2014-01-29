var url = require('url');
var express = require('express');
var ejs = require('ejs');

var app = express();

app.set('views', __dirname);
app.set('view engine', 'html.ejs');
app.engine('html.ejs', ejs.__express);

var baseUrl = function(req) {
  return req.protocol + '://' + req.get('Host') + '/';
};

app.get('/', function(req, res) {
  res.render('index');
});

var renderApp = function(app, req, res) {
  ['locale', 'level', 'skin', 'dir'].forEach(function(key) {
    if (!req.query[key]) {
      res.end('Expected ' + key + ' query parameter');
      return;
    }
  });
  res.render('app', {
    app: app,
    options: {
      locale: req.query.locale,
      localeDirection: req.query.dir,
      containerId: 'blocklyApp',
      levelId: req.query.level,
      skinId: req.query.skin,
      baseUrl: baseUrl(req),
      cacheBust: false // or 'test-string'
    }
  });
};

app.get('/maze', function(req, res) {
  renderApp('maze', req, res);
});

app.get('/turtle', function(req, res) {
  renderApp('turtle', req, res);
});

app.get('/bounce', function(req, res) {
  renderApp('bounce', req, res);
});

module.exports = app;
