testGroups.push({
  name: 'French settings',
  language: 'french',
  includeInPercentage: true,
  tests: [

    // Vowels
    { tibetan: 'འུ', transliteration: 'ou' },
    { tibetan: 'འུས', transliteration: 'u' },
    { tibetan: 'འོས', transliteration: 'eu' },
    { tibetan: 'པའི', transliteration: 'pé' },

    // Regular consonants
    { tibetan: 'ཅ', transliteration: 'tcha' },
    { tibetan: 'ཆ', transliteration: "tch'a" },
    { tibetan: 'ཇ', transliteration: 'dja' },
    { tibetan: 'ཐ', transliteration: "t'a" },
    { tibetan: 'བ', transliteration: 'pa' },
    { tibetan: 'ཚ', transliteration: "ts'a" },
    { tibetan: 'ཟ', transliteration: 'sa' },
    { tibetan: 'ཤ', transliteration: 'cha' },
    { tibetan: 'ཞ', transliteration: 'sha' },

    // Modified consonants (with prefix or superscribed)
    { tibetan: 'རྗ', transliteration: 'dja' },
    { tibetan: 'རྒ', transliteration: 'ga' },

    // Ratas
    // 2nd column with rata
    { tibetan: 'ཁྲ', transliteration: "t'ra" },
    { tibetan: 'ཕྲ', transliteration: "t'ra" },

    // Yatas
    { tibetan: 'རྒྱ', transliteration: 'guia' },
    { tibetan: 'པྱ', transliteration: 'tcha' },
    { tibetan: 'ཕྱ', transliteration: "tch'a" },
    { tibetan: 'བྱ', transliteration: "tch'a" },

  ]
});
