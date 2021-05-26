"use strict";

var defaultLanguage = 'english (strict)';

var defaultToOriginal = function defaultToOriginal(settings) {
  return _(settings).defaults(originalSettings);
};

var Settings = {
  defaultLanguage: defaultLanguage,
  language: defaultLanguage,
  settings: defaultToOriginal(settingsPerLanguage[defaultLanguage]),
  get: function get(key) {
    return this.settings[key];
  },
  change: function change(language) {
    Storage.set('language', language);
    this.language = language;
    this.settings = defaultToOriginal(settingsPerLanguage[language]);
  },
  "default": function _default() {
    this.change(this.defaultLanguage);
  },
  isDefault: function isDefault() {
    return this.language == this.defaultLanguage;
  },
  languages: function languages() {
    return _(settingsPerLanguage).keys();
  }
};

var t = function t(key) {
  return Settings.get(key);
};