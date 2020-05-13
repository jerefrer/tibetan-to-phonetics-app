var Transliterator = function(tibetan) {
  return {
    tibetan: tibetan,
    removeLineEndings: function() {
      this.tibetan = this.tibetan.replace(/[།༑ཿ༔]$/, '');
    },
    transliterate: function() {
      this.removeLineEndings();
      var syllables = this.tibetan.split('་');
      return syllables.inGroupsOf(2).map(function(group) {
        return new PairOfSyllables(group).transliterate();
      }).join(' ');
    }
  }
}

var PairOfSyllables = function(pair) {
  return {
    pair: pair,
    transliterate: function() {
      switch (pair.join('་')) {
        case 'ཨོ་རྒྱན': return 'Orgyen'; break;
        default:
          var first  = new Syllable(pair[0]).transliterate();
          var second = new Syllable(pair[1]).transliterate();
          if (second == 'kyi') second = ' ' + second;
          return [first, second].join('');
          break;
      }
    }
  }
}

var Syllable = function(syllable) {
  return {
    syllable: syllable,
    transliterate: function() {
      if (!this.syllable) return;
      var consonant;
      var vowel = 'a';
      switch(this.syllable[0]) {
        case 'ཀ':
        case 'ག': consonant = 'k'; break;
        case 'ཁ': consonant = 'kh'; break;
        case 'ང': consonant = 'ng'; break;
        case 'ཅ':
        case 'ཆ':
        case 'ཇ': consonant = 'ch'; break;
        case 'ཉ': consonant = 'ny'; break;
        case 'ཏ':
        case 'ད': consonant = 't'; break;
        case 'ཐ': consonant = 'th'; break;
        case 'ན': consonant = 'n'; break;
        case 'པ':
        case 'བ': consonant = 'p'; break;
        case 'ཕ': consonant = 'ph'; break;
        case 'མ': consonant = 'm'; break;
        case 'ཙ':
        case 'ཚ': consonant = 'ts'; break;
        case 'ཛ': consonant = 'dz'; break;
        case 'ཝ': consonant = 'w'; break;
        case 'ཞ': consonant = 'zh'; break;
        case 'ཟ': consonant = 's'; break;
        case 'འ': consonant = ''; break;
        case 'ཡ': consonant = 'y'; break;
        case 'ར': consonant = 'r'; break;
        case 'ལ': consonant = 'l'; break;
        case 'ཤ': consonant = 'sh'; break;
        case 'ས': consonant = 's'; break;
        case 'ཧ': consonant = 'h'; break;
        case 'ཨ': consonant = ''; break;
      }
      switch(this.syllable[1]) {
        case 'ི': vowel = 'i'; break;
        case 'ུ': vowel = 'u'; break;
        case 'ེ': vowel = 'e'; break;
        case 'ོ': vowel = 'o'; break;
      }
      return consonant + vowel;
    }
  }
}