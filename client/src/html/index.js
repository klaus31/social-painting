var MAX_RANDOM_G_CHANNEL = 180; // color must not be too bright
var createNewColor = function() {
  return RandomColor.next(false, false, false, false, MAX_RANDOM_G_CHANNEL)
};

var canvas = {
  width: '{{pic.width}}' - 0,
  height: '{{pic.height}}' - 0
};

var movepic = {
  startingpos: null,
  maxtop: $('#canvas').position().top,
  maxleft: 0,
};
movepic.mintop = movepic.maxtop - canvas.height + $(window).height();
movepic.minleft = movepic.maxleft - canvas.width + $(window).width();

var drawing = {
  prev: null,
  pos: {
    x: null,
    y: null
  },
  color: createNewColor()
};

var action = {
  paint: true,
  move: false,
  enabled: false
};

var ctrl = {};

ctrl.start = function(event) {
  event.preventDefault();
  movepic.startingpos = {
    x: event.originalEvent.pageX || false,
    y: event.originalEvent.pageY || false,
    top: $('#canvas').position().top,
    left: $('#canvas').position().left
  };
  action.enabled = true;
  if (action.paint) {
    $('#canvas').addClass('paint').removeClass('move');
  } else {
    $('#canvas').addClass('move').removeClass('paint');
  }
};

ctrl.stop = function() {
  action.enabled = false;
  drawing.prev = null;
  $('#canvas').removeClass('paint').removeClass('move');
};

var websocket = wrapWs('{{server.websocket.uri}}');

var ctx;

var draw = function(dto) {
  if (dto.x0 && dto.x1 && dto.y0 && dto.y1 && dto.color) { // got valid ws drawing
    ctx.strokeStyle = dto.color;
    ctx.beginPath();
    ctx.moveTo(dto.x0, dto.y0);
    ctx.lineTo(dto.x1, dto.y1);
    ctx.stroke();
  }
}

canvas.reinit = function(canvas_id, dimension) {
  $('#canvas').attr('width', canvas.width).attr('height', canvas.height);
  var dimension = '2d';
  ctx = $('#canvas')[0].getContext(dimension);
  ctx.lineWidth = 2;

  $.get('{{server.imageGenerator.uriStarterkit}}', function(starterkit) {
    if (starterkit.pic) {
      var img = new Image();
      img.src = starterkit.pic;
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
        $(starterkit.drawings).each(function(i, drawing) {
          draw(drawing);
        });
      };
    }
  })
};

var actionEvent = function(event) {
  if (action.enabled) {
    event.preventDefault();
    if (action.paint) {
      drawing.pos.x = event.originalEvent.pageX - $('#canvas').position().left;
      drawing.pos.y = event.originalEvent.pageY - $('#canvas').position().top;

      if (drawing.prev) { // not first draw
        var dto = {
          x0: drawing.prev.pos.x,
          x1: drawing.pos.x,
          y0: drawing.prev.pos.y,
          y1: drawing.pos.y,
          color: drawing.color
        }
        if (dto.x0 != dto.x1 || dto.y0 != dto.y1) { // pos changed
          websocket.send(dto);
        }
        delete drawing.prev;
      }
      drawing.prev = JSON.parse(JSON.stringify(drawing));
    } else {
      if (!movepic.startingpos.x) movepic.startingpos.x = event.originalEvent.pageX;
      if (!movepic.startingpos.y) movepic.startingpos.y = event.originalEvent.pageY;
      var x = movepic.startingpos.x - event.originalEvent.pageX;
      var y = movepic.startingpos.y - event.originalEvent.pageY;

      var newpos = {
        top: movepic.startingpos.top - y,
        left: movepic.startingpos.left - x
      }

      if (newpos.top > movepic.maxtop) newpos.top = movepic.maxtop;
      if (newpos.left > movepic.maxleft) newpos.left = movepic.maxleft;

      if (newpos.top < movepic.mintop) newpos.top = movepic.mintop;
      if (newpos.left < movepic.minleft) newpos.left = movepic.minleft;

      $('#canvas').css(newpos);
    }
  }
};

canvas.reinit();

$('#canvas').on('touchmove', actionEvent);
$('#canvas').on('mousemove', actionEvent);

$('#canvas').on('touchstart', ctrl.start);
$('#canvas').on('touchend', ctrl.stop);

$('#canvas').on('mousedown', ctrl.start);
$('#canvas').on('mouseup', ctrl.stop);
$('#canvas').on('mouseleave', ctrl.stop);

var setModusMove = function() {
  action.move = true;
  action.paint = false;
  $('#move').addClass('active');
  $('#paint').removeClass('active');
};

var setModusPaint = function() {
  action.move = false;
  action.paint = true;
  $('#move').removeClass('active');
  $('#paint').addClass('active');
};

$('#move').on('click', setModusMove);

$('#paint').on('click', setModusPaint);

websocket.onmessage(draw);

// achtung, achtung - dies ist die letzte methode, die ich in jquery reinfummel
// wenn dann noch eine kommen sollte, geht es auf angular!
var colorpicker = $('#colorpick').colorpicker({
  format: 'rgba'
});
colorpicker.on('changeColor.colorpicker', function(event) {
  $('#colorpick').css('color', colorpicker.colorpicker('getValue'));
  drawing.color = colorpicker.colorpicker('getValue');
});
colorpicker.on('hidePicker.colorpicker', function(event) {
  $('#colorpick').removeClass('active');
});
colorpicker.on('showPicker.colorpicker', function(event) {
  $('#colorpick').addClass('active');
});
colorpicker.colorpicker('setValue', drawing.color);

// ok, der geht noch -- aber dann ...
var show = function(what) {
  return function() {
    $('#canvas, #info-content, #copyright-content, #help-content').hide();
    $('#navi > button').removeClass('active');
    $('#' + what).addClass('active');
    if (what != 'info' && what != 'copyright' && what != 'help') {
      $('#canvas').show();
    } else {
      $('#' + what + '-content').show();
    }
  }
}
$('#info').on('click', show('info'));
$('#copyright').on('click', show('copyright'));
$('#help').on('click', show('help'));
$('#paint').on('click', show('paint'));
$('#move').on('click', show('move'));
$('#copyright').on('click', show('copyright'));

// jaja, ist ja gut
// leertasten funktion
var spacePressed = false;
$(document).keydown(function(e) {
  if (!spacePressed && e.keyCode == 32) { // leertaste
    spacePressed = true;
    setModusMove();
    ctrl.start(e);
  }
});
$(document).keyup(function(e) {
  if (spacePressed && e.keyCode == 32) { // leertaste
    spacePressed = false;
    setModusPaint();
    ctrl.stop(e);
  }
});