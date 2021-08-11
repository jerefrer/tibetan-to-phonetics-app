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

  id: 'french',
  name: 'French',

  rules: {

    'doubleS': true,

    // Vowels
    'u': 'ou',               // འུ
    'ü': 'u',                // འུས
    'ö': 'eu',               // འོས
    'aKikuI': 'é',           // པའི

    // Regular consonants
    'ca': 'tch',             // ཅ
    'cha': "tch'",           // ཆ
    'ja': 'dj',              // ཇ
    'tha': "t'",             // ཐ
    'ba': 'p',               // བ
    'tsha': "ts'",           // ཚ
    'sha': 'ch',             // ཤ
    'zha': 'sh',             // ཞ

    // Modified consonants (with prefix or superscribed)
    'jaMod': 'dj',           // རྗ
    'gaMod': 'gu',           // རྒ

    // Ratas
    'rata2': "t'r",          // ཁྲ  / 2nd col with rata

    // Yatas
    'gaModYata': 'gui',      // སྒྱ / ga with yata and prefix/superscribed
    'paYata': 'tch',         // པྱ
    'phaYata': "tch'",       // ཕྱ
    'baYata': "tch'",        // བྱ
    'baModYata': 'dj',       // སྦྱ / ba with yata and prefix/superscribed

  },

  exceptions: {

  }

})
