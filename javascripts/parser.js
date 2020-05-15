var Parser = function(syllable, options) {
  return {
    options: _(options).defaults({
      keepMainAsSuperscribed: false
    }),
    prefix: null,
    suffix: null,
    secondSuffix: null,
    syllable: syllable,
    length: syllable.length,
    at: function(element, delta, fromEnd) {
      var index;
      if (fromEnd) index = _(this.syllable).lastIndexOf(element);
      else         index = _(this.syllable).indexOf(element);
      return (index >= 0) && this.syllable[index+delta] || null;
    },
    isVowel: function(char) {
      return char && char.match(/[ིེོུ]/);
    },
    vowel: function() {
      var match = this.isVowel(this.syllable);
      return match && match[0];
    },
    superscribed: function() {
      var match = this.syllable.match(/[ྐྒྔྗྙྟྡྣྦྨྩྫྕྤྷ]/);
      return match && this.at(match[0], -1);
    },
    subscribed: function() {
      var match = this.syllable.match(/[ྱྲླ]/);
      return match && match[0];
    },
    figureOutPrefixAndSuffixes: function() {
      this.figureOutPrefix();
      this.figureOutSuffixes();
    },
    figureOutPrefix: function() {
      if (this.superscribed()) this.prefix = this.at(this.superscribed(), -1);
      else                     this.prefix = this.at(this.main,           -1);
    },
    figureOutSuffixes: function() {
      if      (this.vowel()     ) this.suffix = this.at(this.vowel(),      1);
      else if (this.subscribed()) this.suffix = this.at(this.subscribed(), 1);
      else                        this.suffix = this.at(this.main,         1);
      this.secondSuffix = this.at(this.suffix, 1, true);
    },
    translateMainAsRegularChar: function() {
      switch(this.main) {
        case 'ྐ': this.main = 'ཀ'; break;
        case 'ྒ': this.main = 'ག'; break;
        case 'ྔ': this.main = 'ང'; break;
        case 'ྗ': this.main = 'ཇ'; break;
        case 'ྙ': this.main = 'ཉ'; break;
        case 'ྟ': this.main = 'ཏ'; break;
        case 'ྡ': this.main = 'ད'; break;
        case 'ྣ': this.main = 'ན'; break;
        case 'ྦ': this.main = 'བ'; break;
        case 'ྨ': this.main = 'མ'; break;
        case 'ྩ': this.main = 'ཙ'; break;
        case 'ྫ': this.main = 'ཛ'; break;
        case 'ྕ': this.main = 'ཅ'; break;
        case 'ྤ': this.main = 'པ'; break;
        case 'ྷ': this.main = 'ཧ'; break;
      }
    },
    isAnException: function() {
      switch(this.syllable) {
        case 'དགས':  this.prefix = 'ད'; this.main = 'ག'; this.suffix = 'ས';                          return true; break;
        case 'དྭགས':                    this.main = 'ད'; this.suffix = 'ག'; this.secondSuffix = 'ས'; return true; break;
        case 'དམས':  this.prefix = 'ད'; this.main = 'མ'; this.suffix = 'ས';                          return true; break;
        case 'འགས':  this.prefix = 'འ'; this.main = 'ག'; this.suffix = 'ས';                          return true; break;
        case 'མངས':  this.prefix = 'མ'; this.main = 'ང'; this.suffix = 'ས';                          return true; break;
        default: return false;
      }
    },
    returnObject: function() {
      return {
        prefix: this.prefix,
        superscribed: this.superscribed(),
        main: this.main,
        subscribed: this.subscribed(),
        vowel: this.vowel(),
        suffix: this.suffix,
        secondSuffix: this.secondSuffix
      }
    },
    secondLetterIsGaNgaBaMa: function() {
      return this.syllable[1].match(/[གངབམ]/);
    },
    parse: function() {
      if (this.isAnException()) return this.returnObject();
      if (this.length == 1) this.main = this.syllable;
      if (this.vowel()) this.main = this.at(this.vowel(), -1);
      if (this.subscribed()) this.main = this.at(this.subscribed(), -1);
      if (this.superscribed()) this.main = this.at(this.superscribed(), 1);
      if (!this.main) {
        if (this.length == 2) {
          this.main = this.syllable[0];
          this.suffix = this.syllable[1];
        } else if (this.length == 4) {
          this.prefix = this.syllable[0];
          this.main = this.syllable[1];
          this.suffix = this.syllable[2];
          this.secondSuffix = this.syllable[3];
        } else if (this.length == 3) {
          if (!(this.syllable.last() == 'ས')) this.main = this.syllable[1];
          else if (!this.secondLetterIsGaNgaBaMa()) this.main = this.syllable[1];
          else if ( this.secondLetterIsGaNgaBaMa()) this.main = this.syllable[0];
          else throw "Welcome to the unknown!";
        }
      }
      this.figureOutPrefixAndSuffixes();
      if (this.superscribed() && !this.options.keepMainAsSuperscribed) this.translateMainAsRegularChar();
      return this.returnObject();
    }
  }
}