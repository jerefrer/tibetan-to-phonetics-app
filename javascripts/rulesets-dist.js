"use strict";

var defaultRulesetId = 'english-semi-strict';
var Rulesets = {
  defaultRulesetId: defaultRulesetId,
  rulesets: [],
  all: function all() {
    return this.rulesets;
  },
  "default": function _default() {
    return this.find(this.defaultRulesetId);
  },
  originalDefault: function originalDefault() {
    return this.findOriginal(this.defaultRulesetId);
  },
  find: function find(rulesetId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!rulesetId) return;
    if (rulesetId.toString().match(/^\d*$/)) rulesetId = parseInt(rulesetId);
    return _(this.rulesets).findWhere({
      id: rulesetId
    });
  },
  findOriginal: function findOriginal(rulesetId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var ruleset = _(defaultRulesets).findWhere({
      id: rulesetId
    });

    return this.initializeRuleset(ruleset);
  },
  update: function update(rulesetId, name, rules, exceptions) {
    var ruleset = this.find(rulesetId);
    ruleset.name = name;
    ruleset.rules = rules;
    ruleset.exceptions = exceptions;
    this.updateStore();
  },
  create: function create(fromRuleset, name) {
    var id = this.maxId() + 1;
    this.rulesets.push({
      id: id,
      isCustom: true,
      isEditable: true,
      name: name || 'Rule set ' + id,
      rules: _(fromRuleset && fromRuleset.rules || {}).defaults(originalRules),
      exceptions: fromRuleset && fromRuleset.exceptions || {}
    });
    this.updateStore();
  },
  copy: function copy(ruleset) {
    this.create(ruleset, 'Copy of ' + ruleset.name);
  },
  "import": function _import(ruleset) {
    this.create(ruleset, ruleset.name);
  },
  "delete": function _delete(ruleset) {
    this.rulesets = _(this.rulesets).without(ruleset);
    this.updateStore();
    Storage.get('selectedRulesetId', undefined, function (value) {
      if (value == ruleset.id) Storage.set('selectedRulesetId', defaultRulesetId);
    });
  },
  maxId: function maxId() {
    return (this.rulesets.filter(function (ruleset) {
      return _(ruleset.id).isNumber();
    }).max('id') || {
      id: 0
    }).id;
  },
  updateStore: function updateStore() {
    localforage.setItem('rulesets', this.rulesets);
  },
  initialize: function initialize(callback) {
    var _this = this;

    localforage.getItem('rulesets').then(function (value) {
      _this.rulesets = value || defaultRulesets.map(function (ruleset) {
        return _this.initializeRuleset(ruleset);
      });
      callback();
    })["catch"](function (error) {
      _this.rulesets = defaultRulesets.map(function (ruleset) {
        return _this.initializeRuleset(ruleset);
      });
      callback();
    });
  },
  initializeRuleset: function initializeRuleset(ruleset) {
    ruleset.isDefault = true;

    _(ruleset.rules).defaults(originalRules);

    return ruleset;
  },
  numberOfSpecificRules: function numberOfSpecificRules(ruleset) {
    return _(ruleset.rules).filter(function (value, key) {
      return originalRules[key] != value;
    }).length;
  }
};