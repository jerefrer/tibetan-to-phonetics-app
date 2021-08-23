let redirectIfInvalidTab = function (to, next) {
  if (_(['rules', 'exceptions']).includes(to.params.tab))
    next()
  else
    next('/settings');
}

var SettingsPage = Vue.component('settings-page', {
  data () {
    return {
      showDropZone: false,
      showLivePreview: false,
      rulesets: Rulesets.rulesets,
      selectedRulesetId: Rulesets.defaultRulesetId,
      exceptions: Exceptions.generalExceptionsAsArray(),
      ignoreGeneralExceptionsStorage: ignoreGeneralExceptionsStorage,
      options: { capitalize: true },
    }
  },
  beforeRouteEnter (to, from, next) {
    redirectIfInvalidTab(to, next);
  },
  beforeRouteUpdate (to, from, next) {
    redirectIfInvalidTab(to, next);
  },
  watch: {
    selectedRulesetId (value) {
      Storage.set('selectedRulesetId', value);
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
    currentTab (value) {
      return this.$route.params.tab;
    },
    defaultRulesets () {
      return _(this.rulesets).where({isDefault: true});
    },
    customRulesets () {
      return _(this.rulesets).where({isCustom: true});
    },
    someLocalStorage () {
      return localforage._driver;
    },
    fakeRulesetForLivePreview () {
      return {
        rules: Rulesets.find(this.selectedRulesetId).rules,
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
    addNewRuleset () {
      Rulesets.create();
      this.rulesets = Rulesets.rulesets;
    },
    copyRuleset (ruleset) {
      Rulesets.copy(ruleset);
      this.rulesets = Rulesets.rulesets;
    },
    deleteRuleset(ruleset) {
      if (confirm('Are you sure?')) {
        Rulesets.delete(ruleset);
        this.rulesets = Rulesets.rulesets;
      }
    },
    isNewRuleset (ruleset) {
      return _(ruleset.id).isNumber();
    },
    addNewException () {
      this.exceptions.push({
        key: '',
        value: ''
      })
    },
    revertExceptionsToOriginal () {
      if (confirm('Are you sure?')) {
        Exceptions.updateGeneralExceptions(originalGeneralExceptions);
        this.exceptions = Exceptions.generalExceptionsAsArray();
      }
    },
    showRulesetUploadModal () {
      this.showUploadModal('tt-rule-set', (result) => {
        var ruleset = JSON.parse(reader.result);
        Rulesets.import(ruleset);
        this.rulesets = Rulesets.rulesets;
      });
    },
    showExceptionsUploadModal () {
      this.showUploadModal('tt-exceptions', (result) => {
        var exceptions = JSON.parse(result);
        _(exceptions).defaults(this.exceptionsAsObject);
        Exceptions.updateGeneralExceptions(exceptions);
        this.exceptions = Exceptions.generalExceptionsAsArray();
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
    }
  },
  template: `
    <div
      class="ui container settings with-live-preview"
      :class="{'with-live-preview-active': showLivePreview}"
    >

      <div class="ui huge secondary pointing menu tab-menu">
        <tab-link tabId="rules">Rules</tab-link>
        <tab-link tabId="exceptions">Exceptions</tab-link>
      </div>

      <div v-if="currentTab == 'rules'" class="ui active tab">

        <div class="ui large centered header">
          Default rule sets
        </div>

        <div class="ui centered cards">
          <ruleset-card
            v-for="ruleset in defaultRulesets"
            :key="ruleset.id"
            :ruleset="ruleset"
            @copy="copyRuleset(ruleset)"
            @delete="deleteRuleset(ruleset)"
          />
        </div>

        <div class="ui hidden section divider"></div>

        <div class="ui large centered header">
          Custom rule sets
          <div v-if="someLocalStorage" class="ui button" @click="showRulesetUploadModal">
            <i class="upload icon" />
            Upload
          </div>
        </div>

        <div v-if="someLocalStorage" class="ui centered cards">

          <ruleset-card
            v-for="ruleset in customRulesets"
            :key="ruleset.id"
            :ruleset="ruleset"
            :isCustom="true"
            @copy="copyRuleset(ruleset)"
            @delete="deleteRuleset(ruleset)"
          />

          <div class="ui new link card" @click="addNewRuleset">
            <div class="content">
              <div class="header">
                <i class="plus icon" />
                New rule set
              </div>
            </div>
          </div>

        </div>

        <div v-else class="ui warning message text container">

          <div class="header">
            Your browser does not support storing data locally, which is
            necessary for custom rule sets to work.
          </div>

          <p>
            You can still enjoy using the default rule sets, but if you want to
            create your own or import other people's you will need to update
            your browser to its latest version or start using a modern browser
            like Mozilla Firefox or Google Chrome.
          </p>

        </div>

      </div>

      <div v-if="currentTab == 'exceptions'" class="ui text container active tab">

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
            These are the general exceptions that apply to all rule sets.
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
        v-if="currentTab == 'exceptions'"
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

          <ruleset-dropdown v-model="selectedRulesetId" />

          <slider-checkbox
            v-model="options.capitalize"
            text="Capital letter at the beginning of each group"
          />

        </div>

        <convert-boxes
          :ruleset="fakeRulesetForLivePreview"
          :options="options"
          tibetanStorageKey="live-preview"
        />

      </div>

    </div>
  `
})

Vue.component('ruleset-card', {
  props: {
    ruleset: Object,
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
      return Rulesets.numberOfSpecificRules(this.ruleset);
    },
    numberOfSpecificExceptions () {
      return Object.keys(this.ruleset.exceptions).length;
    },
  },
  methods: {
    download () {
      var json = JSON.stringify(_(this.ruleset).omit('id'));
      var blob = new Blob([json], { type: 'text/javascript' });
      saveAs(blob, this.ruleset.name + '.tt-rule-set');
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
          <link-to-edit-ruleset :ruleset="ruleset" />
          <div class="ui button" title="Copy" @click="$emit('copy')">
            <i class="copy icon"></i>
          </div>
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
          {{ruleset.name}}
        </div>
      </div>
      <div class="extra content">
        <span v-if="ruleset.id == 'english-strict'" class="left floated">
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