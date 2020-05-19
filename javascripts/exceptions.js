var findException = function(tibetan) {
  var transliteration;
  var spaceAfter = false;
  switch(tibetan) {
    // Complicated spaces
    case 'ལ་གསོལ་བ་འདེབས': transliteration = 'la sölwa dep'; break;
    // Mute suffixes
    case 'བདག': transliteration = 'da'; break;
    case 'ཤོག': transliteration = 'sho'; break;
    // Links between syllables
    case 'ཡ་མཚན': transliteration = 'yam_tsen'; break;
    case 'གོ་འཕང': transliteration = "kom_p'ang"; break;
    case 'ཨོ་རྒྱན': transliteration = 'or_gyen'; break;
    case 'རྒྱ་མཚོ': transliteration = 'gyam_tso'; break;
    case 'མཁའ་འགྲོ': transliteration = 'khan_dro'; break;
    case 'རྗེ་འབངས': transliteration = "jem_bang"; break;
    case 'དགེ་འདུན': transliteration = "gen_dün"; break;
    case 'འཕྲོ་འདུ': transliteration = "tr'on_du"; break;
    case 'མི་འགྱུར': transliteration = 'min_gyur'; break;
    case 'རྒྱ་མཚོའི': transliteration = 'gyam_tsö'; break;
    case 'མཆོད་རྟེན': transliteration = 'chor_ten'; break;
    case 'སྤྲོ་བསྡུ': transliteration = 'tron_du'; break;
    case 'འོད་མཐའ་ཡས': transliteration = 'ön_tha_yé'; break;
    case 'རྡོ་རྗེ': transliteration = 'dor_jé'; break;
    case 'རྡོ་རྗེར': transliteration = 'dor_jer'; break;
    case 'རྡོ་རྗེའི': transliteration = 'dor_jé'; break;
    // Mistakes that become so common we keep them
    case 'རབ་འབྱམས': transliteration = 'rab_jam'; break;
    // Sanskrit stuff
    case 'ༀ': transliteration = 'om'; spaceAfter = true; break;
    case 'ཨཱ': transliteration = 'ah'; spaceAfter = true; break;
    case 'ཧཱུྃ': transliteration = 'hūṃ'; spaceAfter = true; break;
    case 'ཧཱུྃ': transliteration = 'hūṃ'; spaceAfter = true; break;
    case 'རྃ': transliteration = 'ram'; spaceAfter = true; break;
    case 'ཡྃ': transliteration = 'yam'; spaceAfter = true; break;
    case 'ཁྃ': transliteration = 'kham'; spaceAfter = true; break;
    case 'ཝཾ': transliteration = 'wam'; spaceAfter = true; break;
    case 'བཾ': transliteration = 'bam'; spaceAfter = true; break;
    case 'ཧཾ': transliteration = 'hang'; spaceAfter = true; break;
    case 'མཾ': transliteration = 'mang'; spaceAfter = true; break;
    case 'དྷུ': transliteration = 'dhu'; break;
    case 'བཛྲ': transliteration = 'va_jra'; break;
    case 'ཏནྟྲ': transliteration = 'tan_tra'; break;
    case 'སིདྡྷི': transliteration = 'sid_dhi'; break;
    case 'ཛྙཱ': transliteration = 'gya'; break;
    case 'པདྨ': transliteration = 'pad_ma'; break;
    case 'པདྨའི': transliteration = 'pad_mé'; break;
    case 'མ་ཧཱ': transliteration = 'ma_ha'; break;
    case 'བཾ་རོ': transliteration = 'pam_ro'; break;
    case 'ཤྲཱི': transliteration = 'shi_ri'; break;
    case 'གུ་རུ': transliteration = 'gu_ru'; break;
    case 'ཨུཏྤལ': transliteration = 'ut_pal'; break;
    case 'ཁ་ཊྭཾ་ག': transliteration = 'ka_tang_ka'; break;
    case 'ཨེ་མ་ཧོ': transliteration = 'é_ma_ho'; break;
    case 'གུ་རུའི': transliteration = 'gu_rü'; break;
    case 'བཾ་རོའི': transliteration = 'pam_rö'; break;
    case 'སམྦྷ་ཝར': transliteration = 'sam_bha_war'; break;
    case 'གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ': transliteration = 'gu_ru pad_ma sid_dhi hūṃ'; break;
    case 'ༀ་ཨཱཿཧཱུྃ་བཛྲ་གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ': transliteration = 'om ah hūṃ va_jra gu_ru pad_ma sid_dhi hūṃ'; break;
  }
  if (transliteration) {
    var numberOfSyllables = 1;
    var tsheks = tibetan.match(/་/g);
    var syllableMarkers = transliteration.match(/[_ ]/g);
    if (syllableMarkers) numberOfSyllables = syllableMarkers.length + 1;
    return {
      spaceAfter: spaceAfter,
      numberOfSyllables: numberOfSyllables,
      numberOfShifts: tsheks ? tsheks.length : 0,
      transliterated: transliteration.replace(/_/g, '')
    }
  }
}