var fs = require('fs');
var express = require('express');
var app = express();
var environment = require('/environment/config.json');
var logger = require('./logger');
var imageGenerator = require('./image-generator');
var imageInspector = require('./image-inspector');

app.get('/snapshot.json', function(req, res, done) {
  if (true || req.param('secure') == 'Eikangookei7aeyahmeahw3oXauN4xaaGhujeM') {
    logger.debug('snapshot requested')
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    imageGenerator.generateNewImage()
    var result = {}
    result.done = true;
    res.send(result)
  } else {
    res.send('404: Page not Found', 404);
  }
});

app.get('/starterkit.json', function(req, res, done) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  var starterkit = {}
  var latestPicName = imageInspector.findLatestPicName()
  starterkit.pic = latestPicName ? environment.server.imageGenerator.uriBase + 'pic/' + latestPicName : null
  imageInspector.findDrawingsAfterLatestPic().toArray(function(err, drawings) {
    if (err) {
      logger.error('201603221842: ' + err)
    }
    starterkit.drawings = drawings
    res.send(starterkit)
    done()
  })
});

app.get('/pic/:pic', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  var pic = req.params.pic;
  logger.info(pic + ' requested');

  // send pic if exists
  try {
    fs.accessSync(environment.pic.folder + pic)
    res.sendFile(environment.pic.folder + pic);
  } catch (e) {
    res.status(404).send('Not found');
  }
});

app.listen(80, function() {});