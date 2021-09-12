"use strict";

var defaultSettingId = 'english-semi-strict';
var Settings = {
  defaultSettingId: defaultSettingId,
  settings: [],
  all: function all() {
    return this.settings;
  },
  "default": function _default() {
    return this.find(this.defaultSettingId);
  },
  originalDefault: function originalDefault() {
    return this.findOriginal(this.defaultSettingId);
  },
  find: function find(settingId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!settingId) return;
    if (settingId.toString().match(/^\d*$/)) settingId = parseInt(settingId);
    return _(this.settings).findWhere({
      id: settingId
    });
  },
  findOriginal: function findOriginal(settingId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var setting = _(defaultSettings).findWhere({
      id: settingId
    });

    return this.initializeSetting(setting);
  },
  update: function update(settingId, name, rules, exceptions) {
    var setting = this.find(settingId);
    setting.name = name;
    setting.rules = rules;
    setting.exceptions = exceptions;
    this.updateStore();
  },
  create: function create(fromSetting, name) {
    var id = this.maxId() + 1;
    this.settings.push({
      id: id,
      isCustom: true,
      isEditable: true,
      name: name || 'Rule set ' + id,
      rules: _(fromSetting && fromSetting.rules || {}).defaults(originalRules),
      exceptions: fromSetting && fromSetting.exceptions || {}
    });
    this.updateStore();
  },
  copy: function copy(setting) {
    this.create(setting, 'Copy of ' + setting.name);
  },
  "import": function _import(setting) {
    this.create(setting, setting.name);
  },
  "delete": function _delete(setting) {
    this.settings = _(this.settings).without(setting);
    this.updateStore();
    Storage.get('selectedSettingId', undefined, function (value) {
      if (value == setting.id) Storage.set('selectedSettingId', defaultSettingId);
    });
  },
  reset: function reset(callback) {
    this.settings = this.initializedDefaultSettings();
    this.updateStore(callback);
  },
  maxId: function maxId() {
    return (this.settings.filter(function (setting) {
      return _(setting.id).isNumber();
    }).max('id') || {
      id: 0
    }).id;
  },
  updateStore: function updateStore(callback) {
    Storage.set('settings', this.settings, function (value) {
      if (callback) callback(value);
    });
  },
  initializedDefaultSettings: function initializedDefaultSettings() {
    var _this = this;

    return defaultSettings.map(function (setting) {
      return _this.initializeSetting(setting);
    });
  },
  initializeFromDefaults: function initializeFromDefaults() {
    this.settings = this.initializedDefaultSettings();
  },
  initializeFromStorage: function initializeFromStorage(callback) {
    var _this2 = this;

    Storage.get('settings', this.initializedDefaultSettings(), function (value) {
      _this2.settings = value;
      callback();
    });
  },
  initializeSetting: function initializeSetting(setting) {
    setting.isDefault = true;

    _(setting.rules).defaults(originalRules);

    return setting;
  },
  numberOfSpecificRules: function numberOfSpecificRules(setting) {
    return _(setting.rules).filter(function (value, key) {
      return originalRules[key] != value;
    }).length;
  }
};