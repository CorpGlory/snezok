var Lang = {}
Lang.res = {}
Lang.res.en = {
  "editorial.title" : "Enter your text",
  "editorial.span" : "at most 40 symbols",
  "ui.save" : "SAVE AND PUBLISH",
  "ui.edit" : "CREATE YOUR OWN",
}

Lang.res.ru = {
  "meta.title": "Создать открытку",
  "meta.description": "Создай своб открытку",
  "editorial.title" : "Введите текст поздравления",
  "editorial.span" : "ограничение 40 символов",
  "ui.save" : "СОХАРИТЬ И ОПУБЛИКОВАТЬ",
  "ui.edit" : "СОЗДАТЬ СВОЕ",
}

var language = window.navigator.userLanguage || window.navigator.language;

Lang.local = Lang.res.en;

if(language.toLocaleLowerCase().indexOf('ru') > -1) {
  Lang.local = Lang.res.ru;
  document.title = Lang.local['meta.title'];
  var meta=document.getElementsByTagName("meta");
  for (var i=0; i<meta.length; i++) {
    if (meta[i].name.toLowerCase()=="description") {
        meta[i].content = Lang.local['meta.description'];
    }
  }
}
