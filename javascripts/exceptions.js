var tr = function(word) {
  if (!word) return '';
  var tsheks = word.match(/་/);
  return new Transliterator(word).transliterate().replace(/ /g, '') + ''.pad(tsheks ? tsheks.length : 0, '_');
}

var transcribeTibetanParts = function(text) {
  var nonTibetanChars = new RegExp(/[\-\_\' a-zA-ZⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯBⒷＢḂḄḆɃƂƁCⒸＣĆĈĊČÇḈƇȻꜾDⒹＤḊĎḌḐḒḎĐƋƊƉꝹEⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎFⒻＦḞƑꝻGⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾHⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍIⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗJⒿＪĴɈKⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢLⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀMⓂＭḾṀṂⱮƜNⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤOⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌPⓅＰṔṖƤⱣꝐꝒꝔQⓆＱꝖꝘɊRⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂSⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄTⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆUⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄVⓋＶṼṾƲꝞɅWⓌＷẀẂŴẆẄẈⱲXⓍＸẊẌYⓎＹỲÝŶỸȲẎŸỶỴƳɎỾZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢaⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐbⓑｂḃḅḇƀƃɓcⓒｃćĉċčçḉƈȼꜿↄdⓓｄḋďḍḑḓḏđƌɖɗꝺeⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝfⓕｆḟƒꝼgⓖｇǵĝḡğġǧģǥɠꞡᵹꝿhⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥiⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨıjⓙｊĵǰɉkⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣlⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇmⓜｍḿṁṃɱɯnⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥoⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵpⓟｐṕṗƥᵽꝑꝓꝕqⓠｑɋꝗꝙrⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃsⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛtⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇuⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉvⓥｖṽṿʋꝟʌwⓦｗẁẃŵẇẅẘẉⱳxⓧｘẋẍyⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿzⓩｚźẑżžẓẕƶȥɀⱬꝣǼǢꜺǄǅǽǣꜻǆ]+/);
  var nonTibetanPart = text.match(nonTibetanChars);
  if (nonTibetanPart) {
    var result = tr(text.slice(0, nonTibetanPart.index)) + nonTibetanPart[0];
    var rest = text.slice(nonTibetanPart.index + nonTibetanPart[0].length);
    if (rest) return result + transcribeTibetanParts(rest);
    else      return result;
  } else {
    return tr(text);
  }
}

var exceptionsAdjustedToLanguage = function() {
  return _(_.clone(exceptions)).extend(exceptionsPerLanguage[Settings.language]);
}

var findException = function(tibetan) {
  var exception;
  var transliteration;
  var spaceAfter = false;
  var modifiers = ['འི', 'ས', 'ར'];
  var modifier = undefined;
  var i = 0;
  while (!exception && i < modifiers.length) {
    var tibetanWithModifier = tibetan.match(new RegExp(`(.*)${modifiers[i]}$`));
    if (tibetanWithModifier) {
      var tibetanWithoutModifier = tibetanWithModifier[1];
      exception = exceptionsAdjustedToLanguage()[tibetanWithoutModifier];
      if (exception)
        modifier = modifiers[i];
    }
    i++;
  }
  if (!exception)
    exception = exceptionsAdjustedToLanguage()[tibetan];
  if (exception) {
    if (modifier) exception += modifier;
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