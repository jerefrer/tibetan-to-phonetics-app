testGroups.push({
  name: 'Exceptions - Double S enabled',
  rules: {
    'doubleS': true
  },
  tests: [
    // Double S if ends with n and starts with s
    { tibetan: 'ཕུན་སུམ་', transliteration: "p'ünssum" },
    // Double S if ends with l and starts with s
    { tibetan: 'ཞལ་ཟས་', transliteration: 'zhelssé' },
    // Double S if ends with r and starts with s
    { tibetan: 'པར་གསུངས་', transliteration: 'parssung' },
    // Double S if ends with m and starts with s
    { tibetan: 'ལམ་སེལ་', transliteration: 'lamssel' },

    // A few counter-examples
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
    // No double S if ends with n and starts with s
    { tibetan: 'ཕུན་སུམ་', transliteration: "p'ünsum" },
    // No double S if ends with l and starts with s
    { tibetan: 'ཞལ་ཟས་', transliteration: 'zhelsé' },
    // No double S if ends with r and starts with s
    { tibetan: 'པར་གསུངས་', transliteration: 'parsung' },
    // No double S if ends with m and starts with s
    { tibetan: 'ལམ་སེལ་', transliteration: 'lamsel' },
  ]
})
