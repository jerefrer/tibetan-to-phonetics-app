var settingsPerLanguage = {};
settingsPerLanguage['english'] = {
  'u': 'u',
  'ü': 'ü',
  'ö': 'ö',
  'g': 'g',
  'gy': 'gy',
  'c': 'ch',
  'ch': 'ch',
  'j': 'j',
  'th': "th",
  'ph': "p'",
  'tsh': "ts",
  "tr'": "tr'",
  'sh': 'sh',
  'zh': 'zh',
}
settingsPerLanguage['french'] = {
  'doubleS': true,
  'g': 'gu',
  'gy': 'gui',
  'u': 'ou',
  'ü': 'u',
  'ö': 'eu',
  'c': 'tch',
  'ch': "tch'",
  'j': 'dj',
  'th': "t'",
  'ph': "p'",
  'tsh': "ts'",
  "tr'": "t'r",
  'sh': 'ch',
  'zh': 'sh'
}

var Settings = {
  defaultLanguage: 'english',
  language: 'english',
  settings: settingsPerLanguage['english'],
  get: function(key) {
    return this.settings[key];
  },
  change: function(language) {
    this.language = localStorage['transliterator.language'] = language;
    this.settings = settingsPerLanguage[language];
  },
  default: function() {
    this.change(this.defaultLanguage);
  },
  isDefault: function() {
    return this.language == this.defaultLanguage;
  },
  languages: function() {
    return _(settingsPerLanguage).keys();
  }
}

var t = function(key) {
  return Settings.get(key);
}