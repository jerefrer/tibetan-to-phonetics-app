var defaultSettingId = 'english-semi-strict';

var Settings = {
  defaultSettingId: defaultSettingId,
  settings: [],
  all () {
    return this.settings;
  },
  default() {
    return this.find(this.defaultSettingId);
  },
  originalDefault() {
    return this.findOriginal(this.defaultSettingId);
  },
  find: function(settingId, options = {}) {
    if (!settingId) return;
    if (settingId.toString().match(/^\d*$/)) settingId = parseInt(settingId);
    return _(this.settings).findWhere({id: settingId});
  },
  findOriginal: function(settingId, options = {}) {
    var setting = _(defaultSettings).findWhere({id: settingId});
    return this.initializeSetting(setting);
  },
  update(settingId, name, rules, exceptions) {
    var setting = this.find(settingId);
    setting.name = name;
    setting.rules = rules;
    setting.exceptions = exceptions;
    this.updateStore();
  },
  create (fromSetting, name) {
    var id = this.maxId() + 1;
    this.settings.push({
      id: id,
      isCustom: true,
      isEditable: true,
      name: name || 'Rule set ' + id,
      rules: _(fromSetting && fromSetting.rules || {}).defaults(originalRules),
      exceptions: fromSetting && fromSetting.exceptions || {}
    })
    this.updateStore();
  },
  copy(setting) {
    this.create(setting, 'Copy of ' + setting.name);
  },
  import(setting) {
    this.create(setting, setting.name);
  },
  delete(setting) {
    this.settings = _(this.settings).without(setting);
    this.updateStore();
    Storage.get('selectedSettingId', undefined, (value) => {
      if (value == setting.id)
        Storage.set('selectedSettingId', defaultSettingId);
    })
  },
  reset(callback) {
    this.settings = this.initializedDefaultSettings();
    this.updateStore(callback);
  },
  maxId () {
    return (
      this.settings
        .filter((setting) => _(setting.id).isNumber())
        .max('id') ||
      { id: 0 }
    ).id;
  },
  updateStore(callback) {
    Storage.set('settings', this.settings, (value) => {
      if (callback) callback(value);
    });
  },
  initializedDefaultSettings () {
    return defaultSettings.map((setting) => this.initializeSetting(setting));
  },
  initialize (callback) {
    Storage.get('settings', this.initializedDefaultSettings(), (value) => {
      this.settings = value;
      callback();
    })
  },
  initializeSetting (setting) {
    setting.isDefault = true;
    _(setting.rules).defaults(originalRules);
    return setting;
  },
  numberOfSpecificRules (setting) {
    return _(setting.rules)
      .filter((value, key) => originalRules[key] != value)
      .length;
  }
}