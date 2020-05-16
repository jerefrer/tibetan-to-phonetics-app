var findException = function(tibetan) {
  var transliteration;
  switch(tibetan) {
    // Wa's
    case 'གསོལ་བ': transliteration = 'söl_wa'; break;
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
    case 'རྒྱ་མཚོའི': transliteration = 'gyam_tsö'; break;
    case 'མཆོད་རྟེན': transliteration = 'chor_ten'; break;
    case 'འོད་མཐའ་ཡས': transliteration = 'ön_tha_ye'; break;
    // Word that should appear whole
    case 'ཀ་མ་ལ': transliteration = 'ka_ma_la'; break;
    case 'ཅོམ་ལྡན་འདས': transliteration = 'tchom_den_de'; break;
    case 'སྤྱན་རས་གཟིགས': transliteration = 'chen_re_zik'; break;
    // Sanskrit stuff
    case 'རྃ': transliteration = 'ram'; break;
    case 'ཡྃ': transliteration = 'yam'; break;
    case 'ཁྃ': transliteration = 'kham'; break;
    case 'ཝཾ': transliteration = 'wam'; break;
    case 'བཾ': transliteration = 'bam'; break;
    case 'ཧཾ': transliteration = 'hang'; break;
    case 'མཾ': transliteration = 'mang'; break;
    case 'ༀ': transliteration = 'om'; break;
    case 'ཧཱུྃ': transliteration = 'hūṃ'; break;
    case 'པདྨ': transliteration = 'pe_ma'; break;
    case 'མ་ཧཱ': transliteration = 'ma_ha'; break;
    case 'གུ་རུ': transliteration = 'gu_ru'; break;
    case 'ཨུཏྤལ': transliteration = 'ut_pal'; break;
    case 'ཁ་ཊྭཾ་ག': transliteration = 'ka_tang_ka'; break;
    case 'གུ་རུའི': transliteration = 'gu_rü'; break;
    case 'རྡོ་རྗེ': transliteration = 'dor_je'; break;
    case 'ཨེ་མ་ཧོ': transliteration = 'e_ma_ho'; break;
    case 'སམྦྷ་ཝར': transliteration = 'sam_bha_war'; break;
    case 'གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ': transliteration = 'gu_ru pad_ma si_ddhi hūṃ'; break;
  }
  if (transliteration) {
    var numberOfSyllables = 1;
    var syllablesMatch = transliteration.match(/[_ ]/g);
    if (syllablesMatch) numberOfSyllables = syllablesMatch.length + 1;
    return {
      numberOfSyllables: numberOfSyllables,
      transliterated: transliteration.replace(/_/g, '')
    }
  }
}