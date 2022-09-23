"use strict";

var removeUntranscribedPunctuationAndNormalize = function removeUntranscribedPunctuationAndNormalize(tibetan) {
  var normalized = TibetanNormalizer.normalize(tibetan);
  return normalized.replace(/[༵\u0F04-\u0F0A\u0F0D-\u0F1F\u0F3A-\u0F3F\u0FBE-\uF269]/g, '').trim().replace(/[༔ཿ]/g, '་').replace(/[ྃྂ]/g, 'ཾ').replace(/་$/g, '');
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