/*! Copyright(c) 2016-NOW by Daniel Oltmanns */

var mongojs = require('mongojs');
var environment = require('/environment/config.json');
var logger = require('./logger');
var fs = require('fs')
var moment = require('moment');
var db = mongojs(environment.mongo.connection, ['drawings'])

var ImageInspector = {}

ImageInspector.findLatestPicName = function() {
  try {
    return fs.readdirSync(environment.pic.folder)
      .filter(function(f) {
        return f.match(/^[0-9]{14}/);
      }).sort().pop();
  } catch (e) {
    logger.error(e)
    return null;
  }
}

ImageInspector.findDrawingsAfter = function(time) {
  return db.drawings.find({
    time: {
      $gt: time
    }
  }, {
    _id: 0
  });
}

ImageInspector.findDateOfNewest = function() {
  var picName = ImageInspector.findLatestPicName();
  return picName ? moment(picName.substr(0, 14), 'YYYYMMDDhhmmss')._d : null;
}

ImageInspector.findDrawingsAfterLatestPic = function() {
  return ImageInspector.findDrawingsAfter(ImageInspector.findDateOfNewest())
}

module.exports = ImageInspector;