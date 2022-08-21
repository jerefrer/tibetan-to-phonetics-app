/*

  Rules found in Gilbert BUÉSO's "Parlons Tibétain":

    p.94:
      When BA is the last syllable of a word, it's pronounced WA.

    p.135:
      The rules for adding the suffix of infinitive to a verb are as follows:
        If the root ends with nga / 'a / ra / la then the suffix is BA
        If not the suffix is PA

  This leads to the question:
  When a BA follows something else than these four suffixes,
  Does it necessarily mean that it is not part of the previous word,
  And therefore should be transcribed as PA?

*/

testGroups.push({
  name: 'Wa as second syllable - First syllable ending with ra should yield Wa',
  tests: [
    { tibetan: 'འཕིར་བ་',  transliteration: "p'irwa" },
    { tibetan: 'བར་བ་',  transliteration: 'parwa' },
    { tibetan: 'བར་བར་',  transliteration: 'parwar' },
    { tibetan: 'བར་བའོ་',  transliteration: 'parwa-o' },
    { tibetan: 'བར་བོ་', transliteration: 'parwo' },
    { tibetan: 'བར་བོར་', transliteration: 'parwor' },
    { tibetan: 'བར་བོས་', transliteration: 'parwö' },
    { tibetan: 'བར་བས་',  transliteration: 'parwé' },
    { tibetan: 'བར་བའི་', transliteration: 'parwé' },
    { tibetan: 'བར་བའམ་', transliteration: 'parwa-am' },
    { tibetan: 'བར་བའང་', transliteration: 'parwa-ang' },
  ]
})

testGroups.push({
  name: 'Wa as second syllable - First syllable ending with nga should yield Wa',
  tests: [
    { tibetan: 'གནང་བ་',  transliteration: 'nangwa' },
  ]
})


testGroups.push({
  name: "Wa as second syllable - First syllable ending with 'a should yield Wa",
  tests: [
    { tibetan: 'དཀའ་བ་',  transliteration: 'kawa' },
  ]
})


testGroups.push({
  name: 'Wa as second syllable - First syllable ending with la should yield Wa',
  tests: [
    { tibetan: 'མཇལ་བ་',  transliteration: 'jelwa' },
  ]
})


testGroups.push({
  name: 'Wa as second syllable - First syllable ending with no suffix should yield Wa',
  tests: [
    { tibetan: 'འགྲོ་བ་',  transliteration: 'drowa' },
  ]
})

// Trying to cover this one actually generates many inaccurate transliterations
// in other weird cases, and it might not be necessary at all. See question above.
//
// testGroups.push({
//   name: 'Wa as second syllable - First syllable ending with anything else should yield Pa',
//   tests: [
//     { tibetan: 'བྱེད་བ་',  transliteration: 'chépa' },
//   ]
// })
