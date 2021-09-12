var SettingsPage = Vue.component('settings-page', {
  data () {
    return {
      showDropZone: false,
      showLivePreview: false,
      clickedNew: false,
      settingIdToCopy: Settings.defaultSettingId,
      settings: Settings.settings,
      selectedSettingId: Settings.defaultSettingId,
      exceptions: Exceptions.generalExceptionsAsArray(),
      ignoreGeneralExceptionsStorage: ignoreGeneralExceptionsStorage,
      options: { capitalize: true },
    }
  },
  watch: {
    selectedSettingId (value) {
      Storage.set('selectedSettingId', value);
    },
    ignoreGeneralExceptionsStorage (value) {
      Storage.set('ignoreGeneralExceptionsStorage', value, () => {
        location.reload();
      });
    },
    options: {
      deep: true,
      handler (value) {
        Storage.set('options', value);
      }
    },
    exceptions: {
      deep: true,
      handler (exceptionsAsArray) {
        Exceptions.updateGeneralExceptions(this.exceptionsAsObject);
      }
    }
  },
  computed: {
    isDevMode () {
      return isDevMode
    },
    isSettingsPage (value) {
      return this.$route.name == 'settings';
    },
    isExceptionsPage (value) {
      return this.$route.name == 'general-exceptions';
    },
    defaultSettings () {
      return _(this.settings).where({isDefault: true});
    },
    customSettings () {
      return _(this.settings).where({isCustom: true});
    },
    someLocalStorage () {
      return localforage._driver;
    },
    fakeSettingForLivePreview () {
      return {
        rules: Settings.find(this.selectedSettingId).rules,
        exceptions: this.exceptionsAsObject
      }
    },
    exceptionsAsObject () {
      return _(this.exceptions).inject((hash, exception) => {
        if (exception.key.trim() && exception.value.trim())
          hash[exception.key] = exception.value;
        return hash;
      }, {});
    }
  },
  methods: {
    copySetting () {
      var setting = Settings.find(this.settingIdToCopy);
      Settings.copy(setting);
      this.settings = Settings.settings;
      this.clickedNew = false;
    },
    deleteSetting(setting) {
      if (confirm('Are you sure?')) {
        Settings.delete(setting);
        this.settings = Settings.settings;
      }
    },
    isNewSetting (setting) {
      return _(setting.id).isNumber();
    },
    addNewException () {
      this.exceptions.push({
        key: '',
        value: ''
      })
    },
    reloadExceptions () {
      this.exceptions = Exceptions.generalExceptionsAsArray();
    },
    revertExceptionsToOriginal () {
      if (confirm('Are you sure?')) {
        Exceptions.resetGeneralExceptions(this.reloadExceptions);
      }
    },
    showSettingUploadModal () {
      this.showUploadModal('tt-setting', (result) => {
        var setting = JSON.parse(reader.result);
        Settings.import(setting);
        this.settings = Settings.settings;
      });
    },
    showExceptionsUploadModal () {
      this.showUploadModal('tt-exceptions', (result) => {
        var exceptions = JSON.parse(result);
        _(exceptions).defaults(this.exceptionsAsObject);
        Exceptions.updateGeneralExceptions(exceptions, this.reloadExceptions);
      });
    },
    showUploadModal (fileExtension, callback) {
      var modal = $('<div class="ui basic modal">');
      modal.html(`
        <i class="close icon"></i>
        <div class="content">
          <div id="file-upload">
            <span class="dndtxt">
              Drag here the .${fileExtension} file or click here to browse to it
            </span>
          </div>
        </div>
      `);
      var processFile = (files) => {
        var file = files.first().nativeFile;
        var reader = new FileReader();
        reader.onload = () => {
          try {
            callback(reader.result);
          } catch(error) {};
          modal.modal('hide');
        };
        reader.readAsText(file);
      };
      var initializeDragAndDrop = function() {
        var uploadOptions = { iframe: { url: '?/upload' }, multiple: true, logging: 0 };
        var uploadArea = new FileDrop('file-upload', uploadOptions);
        uploadArea.event('send', processFile);
      }
      $('.ui.modal').remove();
      modal.modal().modal('show');
      initializeDragAndDrop();
    },
    downloadExceptions () {
      var json = JSON.stringify(this.exceptionsAsObject);
      var blob = new Blob([json], { type: 'text/javascript' });
      var datetime = new Date().toJSON().replace(/[T:]/g, '-').substr(0, 19);
      saveAs(blob, datetime + '.tt-exceptions');
    },
    resetStorage () {
      if (confirm('Are you sure?')) {
        Storage.delete('convert-page');
        Storage.delete('selectedSettingId');
        Storage.delete('options');
        Storage.delete('compareTransliteration');
        Storage.delete('compareTibetan');
        Storage.delete('general-exceptions');
        Exceptions.resetGeneralExceptions(this.reloadExceptions);
        Settings.reset((value) => {
          this.settings = value;
          var button = $(this.$refs.wipeOutButton);
          var buttonTextContainer = button.find('.content');
          var previousHtml = buttonTextContainer.html();
          buttonTextContainer.html('Clear all stored data<p>Wipe out complete!</p>');
          setTimeout(() => buttonTextContainer.html(previousHtml), 3000);
        });
      }
    }
  },
  template: `
    <div
      class="ui container settings with-live-preview"
      :class="{'with-live-preview-active': showLivePreview}"
    >

      <div class="ui huge secondary pointing menu tab-menu">
        <router-link class="item" :to="{name: 'settings'}">
          Settings
        </router-link>
        <router-link class="item" :to="{name: 'general-exceptions'}">
          Exceptions
        </router-link>
      </div>

      <div v-if="isSettingsPage" class="ui active tab">

        <div class="ui large centered header">
          Default settings
        </div>

        <div class="ui centered cards">
          <setting-card
            v-for="setting in defaultSettings"
            :key="setting.id"
            :setting="setting"
            @delete="deleteSetting(setting)"
          />
        </div>

        <div class="ui hidden section divider"></div>

        <div class="ui large centered header">
          Custom settings
          <div v-if="someLocalStorage" class="ui button" @click="showSettingUploadModal">
            <i class="upload icon" />
            Upload
          </div>
        </div>

        <div v-if="someLocalStorage" class="ui centered cards">

          <setting-card
            v-for="setting in customSettings"
            :key="setting.id"
            :setting="setting"
            :isCustom="true"
            @copy="copySetting(setting)"
            @delete="deleteSetting(setting)"
          />

          <div
            class="ui new card"
            :class="{link: !clickedNew}"
            @click="!clickedNew && (clickedNew = true)"
          >
            <div class="content">
              <div class="header">
                <template v-if="clickedNew">
                  Copy from:
                </template>
                <template v-else>
                  <i class="plus icon" />
                  New setting
                </template>
              </div>
              <div v-if="clickedNew">
                <settings-dropdown
                  v-model="settingIdToCopy"
                  :withLinkToSetting="false"
                />
                <div class="ui button" @click.stop="clickedNew = false">
                  Cancel
                </div>
                <div class="ui primary button" @click.stop="copySetting">
                  Go
                </div>
              </div>
            </div>
          </div>

        </div>

        <div v-else class="ui warning message text container">

          <div class="header">
            Your browser does not support storing data locally, which is
            necessary for custom settings to work.
          </div>

          <p>
            You can still enjoy using the default settings, but if you want to
            create your own or import other people's you will need to update
            your browser to its latest version or start using a modern browser
            like Mozilla Firefox or Google Chrome.
          </p>

        </div>

        <div class="ui hidden divider"></div>
        <div class="ui section divider"></div>
        <div class="ui hidden divider"></div>

        <div class="ui center aligned container">
          <div
            ref="wipeOutButton"
            class="ui large labeled icon button wipe-out-button"
            @click="resetStorage"
          >
            <i class="large icon recycle" />
            <div class="content">
              Clear all stored data
              <ul>
                <li>All custom settings</li>
                <li>All modifications made in the general exceptions</li>
                <li>The last typed values in both convert and compare pages</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="ui hidden divider"></div>

      </div>

      <div v-if="isExceptionsPage" class="ui text container active tab">

        <div class="ui large segment dev-mode">
          <div class="left">
            Dev mode
          </div>
          <slider-checkbox
            v-model="ignoreGeneralExceptionsStorage"
            text="Ignore all modifications made here and use the default exceptions from file"
          />
        </div>

        <div
          ref="div"
          id="general-exceptions-message"
          class="ui large secondary segment"
        >
          <div>
            These are the general exceptions that <em>apply to all settings</em>.
          </div>
          <div>
            <div class="ui button" @click="showExceptionsUploadModal">
              <i class="upload icon"></i>
              Upload
            </div>
            <div class="ui button" @click="downloadExceptions">
              <i class="download icon"></i>
              Download
            </div>
          </div>
        </div>

        <exceptions-instructions />

        <div class="exceptions">
          <div
            v-for="(exception, index) in exceptions"
            class="ui exception input"
            :class="{
              top: index == 0,
              bottom: index == exceptions.length - 1
            }"
          >
            <input class="tibetan" v-model="exception.key"   spellcheck="false" />
            <input class="tibetan" v-model="exception.value" spellcheck="false" />
          </div>
          <div class="ui attached button new exception" @click="addNewException">
            <i class="plus icon" />
            Add a new exception
          </div>
        </div>

        <div
          class="ui bottom attached button reset-exceptions"
          @click="revertExceptionsToOriginal"
        >
          <i class="undo icon" />
          Reset all to default (all modifications will be lost)
        </div>

      </div>

      <div
        v-if="isExceptionsPage"
        class="live-preview"
        :class="{active: showLivePreview}"
      >

        <button
          class="ui top attached icon button"
          @click="showLivePreview=!showLivePreview"
        >
          <i class="up arrow icon" />
          Live preview
        </button>

        <div id="menu">

          <settings-dropdown v-model="selectedSettingId" />

          <slider-checkbox
            v-model="options.capitalize"
            text="Capital letter at the beginning of each group"
          />

        </div>

        <convert-boxes
          :setting="fakeSettingForLivePreview"
          :options="options"
          tibetanStorageKey="live-preview"
        />

      </div>

    </div>
  `
})

Vue.component('setting-card', {
  props: {
    setting: Object,
    isCustom: Boolean
  },
  filters: {
    pluralize(value, text) {
      if      (value == 0) return 'No ' + text.pluralize();
      else if (value == 1) return value + ' ' + text.singularize();
      else                 return value + ' ' + text.pluralize();
    }
  },
  computed: {
    numberOfSpecificRules () {
      return Settings.numberOfSpecificRules(this.setting);
    },
    numberOfSpecificExceptions () {
      return Object.keys(this.setting.exceptions).length;
    },
  },
  methods: {
    download () {
      var json = JSON.stringify(_(this.setting).omit('id'));
      var blob = new Blob([json], { type: 'text/javascript' });
      saveAs(blob, this.setting.name + '.tt-setting');
    }
  },
  mounted () {
    setTimeout(() => {
      $('[title]', this.$refs.card).popup({
        position: 'top center',
        variation: 'inverted'
      });
    }, 100)
  },
  template: `
    <div class="ui card" ref="card">
      <div class="content">
        <div class="ui large icon buttons">
          <link-to-edit-setting :setting="setting" />
          <div
            v-if="isCustom"
            class="ui button"
            title="Download"
            @click="download"
          >
            <i class="download icon"></i>
          </div>
          <div
            v-if="isCustom"
            class="ui button"
            title="Delete"
            @click="$emit('delete')"
          >
            <i class="times icon"></i>
          </div>
        </div>
        <div class="header">
          {{setting.name}}
        </div>
      </div>
      <div class="extra content">
        <span v-if="setting.id == 'english-strict'" class="left floated">
          The original setting
        </span>
        <template v-else>
          <span class="left floated">
            {{numberOfSpecificRules | pluralize('altered rule')}}
          </span>
          <span class="right floated" v-if="numberOfSpecificExceptions">
            {{numberOfSpecificExceptions | pluralize('specific exception')}}
          </span>
        </template>
      </div>
    </div>
  `
})