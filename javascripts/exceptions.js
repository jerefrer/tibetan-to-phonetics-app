var tr = function(word) {
  var tsheks = word.match(/་/);
  return new Transliterator(word).transliterate().replace(/ /g, '') + ''.pad(tsheks ? tsheks.length : 0, '_');
}

var findException = function(tibetan) {
  var transliteration;
  var spaceAfter = false;
  switch(tibetan) {
    // Complicated spaces
    case 'ལ་གསོལ་བ་འདེབས': transliteration = 'la '+tr('གསོལ་བ')+' dep'; break;
    // Mute suffixes
    case 'བདག': transliteration = 'da'; break;
    case 'ཤོག': transliteration = 'sho'; break;
    // Links between syllables
    case 'ཡ་མཚན': transliteration = tr('ཡམ་མཚན'); break;
    case 'གོ་འཕང': transliteration = tr('གོམ་འཕང'); break;
    case 'ཨོ་རྒྱན': transliteration = tr('ཨོར་རྒྱན'); break;
    case 'རྒྱ་མཚོ': transliteration = tr('རྒྱམ་མཚོ'); break;
    case 'མཁའ་འགྲོ': transliteration = tr('མཁའ')+'n_'+tr('འགྲོ'); break;
    case 'རྗེ་འབངས': transliteration = tr('རྗེམ་འབངས'); break;
    case 'དགེ་འདུན': transliteration = tr('དགེན་འདུན'); break;
    case 'འཕྲོ་འདུ': transliteration = tr('འཕྲོ')+'n_'+tr('འདུ'); break;
    case 'མི་འགྱུར': transliteration = tr('མིན་འགྱུར'); break;
    case 'རྒྱ་མཚོའི': transliteration = tr('རྒྱམ་མཚོའི'); break;
    case 'མཆོད་རྟེན': transliteration = tr('མཆོར་རྟེན'); break;
    case 'སྤྲོ་བསྡུ': transliteration = tr('སྤྲོ')+'n_'+tr('འདུ'); break;
    case 'འོད་མཐའ་ཡས': transliteration = tr('འོན་མཐའ་ཡས'); break;
    case 'རྡོ་རྗེ': transliteration = tr('རྡོར་རྗེ'); break;
    case 'རྡོ་རྗེར': transliteration = tr('རྡོར་རྗེར'); break;
    case 'རྡོ་རྗེའི': transliteration = tr('རྡོར་རྗེ'); break;
    // Mistakes that become so common we keep them
    case 'རབ་འབྱམས': transliteration = tr('ར')+'b_'+tr('འབྱམས'); break;
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
    case 'དྷུ': transliteration = 'dh'+tr('འུ'); break;
    case 'བཛྲ': transliteration = 'va_jra'; break;
    case 'ཏནྟྲ': transliteration = 'tan_tra'; break;
    case 'སིདྡྷི': transliteration = 'sid_dhi'; break;
    case 'ཛྙཱ': transliteration = tr('རྒྱ'); break;
    case 'པདྨ': transliteration = 'pad_ma'; break;
    case 'པདྨའི': transliteration = 'pad_mé'; break;
    case 'མ་ཧཱ': transliteration = 'ma_ha'; break;
    case 'བཾ་རོ': transliteration = 'pam_ro'; break;
    case 'ཤྲཱི': transliteration = tr('ཤི་རི་'); break;
    case 'གུ་རུ': transliteration = 'gu_ru'; break;
    case 'ཨུཏྤལ': transliteration = tr('ཨུ') + 't_' + tr('པལ'); break;
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