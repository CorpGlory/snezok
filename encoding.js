
function strEncode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function strDecode(str) {
  return decodeURIComponent(escape(atob(str)));
}
