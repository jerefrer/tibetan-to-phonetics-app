"use strict";

var removeUntranscribedPunctuationAndNormalize = function removeUntranscribedPunctuationAndNormalize(tibetan) {
  return normalizeCombinedLetters(tibetan).replace(/[༵\u0F04-\u0F0A\u0F0D-\u0F1F\u0F3A-\u0F3F\u0FBE-\uF269]/g, '').trim().replace(/[༔ཿ]/g, '་').replace(/[ྃྂ]/g, 'ཾ').replace(/(ཾ)([ཱཱཱེིོིྀུུ])/g, '$2$1') // Malformed: anusvara before vowel
  .replace(/༌/g, '་') // Alternative encoding for tshek
  .replace(/་+/g, '་').replace(/་$/g, '');
};

var normalizeCombinedLetters = function normalizeCombinedLetters(tibetan) {
  return tibetan.replace(/ༀ/g, 'ཨོཾ').replace(/ཀྵ/g, 'ཀྵ').replace(/ཱུ/g, 'ཱུ').replace(/ཱི/g, 'ཱི').replace(/ཱྀ/g, 'ཱྀ').replace(/དྷ/g, 'དྷ').replace(//g, '࿓༅').replace(//g, 'སྤྲ').replace(//g, 'ུ').replace(//g, 'ག').replace(//g, 'ུ').replace(//g, 'རྒྱ').replace(//g, 'གྲ').replace(//g, 'ུ').replace(//g, 'ི').replace(//g, 'བྱ').replace(//g, 'སྲ').replace(//g, 'སྒྲ').replace(//g, 'ལྷ').replace(//g, 'ོ').replace(//g, 'གྱ').replace(//g, 'རླ').replace(/ཪླ/g, 'རླ').replace(//g, 'ཕྱ').replace(//g, 'སྩ').replace(//g, 'རྡ').replace(//g, 'རྗ');
};

var extractTransliteration = function extractTransliteration(text) {
  var lines = text.split("\n");
  var transliterationLines = [];

  _(lines).each(function (line) {
    if (line.match(/^[A-Z][ ]*\d*$/)) return; // Page number

    if (line.match(/[ÂĀÊĒÎĪÔŌṐÛŪâāêēîīôōûūf1-9\,\;\.\:\!\?\*\_\(\)]/)) return; // Translation line

    transliterationLines.push(line);
  });

  return transliterationLines.join("\n");
};