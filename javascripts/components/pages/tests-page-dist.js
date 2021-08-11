"use strict";

var processTime;
var startedAt;
var TestsPage = Vue.component('tests-page', {
  data: function data() {
    var passedCount = 0;
    var textsPassed = 0;
    var textsTotal = 0;
    var ranTests = testGroups.map(function (testGroup) {
      testGroup.tests.each(function (test) {
        test.runTest = function () {
          var language = testGroup.language ? Languages.findOriginal(testGroup.language) : Languages.originalDefault();
          this.transliterated = new TibetanTransliterator(this.tibetan, language, {
            capitalize: testGroup.capitalize
          }).transliterate();
          return this.transliterated == this.transliteration;
        };

        test.pass = test.runTest();
        if (test.pass) passedCount++;

        if (testGroup.includeInPercentage) {
          if (test.pass) textsPassed++;
          textsTotal++;
        }
      });
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
      percentageTexts: textsPassed / textsTotal * 100
    };
  },
  computed: {
    style: function style() {
      return {
        color: this.passedCount == this.total ? '#21ba45' : '#db2828'
      };
    }
  },
  beforeCreate: function beforeCreate() {
    startedAt = new Date().getTime();
  },
  mounted: function mounted() {
    $(this.$refs.time).text(processTime);
  },
  template: "\n    <div>\n      <table class=\"ui definition table\">\n        <thead>\n          <tr>\n            <td class=\"ui header\" colspan=\"10\">\n              Total:\n              <span :style=\"style\">\n                {{percentage.toPrecision(3)}}%\n                ({{passedCount}}/{{total}})\n              </span>\n              <span v-if=\"passedCount != total\">\n                 \u2014\n                Texts only:\n                <span :style=\"style\">\n                  {{percentageTexts.toPrecision(3)}}%\n                  ({{textsPassed}}/{{textsTotal}})\n                </span>\n              </span>\n               \u2014\n              Ran in: <span ref=\"time\"></span>ms\n            </td>\n          </tr>\n        </thead>\n        <tbody>\n          <results-group\n           v-for=\"(test, index) in tests\"\n           :key=\"index\"\n           :name=\"test.name\"\n           :sentences=\"test.sentences\"\n           :tests=\"test.tests\"\n          />\n        </tbody>\n      </table>\n    </div>\n  "
});
Vue.component('results-group', {
  props: {
    name: String,
    sentences: Boolean,
    tests: Array
  },
  data: function data() {
    var passedCount = this.tests.count(function (test) {
      return test.pass;
    });
    var allPassed = passedCount == this.tests.length;
    return {
      allPassed: allPassed,
      opened: allPassed,
      passedCount: passedCount,
      total: this.tests.length
    };
  },
  template: "\n    <tr\n      class=\"ui segment results-group\">\n      <td class=\"header\" @click=\"opened = !opened\">\n        {{name}}\n      </td>\n      <td class=\"count\">{{passedCount}}/{{total}}</td>\n      <td class=\"result\">\n        <i v-if=\" allPassed\" class=\"check green icon\"></i>\n        <i v-if=\"!allPassed\" class=\"times red icon\"></i>\n      </td>\n      <td>\n        <test-result\n          v-if=\"!opened\"\n          v-for=\"(test, index) in tests\"\n          :sentence=\"sentences\"\n          :test=\"test\"\n          :key=\"index\"\n        />\n      </td>\n    </tr>\n  "
});
Vue.component('test-result', {
  props: {
    test: Object,
    sentence: Boolean
  },
  computed: {
    expected: function expected() {
      return this.test.transliteration;
    },
    actual: function actual() {
      return this.test.transliterated;
    }
  },
  template: "\n    <span\n      class=\"ui basic label test\"\n      :style=\"{display: sentence ? 'block' : 'inline-block'}\"\n      @click=\"test.runTest()\"\n    >\n      <span>\n        <i v-if=\" test.pass\" class=\"check green icon\"></i>\n        <i v-if=\"!test.pass\" class=\"times red icon\"></i>\n      </span>\n      <span class=\"tibetan\">{{test.tibetan}}</span>\n      <test-diff\n        v-if=\"expected != actual\"\n        :expected=\"expected\"\n        :actual=\"actual\"\n        :style=\"{ marginLeft: sentence ? '20px' : 'inherit' }\"\n      ></test-diff>\n    </span>\n  "
});
Vue.component('test-diff', {
  props: {
    expected: String,
    actual: String
  },
  computed: {
    parts: function parts() {
      return JsDiff.diffChars(this.expected, this.actual);
    }
  },
  template: "\n    <span style=\"font-size: 1.2em\">\n      <span\n        v-for=\"part in parts\"\n        :style=\"[part.added ? {color: '#2185d0', 'font-weight': 'bold'} : '', part.removed ? {color: '#db2828', 'font-weight': 'bold'} : '']\"\n        >{{part.added || part.removed ? part.value && part.value.replace(/ /, '_') : part.value}}</span>\n    </span>\n  "
});