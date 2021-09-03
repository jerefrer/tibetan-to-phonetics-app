"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var t, findException;
var syllablesWithUnknownConsonant = [];

var TibetanTransliterator = function TibetanTransliterator() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var setting = assignValidSettingOrThrowException(options.setting);
  var exceptions = new Exceptions(setting);

  t = function t(key) {
    return setting.rules[key];
  };

  findException = function findException(text) {
    return exceptions.find(text);
  };

  return {
    setting: setting,
    exceptions: exceptions,
    options: options,
    transliterate: function transliterate(tibetan, options) {
      var _this = this;

      tibetan = removeUntranscribedPunctuationAndNormalize(tibetan);
      tibetan = this.substituteNumbers(tibetan);
      var groups = this.splitBySpacesOrNumbers(tibetan);
      return groups.map(function (tibetanGroup, index) {
        if (tibetanGroup.match(/^\d+$/)) return tibetanGroup;else {
          var group = new Group(tibetanGroup).transliterate();
          if (options && options.capitalize || _this.options.capitalize) group = group.capitalize();
          return group;
        }
      }).join(' ');
    },
    splitBySpacesOrNumbers: function splitBySpacesOrNumbers(text) {
      return _(text.split(/(\d+)| /)).compact();
    },
    substituteNumbers: function substituteNumbers(text) {
      _({
        '༠': '0',
        '༡': '1',
        '༢': '2',
        '༣': '3',
        '༤': '4',
        '༥': '5',
        '༦': '6',
        '༧': '7',
        '༨': '8',
        '༩': '9'
      }).each(function (arabic, tibetan) {
        text = text.replace(new RegExp(tibetan, 'g'), arabic);
      });

      return text;
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
      this.syllables = _.compact(tibetan.trim().split('་'));
      this.groupNumberOfSyllables = this.syllables.length;

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
          if (this.isLastSyllableAndStartsWithBa(syllable)) this.group += this.BaAsWaWhenSecondSyllable(syllable);else {
            var firstTransliteration = new Syllable(syllable).transliterate();
            if (this.handleSecondSyllable(firstTransliteration, syllable)) ;else this.group += firstTransliteration;
          }
        }
      }

      return this.group.trim();
    },
    handleSecondSyllable: function handleSecondSyllable(firstTransliteration, firstTibetan) {
      var secondSyllable = this.syllables.shift();

      if (secondSyllable) {
        var secondTransliteration;
        var secondException = this.findLongestException(secondSyllable, this.syllables);

        if (secondException) {
          this.shiftSyllables(secondException.numberOfShifts);
          secondTransliteration = secondException.transliterated;
        } else {
          var BaAsWaTransliteration;
          if (BaAsWaTransliteration = this.BaAsWaWhenSecondSyllable(secondSyllable)) secondTransliteration = BaAsWaTransliteration;else secondTransliteration = new Syllable(secondSyllable).transliterate();
        }

        if (firstTransliteration) {
          if (this.AngOrAm(firstTibetan)) {
            this.group += firstTransliteration + ' '; // Because *-am is two syllables, we add back the second syllable
            // to the array and return so that it gets processed as the first
            // syllable of the next pair.

            this.syllables.unshift(secondSyllable);
            return true;
          }

          firstTransliteration = this.connectWithDashIfNecessary(firstTransliteration, secondTransliteration);
          firstTransliteration = this.mergeDuplicateConnectingLettersWithPreviousSyllable(firstTransliteration, secondTransliteration);
          firstTransliteration = this.addDoubleSIfNecesary(firstTransliteration, secondTransliteration);
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
    isLastSyllableAndStartsWithBa: function isLastSyllableAndStartsWithBa(syllable) {
      if (this.groupNumberOfSyllables > 1 && this.syllables.length == 0) return this.BaAsWaWhenSecondSyllable(syllable);
    },
    BaAsWaWhenSecondSyllable: function BaAsWaWhenSecondSyllable(syllable) {
      if (syllable == 'བ') return t('wa') + t('a');else if (syllable == 'བར') return t('wa') + t('a') + t('raSuffix');else if (syllable == 'བས') return t('wa') + t('drengbu');else if (syllable == 'བའི') return t('wa') + t('aKikuI');else if (syllable == 'བའོ') return t('wa') + t('a') + t('endLinkChar') + t('o');else if (syllable == 'བོ') return t('wa') + t('o');else if (syllable == 'བོས') return t('wa') + t('ö');else if (syllable == 'བོའི') return t('wa') + t('ö');else if (syllable == 'བུས') return t('wa') + t('ü');
    },
    AngOrAm: function AngOrAm(tibetan) {
      return tibetan.match(/.+འ[ངམ]$/);
    },
    connectWithDashIfNecessary: function connectWithDashIfNecessary(firstSyllable, secondSyllable) {
      var twoVowels = this.endsWithVowel(firstSyllable) && this.startsWithVowel(secondSyllable);
      var aFollowedByN = firstSyllable.last() == 'a' && secondSyllable.first() == 'n';
      var oFollowedByN = firstSyllable.last() == 'o' && secondSyllable.first() == 'n';
      var gFollowedByN = firstSyllable.last() == 'g' && secondSyllable.first() == 'n';
      if (twoVowels || aFollowedByN || oFollowedByN || gFollowedByN) return firstSyllable + '-';else return firstSyllable;
    },
    mergeDuplicateConnectingLettersWithPreviousSyllable: function mergeDuplicateConnectingLettersWithPreviousSyllable(firstSyllable, secondSyllable) {
      if (firstSyllable.last() == secondSyllable.first()) return firstSyllable.slice(0, firstSyllable.length - 1);else return firstSyllable;
    },
    addDoubleSIfNecesary: function addDoubleSIfNecesary(firstSyllable, secondSyllable) {
      if (t('doubleS') && this.endsWithVowel(firstSyllable) && secondSyllable.match(/^s[^h]/)) return firstSyllable + 's';else return firstSyllable;
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
  var parsed = new TibetanParser(syllable).parse();

  var object = _.omit(parsed, _.functions(parsed));

  return _(object).extend({
    syllable: syllable,
    transliterate: function transliterate() {
      var consonant = this.consonant();

      if (consonant == undefined) {
        syllablesWithUnknownConsonant.push(syllable);
        return '࿗';
      }

      return consonant + this.getVowel() + this.getSuffix() + this.endingO() + this.endingU();
    },
    consonant: function consonant() {
      if (this.lata()) {
        if (this.root == 'ཟ') return t('lataDa');else return t('lata');
      }

      if (this.daoWa()) {
        if (this.yata()) return t('daoWaYata');else if (this.vowel) return '';else return t('wa');
      }

      switch (this.root) {
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
                  else if (this.getVowel() == 'ou') return 'g'; // 'gourou' and not 'guourou'
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
        case 'ཎ':
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
          } else if (this.rata()) return t('rata3');else if (this.yata()) return t('baYata');else return t('ba');

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
        case 'ཥ':
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
          if (this.aKikuIOrSuffixIsLaSaDaNa()) return t('ü');else return t('u');
          break;

        case 'ོ':
          if (this.aKikuIOrSuffixIsLaSaDaNa()) return t('ö');else return t('o');
          break;

        default:
          if (this.aKikuI()) return t('aKikuI');else if (this.suffix && this.suffix.match(/[སད]/)) return t('drengbu');else if (this.suffix && this.suffix.match(/[ནཎ]/)) return t('aNa');else if (this.suffix && this.suffix == 'ལ') return t('aLa');else return t('a');
          break;
      }
    },
    getSuffix: function getSuffix() {
      if (this.anusvara) if (this.root.match(/[ཧ]/)) return t('ngaSuffix');else return t('maSuffix');

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

        case 'འང':
          return t('endLinkChar') + t('a') + t('ngaSuffix');
          break;

        case 'འམ':
          return t('endLinkChar') + t('a') + t('maSuffix');
          break;

        default:
          return '';
      }
    },
    suffixIsSaDa: function suffixIsSaDa() {
      return this.aKikuI() || this.suffix && this.suffix.match(/[སད]/);
    },
    aKikuIOrSuffixIsLaSaDaNa: function aKikuIOrSuffixIsLaSaDaNa() {
      return this.aKikuI() || this.suffix && this.suffix.match(/[ལསདནཎ]/);
    },
    daoWa: function daoWa() {
      return this.syllable.match(/^དབ[ྱ]?[ིེོུ]?[ངསགརལདའབ]?[ིས]?$/);
    },
    aKikuI: function aKikuI() {
      return this.syllable.match(/འི$/);
    },
    endingO: function endingO() {
      return this.ifMatchesAppendEndingChar(/འོ$/, t('o'));
    },
    endingU: function endingU() {
      return this.ifMatchesAppendEndingChar(/འུ$/, t('u'));
    },
    ifMatchesAppendEndingChar: function ifMatchesAppendEndingChar(regex, _char) {
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

var assignValidSettingOrThrowException = function assignValidSettingOrThrowException(setting) {
  if (_typeof(setting) == 'object') {
    if (_typeof(setting.rules) == 'object' && _typeof(setting.exceptions) == 'object') {
      _(setting.rules).defaults(originalRules);

      return setting;
    } else throwBadArgumentsError("You passed an object but it doesn't return " + "objects for 'rules' and 'exceptions'.");
  } else if (typeof setting == 'string') {
    var existingSetting = Settings.find(setting);
    if (existingSetting) return existingSetting;else throwBadArgumentsError("There is no existing setting matching id '" + setting + "'");
  } else if (setting) throwBadArgumentsError("You passed " + _typeof(setting));else return Settings["default"]();
};

var throwBadArgumentsError = function throwBadArgumentsError(passedMessage) {
  throw new TypeError("Invalid value for 'setting' option\n+" + "------------------------------------\n" + passedMessage + "\n" + "------------------------------------\n" + "The 'setting' option accepts either:\n" + "- the name of a existing setting\n" + "- a setting object itself\n" + "- any object that quacks like a setting, meaning it returns objects " + "for 'rules' and 'exceptions'\n");
};