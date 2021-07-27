# tibetan-transliterator

A naive attempt at automatically generating reliable tibetan transliterations
based on customizable sets of rules.

Getting started
-----------

Just copy the repository locally.

Usage
-----------

![Demo](./docs/index-small.jpg)

### `index.html`

* Choose your prefered transliteration style at the top
* Paste your tibetan in the left box
* Click *Copy to clipboard* on the right box to copy the transliteration

![Demo](./docs/compare-small.jpg)

### `compare.html`

* Choose your prefered transliteration style at the top
* Paste your tibetan in the left box
* Paste your existing transliteration in the middle box
* See the differences in the right box
* Clicking on a difference will make the necessary change in the existing
  transliteration so that it will disappear from the right box, allowing you
  to quickly prune those that are irrelevant to you.

Testing
-----------

* Just open `tests.html`
* To ease debugging, clicking a tibetan case on the right side will re-run
  the test for just that particular case.

Credits
-----------

The rules used to deconstruct the syllables into parts (root, prefix, ...)
are almost entirely based on John Rockwell's ZALKEJZAMLEKJZA

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
