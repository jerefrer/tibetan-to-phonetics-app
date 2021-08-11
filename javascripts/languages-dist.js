"use strict";

var defaultLanguageId = 'english-semi-strict';
var Languages = {
  defaultLanguageId: defaultLanguageId,
  languages: [],
  all: function all() {
    return this.languages;
  },
  "default": function _default() {
    return this.find(this.defaultLanguageId);
  },
  originalDefault: function originalDefault() {
    return this.findOriginal(this.defaultLanguageId);
  },
  find: function find(languageId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (languageId.toString().match(/^\d*$/)) languageId = parseInt(languageId);
    return _(this.languages).findWhere({
      id: languageId
    });
  },
  findOriginal: function findOriginal(languageId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var language = _(defaultLanguages).findWhere({
      id: languageId
    });

    return this.initializeLanguage(language);
  },
  update: function update(languageId, name, rules, exceptions) {
    var language = this.find(languageId);
    language.name = name;
    language.rules = rules;
    language.exceptions = exceptions;
    Storage.set('languages', this.languages);
  },
  create: function create(fromLanguage, name) {
    var id = this.maxId() + 1;
    this.languages.push({
      id: id,
      isCustom: true,
      isEditable: true,
      name: name || 'Rule set ' + id,
      rules: _(fromLanguage && fromLanguage.rules || {}).defaults(originalRules),
      exceptions: fromLanguage && fromLanguage.exceptions || {}
    });
    Storage.set('languages', this.languages);
  },
  copy: function copy(language) {
    this.create(language, 'Copy of ' + language.name);
  },
  "import": function _import(language) {
    this.create(language, language.name);
  },
  "delete": function _delete(language) {
    this.languages = _(this.languages).without(language);
    Storage.set('languages', this.languages);
    if (Storage.get('selectedLanguageId') == language.id) Storage.set('selectedLanguageId', defaultLanguageId);
  },
  maxId: function maxId() {
    return (this.languages.filter(function (language) {
      return _(language.id).isNumber();
    }).max('id') || {
      id: 0
    }).id;
  },
  initialize: function initialize() {
    var _this = this;

    this.languages = Storage.get('languages') || defaultLanguages.map(function (language) {
      return _this.initializeLanguage(language);
    });
  },
  initializeLanguage: function initializeLanguage(language) {
    language.isDefault = true;

    _(language.rules).defaults(originalRules);

    return language;
  },
  numberOfSpecificRules: function numberOfSpecificRules(language) {
    return _(language.rules).filter(function (value, key) {
      return originalRules[key] != value;
    }).length;
  }
};
Languages.initialize();