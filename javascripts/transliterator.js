var Transliterator = function(tibetan) {
  return {
    tibetan: tibetan,
    line: '',
    transliterate: function() {
      var syllablesCount = 0;
      this.removeUntranscribedPunctuation();
      this.syllables = this.tibetan.split('་');
      while (syllable = this.syllables.shift()) {
        var exception = this.findLongestException(syllable, this.syllables);
        if (exception) {
          this.line += exception.transliterated;
          if (exception.numberOfSyllables == 1) {
            if (exception.spaceAfter) this.line += ' ';
            this.handleSecondSyllable();
          } else
            this.line = this.line + ' ';
          this.shiftSyllables(exception.numberOfShifts);
        } else {
          firstTransliteration = new Syllable(syllable).transliterate();
          if (this.handleSecondSyllable(firstTransliteration));
          else this.line += firstTransliteration;
        }
      }
      return this.line.trim();
    },
    handleSecondSyllable: function(firstTransliteration) {
      var secondSyllable = this.syllables.shift();
      if (secondSyllable) {
        var spaceBefore = false;
        var secondTransliteration;
        var secondException = this.findLongestException(secondSyllable, this.syllables);
        if (secondException) {
          this.shiftSyllables(secondException.numberOfShifts);
          secondTransliteration = secondException.transliterated;
        } else {
          if      (secondSyllable == 'བ')   { secondTransliteration = 'wa'; spaceBefore = true; }
          else if (secondSyllable == 'བར')  { secondTransliteration = 'war'; spaceBefore = true; }
          else if (secondSyllable == 'བས')  { secondTransliteration = 'wé'; spaceBefore = true; }
          else if (secondSyllable == 'བའི') { secondTransliteration = 'wé'; spaceBefore = true; }
          else                               secondTransliteration = new Syllable(secondSyllable).transliterate();
        }
        if (firstTransliteration) {
          firstTransliteration = this.connectWithDashIfNecessary(firstTransliteration, secondTransliteration);
          firstTransliteration = this.mergeDuplicateConnectingLettersWithPreviousSyllable(firstTransliteration, secondTransliteration);
          if (spaceBefore) this.line = this.line.trim() + ' ';
          this.line += firstTransliteration;
        }
        this.line += secondTransliteration + ' ';
        return true;
      }
    },
    findLongestException: function(syllable) {
      var restOfSyllables = this.syllables;
      if (!restOfSyllables.length)
        return findException(syllable);
      else {
        var exception;
        (restOfSyllables.length).downto(0, function(index) {
          subset = [syllable].add(restOfSyllables.slice(0, index));
          if (!exception) exception = findException(subset.join('་'));
        })
        return exception;
      }
    },
    connectWithDashIfNecessary: function(firstSyllable, secondSyllable) {
      var twoVowels = this.isVowel(firstSyllable.last()) && this.isVowel(secondSyllable.first());
      var aFollowedByN = firstSyllable.last() == 'a' && secondSyllable.first() == 'n';
      var oFollowedByN = firstSyllable.last() == 'o' && secondSyllable.first() == 'n';
      var gFollowedByN = firstSyllable.last() == 'g' && secondSyllable.first() == 'n';
      if (twoVowels || aFollowedByN || oFollowedByN || gFollowedByN)
        return firstSyllable = firstSyllable + '-';
      else
        return firstSyllable;
    },
    mergeDuplicateConnectingLettersWithPreviousSyllable: function(firstSyllable, secondSyllable) {
      if (firstSyllable.last() == secondSyllable.first())
        return firstSyllable = firstSyllable.slice(0, firstSyllable.length-1);
      else
        return firstSyllable;
    },
    shiftSyllables: function(numberOfShifts) {
      var that = this;
      _(numberOfShifts).times(function() { that.syllables.shift(); });
    },
    removeUntranscribedPunctuation: function() {
      this.tibetan = this.tibetan.replace(/[༎།༑༈༔༵]/g, '').trim();
      this.tibetan = this.tibetan.replace(/[ཿ ]+/g, '་').replace(/་+/g, '་');
    },
    isVowel: function(char) {
      return char.match(/[aeiouéiöü]/);
    }
  }
}

var Syllable = function(syllable) {
  var parsed = new Parser(syllable).parse();
  var object = _.omit(parsed, (_.functions(parsed)));
  return _(object).extend({
    syllable: syllable,
    transliterate: function() {
      return this.consonant() + this.getVowel() + this.getSuffix() + this.endingO() + this.endingU()
    },
    consonant: function() {
      if (this.lata()) {
        if (this.main == 'ཟ')                        return  'd';
        else                                         return  'l';
      }
      if (this.daoWa()) {
        if      (this.yata())                        return  'y';
        else if (this.vowel)                         return   '';
        else                                         return  'w';
      }
      switch(this.main) {
        case 'ཀ':
          if      (this.rata())                      return 'tr';
          else if (this.yata())                      return 'ky';
          else                                       return  'k'; break;
        case 'ག':
          if      (this.superscribed || this.prefix) {
            if      (this.rata())                    return 'dr';
            else if (this.yata())                    return 'gy';
            else                                     return  'g';
          }
          else if (this.rata())                      return 'tr';
          else if (this.yata())                      return 'ky';
          else                                       return  'k'; break;
        case 'ཁ':
          if      (this.rata())                      return "tr'";
          else if (this.yata())                      return 'khy';
          else                                       return  'kh'; break;
        case 'ང':                                    return  'ng'; break;
        case 'ཅ':                                    return  'ch'; break;
        case 'ཆ':                                    return  'ch'; break;
        case 'ཇ':
          if      (this.superscribed || this.prefix) return  'j';
          else                                       return  'ch'; break;
        case 'ཉ':                                    return 'ny'; break;
        case 'ཏ':
          if      (this.rata())                      return 'tr';
          else                                       return  't'; break;
        case 'ད':
          if      (this.superscribed || this.prefix) {
            if      (this.rata())                    return 'dr';
            else                                     return  'd';
          }
          else if (this.rata())                      return 'tr';
          else                                       return 't'; break;
        case 'ཐ':
          if      (this.rata())                      return "tr'";
          else                                       return  'th'; break;
        case 'ན':                                    return  'n'; break;
        case 'པ':
          if      (this.rata())                      return 'tr';
          else if (this.yata())                      return 'ch';
          else                                       return  'p'; break;
        case 'བ':
          if      (this.superscribed || this.prefix) {
            if      (this.rata())                    return 'dr';
            else if (this.yata())                    return  'j';
            else                                     return  'b';
          }
          else if (this.rata())                      return 'tr';
          else if (this.yata())                      return 'ch';
          else if (this.dreldraAi())                 return  'w';
          else if (!this.suffix &&
                  (!this.vowel || this.vowel == 'ོ'))return  'w';
          else                                       return  'p'; break;
        case 'ཕ':
          if      (this.rata())                      return "tr'";
          else if (this.yata())                      return 'ch';
          else                                       return "p'"; break;
        case 'མ':
          if     (this.yata())                       return 'ny';
          else                                       return  'm'; break;
        case 'ཙ':
        case 'ཚ':                                    return 'ts'; break;
        case 'ཛ':                                    return 'dz'; break;
        case 'ཝ':                                    return  'w'; break;
        case 'ཞ':                                    return 'zh'; break;
        case 'ཟ':
          if     (this.superscribed || this.prefix)  return  'z';
          else                                       return  's'; break;
        case 'འ':                                    return  ''; break;
        case 'ཡ':                                    return  'y'; break;
        case 'ར':                                    return  'r'; break;
        case 'ལ':                                    return  'l'; break;
        case 'ཤ':                                    return 'sh'; break;
        case 'ས':                                    return  's'; break;
        case 'ཧ':
          if      (this.superscribed == 'ལ')         return 'lh';
          if      (this.rata())                      return 'hr';
          else                                       return  'h'; break;
        case 'ཨ':                                    return  ''; break;
      }
    },
    getVowel: function() {
      switch(this.vowel) {
        case 'ི': return 'i'; break;
        case 'ེ':
          if      (this.suffix && this.suffix.match(/[མནཎར]/)) return 'e';
          else if (this.suffix && this.suffix.match(/[གབལང]/)) return 'e';
          else                                                return 'é'; break;
        case 'ུ':
          if (this.dreldraAiOrSuffixIsLaSaDaNa()) return 'ü'
          else                                    return 'u'; break;
        case 'ོ':
          if (this.dreldraAiOrSuffixIsLaSaDaNa()) return 'ö'
          else                                    return 'o'; break;
        default:
          if      (this.dreldraAiOrSuffixIsSaDa())          return 'é';
          else if (this.suffix && this.suffix.match(/[ནཎ]/)) return 'e';
          else                                              return 'a'; break;
      }
    },
    getSuffix: function() {
      switch(this.suffix) {
        case 'ག': return 'k'; break;
        case 'ང': return 'ng'; break;
        case 'ན': return 'n'; break;
        case 'ཎ': return 'n'; break;
        case 'བ': return (this.daoWa()) ? '' : 'p'; break;
        case 'མ': return 'm'; break;
        case 'ར': return 'r'; break;
        case 'ལ': return 'l'; break;
        default: return '';
      }
    },
    dreldraAiOrSuffixIsSaDa: function() {
      return this.dreldraAi() || (this.suffix && this.suffix.match(/[སད]/));
    },
    dreldraAiOrSuffixIsLaSaDaNa: function() {
      return this.dreldraAi() || (this.suffix && this.suffix.match(/[ལསདནཎ]/));
    },
    daoWa: function() {
      return this.syllable.match(/^དབ[ྱ]?[ིེོུ]?[ངསགརལདའབ]?[ིས]?$/);
    },
    dreldraAi: function() {
      return this.syllable.match(/འི$/);
    },
    endingO: function() {
      return (this.syllable.length > 2 && this.syllable.match(/འོ$/)) ? '-o' : '';
    },
    endingU: function() {
      return (this.syllable.length > 2 && this.syllable.match(/འུ$/)) ? '-u' : '';
    },
    rata: function() {
      return this.subscribed == 'ྲ';
    },
    yata: function() {
      return this.subscribed == 'ྱ';
    },
    lata: function() {
      return this.subscribed == 'ླ';
    }
  });
}