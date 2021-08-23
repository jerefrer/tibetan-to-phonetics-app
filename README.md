# tibetan-transliterator

A naive attempt at automatically generating reliable Tibetan transliterations
based on customizable sets of rules.

Getting started
-----------

Just copy the repository locally.

Usage
-----------

![Demo](./docs/index-small.jpg)

* Choose your prefered transliteration style at the top
* Paste your Tibetan in the left box
* Click *Copy to clipboard* at the top of the right box to copy the
  transliteration

#### Compare page

![Compare](./docs/compare-small.jpg)

* Choose your prefered transliteration style at the top
* Paste your Tibetan in the left box
* Paste your existing transliteration in the middle box
* See the differences in the right box
  * In red are the things that are present in the existing but missing from the auto-generated.
  * In blue are the things that are present in the auto-generated but missing from the existing.
* Clicking on a difference will make the necessary change in the existing
  transliteration so that it will disappear from the right box, allowing you
  to quickly prune those that are irrelevant to you.

### Using as a library

```js
var defaultRuleset = Rulesets.default();
var transliterator = new TibetanTransliterator(); // using default 'english-strict'
transliterator.transliterate('གང་གི་བློ་གྲོས་');
// => 'kangki lotrö'
transliterator.transliterate('སྒྲིབ་གཉིས་སྤྲིན་བྲལ་');
// => 'dripnyi trintrel'
```
Use the 'capitalize' option to capitalize the first letter of every group,
either passing it to the constructor:
```js
var transliterator = new TibetanTransliterator({ capitalize: true });
transliterator.transliterate('ཨེ་མ་ཧོཿ སྤྲོས་བྲལ་ཆོས་ཀྱི་དབྱིངས་ཀྱི་ཞིང་ཁམས་སུ༔ ');
// => 'Émaho Trötrel chökyi yingkyi zhingkham su'
```
Or on a per-call basis:
```js
var transliterator = new TibetanTransliterator();
transliterator.transliterate('ཨེ་མ་ཧོཿ སྤྲོས་བྲལ་ཆོས་ཀྱི་དབྱིངས་ཀྱི་ཞིང་ཁམས་སུ༔ ');
// => 'émaho trötrel chökyi yingkyi zhingkham su'
transliterator.transliterate('ཨེ་མ་ཧོཿ སྤྲོས་བྲལ་ཆོས་ཀྱི་དབྱིངས་ཀྱི་ཞིང་ཁམས་སུ༔ ', { capitalize: true });
// => 'Émaho Trötrel chökyi yingkyi zhingkham su'
```
Use different rulesets, either by passing the name of an existing set:
```js
var englishLooseRuletset = Rulesets.find('english-loose');
new TibetanTransliterator({ ruleset: 'english-loose' }).transliterate('གང་གི་བློ་གྲོས་');
// => 'gangi lodrö'

```
Or the set itself:
```js
var frenchRuletset = Rulesets.find('french');
new TibetanTransliterator({ ruleset: frenchRuletset }).transliterate('གང་གི་བློ་གྲོས་');
// => 'kangki lotreu'
```
Or any object that quacks like a ruleset, meaning it returns objects for 'rules' and 'exceptions':
```js
var fakeRuleSet = {
  rules: { 'ö': 'eu' },
  exceptions: {}
};
new TibetanTransliterator({ ruleset: fakeRuleSet }).transliterate('གང་གི་བློ་གྲོས་');
// => 'kangki lotreu'
```

Exceptions
-----------

![Exceptions](./docs/exceptions.jpg)

* Each line defines one exception.

* If any of the values on the left of the colon is found in the line to be
  transliterated, then it will be treated as if it was the value on the right
  of the colon.

* Tibetan characters will be transliterated as they would be normally.
* Latin characters will be inserted as-is within the transliteration.

* If using Latin characters, then between each syllable you need to add an
  underscore to help the system determine how many syllables the word is made
  of, even if it does not exactly match how the word is composed.
  For instance if you want to have སངས་རྒྱས་ always transliterated as 'sangye',
  you would do:
  ```
  'སངས་རྒྱས': 'san_gye'
  ```
  but not
  ```
  'སངས་རྒྱས': 'sang_gye'
  ```

* If a line is defined with a left value that is included in another line with
  a longer left value, then the longer one will be used.
  For instance if these two rules are defined:
  ```
  'སངས་': 'SAN'
  'སངས་རྒྱས': 'san_GYE'
  ```
  Then སངས་རྒྱས་ would be transliterated as 'sanGYE', ignoring the first rule.

Rule sets
-----------

All rule sets are defined in `settings/`.

The `original.js` set is not meant to be edited and serves as the default upon
which all other sets are applied to override the default rules.

For instance the rule for 'kha' in `original.js` is:
```js
'kha': 'kh',
```

If you wish to display 'kha' as 'ka', you would have this line in your own
rule set file:
```js
'kha': 'k',
```

![Exceptions](./docs/ruleset.jpg)

Every single line in `original.js` can thus be copy-pasted in another set file
to be overridden. You can edit existing rule sets or create new ones.

Style-specific exceptions can be defined and default ones can be overriden.
Just add your exceptions in `exceptionsPerRuleset['my set']`.

To add a new rule set just copy an existing one and replace twice the name of
the set:
```html
# settings/my-new-set.js

settingsPerRuleset['my new set'] = {
...
}

exceptionsPerRuleset['my new set'] = {
...
}
```
Also don't forget to add the `<script>` include tag in `index.html`,
`compare.html` and `tests.html` next to the other ones:
```html
<script src="settings/my-new-set.js"></script>
```

Testing
-----------

![Tests](./docs/tests-small.jpg)

Just open `tests.html`.

Categories can be clicked to reveal their test cases.

To ease debugging, clicking a Tibetan case on the right side will re-run the
test for just that particular case.

TODO
-----------

See `TODO.md`

Credits
-----------

The rules used to deconstruct the syllables into parts (root, prefix, ...)
are almost entirely based on John Rockwell's *A Primer for Classical Literary
Tibetan, Volume 1*, so kudos to everyone involved in the production of this
great book.

A zillion thanks also to:

* Joe B. Wilson and everybody involved in publishing *Translating Tibetan from
  Buddhism* which is equally great.
* Tony Duff and friends for producing all these beautiful Tibetan fonts.
* Everybody involved in building an maintaining Vue.js, SemanticUI, FontAwesome,
  SublimeText, jQuery, Sugar.js, Underscore.js, DevDocs, Zeal and Google Chrome
  for making web development so easy and enjoyable.

Through the virtue coming from this work, may all beings human and
otherwise reach absolute freedom.

License
-----------

This software is licensed under the MIT License.

Copyright Padmakara, 2021.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
