testGroups.push({
  name: 'Exceptions - Connect with dash',
  tests: [
    // Dash if first ends and second starts with vowel
    { tibetan 'བའི་འོས', transliteration: 'pé-ö' },
    { tibetan 'ས་འམ་', transliteration: 'sa-am' },
    // Or a followed by n
    { tibetan 'མ་ཪྙེད་', transliteration: 'ma-nyé' },
    { tibetan 'མ་མངོན་', transliteration: 'ma-ngön' },
    // Or o followed by n
    { tibetan 'མོ་སྣང་', transliteration: 'mo-nang' },
    { tibetan 'ལོ་ཉེས་', transliteration: 'lo-nyé' },
    // Or g followed by n
    { tibetan 'བསང་སྣ་', transliteration: 'sang-na' },
    { tibetan 'གསང་སྔགས་', transliteration: 'sang-ngak' },

    // A few counter-examples
    // No dash if ends with and starts with other consonants
    { tibetan: 'སྒྲོལ་མ', transliteration: 'drölma' },
    // No dash if a followed by g
    { tibetan: 'བརྡ་བརྒྱུད་', transliteration: 'dagyü' },
    // No dash if o followed by g
    { tibetan: 'འདོད་དགུའི་', transliteration: 'dögü' },
    // No dash if k followed by n
    { tibetan: 'ལེགས་བསྣམས་', transliteration: 'leknam' },
  ]
})
