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

defaultLanguages.push({

  id: 'english-loose',
  name: 'English (loose)',

  rules: {

    // Linking char (as in pa-o or pe-u)
    'endLinkChar': "'",

    // Vowels
    'aKikuI': 'é',              // པའི

    // Regular consonants
    'ga': 'g',                  // ག
    'cha': 'ch',                // ཆ
    'ba': 'p',                  // བ
    'tsha': 'ts',               // ཚ
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
    'phaYata': 'ch',            // ཕྱ
    'baYata': 'ch',             // བྱ

  },

  exceptions: {

  }

})