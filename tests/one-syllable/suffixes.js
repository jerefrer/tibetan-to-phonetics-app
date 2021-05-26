testGroups.push({
  name: 'Suffixes',
  tests: [
    // da/sa: ümlaut & silent
    { tibetan: 'པད', transliteration: 'pé' },
    { tibetan: 'རྒྱད', transliteration: 'gyé' },
    { tibetan: 'པས', transliteration: 'pé' },
    { tibetan: 'པོས', transliteration: 'pö' },
    { tibetan: 'རྒྱས', transliteration: 'gyé' },

    // na: ümlaut & pronounced & nasalazies
    { tibetan: 'པན', transliteration: 'pen' },
    { tibetan: 'རྒྱན', transliteration: 'gyen' },

    // la: ümlauts & pronounced & softens
    { tibetan: 'པལ', transliteration: 'pel' },
    { tibetan: 'རྒྱལ', transliteration: 'gyel' },
    { tibetan: 'རྒྱེལ', transliteration: 'gyel' },

    // ka/pa : pronounced & softens
    { tibetan: 'ལག', transliteration: 'lak' },
    { tibetan: 'ལེག', transliteration: 'lek' },
    { tibetan: 'འཕགས', transliteration: "p'ak" },
    { tibetan: 'ལབ', transliteration: "lap" },
    { tibetan: 'ལེབ', transliteration: "lep" },
    { tibetan: 'གྲུབ', transliteration: "trup" },

    // nga/ma: pronounced & softens
    { tibetan: 'ཁང', transliteration: 'khang' },
    { tibetan: 'ཆུང', transliteration: 'chung' },
    { tibetan: 'མཉམ', transliteration: 'nyam' },
    { tibetan: 'ལམ', transliteration: 'lam' },
    { tibetan: 'སྟེང', transliteration: 'teng' },

    // ra: pronounced
    { tibetan: 'མར', transliteration: 'mar' },
    { tibetan: 'ཐར', transliteration: 'thar' },

    // ': not pronounced
    { tibetan: 'བཀའ', transliteration: 'ka' },
    { tibetan: 'བགའ', transliteration: 'ga' },

    // 'i as dreldra
    { tibetan: 'བགའི',  transliteration: 'gé' },
    { tibetan: 'བགིའི', transliteration: 'gi' },
    { tibetan: 'བགུའི', transliteration: 'gü' },
    { tibetan: 'བགེའི', transliteration: 'gé' },
    { tibetan: 'བགོའི', transliteration: 'gö' },

    // 'o as ending particle
    { tibetan: 'བགའོ',  transliteration: 'ga-o' },
    { tibetan: 'བགིའོ', transliteration: 'gi-o' },
    { tibetan: 'བགུའོ', transliteration: 'gu-o' },
    { tibetan: 'བགེའོ', transliteration: 'gé-o' },
    { tibetan: 'བགོའོ', transliteration: 'go-o' },

    // 'u for specific words
    { tibetan: 'བེའུ', transliteration: 'pé-u' },
    { tibetan: 'མིའུ', transliteration: 'mi-u' },
    { tibetan: 'ཀུའུ', transliteration: 'ku-u' },
    { tibetan: 'ཀྲུའུ', transliteration: 'tru-u' },
    { tibetan: 'ཕྱུའུ', transliteration: 'chu-u' },
    { tibetan: 'ནེའུ', transliteration: 'né-u' },
    { tibetan: 'རྡེའུ', transliteration: 'dé-u' },
    { tibetan: 'མདེའུ', transliteration: 'dé-u' },
    { tibetan: 'དྲེའུ', transliteration: 'tré-u' },
    { tibetan: 'མཐེའུ', transliteration: 'thé-u' },
    { tibetan: 'སྒྱེའུ', transliteration: 'gyé-u' },
  ]
})