"use strict";

Vue.component('exceptions-instructions', {
  data: function data() {
    return {
      show: false
    };
  },
  watch: {
    show: function show(value) {
      Storage.set('showExceptionsInstructions', value);
    }
  },
  created: function created() {
    var _this = this;

    Storage.get('showExceptionsInstructions', false, function (value) {
      return _this.show = value;
    });
  },
  mounted: function mounted() {
    var _this2 = this;

    $(this.$refs.div).accordion({
      onOpen: function onOpen() {
        return _this2.show = true;
      },
      onClose: function onClose() {
        return _this2.show = false;
      }
    });
  },
  template: "\n    <div\n      ref=\"div\"\n      class=\"ui info message fluid accordion exceptions-instructions\"\n    >\n\n      <div class=\"title header\" :class=\"{ active: show }\">\n        <i class=\"dropdown icon\"></i>\n        <span>Things to know about exceptions</span>\n      </div>\n\n      <div class=\"content\" :class=\"{ active: show }\">\n        <ul>\n          <li>\n            The left side is Tibetan characters only and represents the text\n            to be substituted.\n          </li>\n          <li>\n            The right side can be either Tibetan or Latin characters or a\n            mixture of both and is what the left side text will be substituted\n            with.\n          </li>\n          <li>\n            <p>\n              All the Tibetan parts on the right side will be processed again\n              by the transliterator, which means that it's always preferable\n              to use as much Tibetan as possible on the right side, because\n              you will therefore rely on the system to take care of adapting\n              the transliteration to all possible rule sets.\n            </p>\n            <p>\n              For instance if I define an exception as:\n              <table class=\"ui celled compact table\">\n                <tr>\n                  <td>\u0F67\u0F71\u0F74\u0F83</td>\n                  <td>hung </td>\n                </tr>\n              </table>\n              <p>\n                Then <span class=\"tibetan\">\u0F67\u0F71\u0F74\u0F83</span> will be transliterated\n                as 'hung' for all rule sets.\n              </p>\n              <p>Whereas if I define it as:</p>\n              <table class=\"ui celled compact table\">\n                <tr>\n                  <td>\u0F67\u0F71\u0F74\u0F83</td>\n                  <td>h\u0F60\u0F74\u0F44 </td>\n                </tr>\n              </table>\n              Then <span class=\"tibetan\">\u0F67\u0F71\u0F74\u0F83</span> will result in \"hung\" in\n              English and in \"h<u>o</u>ung\" in French.\n            </p>\n          </li>\n          <li>\n            <p>\n              Add a space after your text on the right side if you want it to\n              always be displayed alone without ever being merged with the\n              following syllable.\n            </p>\n            <p>\n              For instance by defining <span class=\"tibetan\">\"h\u0F60\u0F74\u0F44 \"</span>\n              with a space at the end on the right side , then you're making\n              sure that <span class=\"tibetan\">\u0F67\u0F71\u0F74\u0F83\u0F0B\u0F68\u0F71\u0F7F'</span> will result in\n              \"hung ah\" and not \"hungah\".\n            </p>\n          </li>\n          <li>\n            <p>\n              All punctation will be normalized on both sides, so that every\n              untranscribed character will just be ignored, and that\n              <span class=\"tibetan\">&nbsp;\u0F7F&nbsp;</span> and\n              <span class=\"tibetan\">&nbsp;\u0F14&nbsp;</span>\n              will be treated just like a normal\n              <span class=\"tibetan\">&nbsp;\u0F0B&nbsp;</span>.\n            </p>\n            <p>\n              The ending\n              <span class=\"tibetan\">&nbsp;\u0F0B&nbsp;</span>\n              is also optional.\n            </p>\n            <p>\n              Therefore all the following exceptions are equivalent and will\n              result in \"samaya dza\":\n              <table class=\"ui celled compact table\">\n                <tr>\n                  <td>\u0F66\u0F0B\u0F58\u0F0B\u0F61\u0F0B\u0F5B\u0F7F</td>\n                  <td>\u0F66\u0F0B\u0F58\u0F0B\u0F61 \u0F5B</td>\n                </tr>\n                <tr>\n                  <td>\u0F66\u0F0B\u0F58\u0F0B\u0F61\u0F0B\u0F5B\u0F0B</td>\n                  <td>\u0F66\u0F0B\u0F58\u0F0B\u0F61 \u0F5B</td>\n                </tr>\n                <tr>\n                  <td>\u0F66\u0F0B\u0F58\u0F0B\u0F61\u0F0B\u0F5B</td>\n                  <td>\u0F66\u0F0B\u0F58\u0F0B\u0F61 \u0F5B</td>\n                </tr>\n                <tr>\n                  <td>\u0F66\u0F7F \u0F58\u0F7F \u0F61\u0F7F \u0F5B\u0F7F</td>\n                  <td>\u0F66\u0F0B\u0F58\u0F0B\u0F61 \u0F5B</td>\n                </tr>\n              </table>\n            </p>\n          </li>\n          <li>\n            <p>\n              All three types of anusvaras (the circle on top of a letter)\n              are normalized into one. Therefore defining an exception with\n              any of them:\n              <table class=\"ui celled compact table\">\n                <tr>\n                  <td>\u0F67\u0F71\u0F74\u0F83</td>\n                  <td>h\u0F60\u0F74\u0F44 </td>\n                </tr>\n              </table>\n            </p>\n            <p>\n              Is equivalent as defining three exceptions, one for each type:\n              <table class=\"ui celled compact table\">\n                <tr>\n                  <td>\u0F67\u0F71\u0F74\u0F7E</td>\n                  <td>h\u0F60\u0F74\u0F44 </td>\n                </tr>\n                <tr>\n                  <td>\u0F67\u0F71\u0F74\u0F83</td>\n                  <td>h\u0F60\u0F74\u0F44 </td>\n                </tr>\n                <tr>\n                  <td>\u0F67\u0F71\u0F74\u0F82</td>\n                  <td>h\u0F60\u0F74\u0F44 </td>\n                </tr>\n              </table>\n            </p>\n          </li>\n          <li>\n            Sometimes if a syllable has both an achung and a vowel then the\n            syllable characters include one single Unicode character for the\n            couple achung/vowel, and sometimes it includes two distinct\n            Unicode characters. Like the above, defining either one or the\n            other style will be the same as defining an exception for each.\n          </li>\n          <li>\n            If you input the same thing on both sides the line will be ignored\n            to prevent infinite loops.\n          </li>\n        </ul>\n      </div>\n\n    </div>\n  "
});