"use strict";

var Transliterator = function Transliterator(tibetan) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    tibetan: tibetan,
    capitalize: options.capitalize,
    transliterate: function transliterate() {
      var _this = this;

      this.removeUntranscribedPunctuation();
      var groups = this.tibetan.split(' ');
      return groups.map(function (tibetanGroup, index) {
        var group = new Group(tibetanGroup).transliterate();
        if (_this.capitalize) group = group.capitalize();
        return group;
      }).join(' ');
    },
    removeUntranscribedPunctuation: function removeUntranscribedPunctuation() {
      this.tibetan = this.tibetan.replace(/[༎།༑༈༔༵]/g, '').trim();
      this.tibetan = this.tibetan.replace(/ཿ/g, '་').replace(/་+/g, '་');
    }
  };
};

var Group = function Group(tibetan) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    tibetan: tibetan,
    group: '',
    capitalize: options.capitalize,
    transliterate: function transliterate() {
      var syllable;
      this.syllables = tibetan.trim().split('་');

      while (syllable = this.syllables.shift()) {
        var exception = this.findLongestException(syllable, this.syllables);

        if (exception) {
          this.group += exception.transliterated;

          if (exception.numberOfSyllables == 1) {
            if (exception.spaceAfter) this.group += ' ';
            this.handleSecondSyllable();
          } else this.group += ' ';

          this.shiftSyllables(exception.numberOfShifts);
        } else {
          var firstTransliteration = new Syllable(syllable).transliterate();
          if (this.handleSecondSyllable(firstTransliteration)) ;else this.group += firstTransliteration;
        }
      }

      return this.group.trim();
    },
    handleSecondSyllable: function handleSecondSyllable(firstTransliteration) {
      var secondSyllable = this.syllables.shift();

      if (secondSyllable) {
        var spaceBefore = false;
        var secondTransliteration;
        var secondException = this.findLongestException(secondSyllable, this.syllables);

        if (secondException) {
          this.shiftSyllables(secondException.numberOfShifts);
          secondTransliteration = secondException.transliterated;
        } else {
          if (secondSyllable == 'བ') {
            secondTransliteration = t('wa') + t('a');
            spaceBefore = true;
          } else if (secondSyllable == 'བར') {
            secondTransliteration = t('wa') + t('a') + t('raSuffix');
            spaceBefore = true;
          } else if (secondSyllable == 'བས') {
            secondTransliteration = t('wa') + t('dreldraAi');
            spaceBefore = true;
          } else if (secondSyllable == 'བའི') {
            secondTransliteration = t('wa') + t('dreldraAi');
            spaceBefore = true;
          } else if (secondSyllable == 'བོས') {
            secondTransliteration = t('wa') + t('ö');
            spaceBefore = true;
          } else if (secondSyllable == 'བུས') {
            secondTransliteration = t('wa') + t('ü');
            spaceBefore = true;
          } else secondTransliteration = new Syllable(secondSyllable).transliterate();
        }

        if (firstTransliteration) {
          firstTransliteration = this.connectWithDashIfNecessary(firstTransliteration, secondTransliteration);
          firstTransliteration = this.mergeDuplicateConnectingLettersWithPreviousSyllable(firstTransliteration, secondTransliteration);
          firstTransliteration = this.addDoubleSIfNecesary(firstTransliteration, secondTransliteration);
          if (spaceBefore) this.group = this.group.trim() + ' ';
          this.group += firstTransliteration;
        }

        this.group += secondTransliteration + ' ';
        return true;
      }
    },
    findLongestException: function findLongestException(syllable) {
      var restOfSyllables = this.syllables;
      if (!restOfSyllables.length) return findException(syllable);else {
        var exception;
        restOfSyllables.length.downto(0, function (index) {
          var subset = [syllable].add(restOfSyllables.slice(0, index));
          if (!exception) exception = findException(subset.join('་'));
        });
        return exception;
      }
    },
    connectWithDashIfNecessary: function connectWithDashIfNecessary(firstSyllable, secondSyllable) {
      var twoVowels = this.endsWithVowel(firstSyllable) && this.startsWithVowel(secondSyllable);
      var aFollowedByN = firstSyllable.last() == 'a' && secondSyllable.first() == 'n';
      var oFollowedByN = firstSyllable.last() == 'o' && secondSyllable.first() == 'n';
      var gFollowedByN = firstSyllable.last() == 'g' && secondSyllable.first() == 'n';
      if (twoVowels || aFollowedByN || oFollowedByN || gFollowedByN) return firstSyllable = firstSyllable + '-';else return firstSyllable;
    },
    mergeDuplicateConnectingLettersWithPreviousSyllable: function mergeDuplicateConnectingLettersWithPreviousSyllable(firstSyllable, secondSyllable) {
      if (firstSyllable.last() == secondSyllable.first()) return firstSyllable = firstSyllable.slice(0, firstSyllable.length - 1);else return firstSyllable;
    },
    addDoubleSIfNecesary: function addDoubleSIfNecesary(firstSyllable, secondSyllable) {
      //if (Settings.get('doubleS') && secondSyllable.match(/^s[^h]/) && (this.endsWithVowel(firstSyllable) || firstSyllable.last() == 'n'))
      if (Settings.get('doubleS') && secondSyllable.match(/^s[^h]/) && !firstSyllable.last().match(/[gk]/)) return firstSyllable + 's';else return firstSyllable;
    },
    shiftSyllables: function shiftSyllables(numberOfShifts) {
      var that = this;

      _(numberOfShifts).times(function () {
        that.syllables.shift();
      });
    },
    startsWithVowel: function startsWithVowel(string) {
      return string.match(/^[eo]?[aeiouéiöü]/);
    },
    endsWithVowel: function endsWithVowel(string) {
      return string.match(/[eo]?[aeiouéiöü]$/);
    }
  };
};

var Syllable = function Syllable(syllable) {
  var parsed = new Parser(syllable).parse();

  var object = _.omit(parsed, _.functions(parsed));

  return _(object).extend({
    syllable: syllable,
    transliterate: function transliterate() {
      return this.consonant() + this.getVowel() + this.getSuffix() + this.endingO() + this.endingU();
    },
    consonant: function consonant() {
      if (this.lata()) {
        if (this.main == 'ཟ') return t('lataDa');else return t('lata');
      }

      if (this.daoWa()) {
        if (this.yata()) return t('daoWaYata');else if (this.vowel) return '';else return t('wa');
      }

      switch (this.main) {
        case 'ཀ':
          if (this.rata()) return t('rata1');else if (this.yata()) return t('kaYata');else return t('ka');
          break;

        case 'ག':
          if (this.superscribed || this.prefix) {
            if (this.rata()) return t('rata3Mod');else if (this.yata()) return t('gaModYata');else if (t('gaMod') == 'gu') {
              // Exceptions for french & spanish
              if (this.getVowel() == 'a') return 'g'; // 'gage' and not 'guage'
              else if (this.getVowel() == 'o') return 'g'; // 'gong' and not 'guong'
                else if (this.getVowel() == 'u') return 'g'; // 'guru' and not 'guuru'
            }
            return t('gaMod');
          } else if (this.rata()) return t('rata3');else if (this.yata()) return t('gaYata');else return t('ga');

          break;

        case 'ཁ':
          if (this.rata()) return t("rata2");else if (this.yata()) return t('khaYata');else return t('kha');
          break;

        case 'ང':
          return t('nga');
          break;

        case 'ཅ':
          return t('ca');
          break;

        case 'ཆ':
          return t('cha');
          break;

        case 'ཇ':
          if (this.superscribed || this.prefix) return t('jaMod');else return t('ja');
          break;

        case 'ཉ':
          return t('nya');
          break;

        case 'ཏ':
        case 'ཊ':
          if (this.rata()) return t('rata1');else return t('ta');
          break;

        case 'ད':
          if (this.superscribed || this.prefix) {
            if (this.rata()) return t('rata3Mod');else return t('daMod');
          } else if (this.rata()) return t('rata3');else return t('da');

          break;

        case 'ཌ':
          // Experimental, default case based on པཎ་ཌི་ for pandita, check if other cases are correct and/or useful
          if (this.superscribed || this.prefix) {
            if (this.rata()) return t('rata3Mod');else return t('daMod');
          } else if (this.rata()) return t('rata3');else return t('daMod');

          break;

        case 'ཐ':
          if (this.rata()) return t('rata2');else return t('tha');
          break;

        case 'ན':
          return t('na');
          break;

        case 'པ':
          if (this.rata()) return t('rata1');else if (this.yata()) return t('paYata');else return t('pa');
          break;

        case 'ཕ':
          if (this.rata()) return t('rata2');else if (this.yata()) return t('phaYata');else return t('pha');
          break;

        case 'བ':
          if (this.superscribed || this.prefix) {
            if (this.rata()) return t('rata3Mod');else if (this.yata()) return t('baModYata');else return t('baMod');
          } else if (this.rata()) return t('rata3');else if (this.yata()) return t('baYata');else if (this.dreldraAi()) return t('wa');else if (!this.suffix && (!this.vowel || this.vowel == 'ོ')) return t('wa');else return t('ba');

          break;

        case 'མ':
          if (this.yata()) return t('nya');else return t('ma');
          break;

        case 'ཙ':
          return t('tsa');
          break;

        case 'ཚ':
          return t('tsha');
          break;

        case 'ཛ':
          return t('dza');
          break;

        case 'ཝ':
          return t('wa');
          break;

        case 'ཞ':
          return t('zha');
          break;

        case 'ཟ':
          if (this.superscribed || this.prefix) return t('zaMod');else return t('za');
          break;

        case 'འ':
          return '';
          break;

        case 'ཡ':
          return t('ya');
          break;

        case 'ར':
          return t('ra');
          break;

        case 'ལ':
          return t('la');
          break;

        case 'ཤ':
          return t('sha');
          break;

        case 'ས':
          return t('sa');
          break;

        case 'ཧ':
          if (this.superscribed == 'ལ') return t('lha');
          if (this.rata()) return t('hra');else return t('ha');
          break;

        case 'ཨ':
          return '';
          break;
      }
    },
    getVowel: function getVowel() {
      switch (this.vowel) {
        case 'ི':
          return t('i');
          break;

        case 'ེ':
          if (this.suffix && this.suffix.match(/[མནཎར]/)) return t('drengbuMaNaRa');else if (this.suffix && this.suffix.match(/[གབལང]/)) return t('drengbuGaBaLaNga');else return t('drengbu');
          break;

        case 'ུ':
          if (this.dreldraAiOrSuffixIsLaSaDaNa()) return t('ü');else return t('u');
          break;

        case 'ོ':
          if (this.dreldraAiOrSuffixIsLaSaDaNa()) return t('ö');else return t('o');
          break;

        default:
          if (this.dreldraAi()) return t('dreldraAi');else if (this.suffix && this.suffix.match(/[སད]/)) return t('drengbu');else if (this.suffix && this.suffix.match(/[ནཎ]/)) return t('aNa');else if (this.suffix && this.suffix == 'ལ') return t('aLa');else return t('a');
          break;
      }
    },
    getSuffix: function getSuffix() {
      switch (this.suffix) {
        case 'ག':
          return t('kaSuffix');
          break;

        case 'ང':
          return t('ngaSuffix');
          break;

        case 'ན':
          return t('naSuffix');
          break;

        case 'ཎ':
          return t('naSuffix');
          break;

        case 'བ':
          return this.daoWa() ? '' : t('baSuffix');
          break;

        case 'མ':
          return t('maSuffix');
          break;

        case 'ར':
          return t('raSuffix');
          break;

        case 'ལ':
          return t('laSuffix');
          break;

        default:
          return '';
      }
    },
    suffixIsSaDa: function suffixIsSaDa() {
      return this.dreldraAi() || this.suffix && this.suffix.match(/[སད]/);
    },
    dreldraAiOrSuffixIsLaSaDaNa: function dreldraAiOrSuffixIsLaSaDaNa() {
      return this.dreldraAi() || this.suffix && this.suffix.match(/[ལསདནཎ]/);
    },
    daoWa: function daoWa() {
      return this.syllable.match(/^དབ[ྱ]?[ིེོུ]?[ངསགརལདའབ]?[ིས]?$/);
    },
    dreldraAi: function dreldraAi() {
      return this.syllable.match(/འི$/);
    },
    endingO: function endingO() {
      return this.endingCharIfMatches(t('o'), /འོ$/);
    },
    endingU: function endingU() {
      return this.endingCharIfMatches(t('u'), /འུ$/);
    },
    endingCharIfMatches: function endingCharIfMatches(_char, regex) {
      return this.syllable.length > 2 && this.syllable.match(regex) ? t('endLinkChar') + _char : '';
    },
    rata: function rata() {
      return this.subscribed == 'ྲ';
    },
    yata: function yata() {
      return this.subscribed == 'ྱ';
    },
    lata: function lata() {
      return this.subscribed == 'ླ';
    }
  });
};