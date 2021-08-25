testGroups.push({
  name: 'Exceptions - Double S enabled',
  rules: {
    'doubleS': true
  },
  tests: [
    // Double S if ends with vowel and starts with s (but not 'sh')
    { tibetan: 'སོ་སོར་', transliteration: 'sossor' },
    { tibetan: 'འོད་གསལ་', transliteration: 'össel' },
    { tibetan: 'རྩ་གསུམ་', transliteration: 'tsassum' },
    { tibetan: 'དུས་གསུམ་', transliteration: 'tüssum' },
    { tibetan: 'ཆོས་སྲིད་', transliteration: 'chössi' },
    { tibetan: 'བརྒྱུད་སྲུང་', transliteration: 'gyüssung' },

    // A few counter-examples
    // No double S if ends with n and starts with s
    { tibetan: 'ཕུན་སུམ་', transliteration: "p'ünsum" },
    // No double S if ends with l and starts with s
    { tibetan: 'ཞལ་ཟས་', transliteration: 'zhelsé' },
    // No double S if ends with r and starts with s
    { tibetan: 'པར་གསུངས་', transliteration: 'parsung' },
    // No double S if ends with m and starts with s
    { tibetan: 'ལམ་སེལ་', transliteration: 'lamsel' },
    // No double S if ends with k and starts with s
    { tibetan: 'ཚིགས་སུ་', transliteration: 'tsiksu' },
    // No double S if ends with g and starts with s
    { tibetan: 'སྣང་སྲིད་', transliteration: 'nangsi' },
    // No double S if starts with 'sh'
    { tibetan: 'སྨོན་ཤིས་', transliteration: 'mönshi' },
    // No double S if starts with 'zh'
    { tibetan: 'བརྩོན་ཞིང་', transliteration: 'tsönzhing' },
  ]
})

testGroups.push({
  name: 'Exceptions - Double S disabled',
  rules: {
    'doubleS': false
  },
  tests: [
    // No double S if ends with vowel and starts with s (but not 'sh')
    { tibetan: 'སོ་སོར་', transliteration: 'sosor' },
    { tibetan: 'འོད་གསལ་', transliteration: 'ösel' },
    { tibetan: 'རྩ་གསུམ་', transliteration: 'tsasum' },
    { tibetan: 'དུས་གསུམ་', transliteration: 'tüsum' },
    { tibetan: 'ཆོས་སྲིད་', transliteration: 'chösi' },
    { tibetan: 'བརྒྱུད་སྲུང་', transliteration: 'gyüsung' },
  ]
})
