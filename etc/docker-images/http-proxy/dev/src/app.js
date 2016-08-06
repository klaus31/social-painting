var http = require('http');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxy();

var routing = require('/environment/config.json').server.proxy.routing;

http.createServer(function(req, res) {
  if (routing[req.headers.host]) {
    proxy.web(req, res, routing[req.headers.host]);
  } else {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('kenn ich nich (called as ' + req.headers.host + ')');
  }
}).listen(80);