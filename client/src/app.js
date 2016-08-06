var fs = require('fs');
var express = require('express');
var app = express();
var handlebars = require('handlebars')
var environment = require('/environment/config.json');

var send = function(path, res) {
  fs.readFile(path, 'utf8', function(err, source) {
    var template = handlebars.compile(source)
    res.send(template(environment))
  })
}

app.use(express.static('./html/public'));
app.get('/', function(req, res) {
  res.header('Content-Type', 'text/html');
  send(__dirname + '/html/index.html', res)
})

app.get('/scripts/index.js', function(req, res) {
  res.header('Content-Type', 'text/javascript');
  send(__dirname + '/html/index.js', res)
})

app.get('/style/index.css', function(req, res) {
  res.header('Content-Type', 'text/css');
  send(__dirname + '/html/index.css', res)
})

app.listen(80, function() {});