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

  // Vowels
  'ü': 'u',                // འུས
  'ö': 'o',                // འོས
  'drengbu': 'e',          // འེ
  'aKikuI': 'e',           // འི

  // Regular consonants
  'kha': 'k',              // ཁ
  'cha': 'ch',             // ཆ
  'nya': 'ñ',              // ཉ
  'tha': 't',              // ཐ
  'pha': 'p',              // ཕ
  'ba': 'p',               // བ
  'tsha': 'ts',            // ཚ
  'dza': 'ds',             // ཛ
  'zha': 'sh',             // ཞ

  // Modified consonants (with prefix or superscribed)
  'gaMod': 'gu',           // གཇ
  'jaMod': 'y',            // རྗ
  'zaMod': 's',            // བཟ

  // Ratas
  'rata2': 'tr',           // ཁྲ  / 2nd col with rata

  // Yatas
  'gaModYata': 'gui',      // སྒྱ / ga with yata and prefix/superscribed
  'paYata': 'ch',          // པྱ
  'phaYata': 'ch',         // ཕྱ
  'baYata': 'ch',          // བྱ
  'baModYata': 'y',        // སྦྱ / ba with yata and prefix/superscribed

}

exceptionsPerLanguage['spanish'] = {
  'ཁ་ཊྭཾ་ག': 'kat_vam_ga'
}