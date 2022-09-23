testGroups.push({
  name: 'English super loose can be used for loose phonetics matching',
  setting: 'english-super-loose',
  includeInPercentage: true,
  tests: [

    { tibetan: 'ཀེ', transliteration: 'ke' },
    { tibetan: 'ཀོས', transliteration: 'ko' },
    { tibetan: 'ཀུས', transliteration: 'ku' },
    { tibetan: 'ཀེམ', transliteration: 'kem' },
    { tibetan: 'ཀན', transliteration: 'ken' },
    { tibetan: 'ཀེན', transliteration: 'ken' },
    { tibetan: 'ཀེར', transliteration: 'ker' },
    { tibetan: 'ཀེག', transliteration: 'kek' },
    { tibetan: 'ཀེབ', transliteration: 'kep' },
    { tibetan: 'ཀལ', transliteration: 'kel' },
    { tibetan: 'ཀེལ', transliteration: 'kel' },
    { tibetan: 'ཀེང', transliteration: 'keng' },
    { tibetan: 'ཀའི', transliteration: 'ke' },

    // Regular consonants
    { tibetan: 'ཀ', transliteration: 'ka' },
    { tibetan: 'ཁ', transliteration: 'ka' },
    { tibetan: 'ག', transliteration: 'ka' },
    { tibetan: 'ཅ', transliteration: 'cha' },
    { tibetan: 'ཆ', transliteration: 'cha' },
    { tibetan: 'ཇ', transliteration: 'cha' },
    { tibetan: 'ཏ', transliteration: 'ta' },
    { tibetan: 'ད', transliteration: 'ta' },
    { tibetan: 'ཐ', transliteration: 'ta' },
    { tibetan: 'པ', transliteration: 'pa' },
    { tibetan: 'ཕ', transliteration: 'pa' },
    { tibetan: 'བ', transliteration: 'pa' },
    { tibetan: 'ཙ', transliteration: 'tsa' },
    { tibetan: 'ཚ', transliteration: 'tsa' },
    { tibetan: 'ཛ', transliteration: 'tsa' },
    { tibetan: 'ཕ', transliteration: 'pa' },
    { tibetan: 'ཞ', transliteration: 'sha' },

    // Modified consonants (with prefix or superscribed)
    { tibetan: 'རྒ', transliteration: 'ka' },
    { tibetan: 'རྗ', transliteration: 'cha' },
    { tibetan: 'རྡ', transliteration: 'ta' },
    { tibetan: 'རྦ', transliteration: 'pa' },
    { tibetan: 'བཟའ', transliteration: 'sa' },

    // Ratas
    { tibetan: 'ཏྲ', transliteration: 'tra' },
    { tibetan: 'ཁྲ', transliteration: 'tra' },
    { tibetan: 'བྲ', transliteration: 'tra' },
    { tibetan: 'སྒྲ', transliteration: 'tra' },
    { tibetan: 'ཧྲ', transliteration: 'hra' },

    // Yatas
    { tibetan: 'ཀྱ', transliteration: 'ka' },
    { tibetan: 'ཁྱ', transliteration: 'ka' },
    { tibetan: 'གྱ', transliteration: 'ka' },
    { tibetan: 'ཀྱི', transliteration: 'ki' },
    { tibetan: 'ཁྱི', transliteration: 'ki' },
    { tibetan: 'གྱི', transliteration: 'ki' },
    { tibetan: 'སྒྱ', transliteration: 'ka' },
    { tibetan: 'པྱ', transliteration: 'cha' },
    { tibetan: 'ཕྱ', transliteration: 'cha' },
    { tibetan: 'བྱ', transliteration: 'cha' },
    { tibetan: 'སྦྱ', transliteration: 'cha' },
    { tibetan: 'དབྱ', transliteration: 'ya' },

    // Latas
    { tibetan: 'གླ', transliteration: 'la' },
    { tibetan: 'ཟླ', transliteration: 'ta' },

    // Special cases
    { tibetan: 'ལྷ', transliteration: 'la' },
    { tibetan: 'དགའ་བ་', transliteration: 'kapa' },
  ]
});
