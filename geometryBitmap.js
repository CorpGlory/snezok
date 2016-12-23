var GeometryBitmap = {}
GeometryBitmap.text = undefined;
GeometryBitmap.width = undefined;
GeometryBitmap.height = undefined;

GeometryBitmap.FONT_SIZE = 100;
GeometryBitmap.LINE_HEIGHT = 120;

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

  function wrapText(text) {

    var context = GeometryBitmap.ctx;
    var x = GeometryBitmap.width / 2;
    var y = GeometryBitmap.height / 2;
    var maxWidth = GeometryBitmap.width;

    var words = text.split(' ');
    var line = '';
    var linesCount = 1;

    var textLines = [];
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        textLines.push(line);
        line = words[n] + ' ';
        linesCount++;
      } else {
        line = testLine;
      }
    }

    textLines.push(line);
    //alert(linesCount);
    var totalHeight = GeometryBitmap.LINE_HEIGHT * (linesCount - 1) + GeometryBitmap.FONT_SIZE;
    var basicOffset = y + GeometryBitmap.FONT_SIZE / 2 - totalHeight / 2;
    _.each(textLines, function(l, i) {
      var offset = basicOffset;
      offset += i * GeometryBitmap.LINE_HEIGHT;
      context.fillText(l, x, offset);
    });

  }


  GeometryBitmap.text = text;
  GeometryBitmap.ctx.clearRect(
    0, 0, GeometryBitmap.width, GeometryBitmap.height
  );

  GeometryBitmap.ctx.font = "bold " + GeometryBitmap.FONT_SIZE + "px Arial";
  GeometryBitmap.ctx.fillStyle = "white";
  GeometryBitmap.ctx.textAlign = "center";
  if(GeometryBitmap.text !== undefined) {
    wrapText(GeometryBitmap.text);
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
