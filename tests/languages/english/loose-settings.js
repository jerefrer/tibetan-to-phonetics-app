testGroups.push({
  name: 'Loose style',
  language: 'english (loose)',
  includeInPercentage: true,
  tests: [

    // End link char (as in pa-o or be-u)
    { tibetan: 'པའོ', transliteration: "pa'o" },
    { tibetan: 'བེའུ', transliteration: "bé'u" },

    // Vowels
    { tibetan: 'པའི', transliteration: 'pé' },

    // Regular consonants
    { tibetan: 'ག', transliteration: "ga" },
    { tibetan: 'ག', transliteration: "ga" },
    { tibetan: 'ཇ', transliteration: "ja" },
    { tibetan: 'ད', transliteration: "da" },
    { tibetan: 'ཕ', transliteration: "pa" },
    { tibetan: 'ཚ', transliteration: "tsa" },
    { tibetan: 'ཞ', transliteration: "sha" },

    // Ratas
    // 2nd column with rata
    { tibetan: 'ཁྲོལ', transliteration: "tröl" },
    { tibetan: 'ཕྲོལ', transliteration: "tröl" },
    // 3rd column with rata
    { tibetan: 'གྲོལ', transliteration: "dröl" },
    { tibetan: 'བྲོལ', transliteration: "dröl" },
    { tibetan: 'དྲོལ', transliteration: "dröl" },

    // Yatas
    { tibetan: 'གྱ', transliteration: "gya" },
    { tibetan: 'ཕྱ', transliteration: "cha" },
    { tibetan: 'བྱ', transliteration: "cha" },

  ]
});
