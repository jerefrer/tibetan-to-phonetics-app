var processTime;
var startedAt;

// We don't want to use the Storage'd settings & exceptions but only the default ones.
Settings.initializeFromDefaults();
Exceptions.generalExceptions = normalizeExceptions(originalGeneralExceptions);

$(function() {
  new Vue({
    el: '#app',
    template: `
      <div id="app" class="night">
        <tests-page />
      </div>
    `
  })
})

var TestsPage = Vue.component('tests-page', {
  data () {
    var passedCount = 0;
    var textsPassed = 0;
    var textsTotal = 0;
    var ranTests = testGroups.map(function(testGroup) {
      testGroup.tests.each(function(test) {
        test.runTest = function() {
          if (test.eval) {
            try {
              test.value = eval(test.eval);
              return test.value == test.expected;
            } catch(error) {
              if (test.expectedError)
                return error.message.match(test.expectedError);
              else
                return false;
            };
          } else {
            var setting =
              testGroup.setting
              ? Settings.findOriginal(testGroup.setting)
              : Settings.originalDefault();
            if (testGroup.rules) {
              setting = Object.clone(setting, true);
              _(setting.rules).extend(testGroup.rules);
            }
            this.transliterated = new TibetanTransliterator(
              {
                setting: setting,
                capitalize: testGroup.capitalize
              }
            ).transliterate(this.tibetan);
            return this.transliterated == this.transliteration;
          }
        }
        test.pass = test.runTest();
        if (test.pass) passedCount++;
        if (testGroup.includeInPercentage) {
          if (test.pass) textsPassed++;
          textsTotal++;
        }
      })
      return testGroup;
    });
    processTime = new Date().getTime() - startedAt;
    var total = _(testGroups).pluck('tests').flatten().length;
    return {
      tests: ranTests,
      passedCount: passedCount,
      total: total,
      textsPassed: textsPassed,
      textsTotal: textsTotal,
      percentage: passedCount / total * 100,
      percentageTexts: textsPassed / textsTotal * 100,
    };
  },
  computed: {
    style: function() {
      return {
        color: (this.passedCount == this.total) ? '#21ba45' : '#db2828'
      }
    }
  },
  beforeCreate() {
    startedAt = new Date().getTime();
  },
  mounted () {
    $(this.$refs.time).text(processTime);
  },
  template: `
    <div>
      <table class="ui definition table">
        <thead>
          <tr>
            <td class="ui header" colspan="10">
              Total:
              <span :style="style">
                {{percentage.toPrecision(3)}}%
                ({{passedCount}}/{{total}})
              </span>
              <span v-if="passedCount != total">
                 —
                Texts only:
                <span :style="style">
                  {{percentageTexts.toPrecision(3)}}%
                  ({{textsPassed}}/{{textsTotal}})
                </span>
              </span>
               —
              Ran in: <span ref="time"></span>ms
            </td>
          </tr>
        </thead>
        <tbody>
          <results-group
           v-for="(test, index) in tests"
           :key="index"
           :name="test.name"
           :sentences="test.sentences"
           :tests="test.tests"
          />
        </tbody>
      </table>
    </div>
  `
})

Vue.component('results-group', {
  props: {
    name: String,
    sentences: Boolean,
    tests: Array
  },
  data: function() {
    var passedCount = this.tests.count(function(test) { return test.pass; });
    var allPassed = passedCount == this.tests.length;
    return {
      allPassed: allPassed,
      opened: allPassed,
      passedCount: passedCount,
      total: this.tests.length
    }
  },
  template: `
    <tr
      class="ui segment results-group">
      <td class="header" @click="opened = !opened">
        {{name}}
      </td>
      <td class="count">{{passedCount}}/{{total}}</td>
      <td class="result">
        <i v-if=" allPassed" class="check green icon"></i>
        <i v-if="!allPassed" class="times red icon"></i>
      </td>
      <td>
        <test-result
          v-if="!opened"
          v-for="(test, index) in tests"
          :sentence="sentences"
          :test="test"
          :key="index"
        />
      </td>
    </tr>
  `
})

Vue.component('test-result', {
  props: {
    test: Object,
    sentence: Boolean
  },
  computed: {
    expected: function() {
      return this.test.transliteration;
    },
    actual: function() {
      return this.test.transliterated;
    }
  },
  template: `
    <span
      class="ui basic label test"
      :style="{display: sentence ? 'block' : 'inline-block'}"
      @click="test.runTest()"
    >
      <span>
        <i v-if=" test.pass" class="check green icon"></i>
        <i v-if="!test.pass" class="times red icon"></i>
      </span>
      <template v-if="test.eval && !test.pass">
        <span v-if="test.error" style="color: '#db2828'">{{test.error}}</span>
        <template v-else>
          <test-diff
            v-if="test.value"
            :expected="test.expected"
            :actual="test.value"
          ></test-diff>
        </template>
      </template>
      <template v-else>
        <span class="tibetan">{{test.tibetan}}</span>
        <test-diff
          v-if="expected != actual"
          :expected="expected"
          :actual="actual"
          :style="{ marginLeft: sentence ? '20px' : 'inherit' }"
        ></test-diff>
      </template>
    </span>
  `
})

Vue.component('test-diff', {
  props: {
    expected: String,
    actual: String
  },
  computed: {
    parts: function() {
      return JsDiff.diffChars(this.expected, this.actual);
    }
  },
  template: `
    <span style="font-size: 1.2em">
      <span
        v-for="part in parts"
        :style="[part.added ? {color: '#2185d0', 'font-weight': 'bold'} : '', part.removed ? {color: '#db2828', 'font-weight': 'bold'} : '']"
        >{{part.added || part.removed ? part.value && part.value.replace(/ /, '_') : part.value}}</span>
    </span>
  `
})
