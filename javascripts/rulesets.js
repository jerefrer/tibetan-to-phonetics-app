var defaultRulesetId = 'english-semi-strict';

var Rulesets = {
  defaultRulesetId: defaultRulesetId,
  rulesets: [],
  all () {
    return this.rulesets;
  },
  default() {
    return this.find(this.defaultRulesetId);
  },
  originalDefault() {
    return this.findOriginal(this.defaultRulesetId);
  },
  find: function(rulesetId, options = {}) {
    if (!rulesetId) return;
    if (rulesetId.toString().match(/^\d*$/)) rulesetId = parseInt(rulesetId);
    return _(this.rulesets).findWhere({id: rulesetId});
  },
  findOriginal: function(rulesetId, options = {}) {
    var ruleset = _(defaultRulesets).findWhere({id: rulesetId});
    return this.initializeRuleset(ruleset);
  },
  update(rulesetId, name, rules, exceptions) {
    var ruleset = this.find(rulesetId);
    ruleset.name = name;
    ruleset.rules = rules;
    ruleset.exceptions = exceptions;
    this.updateStore();
  },
  create (fromRuleset, name) {
    var id = this.maxId() + 1;
    this.rulesets.push({
      id: id,
      isCustom: true,
      isEditable: true,
      name: name || 'Rule set ' + id,
      rules: _(fromRuleset && fromRuleset.rules || {}).defaults(originalRules),
      exceptions: fromRuleset && fromRuleset.exceptions || {}
    })
    this.updateStore();
  },
  copy(ruleset) {
    this.create(ruleset, 'Copy of ' + ruleset.name);
  },
  import(ruleset) {
    this.create(ruleset, ruleset.name);
  },
  delete(ruleset) {
    this.rulesets = _(this.rulesets).without(ruleset);
    this.updateStore();
    Storage.get('selectedRulesetId', undefined, (value) => {
      if (value == ruleset.id)
        Storage.set('selectedRulesetId', defaultRulesetId);
    })
  },
  maxId () {
    return (
      this.rulesets
        .filter((ruleset) => _(ruleset.id).isNumber())
        .max('id') ||
      { id: 0 }
    ).id;
  },
  updateStore() {
    localforage.setItem('rulesets', this.rulesets);
  },
  initialize (callback) {
    localforage.getItem('rulesets').then((value) => {
      this.rulesets =
        value ||
        defaultRulesets.map((ruleset) => this.initializeRuleset(ruleset));
      callback();
    }).catch((error) => {
      this.rulesets =
        defaultRulesets.map((ruleset) => this.initializeRuleset(ruleset));
      callback();
    });
  },
  initializeRuleset (ruleset) {
    ruleset.isDefault = true;
    _(ruleset.rules).defaults(originalRules);
    return ruleset;
  },
  numberOfSpecificRules (ruleset) {
    return _(ruleset.rules)
      .filter((value, key) => originalRules[key] != value)
      .length;
  }
}