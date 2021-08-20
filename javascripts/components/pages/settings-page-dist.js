"use strict";

var redirectIfInvalidTab = function redirectIfInvalidTab(to, next) {
  if (_(['rules', 'exceptions']).includes(to.params.tab)) next();else next('/settings');
};

var SettingsPage = Vue.component('settings-page', {
  data: function data() {
    return {
      showDropZone: false,
      showLivePreview: false,
      languages: Languages.languages,
      selectedLanguageId: Languages.defaultLanguageId,
      exceptions: Exceptions.generalExceptionsAsArray(),
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
    selectedLanguageId: function selectedLanguageId(value) {
      Storage.set('selectedLanguageId', value);
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
    currentTab: function currentTab(value) {
      return this.$route.params.tab;
    },
    defaultLanguages: function defaultLanguages() {
      return _(this.languages).where({
        isDefault: true
      });
    },
    customLanguages: function customLanguages() {
      return _(this.languages).where({
        isCustom: true
      });
    },
    someLocalStorage: function someLocalStorage() {
      return localforage._driver;
    },
    fakeLanguageForLivePreview: function fakeLanguageForLivePreview() {
      return {
        rules: Languages.find(this.selectedLanguageId).rules,
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
    addNewLanguage: function addNewLanguage() {
      Languages.create();
      this.languages = Languages.languages;
    },
    copyLanguage: function copyLanguage(language) {
      Languages.copy(language);
      this.languages = Languages.languages;
    },
    deleteLanguage: function deleteLanguage(language) {
      if (confirm('Are you sure?')) {
        Languages["delete"](language);
        this.languages = Languages.languages;
      }
    },
    isNewLanguage: function isNewLanguage(language) {
      return _(language.id).isNumber();
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
    showImportModal: function showImportModal() {
      var _this = this;

      var modal = $('<div class="ui basic modal">');
      modal.html("\n        <i class=\"close icon\"></i>\n        <div class=\"content\">\n          <div id=\"mantra-import\">\n            <span class=\"dndtxt\">\n              Drag here the .tt-rule-set file or click here to browse to it\n            </span>\n          </div>\n        </div>\n      ");

      var processFile = function processFile(files) {
        var file = files.first().nativeFile;
        var reader = new FileReader();

        reader.onload = function () {
          try {
            var language = JSON.parse(reader.result);
            Languages["import"](language);
            _this.languages = Languages.languages;
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
        var uploadArea = new FileDrop('mantra-import', uploadOptions);
        uploadArea.event('send', processFile);
      };

      $('.ui.modal').remove();
      modal.modal().modal('show');
      initializeDragAndDrop();
    }
  },
  template: "\n    <div\n      class=\"ui container settings with-live-preview\"\n      :class=\"{'with-live-preview-active': showLivePreview}\"\n    >\n\n      <div class=\"ui huge secondary pointing menu tab-menu\">\n        <tab-link tabId=\"rules\">Rules</tab-link>\n        <tab-link tabId=\"exceptions\">Exceptions</tab-link>\n      </div>\n\n      <div v-if=\"currentTab == 'rules'\" class=\"ui active tab\">\n\n        <div class=\"ui large centered header\">\n          Default rule sets\n        </div>\n\n        <div class=\"ui centered cards\">\n          <language-card\n            v-for=\"language in defaultLanguages\"\n            :key=\"language.id\"\n            :language=\"language\"\n            @copy=\"copyLanguage(language)\"\n            @delete=\"deleteLanguage(language)\"\n          />\n        </div>\n\n        <div class=\"ui hidden section divider\"></div>\n\n        <div class=\"ui large centered header\">\n          Custom rule sets\n          <div v-if=\"someLocalStorage\" class=\"ui button\" @click=\"showImportModal\">\n            <i class=\"upload icon\" />\n            Import\n          </div>\n        </div>\n\n        <div v-if=\"someLocalStorage\" class=\"ui centered cards\">\n\n          <language-card\n            v-for=\"language in customLanguages\"\n            :key=\"language.id\"\n            :language=\"language\"\n            :isCustom=\"true\"\n            @copy=\"copyLanguage(language)\"\n            @delete=\"deleteLanguage(language)\"\n          />\n\n          <div class=\"ui new link card\" @click=\"addNewLanguage\">\n            <div class=\"content\">\n              <div class=\"header\">\n                <i class=\"plus icon\" />\n                New rule set\n              </div>\n            </div>\n          </div>\n\n        </div>\n\n        <div v-else class=\"ui warning message text container\">\n\n          <div class=\"header\">\n            Your browser does not support storing data locally, which is\n            necessary for custom rule sets to work.\n          </div>\n\n          <p>\n            You can still enjoy using the default rule sets, but if you want to\n            create your own or import other people's you will need to update\n            your browser to its latest version or start using a modern browser\n            like Mozilla Firefox or Google Chrome.\n          </p>\n\n        </div>\n\n      </div>\n\n      <div v-if=\"currentTab == 'exceptions'\" class=\"ui text container active tab\">\n\n        <div ref=\"div\" class=\"ui large secondary center aligned segment\">\n          These are the general exceptions that apply to all rule sets.\n        </div>\n\n        <exceptions-instructions />\n\n        <div class=\"exceptions\">\n          <div\n            v-for=\"(exception, index) in exceptions\"\n            class=\"ui exception input\"\n            :class=\"{\n              top: index == 0,\n              bottom: index == exceptions.length - 1\n            }\"\n          >\n            <input class=\"tibetan\" v-model=\"exception.key\"   spellcheck=\"false\" />\n            <input class=\"tibetan\" v-model=\"exception.value\" spellcheck=\"false\" />\n          </div>\n          <div class=\"ui attached button new exception\" @click=\"addNewException\">\n            <i class=\"plus icon\" />\n            Add a new exception\n          </div>\n        </div>\n\n        <div\n          class=\"ui bottom attached button reset-exceptions\"\n          @click=\"revertExceptionsToOriginal\"\n        >\n          <i class=\"undo icon\" />\n          Reset all to default (all modifications will be lost)\n        </div>\n\n      </div>\n\n      <div\n        v-if=\"currentTab == 'exceptions'\"\n        class=\"live-preview\"\n        :class=\"{active: showLivePreview}\"\n      >\n\n        <button\n          class=\"ui top attached icon button\"\n          @click=\"showLivePreview=!showLivePreview\"\n        >\n          <i class=\"up arrow icon\" />\n          Live preview\n        </button>\n\n        <div id=\"menu\">\n\n          <language-menu v-model=\"selectedLanguageId\" />\n\n          <slider-checkbox\n            v-model=\"options.capitalize\"\n            text=\"Capital letter at the beginning of each group\"\n          />\n\n        </div>\n\n        <convert-boxes\n          :language=\"fakeLanguageForLivePreview\"\n          :options=\"options\"\n          tibetanStorageKey=\"live-preview\"\n        />\n\n      </div>\n\n    </div>\n  "
});
Vue.component('language-card', {
  props: {
    language: Object,
    isCustom: Boolean
  },
  filters: {
    pluralize: function pluralize(value, text) {
      if (value == 0) return 'No ' + text.pluralize();else if (value == 1) return value + ' ' + text.singularize();else return value + ' ' + text.pluralize();
    }
  },
  computed: {
    numberOfSpecificRules: function numberOfSpecificRules() {
      return Languages.numberOfSpecificRules(this.language);
    },
    numberOfSpecificExceptions: function numberOfSpecificExceptions() {
      return Object.keys(this.language.exceptions).length;
    }
  },
  methods: {
    download: function download() {
      var json = JSON.stringify(_(this.language).omit('id'));
      var blob = new Blob([json], {
        type: 'text/javascript'
      });
      saveAs(blob, this.language.name + '.tt-rule-set');
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    setTimeout(function () {
      $('[title]', _this2.$refs.card).popup({
        position: 'top center',
        variation: 'inverted'
      });
    }, 100);
  },
  template: "\n    <div class=\"ui card\" ref=\"card\">\n      <div class=\"content\">\n        <div class=\"ui large icon buttons\">\n          <link-to-edit-language :language=\"language\" />\n          <div class=\"ui button\" title=\"Copy\" @click=\"$emit('copy')\">\n            <i class=\"copy icon\"></i>\n          </div>\n          <div\n            v-if=\"isCustom\"\n            class=\"ui button\"\n            title=\"Download\"\n            @click=\"download\"\n          >\n            <i class=\"download icon\"></i>\n          </div>\n          <div\n            v-if=\"isCustom\"\n            class=\"ui button\"\n            title=\"Delete\"\n            @click=\"$emit('delete')\"\n          >\n            <i class=\"times icon\"></i>\n          </div>\n        </div>\n        <div class=\"header\">\n          {{language.name}}\n        </div>\n      </div>\n      <div class=\"extra content\">\n        <span v-if=\"language.id == 'english-strict'\" class=\"left floated\">\n          The original setting\n        </span>\n        <template v-else>\n          <span class=\"left floated\">\n            {{numberOfSpecificRules | pluralize('altered rule')}}\n          </span>\n          <span class=\"right floated\" v-if=\"numberOfSpecificExceptions\">\n            {{numberOfSpecificExceptions | pluralize('specific exception')}}\n          </span>\n        </template>\n      </div>\n    </div>\n  "
});