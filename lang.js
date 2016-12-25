var Lang = {}
Lang.res = {}
Lang.res.en = {
  "editorial.title" : "Enter your text",
  "editorial.span" : "at most 40 symbols",
  "ui.save" : "SAVE AND PUBLISH",
  "ui.edit" : "CREATE YOUR OWN",
  "share.text": "Polytechnic Museum sent you a snowy card"
}

Lang.res.ru = {
  "meta.title": "Создать открытку",
  "meta.description": "Создай своб открытку",
  "editorial.title" : "Введите текст поздравления",
  "editorial.span" : "ограничение 40 символов",
  "ui.save" : "СОХРАНИТЬ И ОПУБЛИКОВАТЬ",
  "ui.edit" : "СОЗДАТЬ СВОЕ",
  "share.text": "Политехнический музей шлет тебе снежную открытку"
}

var language = window.navigator.userLanguage || window.navigator.language;

Lang.local = Lang.res.en;

function setDescription(text) {
  var meta=document.getElementsByTagName("meta");
  for (var i=0; i<meta.length; i++) {
    if (meta[i].name.toLowerCase()=="description") {
      meta[i].content = text;
    }
  }
}

function getDescription(text) {
  var meta=document.getElementsByTagName("meta");
  for (var i=0; i<meta.length; i++) {
    if (meta[i].name.toLowerCase()=="description") {
      return meta[i].content;
    }
  }
}


if(language.toLocaleLowerCase().indexOf('ru') > -1) {
  Lang.local = Lang.res.ru;
  document.title = Lang.local['meta.title'];
  setDescription(Lang.local['meta.description'])
}
