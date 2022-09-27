//  ka  / kha  / ga  become ka
//  bha / cha  / ja  become cha
//  ta  / tha  / da  become ta
//  pa  / pha  / ba  become pa
//  kya / khya / gya become kya
//  sa  / za         become sa
//  tra / dra        become tra

defaultSettings.push({

  id: 'english-super-loose',
  name: 'English SuperLoose (for phonetic search)',

  rules: {

    // End equals start (sang-gyé, tak-ki, ...)
    // Value can be 'merge', 'dash', 'space', or 'leave'
    'endEqualsStart': 'merge',

    // Linking char (as in pa-o or pe-u)
    'endLinkChar': "'",

    // Vowels
    'ü': 'u',                // འུས
    'ö': 'o',                // འོས
    'drengbu': 'e',          // འེ
    'drengbuMaNaRa': 'e',    // མཁྱེན་ / drengbu and suffix ma, na, ra
    'drengbuGaBaLaNga': 'e', // འཕྲེང་ / drengbu and suffix ga, ba, la, nga
    'aNa': 'e',              // རྒྱན་  / no vowel and suffix na
    'aLa': 'e',              // རྒྱལ་  / no vowel and suffix la
    'aKikuI': "e",           // པའི

    // Regular consonants
    'kha': 'k',               // ཁ
    'tha': 't',               // ཁ
    'ga': 'k',               // ག
    'ba': 'p',               // བ
    'cha': 'ch',             // ཆ
    'tsha': 'ts',            // ཚ
    'da': 't',               // ད
    'pha': 'p',              // ཕ
    'zha': 'sh',             // ཞ
    'dza': 'ts',             // ཞ

    // Modified consonants (with prefix or superscribed)
    'gaMod': 'k',            // རྒ
    'jaMod': 'ch',           // རྗ
    'daMod': 't',            // རྡ
    'baMod': 'p',            // རྦ
    'zaMod': 's',            // བཟ

    // Ratas
    'rata1': 'tr',           // ཏྲ  / 1st col with rata
    'rata2': 'tr',           // ཁྲ  / 2nd col with rata
    'rata3': 'tr',           // བྲ  / 3rd col with rata
    'rata3Mod': 'tr',        // སྒྲ / 3rd col with rata and prefix/superscribed
    'hra': 'hr',             // ཧྲ

    // Yatas
    'kaYata': 'k',           // ཀྱ
    'khaYata': 'k',          // ཁྱ
    'gaYata': 'k',           // གྱ
    'gaModYata': 'k',        // སྒྱ / ga with yata and prefix/superscribed
    'paYata': 'ch',          // པྱ
    'phaYata': 'ch',         // ཕྱ
    'baYata': 'ch',          // བྱ
    'baModYata': 'ch',       // སྦྱ / ba with yata and prefix/superscribed
    'daoWaYata': 'y',        // དབྱ

    // Latas
    'lata': 'l',             // གླ
    'lataDa': 't',           // ཟླ

    // Special cases
    'lha': 'l',              // ལྷ
    'baAsWa': 'p'

  },

  exceptions: {

  }

})