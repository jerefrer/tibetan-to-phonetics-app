var Parser = function(syllable, options) {
  var normalizedSyllable = syllable
    .replace(/ཱུ/g, 'ཱུ')
    .replace(/ཱི/g, 'ཱི')
    .replace(/ཱྀ/g, 'ཱྀ');
  return {
    options: _(options).defaults({
      keepMainAsSuperscribed: false
    }),
    prefix: null,
    suffix: null,
    secondSuffix: null,
    syllable: normalizedSyllable,
    dreldraAi: false,
    completionU: false,
    // Returns the syllable without either wasur, achung, anusvara or honorific
    simplifiedSyllable: function() {
      return this.syllable.replace(/[ྭཱཾ༵ྃྂ]/g, '');
    },
    length: function() {
      return this.simplifiedSyllable().length;
    },
    at: function(element, delta, options = {}) {
      var index;
      var syllable = this.simplifiedSyllable();
      if (options.fromEnd) index = _(syllable).lastIndexOf(element);
      else                 index = _(syllable).indexOf(element);
      return (index >= 0) ? syllable[index+delta] : null;
    },
    vowel: function() {
      var match = this.syllable.match(/[ིེོུ]/);
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
      this.secondSuffix = this.at(this.suffix, 1, { fromEnd: true });
    },
    convertMainAsRegularChar: function() {
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
    isAnExceptionNowHandled: function() {
      switch(this.syllable) {
        case 'དབ':   this.prefix = 'ད'; this.main = 'བ';                                            return true; break;
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
        secondSuffix: this.secondSuffix,
        wasur: this.wasur(),
        achung: this.achung(),
        anusvara: this.anusvara(),
        honorificMarker: this.honorificMarker()
      }
    },
    secondLetterIsGaNgaBaMa: function() {
      return this.syllable[1].match(/[གངབམ]/);
    },
    handleDreldraAi: function() {
      if (this.length() > 2 && this.syllable.match(/འི$/)) {
        if (this.length() <= 3) this.syllable = this.syllable.replace(/འི$/, '');
        else                    this.syllable = this.syllable.replace(/འི$/,  'འ');
        this.dreldraAi = true;
      }
    },
    handleEndingO: function() {
      if (this.length() > 2 && this.syllable.match(/འོ$/)) {
        this.syllable = this.syllable.replace(/འོ$/, 'འ');
        this.completionO = true;
      }
    },
    handleEndingU: function() {
      if (this.length() > 2 && this.syllable.match(/འུ$/)) {
        this.syllable = this.syllable.replace(/འུ$/, '');
        this.completionU = true;
      }
    },
    wasur: function() {
      return !!this.syllable.match('ྭ');
    },
    achung: function() {
      return !!this.syllable.match('ཱ');
    },
    anusvara: function() {
      return !!this.syllable.match(/[ཾྃྂ]/);
    },
    honorificMarker: function() {
      return !!this.syllable.match('༵');
    },
    parse: function() {
      var dreldraAi = false;
      if (this.isAnExceptionNowHandled()) return this.returnObject();
      this.handleDreldraAi();
      this.handleEndingU();
      this.handleEndingO();
      if (this.length() == 1) this.main = this.syllable[0];
      if (this.vowel()) this.main = this.at(this.vowel(), -1);
      if (this.subscribed()) this.main = this.at(this.subscribed(), -1);
      if (this.superscribed()) this.main = this.at(this.superscribed(), 1);
      if (!this.main) {
        if (this.length() == 2) {
          this.main = this.syllable[0];
          this.suffix = this.syllable[1];
        } else if (this.length() == 4) {
          this.prefix = this.syllable[0];
          this.main = this.syllable[1];
          this.suffix = this.syllable[2];
          this.secondSuffix = this.syllable[3];
        } else if (this.length() == 3) {
          if (!(this.syllable.last() == 'ས')) this.main = this.syllable[1];
          else if (!this.secondLetterIsGaNgaBaMa()) this.main = this.syllable[1];
          else if ( this.secondLetterIsGaNgaBaMa()) this.main = this.syllable[0];
          else alert("There has been an error:\n\nThe syllable "+this.syllable+" could not be parsed.\n\nAre you sure it's correct?")
        }
      }
      this.figureOutPrefixAndSuffixes();
      if (this.dreldraAi) this.suffix = 'འི';
      if (this.completionU) this.suffix = 'འུ';
      if (this.completionO) this.suffix = 'འོ';
      if (this.superscribed() && !this.options.keepMainAsSuperscribed) this.convertMainAsRegularChar();
      return this.returnObject();
    }
  }
}