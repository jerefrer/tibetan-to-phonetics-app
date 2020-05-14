var Parser = function(syllable) {
  return {
    prefix: null,
    suffix: null,
    secondSuffix: null,
    syllable: syllable,
    length: syllable.length,
    at: function(element, delta) {
      var index = this.syllable.indexOf(element);
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
    figureOutTheRest: function() {

    },
    parse: function() {
      if (this.length == 1) this.main = this.syllable;
      if (this.subscribed()) {
        this.main = this.at(this.subscribed(), -1);
        if (this.syllable.indexOf(this.main) == 2)
          this.prefix = this.syllable[0];
        if (this.isVowel(this.at(this.subscribed(), 1)))
          this.suffix = this.at(this.subscribed(), 2);
        else
          this.suffix = this.at(this.subscribed(), 1);
        this.secondSuffix = this.at(this.suffix, 1);
      }
      else if (this.vowel()) {
        this.main = this.at(this.vowel(), -1);
        if (this.syllable.indexOf(this.main) == 1) this.prefix = this.syllable[0];
        if (this.at(this.vowel(), 1)) suffix = this.at(this.vowel(), 1);
        if (this.at(this.vowel(), 2)) secondSuffix = this.at(this.vowel(), 2);
      }
      else if (this.superscribed()) {
        this.main = this.at(this.superscribed(), 1);
        this.figureOutTheRest();
      }
      else if (this.length == 2) {
        this.main = this.syllable[0];
        this.suffix = this.syllable[1];
      } else if (this.length == 4) {
        this.prefix = this.syllable[0];
        this.main = this.syllable[1];
        this.suffix = this.syllable[2];
        this.secondSuffix = this.syllable[3];
      } else if (this.length == 3) {
        // TODO
      }
      return {
        prefix: this.prefix,
        superscribed: this.superscribed(),
        main: this.main,
        subscribed: this.subscribed(),
        vowel: this.vowel(),
        suffix: this.suffix,
        secondSuffix: this.secondSuffix
      }
    }
  }
}