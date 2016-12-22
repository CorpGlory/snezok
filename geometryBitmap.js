var GeometryBitmap = {}
GeometryBitmap.text = undefined;
GeometryBitmap.width = undefined;
GeometryBitmap.height = undefined;

GeometryBitmap.init = function() {
  var canvas = $('#geometryBitmap').get()[0];
  var ctx = canvas.getContext('2d');
  GeometryBitmap.canvas = canvas;
  GeometryBitmap.ctx = ctx;
}

GeometryBitmap.resize = function(width, height) {
  GeometryBitmap.width = width;
  GeometryBitmap.height = height;
  GeometryBitmap.canvas.width = width;
  GeometryBitmap.canvas.height = height;
  GeometryBitmap.setText(GeometryBitmap.text);
}

GeometryBitmap.setText = function(text) {
  GeometryBitmap.text = text;
  GeometryBitmap.ctx.clearRect(
    0, 0, GeometryBitmap.width, GeometryBitmap.height
  );
  GeometryBitmap.ctx.font = "bold 100px Arial";
  GeometryBitmap.ctx.fillStyle = "white";
  GeometryBitmap.ctx.textAlign = "center";
  if(GeometryBitmap.text !== undefined) {
    GeometryBitmap.ctx.fillText(
      text, GeometryBitmap.width / 2, GeometryBitmap.height / 2
    );
  }
}

GeometryBitmap.getFill = function(x, y) {
  var x = Math.round(x);
  var y = Math.round(y);
  if(x < 0 || y < 0) {
    return false;
  }
  if(x >= GeometryBitmap.width || y >= GeometryBitmap.height) {
    return false;
  }
  var p = undefined;
  try {
    p = GeometryBitmap.ctx.getImageData(x, y, 1, 1).data;
  } catch (e) {
    console.log(e);
  }
  return p[0] === 255;
}
