/*! Copyright(c) 2016-NOW by Daniel Oltmanns */

var mongojs = require('mongojs');
var environment = require('/environment/config.json');
var imageInspector = require('./image-inspector');
var logger = require('./logger');
var fs = require('fs')
var CanvasLib = require('canvas')
var canvas = new CanvasLib(environment.pic.width, environment.pic.height)
var ctx = canvas.getContext('2d');
var db = mongojs(environment.mongo.connection, ['drawings'])
var moment = require('moment');

ctx.fillStyle = environment.pic.bgColor
ctx.fillRect(0, 0, environment.pic.width, environment.pic.height)

var draw = function(dto) {
  if (dto.x0 && dto.x1 && dto.y0 && dto.y1 && dto.color) {
    ctx.strokeStyle = dto.color;
    ctx.beginPath();
    ctx.moveTo(dto.x0, dto.y0);
    ctx.lineTo(dto.x1, dto.y1);
    ctx.stroke();
  }
}

// TODO ggf. aufbau auf png von gestern
var createNewPic = function() {
  db.drawings.find().forEach(function(err, drawing) {
    if (drawing) {
      draw(drawing);
    } else {
      finishEm()
    }
  })
}

var ImageGenerator = {}
ImageGenerator.generateNewImage = function() {
  var dateOfLastImage = imageInspector.findDateOfNewest()
  if (dateOfLastImage) {
    // Stelle fest, wieviel drawings seit dem in der Datenbank gespeichert wurden
    imageInspector.findDrawingsAfter(dateOfLastImage).count(function(e, count) {
      if (e) {
        logger.error('201603222015: ' + e);
      }
      if (count - 0 > environment.pic.createEveryDrawing) {
        logger.info(count + ' drawings after ' + dateOfLastImage);
        createNewPic();
      }
    })
  } else {
    // es wurde noch nie ein bild erstellt
    logger.info('es wurde noch kein bild erstellt');
    createNewPic();
  }
}

var getFilePath = function() {
  return environment.pic.folder + moment(new Date()).format('YYYYMMDDHHmmss') + '.png';
}

var finishEm = function() {
  var file = getFilePath();
  var stream = canvas.pngStream();
  var out = fs.createWriteStream(file);

  stream.on('data', function(chunk) {
    out.write(chunk);
  });

  stream.on('end', function() {
    logger.info(file + ' saved');
    // TODO kann raus!!!! ? db.close()
  });
}

db.on('error', function(err) {
  logger.error('database error', err)
})

db.on('connect', function() {
  logger.info('database connected')
})

module.exports = ImageGenerator;