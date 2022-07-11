Vue.component('exceptions-instructions', {
  data () {
    return {
      show: false
    }
  },
  watch: {
    show (value) {
      Storage.set('showExceptionsInstructions', value);
    }
  },
  created () {
    Storage.get('showExceptionsInstructions', false, (value) => this.show = value);
  },
  mounted () {
    $(this.$refs.div).accordion({
      onOpen:  () => this.show = true,
      onClose: () => this.show = false
    });
  },
  template: `
    <div
      ref="div"
      class="ui info message fluid accordion exceptions-instructions"
    >

      <div class="title header" :class="{ active: show }">
        <i class="dropdown icon"></i>
        <span>Things to know about exceptions</span>
      </div>

      <div class="content" :class="{ active: show }">
        <ul>
          <li>
            The left side is Tibetan characters only and represents the text
            to be substituted.
          </li>
          <li>
            The right side can be either Tibetan or Latin characters or a
            mixture of both and is what the left side text will be substituted
            with.
          </li>
          <li>
            <p>
              All the Tibetan parts on the right side will be processed again
              by the transliterator, which means that it's always preferable
              to use as much Tibetan as possible on the right side, because
              you will therefore rely on the system to take care of adapting
              the transliteration to all possible rule sets.
            </p>
            <p>
              For instance if I define an exception as:
              <table class="ui celled compact table">
                <tr>
                  <td>ཧཱུྃ</td>
                  <td>hung </td>
                </tr>
              </table>
              <p>
                Then <span class="tibetan">ཧཱུྃ</span> will be transliterated
                as "hung" for all rule sets.
              </p>
              <p>Whereas if I define it as:</p>
              <table class="ui celled compact table">
                <tr>
                  <td>ཧཱུྃ</td>
                  <td>hའུང </td>
                </tr>
              </table>
              Then <span class="tibetan">ཧཱུྃ</span> will be "hung" in English
              and "h<u>o</u>ung" in French.
            </p>
          </li>
          <li>
            <p>
              If using Latin characters, then between each syllable you need to
              add an underscore to help the system determine how many syllables
              the word is made of, even if it does not exactly match how the word
              is composed. Those underscores are only used internally and will
              be removed from the transliteration.
            </p>
            <p>
              For instance if you want to have
              <span class="tibetan">སངས་རྒྱས་</span> transliterated as "sangye",
              you would logically think about defining:
            </p>
            <table class="ui celled compact table">
              <tr>
                <td>སངས་རྒྱས</td>
                <td>sang_gye</td>
              </tr>
            </table>
            But this would result in "sanggye".
            So instead you could define:
            <table class="ui celled compact table">
              <tr>
                <td>སངས་རྒྱས</td>
                <td>san_gye</td>
              </tr>
            </table>
            Or even:
            <table class="ui celled compact table">
              <tr>
                <td>སངས་རྒྱས</td>
                <td>s_angye</td>
              </tr>
            </table>
            Since the underscores is really there only to determine the number
            of syllables and will be removed, they can be really anywhere as
            long as they properly match the number of syllables.
          </li>
          <li>
            <p>
              <u>
                If you define an exception and the resulting transliteration has
                repeating syllables, this means that you most probably forgot
                to add underscores.
              </u>
            </p>
            <p>
              For instance if you define:
            </p>
            <table class="ui celled compact table">
              <tr>
                <td>སངས་རྒྱས</td>
                <td>SANGYE</td>
              </tr>
            </table>
            You will end up with "SANGYEgyé" because the system considers that
            SANGYE is meant to represent only the first tibetan syllable
            <span class="tibetan">སངས་</span> and then goes on to transliterate
            <span class="tibetan">རྒྱས་</span> as it would normally do.
          </li>
          <li>
            If a line is defined with a left value that is included in another
            longer left value, then the longer one will be used.
            For instance if these two rules are defined:
            <table class="ui celled compact table">
              <tr>
                <td>སངས་</td>
                <td>SAN</td>
              </tr>
              <tr>
                <td>སངས་རྒྱས</td>
                <td>san_GYE</td>
              </tr>
            </table>
            Then <span class="tibetan">སངས་རྒྱས་</span> would be transliterated
            as "sanGYE", ignoring the first
            rule.
          </li>
          <li>
            <p>
              Add a space after your text on the right side if you want it to
              always be displayed alone without ever being merged with the
              following syllable.
            </p>
            <p>
              For instance by defining <span class="tibetan">"hའུང "</span>
              with a space at the end on the right side , then you're making
              sure that <span class="tibetan">ཧཱུྃ་ཨཱཿ</span> &nbsp;&nbsp; will
              result in "hung ah" and not "hungah".
            </p>
          </li>
          <li>
            <p>
              All punctation will be normalized on both sides, so that every
              untranscribed character will just be ignored, and that
              <span class="tibetan">&nbsp;ཿ&nbsp;</span> and
              <span class="tibetan">&nbsp;༔&nbsp;</span>
              will be treated just like a normal
              <span class="tibetan">&nbsp;་&nbsp;</span>.
            </p>
            <p>
              The ending
              <span class="tibetan">&nbsp;་&nbsp;</span>
              is also optional.
            </p>
            <p>
              Therefore all the following exceptions are equivalent and will
              result in "samaya dza":
              <table class="ui celled compact table">
                <tr>
                  <td>ས་མ་ཡ་ཛཿ</td>
                  <td>ས་མ་ཡ ཛ</td>
                </tr>
                <tr>
                  <td>ས་མ་ཡ་ཛ་</td>
                  <td>ས་མ་ཡ ཛ</td>
                </tr>
                <tr>
                  <td>ས་མ་ཡ་ཛ</td>
                  <td>ས་མ་ཡ ཛ</td>
                </tr>
                <tr>
                  <td>སཿ མཿ ཡཿ ཛཿ</td>
                  <td>ས་མ་ཡ ཛ</td>
                </tr>
              </table>
            </p>
          </li>
          <li>
            <p>
              All three types of anusvaras (the circle on top of a letter)
              are normalized into one. Therefore defining an exception with
              any of them:
              <table class="ui celled compact table">
                <tr>
                  <td>ཧཱུྃ</td>
                  <td>hའུང </td>
                </tr>
              </table>
            </p>
            <p>
              Is equivalent as defining three exceptions, one for each type:
              <table class="ui celled compact table">
                <tr>
                  <td>ཧཱུཾ</td>
                  <td>hའུང </td>
                </tr>
                <tr>
                  <td>ཧཱུྃ</td>
                  <td>hའུང </td>
                </tr>
                <tr>
                  <td>ཧཱུྂ</td>
                  <td>hའུང </td>
                </tr>
              </table>
            </p>
          </li>
          <li>
            Sometimes if a syllable has both an achung and a vowel then the
            syllable characters include one single Unicode character for the
            couple achung/vowel, and sometimes it includes two distinct
            Unicode characters. Like the above, defining either one or the
            other style will be the same as defining an exception for each.
          </li>
          <li>
            If you input the same thing on both sides the line will be ignored.
          </li>
        </ul>
      </div>

    </div>
  `
})