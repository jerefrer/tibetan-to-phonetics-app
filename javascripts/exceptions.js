var exceptions = {
  // Complicated spaces
  'ལ་གསོལ་བ་འདེབས': 'la གསོལ་བ dep',
  // Mute suffixes
  'བདག': 'da',
  'ཤོག': 'sho',
  // Links between syllables
  'ཡ་མཚན': 'ཡམ་མཚན',
  'གོ་འཕང': 'གོམ་འཕང',
  'ཨོ་རྒྱན': 'ཨོར་རྒྱན',
  'རྒྱ་མཚོ': 'རྒྱམ་མཚོ',
  'མཁའ་འགྲོ': 'མཁའn_འགྲོ',
  'རྗེ་འབངས': 'རྗེམ་འབངས',
  'དགེ་འདུན': 'དགེན་འདུན',
  'འཕྲོ་འདུ': 'འཕྲོn_འདུ',
  'མི་འགྱུར': 'མིན་འགྱུར',
  'རྒྱ་མཚོའི': 'རྒྱམ་མཚོའི',
  'མཆོད་རྟེན': 'མཆོར་རྟེན',
  'སྤྲོ་བསྡུ': 'སྤྲོn_འདུ',
  'འོད་མཐའ་ཡས': 'འོན་མཐའ་ཡས',
  'རྡོ་རྗེ': 'རྡོར་རྗེ',
  'རྡོ་རྗེར': 'རྡོར་རྗེར',
  'རྡོ་རྗེའི': 'རྡོར་རྗེ',
  // Mistakes that become so common we keep them
  'རབ་འབྱམས': 'རb_འབྱམས',
  // Sanskrit stuff
  'ༀ': 'om ',
  'ཨཱ': 'ah ',
  'ཧཱུྃ': 'hūṃ ',
  'ཧཱུྃ': 'hūṃ ',
  'རྃ': 'ram ',
  'ཡྃ': 'yam ',
  'ཁྃ': 'kham ',
  'ཝཾ': 'wam ',
  'བཾ': 'bam ',
  'ཧཾ': 'hang ',
  'མཾ': 'mang ',
  'ཀརྨ': 'ཀར་མ',
  'དྷུ': 'dhའུ',
  'ཕཊ': "phet'",
  'བཛྲ': 'va_jra',
  'ཏནྟྲ': 'tan_tra',
  'སིདྡྷི': 'sid_dhi',
  'ཛྙཱ': 'རྒྱ',
  'པདྨ': 'pad_མ',
  'པདྨའི': 'pad_མའི',
  'པདྨོ': 'pad_མོ',
  'མ་ཧཱ': 'ma_ha',
  'བཾ་རོ': 'བམ་རོ',
  'ཤྲཱི': 'ཤི་རི་',
  'གུ་རུ': 'སྒུ་རུ',
  'ཨུཏྤལ': 'ཨུt_པལ',
  'ཁ་ཊྭཾ་ག': 'ka_tang_ka',
  'ཨེ་མ་ཧོ': 'é_ma_ho',
  'གུ་རུའི': 'སྒུ་རུའི',
  'བཾ་རོའི': 'བམ་རོའི',
  'སམྦྷ་ཝར': 'sam_bha_war',
  'གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ': 'gu_ru pad_ma sid_dhi hūṃ',
  'ༀ་ཨཱཿཧཱུྃ་བཛྲ་གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ': 'om ah hūṃ va_jra gu_ru pad_ma sid_dhi hūṃ'
}

var tr = function(word) {
  var tsheks = word.match(/་/);
  return new Transliterator(word).transliterate().replace(/ /g, '') + ''.pad(tsheks ? tsheks.length : 0, '_');
}

var transcribeTibetanParts = function(text) {
  var nonTibetanChars = new RegExp(/[\-\_\' a-zAⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯBⒷＢḂḄḆɃƂƁCⒸＣĆĈĊČÇḈƇȻꜾDⒹＤḊĎḌḐḒḎĐƋƊƉꝹEⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎFⒻＦḞƑꝻGⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾHⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍIⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗJⒿＪĴɈKⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢLⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀMⓂＭḾṀṂⱮƜNⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤOⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌPⓅＰṔṖƤⱣꝐꝒꝔQⓆＱꝖꝘɊRⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂSⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄTⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆUⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄVⓋＶṼṾƲꝞɅWⓌＷẀẂŴẆẄẈⱲXⓍＸẊẌYⓎＹỲÝŶỸȲẎŸỶỴƳɎỾZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢaⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐbⓑｂḃḅḇƀƃɓcⓒｃćĉċčçḉƈȼꜿↄdⓓｄḋďḍḑḓḏđƌɖɗꝺeⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝfⓕｆḟƒꝼgⓖｇǵĝḡğġǧģǥɠꞡᵹꝿhⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥiⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨıjⓙｊĵǰɉkⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣlⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇmⓜｍḿṁṃɱɯnⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥoⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵpⓟｐṕṗƥᵽꝑꝓꝕqⓠｑɋꝗꝙrⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃsⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛtⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇuⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉvⓥｖṽṿʋꝟʌwⓦｗẁẃŵẇẅẘẉⱳxⓧｘẋẍyⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿzⓩｚźẑżžẓẕƶȥɀⱬꝣǼǢꜺǄǅǽǣꜻǆ]+/, 'i');
  var nonTibetanPart = text.match(nonTibetanChars);
  if (nonTibetanPart) {
    var result = tr(text.slice(0, nonTibetanPart.index)) + nonTibetanPart[0];
    var rest = text.slice(nonTibetanPart.index+nonTibetanPart[0].length);
    if (rest) return result + transcribeTibetanParts(rest);
    else      return result;
  } else {
    return tr(text);
  }
}

var exceptionsAdjustedToLanguage = function() {
  return _(exceptions).extend(exceptionsPerLanguage[Settings.language]);
}

var findException = function(tibetan) {
  var transliteration;
  var spaceAfter = false;
  var exception = exceptionsAdjustedToLanguage()[tibetan];
  if (exception) {
    transliteration = transcribeTibetanParts(exception);
    spaceAfter = transliteration.last() == ' ';
    var numberOfSyllables = 1;
    var tsheks = tibetan.match(/་/g);
    var syllableMarkers = transliteration.trim().match(/[_ ]/g);
    if (syllableMarkers) numberOfSyllables = syllableMarkers.length + 1;
    return {
      spaceAfter: spaceAfter,
      numberOfSyllables: numberOfSyllables,
      numberOfShifts: tsheks ? tsheks.length : 0,
      transliterated: transliteration.trim().replace(/_/g, '')
    }
  }
}