var TextInput = {}

TextInput.init = function() {
  $('#textInput').val(TEXT);
  $('#textInput').bind('input propertychange', function() {
    GeometryBitmap.setText(this.value)
  });
  $('#geometryBitmap').fadeTo('fast', 0.2);
  $('#textInput').fadeTo('fast', 0);
  setTimeout(function() {
   $('#textInput').focus();
  }, 1);
  $('#inputForm').show();
}
