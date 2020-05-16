var findException = function(tibetan) {
  var transliteration;
  switch(tibetan) {
    // Wa's
    case 'གསོལ་བ': transliteration = 'söl_wa'; break;
    // Mute suffixes
    case 'བདག': transliteration = 'da'; break;
    case 'ཤོག': transliteration = 'sho'; break;
    // Links between syllables
    case 'ཡ་མཚན': transliteration = 'yam_tsen'; break;
    case 'གོ་འཕང': transliteration = "kom_p'ang"; break;
    case 'ཨོ་རྒྱན': transliteration = 'or_gyen'; break;
    case 'མཁའ་འགྲོ': transliteration = 'khan_dro'; break;
    case 'རྗེ་འབངས': transliteration = "jem_bang"; break;
    case 'དགེ་འདུན་': transliteration = "gen_dün"; break;
    case 'མཆོད་རྟེན': transliteration = 'chor_ten'; break;
    case 'འོད་མཐའ་ཡས': transliteration = 'ön_tha_ye'; break;
    // Sanskrit stuff
    case 'ༀ': transliteration = 'om'; break;
    case 'ཧཱུྃ': transliteration = 'hūṃ'; break;
    case 'པདྨ': transliteration = 'pe_ma'; break;
    case 'མ་ཧཱ': transliteration = 'ma_ha'; break;
    case 'གུ་རུ': transliteration = 'gu_ru'; break;
    case 'ཨུཏྤལ': transliteration = 'ut_pal'; break;
    case 'རྡོ་རྗེ': transliteration = 'dor_je'; break;
    case 'ཨེ་མ་ཧོ': transliteration = 'e_ma_ho'; break;
    case 'སམྦྷ་ཝར': transliteration = 'sam_bha_war'; break;
    case 'གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ': transliteration = 'gu_ru pad_ma si_ddhi hūṃ'; break;
  }
  if (transliteration) {
    var numberOfSyllables = 1;
    var syllablesMatch = transliteration.match(/[_ ]/g);
    if (syllablesMatch) numberOfSyllables = syllablesMatch.length + 1;
    return {
      numberOfSyllables: numberOfSyllables,
      transliterated: transliteration.replace(/_/g, '')
    }
  }
}

var Transliterator = function(tibetan) {
  return {
    tibetan: tibetan,
    line: '',
    removeUntranscribedPunctuation: function() {
      this.tibetan = this.tibetan.replace(/[།༑ཿ༔]/g, '');
      this.tibetan = this.tibetan.replace(/[ ]/g, '་');
    },
    findLongestException: function(syllable, restOfSyllables) {
      if (!restOfSyllables.length)
        return findException(syllable);
      else {
        var exception;
        (restOfSyllables.length).downto(1, function(index) {
          subset = [syllable].add(restOfSyllables.slice(0, index));
          if (!exception) exception = findException(subset.join('་'));
        })
        return exception;
      }
    },
    findExceptionOrTransliterate: function(syllable) {
      var result;
      var that = this;
      var exception = this.findLongestException(syllable, this.syllables);
      if (exception) {
        result = exception;
        _(exception.numberOfSyllables-1).times(function() { that.syllables.shift(); });
      } else
        result = new Syllable(syllable).transliterate();
      return result;
    },
    mergeDuplicateConnectingLettersWithPreviousSyllable: function(result) {
      if (this.line.last() == result.transliterated.first())
        this.line = this.line.slice(0, this.line.length-1);
    },
    transliterate: function() {
      var syllablesCount = 0;
      this.removeUntranscribedPunctuation();
      this.syllables = this.tibetan.split('་');
      while (syllable = this.syllables.shift()) {
        var result = this.findExceptionOrTransliterate(syllable);
        this.mergeDuplicateConnectingLettersWithPreviousSyllable(result);
        this.line += result.transliterated;
        syllablesCount += result.numberOfSyllables;
        if (syllablesCount % 2 == 0) this.line += ' ';
      }
      return this.line.trim();
    }
  }
}

var Syllable = function(syllable) {
  var parsed = new Parser(syllable).parse();
  var object = _.omit(parsed, (_.functions(parsed)));
  return _(object).extend({
    syllable: syllable,
    getVowel: function() {
      switch(this.vowel) {
        case 'ི': return 'i'; break;
        case 'ེ': return 'e'; break;
        case 'ུ':
          if (this.dreldraAiOrSuffixIsLaSaDaNa()) return 'ü'
          else                         return 'u'; break;
        case 'ོ':
          if (this.dreldraAiOrSuffixIsLaSaDaNa()) return 'ö'
          else                         return 'o'; break;
        default:
          if (this.dreldraAiOrSuffixIsSaDaNa())   return 'e'
          else                         return 'a'; break;
      }
    },
    dreldraAiOrSuffixIsSaDaNa: function() {
      return this.dreldraAi() || (this.suffix && this.suffix.match(/[སདན]/));
    },
    dreldraAiOrSuffixIsLaSaDaNa: function() {
      return this.dreldraAi() || (this.suffix && this.suffix.match(/[ལསདན]/));
    },
    rata: function() {
      return this.subscribed == 'ྲ';
    },
    yata: function() {
      return this.subscribed == 'ྱ';
    },
    lata: function() {
      return this.subscribed == 'ླ';
    },
    daoWa: function() {
      return this.syllable.match(/^དབ[ྱ]?[ིེོུ]?[ང]?$/);
    },
    dreldraAi: function() {
      return this.syllable.match(/འི$/);
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
    getSuffix: function() {
      switch(this.suffix) {
        case 'ག': return 'k';
        case 'ང': return 'ng';
        case 'ན': return 'n';
        case 'བ': return (this.daoWa()) ? '' : 'p';
        case 'མ': return 'm';
        case 'ར': return 'r';
        case 'ལ': return 'l';
        default:  return '';
      }
    },
    exception: function() {
      return findException(this.syllable)
    },
    transliterate: function() {
      return this.exception() || {
        transliterated: this.consonant() + this.getVowel() + this.getSuffix(),
        numberOfSyllables: 1
      }
    }
  });
}