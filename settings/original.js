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

var originalSettings = {
  // End link char (as in pa-o or be-u)
  'endLinkChar': '-',

  // Vowels
  'a': 'a',                   // འ
  'i': 'i',                   // འི
  'o': 'o',                   // འོ
  'u': 'u',                   // འུ
  'ü': 'ü',                   // འུས
  'ö': 'ö',                   // འོས
  'drengbu': 'é',             // འེ
  'drengbuMaNaRa': 'e',       // མཁྱེན་ // drengbu and suffix ma, na, ra
  'drengbuGaBaLaNga': 'e',    // འཕྲེང་ // drengbu and suffix ga, ba, la, nga
  'aNa': 'e',                 // རྒྱན་ // no vowel and suffix na
  'aLa': 'e',                 // རྒྱལ་ // no vowel and suffix la
  'dreldraAi': 'é',           // པའི

  // Regular consonants
  'ka': 'k',                  // ཀ
  'kha': 'kh',                // ཁ
  'ga': 'k',                  // ག
  'nga': 'ng',                // ང
  'ca': 'ch',                 // ཅ
  'cha': 'ch',                // ཆ
  'ja': 'ch',                 // ཇ
  'nya': 'ny',                // ཉ
  'ta': 't',                  // ཏ
  'tha': 'th',                // ཐ
  'da': 't',                  // ད
  'na': 'n',                  // ན
  'pa': 'p',                  // པ
  'pha': "p'",                // ཕ
  'ba': 'p',                  // བ
  'ma': 'm',                  // མ
  'tsa': 'ts',                // ཙ
  'tsha': 'ts',               // ཚ
  'dza': 'dz',                // ཛ
  'wa': 'w',                  // ཝ
  'zha': 'zh',                // ཞ
  'za': 's',                  // ཟ
  'ya': 'y',                  // ཡ
  'ra': 'r',                  // ར
  'la': 'l',                  // ལ
  'sha': 'sh',                // ཤ
  'sa': 's',                  // ས
  'ha': 'h',                  // ཧ

  // Modified consonants (when prefixed or superscribed)
  'gaMod': 'g',               // རྒ
  'jaMod': 'j',               // རྗ
  'daMod': 'd',               // རྡ
  'baMod': 'b',               // རྦ
  'zaMod': 'z',               // བཟ

  // Ratas
  'rata1': 'tr',              // ཏྲ  // 1st column with rata
  'rata2': "tr'",             // ཁྲ  // 2nd column with rata
  'rata3': 'tr',              // བྲ  // 3rd column with rata
  'rata3Mod': 'dr',           // སྒྲ // 3rd column with rata when prefixed or superscribed
  'hra': 'hr',                // ཧྲ

  // Yatas
  'kaYata': 'ky',             // ཀྱ
  'khaYata': 'khy',           // ཁྱ
  'gaYata': 'ky',             // གྱ
  'gaModYata': 'gy',          // སྒྱ // ga with yata when prefixed or superscribed
  'paYata': 'ch',             // པྱ
  'phaYata': 'ch',            // ཕྱ
  'baYata': 'ch',             // བྱ
  'baModYata': 'j',           // སྦྱ // ba with yata when prefixed or superscribed
  'daoWaYata': 'y',           // དབྱ

  // Latas
  'lata': 'l',                // གླ
  'lataDa': 'd',              // ཟླ

  // Special cases
  'lha': 'lh',                // ལྷ

  // Suffixes
  'kaSuffix': 'k',            // དཀ
  'ngaSuffix': 'ng',          // དང
  'naSuffix': 'n',            // དན
  'baSuffix': 'p',            // དབ
  'maSuffix': 'm',            // དམ
  'raSuffix': 'r',            // དར
  'laSuffix': 'l',            // དལ
}