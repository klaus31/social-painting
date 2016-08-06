/*! Copyright(c) 2016-NOW by Daniel Oltmanns (http://www.knurt.de) - MIT Licensed */

var mongojs = require('mongojs');
var environment = require('/environment/config.json');
var logger = require('./logger');
var db = mongojs(environment.mongo.connection, ['drawings'])
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  port: 3001
});

var snapshot = function() {
  var http = require('http');
  var options = {
    host: 'social-painting-image-generator',
    path: '/snapshot.json?secure=Eikangookei7aeyahmeahw3oXauN4xaaGhujeM'
  };
  logger.debug("request for snapshot");
  var callback = function() {}
  http.request(options, callback).end();
}

var broadcastJSON = function(text) {
  var json = JSON.parse(text)
  wss.clients.forEach(function(client) {
    client.send(JSON.stringify(json));
  });
  json.time = new Date();
  db.drawings.save(json);
};

wss.on('connection', function(ws) {
  logger.info('new connection');
  snapshot()
  ws.on('message', broadcastJSON);
  ws.send('something');
});