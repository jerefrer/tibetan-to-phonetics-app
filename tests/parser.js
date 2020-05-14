testGroups.push({
    name: "Only one syllable",
    tests: [
      { syllable: 'བ',    prefix: null, superscribed: null, main: 'བ', subscribed: null, vowel: null, suffix: null, secondSuffix: null },
    ]
});
testGroups.push({
    name: "A1) There is a written vowel",
    tests: [
      { syllable: 'ཆོས',   prefix: null, superscribed: null, main: 'ཆ', subscribed: null, vowel: 'ོ', suffix: 'ས', secondSuffix: null },
      { syllable: 'མིན',   prefix: null, superscribed: null, main: 'མ', subscribed: null, vowel: 'ི', suffix: 'ན', secondSuffix: null },
      { syllable: 'དངོས',  prefix: 'ད', superscribed: null, main: 'ང', subscribed: null, vowel: 'ོ', suffix: 'ས', secondSuffix: null },
    ]
});
testGroups.push({
    name: "A2) There is a superscribed or subscribed letter",
    tests: [
      { syllable: 'བྱང',  prefix: null, superscribed: null, main: 'བ', subscribed: 'ྱ', vowel: null, suffix: 'ང', secondSuffix: null },
      { syllable: 'བརྒལ',  prefix: 'བ', superscribed: 'ར', main: 'ག', subscribed: null, vowel: null, suffix: 'ལ', secondSuffix: null },
      { syllable: 'འབྲལ',  prefix: 'འ', superscribed: null, main: 'བ', subscribed: 'ྲ', vowel: null, suffix: 'ལ', secondSuffix: null },
      { syllable: 'སྨད',  prefix: null, superscribed: 'ས', main: 'མ', subscribed: null, vowel: null, suffix: 'ད', secondSuffix: null },
    ]
});
testGroups.push({
    name: "A3) There is a combination of vowel / superscribed / subscribed",
    tests: [
      { syllable: 'བྱིན',  prefix: null, superscribed: null, main: 'བ', subscribed: 'ྱ', vowel: 'ི', suffix: 'ན', secondSuffix: null },
      { syllable: 'བརྙེན',  prefix: 'བ', superscribed: 'ར', main: 'ཉ', subscribed: null, vowel: 'ེ', suffix: 'ན', secondSuffix: null },
      { syllable: 'རྒྱན',  prefix: null, superscribed: 'ར', main: 'ག', subscribed: 'ྱ', vowel: null, suffix: 'ན', secondSuffix: null },
      { syllable: 'བརྒྱད',  prefix: 'བ', superscribed: 'ར', main: 'ག', subscribed: 'ྱ', vowel: null, suffix: 'ད', secondSuffix: null },
    ]
});
testGroups.push({
    name: "B1) No vowel and only two letters",
    tests: [
      { syllable: 'དམ',  prefix: null, superscribed: null, main: 'ད', subscribed: null, vowel: null, suffix: 'མ', secondSuffix: null },
      { syllable: 'ཅན',  prefix: null, superscribed: null, main: 'ཅ', subscribed: null, vowel: null, suffix: 'ན', secondSuffix: null },
      { syllable: 'དང',  prefix: null, superscribed: null, main: 'ད', subscribed: null, vowel: null, suffix: 'ང', secondSuffix: null },
    ]
});
testGroups.push({
    name: "B1 bonus) Cases with AO at the end",
    tests: [
      { syllable: 'མང',  prefix: null, superscribed: null, main: 'མ', subscribed: null, vowel: null, suffix: 'ང', secondSuffix: null },
      { syllable: 'མངའ',  prefix: 'མ', superscribed: null, main: 'ང', subscribed: null, vowel: null, suffix: 'འ', secondSuffix: null },
      { syllable: 'དག',  prefix: null, superscribed: null, main: 'ད', subscribed: null, vowel: null, suffix: 'ག', secondSuffix: null },
      { syllable: 'དགའ',  prefix: 'ད', superscribed: null, main: 'ག', subscribed: null, vowel: null, suffix: 'འ', secondSuffix: null },
    ]
});
testGroups.push({
    name: "B2) No vowel and four letters in a row",
    tests: [
      { syllable: 'གཤགས',  prefix: 'ག', superscribed: null, main: 'ཤ', subscribed: null, vowel: null, suffix: 'ག', secondSuffix: 'ས' },
      { syllable: 'གདམས',  prefix: 'ག', superscribed: null, main: 'ད', subscribed: null, vowel: null, suffix: 'མ', secondSuffix: 'ས' },
      { syllable: 'འབངས',  prefix: 'འ', superscribed: null, main: 'བ', subscribed: null, vowel: null, suffix: 'ང', secondSuffix: 'ས' },
      { syllable: 'འབབས',  prefix: 'འ', superscribed: null, main: 'བ', subscribed: null, vowel: null, suffix: 'བ', secondSuffix: 'ས' },
    ]
});
testGroups.push({
    name: "B3a) No vowel, three letters, the final is NOT SA",
    tests: [
      { syllable: 'དམན',  prefix: 'ད', superscribed: null, main: 'ང', subscribed: null, vowel: null, suffix: 'ན', secondSuffix: null },
      { syllable: 'བདག',  prefix: 'བ', superscribed: null, main: 'ད', subscribed: null, vowel: null, suffix: 'ག', secondSuffix: null },
      { syllable: 'འཇམ',  prefix: 'འ', superscribed: null, main: 'ཇ', subscribed: null, vowel: null, suffix: 'མ', secondSuffix: null },
      { syllable: 'དཔལ',  prefix: 'ད', superscribed: null, main: 'པ', subscribed: null, vowel: null, suffix: 'ལ', secondSuffix: null },
    ]
});
testGroups.push({
    name: "B3b) No vowel, three letters, the final is     SA and the second letter is NOT GA NGA BA MA",
    tests: [
      { syllable: 'གནས',  prefix: 'ག', superscribed: null, main: 'ན', subscribed: null, vowel: null, suffix: 'ས', secondSuffix: null },
      { syllable: 'བདས',  prefix: 'བ', superscribed: null, main: 'ད', subscribed: null, vowel: null, suffix: 'ས', secondSuffix: null },
      { syllable: 'འདས',  prefix: 'འ', superscribed: null, main: 'ད', subscribed: null, vowel: null, suffix: 'ས', secondSuffix: null },
    ]
});
testGroups.push({
    name: "B3c) No vowel, three letters, the final is     SA and the second letter is     GA NGA BA MA",
    tests: [
      { syllable: 'ལགས',  prefix: 'ལ', superscribed: null, main: 'ག', subscribed: null, vowel: null, suffix: 'ས', secondSuffix: null },
      { syllable: 'ཐབས',  prefix: 'ཐ', superscribed: null, main: 'བ', subscribed: null, vowel: null, suffix: 'ས', secondSuffix: null },
      { syllable: 'ལངས',  prefix: 'ལ', superscribed: null, main: 'ང', subscribed: null, vowel: null, suffix: 'ས', secondSuffix: null },
    ]
});
testGroups.push({
    name: "B3d) No vowel, three letters, exceptions",
    tests: [
      { syllable: 'དགས',  prefix: 'ད', superscribed: null, main: 'ག', subscribed: null, vowel: null, suffix: 'ས', secondSuffix: null },
      { syllable: 'དྭགས',  prefix: null, superscribed: null, main: 'ད', subscribed: null, vowel: null, suffix: 'ག', secondSuffix: 'ས' },
      { syllable: 'དམས',  prefix: 'ད', superscribed: null, main: 'མ', subscribed: null, vowel: null, suffix: 'ས', secondSuffix: null },
      { syllable: 'འགས',  prefix: 'འ', superscribed: null, main: 'ག', subscribed: null, vowel: null, suffix: 'ས', secondSuffix: null },
      { syllable: 'མངས',  prefix: 'མ', superscribed: null, main: 'ང', subscribed: null, vowel: null, suffix: 'ས', secondSuffix: null },
    ]
});
testGroups.push({
    name: "Added cases",
    tests: [
      { syllable: 'དག',   prefix: null, superscribed: null, main: 'ད', subscribed: null, vowel: null, suffix: 'ག',  secondSuffix: null },
      { syllable: 'དབུ',  prefix: 'ད',   superscribed: null, main: 'བ', subscribed: null, vowel: 'ུ',  suffix: null, secondSuffix: null },
      { syllable: 'རྒ',   prefix: null, superscribed: 'ར',   main: 'ྒ', subscribed: null, vowel: null, suffix: null, secondSuffix: null },
      { syllable: 'གླ',   prefix: null, superscribed: null, main: 'ག', subscribed: 'ླ',   vowel: null, suffix: null, secondSuffix: null },
      { syllable: 'རྒྱ',  prefix: null, superscribed: 'ར',   main: 'ྒ', subscribed: 'ྱ',  vowel: null, suffix: null, secondSuffix: null },
      { syllable: 'རྒྱེ', prefix: null, superscribed: 'ར',   main: 'ྒ', subscribed: 'ྱ',  vowel: 'ེ',  suffix: null, secondSuffix: null },
      { syllable: 'གཤགས', prefix: 'ག', superscribed: null, main: 'ཤ', subscribed: null,  vowel: null,  suffix: 'ག', secondSuffix: 'ས' }
    ]
});
