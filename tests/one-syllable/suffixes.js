testGroups.push({
  name: 'Prefixed mono-syllables',
  tests: [
    // da/sa: ümlaut & silent
    { tibetan: 'པད', transliteration: 'pe' },
    { tibetan: 'རྒྱད', transliteration: 'gye' },
    { tibetan: 'པས', transliteration: 'pe' },
    { tibetan: 'རྒྱས', transliteration: 'gye' },

    // na: ümlaut & pronounced
    { tibetan: 'པན', transliteration: 'pen' },
    { tibetan: 'རྒྱན', transliteration: 'gyen' },

    // la: ümlauts all vowels but a & pronounced
    { tibetan: 'པལ', transliteration: 'pal' },
    { tibetan: 'རྒྱལ', transliteration: 'gyal' },

    // ka/pa : ümlauts & pronounced
    { tibetan: 'ལག', transliteration: 'lak' },
    { tibetan: 'འཕགས', transliteration: "p'ak" },
    { tibetan: 'ལབ', transliteration: "lap" },
    { tibetan: 'གྲུབ', transliteration: "trup" },

    // nga/ma: ümlauts & pronounced
    { tibetan: 'ཁང', transliteration: 'khang' },
    { tibetan: 'ཆུང', transliteration: 'chung' },
    { tibetan: 'མཉམ', transliteration: 'nyam' },
    { tibetan: 'ལམ', transliteration: 'lam' },

    // ra: ümlauts & pronounced
    { tibetan: 'མར', transliteration: 'mar' },
    { tibetan: 'ཐར', transliteration: 'thar' },

    // ': ümlauts & not pronounced
    { tibetan: 'བཀའ', transliteration: 'ka' },
    { tibetan: 'བགའ', transliteration: 'ga' },

    // 'i as dreldra
    { tibetan: 'བགའི',  transliteration: 'ge' },
    { tibetan: 'བགིའི', transliteration: 'gi' },
    { tibetan: 'བགུའི', transliteration: 'gü' },
    { tibetan: 'བགེའི', transliteration: 'ge' },
    { tibetan: 'བགོའི', transliteration: 'gö' },

    // 'o as ending particle
    { tibetan: 'བགའོ',  transliteration: 'ga-o' },
    { tibetan: 'བགིའོ', transliteration: 'gi-o' },
    { tibetan: 'བགུའོ', transliteration: 'gu-o' },
    { tibetan: 'བགེའོ', transliteration: 'ge-o' },
    { tibetan: 'བགོའོ', transliteration: 'go-o' },

    // 'u for certain words?
    { tibetan: 'བེའུ', transliteration: 'pe-u' },
    { tibetan: 'མིའུ', transliteration: 'mi-u' },
    { tibetan: 'ཀུའུ', transliteration: 'ku-u' },
    { tibetan: 'ཀྲུའུ', transliteration: 'tru-u' },
    { tibetan: 'ཕྱུའུ', transliteration: 'chu-u' },
    { tibetan: 'ནེའུ', transliteration: 'ne-u' },
    { tibetan: 'རྡེའུ', transliteration: 'de-u' },
    { tibetan: 'མདེའུ', transliteration: 'de-u' },
    { tibetan: 'དྲེའུ', transliteration: 'tre-u' },
    { tibetan: 'མཐེའུ', transliteration: 'the-u' },
    { tibetan: 'སྒྱེའུ', transliteration: 'gye-u' },
  ]
})