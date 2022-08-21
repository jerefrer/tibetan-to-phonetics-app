"use strict";

var TibetanParser = function TibetanParser(syllable, options) {
  var normalizedSyllable = syllable.replace(/ཱུ/g, 'ཱུ').replace(/ཱི/g, 'ཱི').replace(/ཱྀ/g, 'ཱྀ');
  return {
    options: _(options).defaults({
      keepMainAsSuperscribed: false
    }),
    prefix: null,
    suffix: null,
    secondSuffix: null,
    syllable: normalizedSyllable,
    aKikuI: false,
    completionU: false,
    // Returns the syllable without either wasur, achung, anusvara or honorific
    simplifiedSyllable: function simplifiedSyllable() {
      return this.syllable.replace(/[ྭཱཾ༵ྃྂ]/g, '');
    },
    length: function length() {
      return this.simplifiedSyllable().length;
    },
    at: function at(element, delta) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var index;
      var syllable = this.simplifiedSyllable();
      if (options.fromEnd) index = _(syllable).lastIndexOf(element);else index = _(syllable).indexOf(element);
      return index >= 0 ? syllable[index + delta] : null;
    },
    vowel: function vowel() {
      var match = this.syllable.match(/[ིྀེཻོཽུ]/);
      return match && match[0];
    },
    superscribed: function superscribed() {
      var match = this.syllable.match(/[ྐྒྔྗྙྟྡྣྦྨྩྫྕྤྷ]/);
      return match && this.at(match[0], -1);
    },
    subscribed: function subscribed() {
      var match = this.syllable.match(/[ྱྲླ]/);
      return match && match[0];
    },
    figureOutPrefixAndSuffixes: function figureOutPrefixAndSuffixes() {
      this.figureOutPrefix();
      this.figureOutSuffixes();
    },
    figureOutPrefix: function figureOutPrefix() {
      if (this.superscribed()) this.prefix = this.at(this.superscribed(), -1);else this.prefix = this.at(this.root, -1);
    },
    figureOutSuffixes: function figureOutSuffixes() {
      if (this.vowel()) this.suffix = this.at(this.vowel(), 1);else if (this.subscribed()) this.suffix = this.at(this.subscribed(), 1);else this.suffix = this.at(this.root, 1);
      this.secondSuffix = this.at(this.suffix, 1, {
        fromEnd: true
      });
    },
    convertMainAsRegularChar: function convertMainAsRegularChar() {
      switch (this.root) {
        case 'ྐ':
          this.root = 'ཀ';
          break;

        case 'ྒ':
          this.root = 'ག';
          break;

        case 'ྔ':
          this.root = 'ང';
          break;

        case 'ྗ':
          this.root = 'ཇ';
          break;

        case 'ྙ':
          this.root = 'ཉ';
          break;

        case 'ྟ':
          this.root = 'ཏ';
          break;

        case 'ྡ':
          this.root = 'ད';
          break;

        case 'ྣ':
          this.root = 'ན';
          break;

        case 'ྦ':
          this.root = 'བ';
          break;

        case 'ྨ':
          this.root = 'མ';
          break;

        case 'ྩ':
          this.root = 'ཙ';
          break;

        case 'ྫ':
          this.root = 'ཛ';
          break;

        case 'ྕ':
          this.root = 'ཅ';
          break;

        case 'ྤ':
          this.root = 'པ';
          break;

        case 'ྷ':
          this.root = 'ཧ';
          break;
      }
    },
    isAnExceptionNowHandled: function isAnExceptionNowHandled() {
      switch (this.syllable) {
        case 'དབ':
          this.prefix = 'ད';
          this.root = 'བ';
          return true;
          break;

        case 'དགས':
          this.prefix = 'ད';
          this.root = 'ག';
          this.suffix = 'ས';
          return true;
          break;

        case 'དྭགས':
          this.root = 'ད';
          this.suffix = 'ག';
          this.secondSuffix = 'ས';
          return true;
          break;

        case 'དམས':
          this.prefix = 'ད';
          this.root = 'མ';
          this.suffix = 'ས';
          return true;
          break;

        case 'འགས':
          this.prefix = 'འ';
          this.root = 'ག';
          this.suffix = 'ས';
          return true;
          break;

        case 'མངས':
          this.prefix = 'མ';
          this.root = 'ང';
          this.suffix = 'ས';
          return true;
          break;

        default:
          return false;
      }
    },
    returnObject: function returnObject() {
      return {
        prefix: this.prefix,
        superscribed: this.superscribed(),
        root: this.root,
        subscribed: this.subscribed(),
        vowel: this.vowel(),
        suffix: this.suffix,
        secondSuffix: this.secondSuffix,
        wasur: this.wasur(),
        achung: this.achung(),
        anusvara: this.anusvara(),
        honorificMarker: this.honorificMarker()
      };
    },
    secondLetterIsGaNgaBaMa: function secondLetterIsGaNgaBaMa() {
      return this.syllable[1].match(/[གངབམ]/);
    },
    handleDreldraAi: function handleDreldraAi() {
      if (this.length() > 2 && this.syllable.match(/འི$/)) {
        if (this.length() <= 3) this.syllable = this.syllable.replace(/འི$/, '');else this.syllable = this.syllable.replace(/འི$/, 'འ');
        this.aKikuI = true;
      }
    },
    handleEndingO: function handleEndingO() {
      if (this.length() > 2 && this.syllable.match(/འོ$/)) {
        this.syllable = this.syllable.replace(/འོ$/, 'འ');
        this.completionO = true;
      }
    },
    handleEndingU: function handleEndingU() {
      if (this.length() > 2 && this.syllable.match(/འུ$/)) {
        this.syllable = this.syllable.replace(/འུ$/, '');
        this.completionU = true;
      }
    },
    handleAndOrParticleAAng: function handleAndOrParticleAAng() {
      if (this.length() > 2 && this.syllable.match(/འང$/)) {
        this.syllable = this.syllable.replace(/འང$/, '');
        this.andOrParticleAAng = true;
      }
    },
    handleConcessiveParticleAAm: function handleConcessiveParticleAAm() {
      if (this.length() > 2 && this.syllable.match(/འམ$/)) {
        this.syllable = this.syllable.replace(/འམ$/, '');
        this.concessiveParticleAAm = true;
      }
    },
    wasur: function wasur() {
      var match = this.syllable.match('ྭ');
      if (match) return match[0];
    },
    achung: function achung() {
      var match = this.syllable.match(/[ཱྰ]/);
      if (match) return match[0];
    },
    anusvara: function anusvara() {
      var match = this.syllable.match(/[ཾྃྂ]/);
      if (match) return match[0];
    },
    honorificMarker: function honorificMarker() {
      var match = this.syllable.match('༵');
      if (match) return match[0];
    },
    parse: function parse() {
      var aKikuI = false;
      if (this.isAnExceptionNowHandled()) return this.returnObject();
      this.handleDreldraAi();
      this.handleEndingU();
      this.handleEndingO();
      this.handleAndOrParticleAAng();
      this.handleConcessiveParticleAAm();
      if (this.length() == 1) this.root = this.syllable[0];
      if (this.vowel()) this.root = this.at(this.vowel(), -1);
      if (this.wasur()) this.root = this.syllable[this.syllable.replace(/[ྲྱཱཾ༵ྃྂ]/g, '').indexOf(this.wasur()) - 1];else if (this.subscribed()) this.root = this.at(this.subscribed(), -1);else if (this.superscribed()) this.root = this.at(this.superscribed(), 1);

      if (!this.root) {
        if (this.length() == 2) {
          this.root = this.syllable[0];
          this.suffix = this.syllable[1];
        } else if (this.length() == 4) {
          this.prefix = this.syllable[0];
          this.root = this.syllable[1];
          this.suffix = this.syllable[2];
          this.secondSuffix = this.syllable[3];
        } else if (this.length() == 3) {
          if (!(this.syllable.last() == 'ས')) this.root = this.syllable[1];else if (!this.secondLetterIsGaNgaBaMa()) this.root = this.syllable[1];else if (this.secondLetterIsGaNgaBaMa()) this.root = this.syllable[0];else alert("There has been an error:\n\nThe syllable " + this.syllable + " could not be parsed.\n\nAre you sure it's correct?");
        }
      }

      this.figureOutPrefixAndSuffixes();
      if (this.aKikuI) this.suffix = 'འི';
      if (this.andOrParticleAAng) this.suffix = 'འང';
      if (this.concessiveParticleAAm) this.suffix = 'འམ';
      if (this.completionU) this.suffix = 'འུ';
      if (this.completionO) this.suffix = 'འོ';
      if (this.superscribed() && !this.options.keepMainAsSuperscribed) this.convertMainAsRegularChar();
      return this.returnObject();
    }
  };
};