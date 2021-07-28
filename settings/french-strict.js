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

settingsPerLanguage['french (strict)'] = {
  'doubleS': true,

  'u': 'ou',
  'ü': 'u',
  'ö': 'eu',

  'ca': 'tch',
  'cha': "tch'",
  'ja': 'dj',
  'tha': "t'",
  'tsha': "ts'",
  'sa': 's',
  'sha': 'ch',
  'zha': 'sh',

  'rata2': "t'r",
  'jaMod': 'dj',
  'gaMod': 'gu',
  'gaModYata': 'gui',
  'paYata': 'tch',
  'phaYata': "tch'",
  'baYata': "tch'",
  'baModYata': 'dj',
}

exceptionsPerLanguage['french (strict)'] = {

}
