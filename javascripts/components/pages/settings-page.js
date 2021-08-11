var SettingsPage = Vue.component('settings-page', {
  data () {
    return {
      currentTab: 'rules',
      showDropZone: false,
      languages: Languages.languages,
      exceptions: Exceptions.generalExceptionsAsArray()
    }
  },
  watch: {
    exceptions: {
      deep: true,
      handler (exceptionsAsArray) {
        var exceptions = _(exceptionsAsArray).inject((hash, exception) => {
          if (exception.key.trim() && exception.value.trim())
            hash[exception.key] = exception.value;
          return hash;
        }, {});
        Exceptions.updateGeneralExceptions(exceptions);
      }
    }
  },
  computed: {
    defaultLanguages () {
      return _(this.languages).where({isDefault: true});
    },
    customLanguages () {
      return _(this.languages).where({isCustom: true});
    }
  },
  methods: {
    addNewLanguage () {
      Languages.create();
      this.languages = Languages.languages;
    },
    copyLanguage (language) {
      Languages.copy(language);
      this.languages = Languages.languages;
    },
    deleteLanguage(language) {
      if (confirm('Are you sure?')) {
        Languages.delete(language);
        this.languages = Languages.languages;
      }
    },
    isNewLanguage (language) {
      return _(language.id).isNumber();
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
    showImportModal () {
      var modal = $('<div class="ui basic modal">');
      modal.html(`
        <i class="close icon"></i>
        <div class="content">
          <div id="mantra-import">
            <span class="dndtxt">
              Drag here the .tt-rule-set file or click here to browse to it
            </span>
          </div>
        </div>
      `);
      var processFile = (files) => {
        var file = files.first().nativeFile;
        var reader = new FileReader();
        reader.onload = () => {
          try {
            var language = JSON.parse(reader.result);
            Languages.import(language);
            this.languages = Languages.languages;
          } catch(error) {};
          modal.modal('hide');
        };
        reader.readAsText(file);
      };
      initializeDragAndDrop = function() {
        var uploadOptions = { iframe: { url: '?/upload' }, multiple: true, logging: 0 };
        var uploadArea = new FileDrop('mantra-import', uploadOptions);
        uploadArea.event('send', processFile);
      }
      $('.ui.modal').remove();
      modal.modal().modal('show');
      initializeDragAndDrop();
    }
  },
  template: `
    <div class="ui container settings">

      <div class="ui huge secondary pointing menu tab-menu">
        <tab-link v-model="currentTab" tabId="rules">Rules</tab-link>
        <tab-link v-model="currentTab" tabId="exceptions">Exceptions</tab-link>
      </div>

      <div v-if="currentTab == 'rules'" class="ui active tab">

        <div class="ui large centered header">
          Default rule sets
        </div>

        <div class="ui centered cards">
          <language-card
            v-for="language in defaultLanguages"
            :key="language.id"
            :language="language"
            @copy="copyLanguage(language)"
            @delete="deleteLanguage(language)"
          />
        </div>

        <div class="ui hidden section divider"></div>

        <div class="ui large centered header">
          Custom rule sets
          <div class="ui button" @click="showImportModal">
            <i class="upload icon" />
            Import
          </div>
        </div>

        <div class="ui centered cards">

          <language-card
            v-for="language in customLanguages"
            :key="language.id"
            :language="language"
            :isCustom="true"
            @copy="copyLanguage(language)"
            @delete="deleteLanguage(language)"
          />

          <div class="ui new link card" @click="addNewLanguage">
            <div class="content">
              <div class="header">
                <i class="plus icon" />
                New rule set
              </div>
            </div>
          </div>

        </div>

      </div>

      <div v-if="currentTab == 'exceptions'" class="ui active tab">

        <div class="ui hidden section divider"></div>

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
          <div class="new exception" @click="addNewException">
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

    </div>
  `
})

Vue.component('tab-link', {
  model: {
    prop: 'value'
  },
  props: {
    value: String,
    tabId: String
  },
  template: `
    <a class="item" :class="{active: value == tabId}" @click="$emit('input', tabId)">
      <slot />
    </a>
  `
})

Vue.component('language-card', {
  props: {
    language: Object,
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
      return Languages.numberOfSpecificRules(this.language);
    },
    numberOfSpecificExceptions () {
      return Object.keys(this.language.exceptions).length;
    },
  },
  methods: {
    download () {
      var json = JSON.stringify(_(this.language).omit('id'));
      var blob = new Blob([json], { type: 'text/javascript' });
      saveAs(blob, this.language.name + '.tt-rule-set');
    }
  },
  template: `
    <div class="ui card">
      <div class="content">
        <div class="ui large icon buttons">
          <link-to-edit-language :language="language" />
          <div class="ui button" @click="$emit('copy')">
            <i class="copy icon"></i>
          </div>
          <div
            v-if="isCustom"
            class="ui button"
            @click="download"
          >
            <i class="download icon"></i>
          </div>
          <div
            v-if="isCustom"
            class="ui button"
            @click="$emit('delete')"
          >
            <i class="times icon"></i>
          </div>
        </div>
        <div class="header">
          {{language.name}}
        </div>
      </div>
      <div class="extra content">
        <span v-if="language.id == 'english-strict'" class="left floated">
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