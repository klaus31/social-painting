var RandomColor = {};
RandomColor.nextInt = function(min, max) {
  var tmp;
  min = min || 0;
  max = max || 101;
  if (min > max) {
    tmp = min;
    min = max;
    max = tmp;
  }
  return Math.floor(Math.random() * (max - min)) + min;
};

RandomColor.next = function(with_alpha, rMin, rMax, gMin, gMax, bMin, bMax) {
  rMin = rMin || 0;
  rMax = rMax || 255;
  gMin = gMin || 0;
  gMax = gMax || 255;
  bMin = bMin || 0;
  bMax = bMax || 255;
  var r = RandomColor.nextInt(rMin, rMax);
  var g = RandomColor.nextInt(gMin, gMax);
  var b = RandomColor.nextInt(bMin, bMax);
  var a = with_alpha ? RandomColor.nextInt(0, 10) / 10 : 1;
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
};
