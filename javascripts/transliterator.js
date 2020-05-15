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
    case 'ཨོ་རྒྱན': transliteration = 'or_gyen'; break;
    case 'མཁའ་འགྲོ': transliteration = 'khan_dro'; break;
    case 'འོད་མཐའ་ཡས': transliteration = 'ön_tha_ye'; break;
    case 'གོ་འཕང': transliteration = "kom_p'ang"; break;
    case 'རྗེ་འབངས': transliteration = "jem_bang"; break;
    // Sanskrit stuff
    case 'ཧཱུྃ༔': transliteration = 'hūṃ'; break;
    case 'པདྨ': transliteration = 'pe_ma'; break;
    case 'མ་ཧཱ': transliteration = 'ma_ha'; break;
    case 'གུ་རུ': transliteration = 'gu_ru'; break;
    case 'ཨེ་མ་ཧོ': transliteration = 'e_ma_ho'; break;
    case 'སམྦྷ་ཝར': transliteration = 'sam_bha_war'; break;
    case 'གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ༔': transliteration = 'gu_ru pad_ma si_ddhi hūṃ'; break;
  }
  if (transliteration) {
    var numberOfSyllables = 1;
    var syllablesMatch = transliteration.match(/[_ ]/);
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
    removeLineEndings: function() {
      this.tibetan = this.tibetan.replace(/[།༑ཿ༔]$/, '');
    },
    exception: function() {
      return findException(this.tibetan);
    },
    transliterate: function() {
      var line = '';
      if (this.exception()){
        line = this.exception().transliterated;
      } else {
        this.removeLineEndings();
        var syllablesCount = 0;
        var syllables = this.tibetan.split('་');
        while (syllable = syllables.shift()) {
          var result;
          var exception = findException([syllable, syllables[0]].join('་'));
          if (exception) {
            result = exception;
            syllables.shift();
          } else
            result = new Syllable(syllable).transliterate();
          // If the two syllables connect with the same letter we display it only once
          if (line.last() == result.transliterated.first()) line = line.slice(0, line.length-1);
          line += result.transliterated;
          syllablesCount += result.numberOfSyllables;
          if (syllablesCount % 2 == 0) line += ' ';
        }
      }
      return line.trim();
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
          if (this.suffixIsLaSaDaNa()) return 'ü'
          else                         return 'u'; break;
        case 'ོ':
          if (this.suffixIsLaSaDaNa()) return 'ö'
          else                         return 'o'; break;
        default:
          if (this.suffixIsLaSaDaNa()) return 'e'
          else                         return 'a'; break;
      }
    },
    suffixIsLaSaDaNa: function() {
      return this.suffix && this.suffix.match(/[ལསདན]/);
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
    consonant: function() {
      if (this.lata()) {
        if (this.main == 'ཟ') return 'd';
        else                  return 'l';
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
        case 'ཟ':                                    return  's'; break;
        case 'འ':                                    return  ''; break;
        case 'ཡ':                                    return  'y'; break;
        case 'ར':                                    return  'r'; break;
        case 'ལ':                                    return  'l'; break;
        case 'ཤ':                                    return 'sh'; break;
        case 'ས':                                    return  's'; break;
        case 'ཧ':
          if      (this.superscribed == 'ལ')         return 'hl';
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
        case 'བ': return 'p';
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