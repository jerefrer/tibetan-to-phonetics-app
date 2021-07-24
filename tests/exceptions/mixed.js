testGroups.push({
  name: 'Exceptions - Mixed',
  sentences: true,
  tests: [
    { tibetan: 'པདྨ་', transliteration: 'padma' },
    { tibetan: 'པདྨ་གེ་སར་', transliteration: 'padma késar' }, // Number of syllable is correct
    { tibetan: 'རབ་འབྱམས་', transliteration: 'rabjam' }, // རb_འབྱམས
  ]
})