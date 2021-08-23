"use strict";

var redirectIfInvalidTab = function redirectIfInvalidTab(to, next) {
  if (_(['rules', 'exceptions']).includes(to.params.tab)) next();else next('/settings');
};

var SettingsPage = Vue.component('settings-page', {
  data: function data() {
    return {
      showDropZone: false,
      showLivePreview: false,
      rulesets: Rulesets.rulesets,
      selectedRulesetId: Rulesets.defaultRulesetId,
      exceptions: Exceptions.generalExceptionsAsArray(),
      ignoreGeneralExceptionsStorage: ignoreGeneralExceptionsStorage,
      options: {
        capitalize: true
      }
    };
  },
  beforeRouteEnter: function beforeRouteEnter(to, from, next) {
    redirectIfInvalidTab(to, next);
  },
  beforeRouteUpdate: function beforeRouteUpdate(to, from, next) {
    redirectIfInvalidTab(to, next);
  },
  watch: {
    selectedRulesetId: function selectedRulesetId(value) {
      Storage.set('selectedRulesetId', value);
    },
    ignoreGeneralExceptionsStorage: function ignoreGeneralExceptionsStorage(value) {
      Storage.set('ignoreGeneralExceptionsStorage', value, function () {
        location.reload();
      });
    },
    options: {
      deep: true,
      handler: function handler(value) {
        Storage.set('options', value);
      }
    },
    exceptions: {
      deep: true,
      handler: function handler(exceptionsAsArray) {
        Exceptions.updateGeneralExceptions(this.exceptionsAsObject);
      }
    }
  },
  computed: {
    isDevMode: function (_isDevMode) {
      function isDevMode() {
        return _isDevMode.apply(this, arguments);
      }

      isDevMode.toString = function () {
        return _isDevMode.toString();
      };

      return isDevMode;
    }(function () {
      return isDevMode;
    }),
    currentTab: function currentTab(value) {
      return this.$route.params.tab;
    },
    defaultRulesets: function defaultRulesets() {
      return _(this.rulesets).where({
        isDefault: true
      });
    },
    customRulesets: function customRulesets() {
      return _(this.rulesets).where({
        isCustom: true
      });
    },
    someLocalStorage: function someLocalStorage() {
      return localforage._driver;
    },
    fakeRulesetForLivePreview: function fakeRulesetForLivePreview() {
      return {
        rules: Rulesets.find(this.selectedRulesetId).rules,
        exceptions: this.exceptionsAsObject
      };
    },
    exceptionsAsObject: function exceptionsAsObject() {
      return _(this.exceptions).inject(function (hash, exception) {
        if (exception.key.trim() && exception.value.trim()) hash[exception.key] = exception.value;
        return hash;
      }, {});
    }
  },
  methods: {
    addNewRuleset: function addNewRuleset() {
      Rulesets.create();
      this.rulesets = Rulesets.rulesets;
    },
    copyRuleset: function copyRuleset(ruleset) {
      Rulesets.copy(ruleset);
      this.rulesets = Rulesets.rulesets;
    },
    deleteRuleset: function deleteRuleset(ruleset) {
      if (confirm('Are you sure?')) {
        Rulesets["delete"](ruleset);
        this.rulesets = Rulesets.rulesets;
      }
    },
    isNewRuleset: function isNewRuleset(ruleset) {
      return _(ruleset.id).isNumber();
    },
    addNewException: function addNewException() {
      this.exceptions.push({
        key: '',
        value: ''
      });
    },
    revertExceptionsToOriginal: function revertExceptionsToOriginal() {
      if (confirm('Are you sure?')) {
        Exceptions.updateGeneralExceptions(originalGeneralExceptions);
        this.exceptions = Exceptions.generalExceptionsAsArray();
      }
    },
    showRulesetUploadModal: function showRulesetUploadModal() {
      var _this = this;

      this.showUploadModal('tt-rule-set', function (result) {
        var ruleset = JSON.parse(reader.result);
        Rulesets["import"](ruleset);
        _this.rulesets = Rulesets.rulesets;
      });
    },
    showExceptionsUploadModal: function showExceptionsUploadModal() {
      var _this2 = this;

      this.showUploadModal('tt-exceptions', function (result) {
        var exceptions = JSON.parse(result);

        _(exceptions).defaults(_this2.exceptionsAsObject);

        Exceptions.updateGeneralExceptions(exceptions);
        _this2.exceptions = Exceptions.generalExceptionsAsArray();
      });
    },
    showUploadModal: function showUploadModal(fileExtension, callback) {
      var modal = $('<div class="ui basic modal">');
      modal.html("\n        <i class=\"close icon\"></i>\n        <div class=\"content\">\n          <div id=\"file-upload\">\n            <span class=\"dndtxt\">\n              Drag here the .".concat(fileExtension, " file or click here to browse to it\n            </span>\n          </div>\n        </div>\n      "));

      var processFile = function processFile(files) {
        var file = files.first().nativeFile;
        var reader = new FileReader();

        reader.onload = function () {
          try {
            callback(reader.result);
          } catch (error) {}

          ;
          modal.modal('hide');
        };

        reader.readAsText(file);
      };

      var initializeDragAndDrop = function initializeDragAndDrop() {
        var uploadOptions = {
          iframe: {
            url: '?/upload'
          },
          multiple: true,
          logging: 0
        };
        var uploadArea = new FileDrop('file-upload', uploadOptions);
        uploadArea.event('send', processFile);
      };

      $('.ui.modal').remove();
      modal.modal().modal('show');
      initializeDragAndDrop();
    },
    downloadExceptions: function downloadExceptions() {
      var json = JSON.stringify(this.exceptionsAsObject);
      var blob = new Blob([json], {
        type: 'text/javascript'
      });
      var datetime = new Date().toJSON().replace(/[T:]/g, '-').substr(0, 19);
      saveAs(blob, datetime + '.tt-exceptions');
    }
  },
  template: "\n    <div\n      class=\"ui container settings with-live-preview\"\n      :class=\"{'with-live-preview-active': showLivePreview}\"\n    >\n\n      <back-button />\n\n      <div class=\"ui huge secondary pointing menu tab-menu\">\n        <tab-link tabId=\"rules\">Rules</tab-link>\n        <tab-link tabId=\"exceptions\">Exceptions</tab-link>\n      </div>\n\n      <div v-if=\"currentTab == 'rules'\" class=\"ui active tab\">\n\n        <div class=\"ui large centered header\">\n          Default rule sets\n        </div>\n\n        <div class=\"ui centered cards\">\n          <ruleset-card\n            v-for=\"ruleset in defaultRulesets\"\n            :key=\"ruleset.id\"\n            :ruleset=\"ruleset\"\n            @copy=\"copyRuleset(ruleset)\"\n            @delete=\"deleteRuleset(ruleset)\"\n          />\n        </div>\n\n        <div class=\"ui hidden section divider\"></div>\n\n        <div class=\"ui large centered header\">\n          Custom rule sets\n          <div v-if=\"someLocalStorage\" class=\"ui button\" @click=\"showRulesetUploadModal\">\n            <i class=\"upload icon\" />\n            Upload\n          </div>\n        </div>\n\n        <div v-if=\"someLocalStorage\" class=\"ui centered cards\">\n\n          <ruleset-card\n            v-for=\"ruleset in customRulesets\"\n            :key=\"ruleset.id\"\n            :ruleset=\"ruleset\"\n            :isCustom=\"true\"\n            @copy=\"copyRuleset(ruleset)\"\n            @delete=\"deleteRuleset(ruleset)\"\n          />\n\n          <div class=\"ui new link card\" @click=\"addNewRuleset\">\n            <div class=\"content\">\n              <div class=\"header\">\n                <i class=\"plus icon\" />\n                New rule set\n              </div>\n            </div>\n          </div>\n\n        </div>\n\n        <div v-else class=\"ui warning message text container\">\n\n          <div class=\"header\">\n            Your browser does not support storing data locally, which is\n            necessary for custom rule sets to work.\n          </div>\n\n          <p>\n            You can still enjoy using the default rule sets, but if you want to\n            create your own or import other people's you will need to update\n            your browser to its latest version or start using a modern browser\n            like Mozilla Firefox or Google Chrome.\n          </p>\n\n        </div>\n\n      </div>\n\n      <div v-if=\"currentTab == 'exceptions'\" class=\"ui text container active tab\">\n\n        <div class=\"ui large segment dev-mode\">\n          <div class=\"left\">\n            Dev mode\n          </div>\n          <slider-checkbox\n            v-model=\"ignoreGeneralExceptionsStorage\"\n            text=\"Ignore all modifications made here and use the default exceptions from file\"\n          />\n        </div>\n\n        <div\n          ref=\"div\"\n          id=\"general-exceptions-message\"\n          class=\"ui large secondary segment\"\n        >\n          <div>\n            These are the general exceptions that apply to all rule sets.\n          </div>\n          <div>\n            <div class=\"ui button\" @click=\"showExceptionsUploadModal\">\n              <i class=\"upload icon\"></i>\n              Upload\n            </div>\n            <div class=\"ui button\" @click=\"downloadExceptions\">\n              <i class=\"download icon\"></i>\n              Download\n            </div>\n          </div>\n        </div>\n\n        <exceptions-instructions />\n\n        <div class=\"exceptions\">\n          <div\n            v-for=\"(exception, index) in exceptions\"\n            class=\"ui exception input\"\n            :class=\"{\n              top: index == 0,\n              bottom: index == exceptions.length - 1\n            }\"\n          >\n            <input class=\"tibetan\" v-model=\"exception.key\"   spellcheck=\"false\" />\n            <input class=\"tibetan\" v-model=\"exception.value\" spellcheck=\"false\" />\n          </div>\n          <div class=\"ui attached button new exception\" @click=\"addNewException\">\n            <i class=\"plus icon\" />\n            Add a new exception\n          </div>\n        </div>\n\n        <div\n          class=\"ui bottom attached button reset-exceptions\"\n          @click=\"revertExceptionsToOriginal\"\n        >\n          <i class=\"undo icon\" />\n          Reset all to default (all modifications will be lost)\n        </div>\n\n      </div>\n\n      <div\n        v-if=\"currentTab == 'exceptions'\"\n        class=\"live-preview\"\n        :class=\"{active: showLivePreview}\"\n      >\n\n        <button\n          class=\"ui top attached icon button\"\n          @click=\"showLivePreview=!showLivePreview\"\n        >\n          <i class=\"up arrow icon\" />\n          Live preview\n        </button>\n\n        <div id=\"menu\">\n\n          <ruleset-dropdown v-model=\"selectedRulesetId\" />\n\n          <slider-checkbox\n            v-model=\"options.capitalize\"\n            text=\"Capital letter at the beginning of each group\"\n          />\n\n        </div>\n\n        <convert-boxes\n          :ruleset=\"fakeRulesetForLivePreview\"\n          :options=\"options\"\n          tibetanStorageKey=\"live-preview\"\n        />\n\n      </div>\n\n    </div>\n  "
});
Vue.component('ruleset-card', {
  props: {
    ruleset: Object,
    isCustom: Boolean
  },
  filters: {
    pluralize: function pluralize(value, text) {
      if (value == 0) return 'No ' + text.pluralize();else if (value == 1) return value + ' ' + text.singularize();else return value + ' ' + text.pluralize();
    }
  },
  computed: {
    numberOfSpecificRules: function numberOfSpecificRules() {
      return Rulesets.numberOfSpecificRules(this.ruleset);
    },
    numberOfSpecificExceptions: function numberOfSpecificExceptions() {
      return Object.keys(this.ruleset.exceptions).length;
    }
  },
  methods: {
    download: function download() {
      var json = JSON.stringify(_(this.ruleset).omit('id'));
      var blob = new Blob([json], {
        type: 'text/javascript'
      });
      saveAs(blob, this.ruleset.name + '.tt-rule-set');
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    setTimeout(function () {
      $('[title]', _this3.$refs.card).popup({
        position: 'top center',
        variation: 'inverted'
      });
    }, 100);
  },
  template: "\n    <div class=\"ui card\" ref=\"card\">\n      <div class=\"content\">\n        <div class=\"ui large icon buttons\">\n          <link-to-edit-ruleset :ruleset=\"ruleset\" />\n          <div class=\"ui button\" title=\"Copy\" @click=\"$emit('copy')\">\n            <i class=\"copy icon\"></i>\n          </div>\n          <div\n            v-if=\"isCustom\"\n            class=\"ui button\"\n            title=\"Download\"\n            @click=\"download\"\n          >\n            <i class=\"download icon\"></i>\n          </div>\n          <div\n            v-if=\"isCustom\"\n            class=\"ui button\"\n            title=\"Delete\"\n            @click=\"$emit('delete')\"\n          >\n            <i class=\"times icon\"></i>\n          </div>\n        </div>\n        <div class=\"header\">\n          {{ruleset.name}}\n        </div>\n      </div>\n      <div class=\"extra content\">\n        <span v-if=\"ruleset.id == 'english-strict'\" class=\"left floated\">\n          The original setting\n        </span>\n        <template v-else>\n          <span class=\"left floated\">\n            {{numberOfSpecificRules | pluralize('altered rule')}}\n          </span>\n          <span class=\"right floated\" v-if=\"numberOfSpecificExceptions\">\n            {{numberOfSpecificExceptions | pluralize('specific exception')}}\n          </span>\n        </template>\n      </div>\n    </div>\n  "
});