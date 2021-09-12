"use strict";

var SettingsPage = Vue.component('settings-page', {
  data: function data() {
    return {
      showDropZone: false,
      showLivePreview: false,
      clickedNew: false,
      settingIdToCopy: Settings.defaultSettingId,
      settings: Settings.settings,
      selectedSettingId: Settings.defaultSettingId,
      exceptions: Exceptions.generalExceptionsAsArray(),
      ignoreGeneralExceptionsStorage: ignoreGeneralExceptionsStorage,
      options: {
        capitalize: true
      }
    };
  },
  watch: {
    selectedSettingId: function selectedSettingId(value) {
      Storage.set('selectedSettingId', value);
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
    isSettingsPage: function isSettingsPage(value) {
      return this.$route.name == 'settings';
    },
    isExceptionsPage: function isExceptionsPage(value) {
      return this.$route.name == 'general-exceptions';
    },
    defaultSettings: function defaultSettings() {
      return _(this.settings).where({
        isDefault: true
      });
    },
    customSettings: function customSettings() {
      return _(this.settings).where({
        isCustom: true
      });
    },
    someLocalStorage: function someLocalStorage() {
      return localforage._driver;
    },
    fakeSettingForLivePreview: function fakeSettingForLivePreview() {
      return {
        rules: Settings.find(this.selectedSettingId).rules,
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
    copySetting: function copySetting() {
      var setting = Settings.find(this.settingIdToCopy);
      Settings.copy(setting);
      this.settings = Settings.settings;
      this.clickedNew = false;
    },
    deleteSetting: function deleteSetting(setting) {
      if (confirm('Are you sure?')) {
        Settings["delete"](setting);
        this.settings = Settings.settings;
      }
    },
    isNewSetting: function isNewSetting(setting) {
      return _(setting.id).isNumber();
    },
    addNewException: function addNewException() {
      this.exceptions.push({
        key: '',
        value: ''
      });
    },
    reloadExceptions: function reloadExceptions() {
      this.exceptions = Exceptions.generalExceptionsAsArray();
    },
    revertExceptionsToOriginal: function revertExceptionsToOriginal() {
      if (confirm('Are you sure?')) {
        Exceptions.resetGeneralExceptions(this.reloadExceptions);
      }
    },
    showSettingUploadModal: function showSettingUploadModal() {
      var _this = this;

      this.showUploadModal('tt-setting', function (result) {
        var setting = JSON.parse(reader.result);
        Settings["import"](setting);
        _this.settings = Settings.settings;
      });
    },
    showExceptionsUploadModal: function showExceptionsUploadModal() {
      var _this2 = this;

      this.showUploadModal('tt-exceptions', function (result) {
        var exceptions = JSON.parse(result);

        _(exceptions).defaults(_this2.exceptionsAsObject);

        Exceptions.updateGeneralExceptions(exceptions, _this2.reloadExceptions);
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
    },
    resetStorage: function resetStorage() {
      var _this3 = this;

      if (confirm('Are you sure?')) {
        Storage["delete"]('convert-page');
        Storage["delete"]('selectedSettingId');
        Storage["delete"]('options');
        Storage["delete"]('compareTransliteration');
        Storage["delete"]('compareTibetan');
        Storage["delete"]('general-exceptions');
        Exceptions.resetGeneralExceptions(this.reloadExceptions);
        Settings.reset(function (value) {
          _this3.settings = value;
          var button = $(_this3.$refs.wipeOutButton);
          var buttonTextContainer = button.find('.content');
          var previousHtml = buttonTextContainer.html();
          buttonTextContainer.html('Clear all stored data<p>Wipe out complete!</p>');
          setTimeout(function () {
            return buttonTextContainer.html(previousHtml);
          }, 3000);
        });
      }
    }
  },
  template: "\n    <div\n      class=\"ui container settings with-live-preview\"\n      :class=\"{'with-live-preview-active': showLivePreview}\"\n    >\n\n      <div class=\"ui huge secondary pointing menu tab-menu\">\n        <router-link class=\"item\" :to=\"{name: 'settings'}\">\n          Settings\n        </router-link>\n        <router-link class=\"item\" :to=\"{name: 'general-exceptions'}\">\n          Exceptions\n        </router-link>\n      </div>\n\n      <div v-if=\"isSettingsPage\" class=\"ui active tab\">\n\n        <div class=\"ui large centered header\">\n          Default settings\n        </div>\n\n        <div class=\"ui centered cards\">\n          <setting-card\n            v-for=\"setting in defaultSettings\"\n            :key=\"setting.id\"\n            :setting=\"setting\"\n            @delete=\"deleteSetting(setting)\"\n          />\n        </div>\n\n        <div class=\"ui hidden section divider\"></div>\n\n        <div class=\"ui large centered header\">\n          Custom settings\n          <div v-if=\"someLocalStorage\" class=\"ui button\" @click=\"showSettingUploadModal\">\n            <i class=\"upload icon\" />\n            Upload\n          </div>\n        </div>\n\n        <div v-if=\"someLocalStorage\" class=\"ui centered cards\">\n\n          <setting-card\n            v-for=\"setting in customSettings\"\n            :key=\"setting.id\"\n            :setting=\"setting\"\n            :isCustom=\"true\"\n            @copy=\"copySetting(setting)\"\n            @delete=\"deleteSetting(setting)\"\n          />\n\n          <div\n            class=\"ui new card\"\n            :class=\"{link: !clickedNew}\"\n            @click=\"!clickedNew && (clickedNew = true)\"\n          >\n            <div class=\"content\">\n              <div class=\"header\">\n                <template v-if=\"clickedNew\">\n                  Copy from:\n                </template>\n                <template v-else>\n                  <i class=\"plus icon\" />\n                  New setting\n                </template>\n              </div>\n              <div v-if=\"clickedNew\">\n                <settings-dropdown\n                  v-model=\"settingIdToCopy\"\n                  :withLinkToSetting=\"false\"\n                />\n                <div class=\"ui button\" @click.stop=\"clickedNew = false\">\n                  Cancel\n                </div>\n                <div class=\"ui primary button\" @click.stop=\"copySetting\">\n                  Go\n                </div>\n              </div>\n            </div>\n          </div>\n\n        </div>\n\n        <div v-else class=\"ui warning message text container\">\n\n          <div class=\"header\">\n            Your browser does not support storing data locally, which is\n            necessary for custom settings to work.\n          </div>\n\n          <p>\n            You can still enjoy using the default settings, but if you want to\n            create your own or import other people's you will need to update\n            your browser to its latest version or start using a modern browser\n            like Mozilla Firefox or Google Chrome.\n          </p>\n\n        </div>\n\n        <div class=\"ui hidden divider\"></div>\n        <div class=\"ui section divider\"></div>\n        <div class=\"ui hidden divider\"></div>\n\n        <div class=\"ui center aligned container\">\n          <div\n            ref=\"wipeOutButton\"\n            class=\"ui large labeled icon button wipe-out-button\"\n            @click=\"resetStorage\"\n          >\n            <i class=\"large icon recycle\" />\n            <div class=\"content\">\n              Clear all stored data\n              <ul>\n                <li>All custom settings</li>\n                <li>All modifications made in the general exceptions</li>\n                <li>The last typed values in both convert and compare pages</li>\n              </ul>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"ui hidden divider\"></div>\n\n      </div>\n\n      <div v-if=\"isExceptionsPage\" class=\"ui text container active tab\">\n\n        <div class=\"ui large segment dev-mode\">\n          <div class=\"left\">\n            Dev mode\n          </div>\n          <slider-checkbox\n            v-model=\"ignoreGeneralExceptionsStorage\"\n            text=\"Ignore all modifications made here and use the default exceptions from file\"\n          />\n        </div>\n\n        <div\n          ref=\"div\"\n          id=\"general-exceptions-message\"\n          class=\"ui large secondary segment\"\n        >\n          <div>\n            These are the general exceptions that <em>apply to all settings</em>.\n          </div>\n          <div>\n            <div class=\"ui button\" @click=\"showExceptionsUploadModal\">\n              <i class=\"upload icon\"></i>\n              Upload\n            </div>\n            <div class=\"ui button\" @click=\"downloadExceptions\">\n              <i class=\"download icon\"></i>\n              Download\n            </div>\n          </div>\n        </div>\n\n        <exceptions-instructions />\n\n        <div class=\"exceptions\">\n          <div\n            v-for=\"(exception, index) in exceptions\"\n            class=\"ui exception input\"\n            :class=\"{\n              top: index == 0,\n              bottom: index == exceptions.length - 1\n            }\"\n          >\n            <input class=\"tibetan\" v-model=\"exception.key\"   spellcheck=\"false\" />\n            <input class=\"tibetan\" v-model=\"exception.value\" spellcheck=\"false\" />\n          </div>\n          <div class=\"ui attached button new exception\" @click=\"addNewException\">\n            <i class=\"plus icon\" />\n            Add a new exception\n          </div>\n        </div>\n\n        <div\n          class=\"ui bottom attached button reset-exceptions\"\n          @click=\"revertExceptionsToOriginal\"\n        >\n          <i class=\"undo icon\" />\n          Reset all to default (all modifications will be lost)\n        </div>\n\n      </div>\n\n      <div\n        v-if=\"isExceptionsPage\"\n        class=\"live-preview\"\n        :class=\"{active: showLivePreview}\"\n      >\n\n        <button\n          class=\"ui top attached icon button\"\n          @click=\"showLivePreview=!showLivePreview\"\n        >\n          <i class=\"up arrow icon\" />\n          Live preview\n        </button>\n\n        <div id=\"menu\">\n\n          <settings-dropdown v-model=\"selectedSettingId\" />\n\n          <slider-checkbox\n            v-model=\"options.capitalize\"\n            text=\"Capital letter at the beginning of each group\"\n          />\n\n        </div>\n\n        <convert-boxes\n          :setting=\"fakeSettingForLivePreview\"\n          :options=\"options\"\n          tibetanStorageKey=\"live-preview\"\n        />\n\n      </div>\n\n    </div>\n  "
});
Vue.component('setting-card', {
  props: {
    setting: Object,
    isCustom: Boolean
  },
  filters: {
    pluralize: function pluralize(value, text) {
      if (value == 0) return 'No ' + text.pluralize();else if (value == 1) return value + ' ' + text.singularize();else return value + ' ' + text.pluralize();
    }
  },
  computed: {
    numberOfSpecificRules: function numberOfSpecificRules() {
      return Settings.numberOfSpecificRules(this.setting);
    },
    numberOfSpecificExceptions: function numberOfSpecificExceptions() {
      return Object.keys(this.setting.exceptions).length;
    }
  },
  methods: {
    download: function download() {
      var json = JSON.stringify(_(this.setting).omit('id'));
      var blob = new Blob([json], {
        type: 'text/javascript'
      });
      saveAs(blob, this.setting.name + '.tt-setting');
    }
  },
  mounted: function mounted() {
    var _this4 = this;

    setTimeout(function () {
      $('[title]', _this4.$refs.card).popup({
        position: 'top center',
        variation: 'inverted'
      });
    }, 100);
  },
  template: "\n    <div class=\"ui card\" ref=\"card\">\n      <div class=\"content\">\n        <div class=\"ui large icon buttons\">\n          <link-to-edit-setting :setting=\"setting\" />\n          <div\n            v-if=\"isCustom\"\n            class=\"ui button\"\n            title=\"Download\"\n            @click=\"download\"\n          >\n            <i class=\"download icon\"></i>\n          </div>\n          <div\n            v-if=\"isCustom\"\n            class=\"ui button\"\n            title=\"Delete\"\n            @click=\"$emit('delete')\"\n          >\n            <i class=\"times icon\"></i>\n          </div>\n        </div>\n        <div class=\"header\">\n          {{setting.name}}\n        </div>\n      </div>\n      <div class=\"extra content\">\n        <span v-if=\"setting.id == 'english-strict'\" class=\"left floated\">\n          The original setting\n        </span>\n        <template v-else>\n          <span class=\"left floated\">\n            {{numberOfSpecificRules | pluralize('altered rule')}}\n          </span>\n          <span class=\"right floated\" v-if=\"numberOfSpecificExceptions\">\n            {{numberOfSpecificExceptions | pluralize('specific exception')}}\n          </span>\n        </template>\n      </div>\n    </div>\n  "
});