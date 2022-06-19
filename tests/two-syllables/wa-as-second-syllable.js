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

// For now we don't cover this one because it actually generates
// more inaccurate transliterations in other weird cases
testGroups.push({
  name: 'Wa as second syllable - First syllable ending with anything else should yield Pa',
  tests: [
    { tibetan: 'བྱེད་བ་',  transliteration: 'chépa' },
  ]
})
