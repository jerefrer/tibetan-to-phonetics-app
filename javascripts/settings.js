var defaultLanguage = 'english (strict)';

var defaultToOriginal = function(settings) {
  return _(settings).defaults(originalSettings);
}

var Settings = {
  defaultLanguage: defaultLanguage,
  language: Storage.get('language') || defaultLanguage,
  settings: defaultToOriginal(settingsPerLanguage[defaultLanguage]),
  get: function(key) {
    return this.settings[key];
  },
  change: function(language) {
    Storage.set('language', language);
    this.language = language;
    this.settings = defaultToOriginal(settingsPerLanguage[language]);
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