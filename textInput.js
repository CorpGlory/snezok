var TextInput = {}

TextInput.init = function() {
  $('#textInput').bind('input propertychange', function() {
    GeometryBitmap.setText(this.value)
  });
}
