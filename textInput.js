var TextInput = {}

TextInput._text = TEXT;
TextInput.init = function() {
  $('#textInput').val(TEXT);
  $('#textInput').bind('input propertychange', function() {
    TextInput._text = this.value;
    GeometryBitmap.setText(this.value)
  });
  $('#geometryBitmap').fadeTo('fast', 0.2);
  $('#textInput').fadeTo('fast', 0);
  setTimeout(function() {
   $('#textInput').focus();
  }, 1);
  $('#inputForm').show();

}

TextInput.submit = function() {
  window.location = "#" + strEncode(TextInput._text);
  window.location.reload(true);
}
