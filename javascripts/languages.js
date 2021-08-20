var defaultLanguageId = 'english-semi-strict';

var Languages = {
  defaultLanguageId: defaultLanguageId,
  languages: [],
  all () {
    return this.languages;
  },
  default() {
    return this.find(this.defaultLanguageId);
  },
  originalDefault() {
    return this.findOriginal(this.defaultLanguageId);
  },
  find: function(languageId, options = {}) {
    if (!languageId) return;
    if (languageId.toString().match(/^\d*$/)) languageId = parseInt(languageId);
    return _(this.languages).findWhere({id: languageId});
  },
  findOriginal: function(languageId, options = {}) {
    var language = _(defaultLanguages).findWhere({id: languageId});
    return this.initializeLanguage(language);
  },
  update(languageId, name, rules, exceptions) {
    var language = this.find(languageId);
    language.name = name;
    language.rules = rules;
    language.exceptions = exceptions;
    this.updateStore();
  },
  create (fromLanguage, name) {
    var id = this.maxId() + 1;
    this.languages.push({
      id: id,
      isCustom: true,
      isEditable: true,
      name: name || 'Rule set ' + id,
      rules: _(fromLanguage && fromLanguage.rules || {}).defaults(originalRules),
      exceptions: fromLanguage && fromLanguage.exceptions || {}
    })
    this.updateStore();
  },
  copy(language) {
    this.create(language, 'Copy of ' + language.name);
  },
  import(language) {
    this.create(language, language.name);
  },
  delete(language) {
    this.languages = _(this.languages).without(language);
    this.updateStore();
    Storage.get('selectedLanguageId', undefined, (value) => {
      if (value == language.id)
        Storage.set('selectedLanguageId', defaultLanguageId);
    })
  },
  maxId () {
    return (
      this.languages
        .filter((language) => _(language.id).isNumber())
        .max('id') ||
      { id: 0 }
    ).id;
  },
  updateStore() {
    localforage.setItem('languages', this.languages);
  },
  initialize (callback) {
    localforage.getItem('languages').then((value) => {
      this.languages =
        value ||
        defaultLanguages.map((language) => this.initializeLanguage(language));
      callback();
    }).catch((error) => {
      this.languages =
        defaultLanguages.map((language) => this.initializeLanguage(language));
      callback();
    });
  },
  initializeLanguage (language) {
    language.isDefault = true;
    _(language.rules).defaults(originalRules);
    return language;
  },
  numberOfSpecificRules (language) {
    return _(language.rules)
      .filter((value, key) => originalRules[key] != value)
      .length;
  }
}