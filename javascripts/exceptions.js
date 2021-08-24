var Exceptions = function(ruleset, tibetan) {
  return {
    ruleset: ruleset,
    exceptions:
      _(_.clone(ruleset.exceptions)).defaults(Exceptions.generalExceptions),
    find (tibetan) {
      var exception;
      var transliteration;
      var spaceAfter = false;
      var modifiers = ['འོ', 'འི', 'ས', 'ར'];
      var modifier = undefined;
      var i = 0;
      while (!exception && i < modifiers.length) {
        var tibetanWithModifier = tibetan.match(new RegExp(`(.*)${modifiers[i]}$`));
        if (tibetanWithModifier) {
          var tibetanWithoutModifier = tibetanWithModifier[1];
          exception = this.exceptions[tibetanWithoutModifier];
          if (exception)
            modifier = modifiers[i];
        }
        i++;
      }
      if (!exception)
        exception = this.exceptions[tibetan];
      if (exception) {
        if (modifier) {
          if (modifier == 'ས' && exception.last() == 'a')
            exception = exception.slice(0, -1) + t('drengbu');
          else if (modifier == 'ས' && exception.last() == 'o')
            exception = exception.slice(0, -1) + t('ö');
          else if (modifier == 'ས' && exception.last() == 'u')
            exception = exception.slice(0, -1) + t('ü');
          else
            exception += modifier;
        }
        transliteration = this.transcribeTibetanParts(exception);
        transliteration = this.removeDuplicateEndingLetters(transliteration);
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
    },
    removeDuplicateEndingLetters (text) {
      return text.replace(/(.?)\1*$/, '$1');
    },
    transcribeTibetanParts (text) {
      var nonTibetanChars = new RegExp(/[\-\_\' a-zA-ZⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯBⒷＢḂḄḆɃƂƁCⒸＣĆĈĊČÇḈƇȻꜾDⒹＤḊĎḌḐḒḎĐƋƊƉꝹEⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎFⒻＦḞƑꝻGⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾHⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍIⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗJⒿＪĴɈKⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢLⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀMⓂＭḾṀṂⱮƜNⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤOⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌPⓅＰṔṖƤⱣꝐꝒꝔQⓆＱꝖꝘɊRⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂSⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄTⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆUⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄVⓋＶṼṾƲꝞɅWⓌＷẀẂŴẆẄẈⱲXⓍＸẊẌYⓎＹỲÝŶỸȲẎŸỶỴƳɎỾZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢaⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐbⓑｂḃḅḇƀƃɓcⓒｃćĉċčçḉƈȼꜿↄdⓓｄḋďḍḑḓḏđƌɖɗꝺeⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝfⓕｆḟƒꝼgⓖｇǵĝḡğġǧģǥɠꞡᵹꝿhⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥiⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨıjⓙｊĵǰɉkⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣlⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇmⓜｍḿṁṃɱɯnⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥoⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵpⓟｐṕṗƥᵽꝑꝓꝕqⓠｑɋꝗꝙrⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃsⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛtⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇuⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉvⓥｖṽṿʋꝟʌwⓦｗẁẃŵẇẅẘẉⱳxⓧｘẋẍyⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿzⓩｚźẑżžẓẕƶȥɀⱬꝣǼǢꜺǄǅǽǣꜻǆ]+/);
      var nonTibetanPart = text.match(nonTibetanChars);
      if (nonTibetanPart) {
        var result = this.tr(text.slice(0, nonTibetanPart.index)) + nonTibetanPart[0];
        var rest = text.slice(nonTibetanPart.index + nonTibetanPart[0].length);
        if (rest) return result + this.transcribeTibetanParts(rest);
        else      return result;
      } else
        return this.tr(text);
    },
    tr (word) {
      if (!word) return '';
      var tsheks = word.match(/་/);
      return new TibetanTransliterator({ ruleset: this.ruleset }).transliterate(word)
                 .replace(/ /g, '') + ''.pad(tsheks ? tsheks.length : 0, '_');
    }
  }
}

var normalizeExceptions = function (exceptions) {
  return _(exceptions).inject((hash, value, key) => {
    if (key.trim().length) {
      var normalizedKey = removeUntranscribedPunctuationAndNormalize(key);
      var normalizedValue = removeUntranscribedPunctuationAndNormalize(value);
      if (normalizedKey != normalizedValue)
        hash[normalizedKey] = value;
    }
    return hash;
  }, {});
}

Exceptions.initialize = function(callback) {
  if (ignoreGeneralExceptionsStorage) {
    this.generalExceptions = normalizeExceptions(originalGeneralExceptions);
    callback();
  } else
    Storage.get(
      'general-exceptions',
      normalizeExceptions(originalGeneralExceptions),
      (value) => {
        this.generalExceptions = value;
        callback();
      }
    );
}

Exceptions.generalExceptionsAsArray = function() {
  return _(this.generalExceptions).map(function(value, key) {
    return { key: key, value: value }
  });
}

Exceptions.updateGeneralExceptions = function(exceptions, callback) {
  var normalizedExceptions = normalizeExceptions(exceptions);
  this.generalExceptions = normalizedExceptions;
  Storage.set('general-exceptions', normalizedExceptions, (value) => {
    if (callback) callback(value);
  });
}

Exceptions.resetGeneralExceptions = function(callback) {
  this.updateGeneralExceptions(originalGeneralExceptions, callback);
}