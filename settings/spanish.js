/*-----------------------------------------------------------------------------
| Each line is made of:
|
| - some text in single quotes  <= The internal code used by the app. Leave it.
|                                  (Usually it is the wylie transliteration)
|
| - a colon                     <= If you forget any colon, the app won't work.
|
| - some text in single         <= How it will be transcribed in the end.
|   or double quotes               If the text includes single quotes,
|                                  then it is wrapped in double quotes.
|
| - a comma                     <= If you forget any comma, the app won't work.
|
| For instance, ཁྱེན will be transliterated by replacing each part one by one,
| using these rules:
|
| - khaYata         => 'khy'
| - drengbuMaNaRa   => 'e'
| - naSuffix        => 'n'
|
| Resulting in 'khyen'.
-----------------------------------------------------------------------------*/

settingsPerLanguage['spanish'] = {
  'ü': 'u',
  'ö': 'o',

  'dreldraAi': 'e',
  'drengbu': 'e',

  'kha': 'k',
  'nya': 'ñ',
  'tha': 't',
  'pha': 'p',
  'dza': 'ds',
  'zha': 'sh',

  'rata2': 'tr',
  'jaMod': 'y',
  'gaMod': 'gu',
  'zaMod': 's',
  'baModYata': 'y',
  'gaModYata': 'gui',
}

exceptionsPerLanguage['spanish'] = {
  'ཁ་ཊྭཾ་ག': 'kat_vam_ga'
}