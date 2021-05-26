/*------------------------------------------------------------------------------------------------
| Each line is made of:
| - some text in single quotes        <= This is the internal code used by the app, don't touch it
|                                        Usually it is the wylie transliteration
| - a colon
| - some text in single/double quotes <= This is how it will be transcribed in the end.
|                                        If the text includes single quotes,
|                                        then it is wrapped in double quotes.
| - a comma                           <= If you forget any comma, the app won't work
|
| For instance, ཁྱེན will be transliterated by replacing each part one by one, using these rules:
| - khaYata         => 'khy'
| - drengbuMaNaRa   => 'e'
| - naSuffix        => 'n'
| Resulting in 'khyen'.
------------------------------------------------------------------------------------------------*/

settingsPerLanguage['english (bois-bas)'] = {
  // Linking char (as in pa-o or pe-u)
  'endLinkChar': "'",

  // Vowels
  'dreldraAi': "a'i",         // པའི

  // Regular consonants
  'ga': 'g',                  // ག
  'ja': 'j',                  // ཇ
  'da': 'd',                  // ད
  'pha': 'p',                 // ཕ
  'ba': 'b',                  // བ
  'zha': 'sh',                // ཞ

  // Ratas
  'rata2': 'tr',              // ཁྲ  // 2nd column with rata
  'rata3': 'dr',              // བྲ  // 3rd column with rata

  // Yatas
  'gaYata': 'gy',             // གྱ

  // Maybe
  // 'kha': 'k',              // ཁ
  // 'tha': 't',              // ཐ
  // 'khaYata': 'ky',         // ཁྱ
  // 'baYata': 'j',           // བྱ
  // 'za': 'z',               // ཟ
}

exceptionsPerLanguage['english (bois-bas)'] = {
  'ཧཱུྃ': 'hung ',
  'ཧཱུྃ': 'hung ',
  'པདྨ': 'pé_ma',
  'པདྨའི': "pé_ma'i",
}
