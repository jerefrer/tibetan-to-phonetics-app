testGroups.push({
  name: 'Formatting - End equals start - Merge',
  rules: {
    endEqualsStart: 'merge'
  },
  tests: [
    { tibetan: 'སངས་རྒྱས་',  transliteration: 'sangyé' },
    { tibetan: 'བསམ་མི་', transliteration: 'sami' },
    { tibetan: 'རིགས་ཀྱི་', transliteration: 'rikyi' },
    { tibetan: 'གཞོན་ནུ', transliteration: 'zhönu' },
  ]
})

testGroups.push({
  name: 'Formatting - End equals start - Dash',
  rules: {
    endEqualsStart: 'dash'
  },
  tests: [
    { tibetan: 'སངས་རྒྱས་',  transliteration: 'sang-gyé' },
    { tibetan: 'བསམ་མི་', transliteration: 'sam-mi' },
    { tibetan: 'རིགས་ཀྱི་', transliteration: 'rik-kyi' },
    { tibetan: 'གཞོན་ནུ', transliteration: 'zhön-nu' },
  ]
})

testGroups.push({
  name: 'Formatting - End equals start - Space',
  rules: {
    endEqualsStart: 'space'
  },
  tests: [
    { tibetan: 'སངས་རྒྱས་',  transliteration: 'sang gyé' },
    { tibetan: 'བསམ་མི་', transliteration: 'sam mi' },
    { tibetan: 'རིགས་ཀྱི་', transliteration: 'rik kyi' },
    { tibetan: 'གཞོན་ནུ', transliteration: 'zhön nu' },
  ]
})

testGroups.push({
  name: 'Formatting - End equals start - Leave',
  rules: {
    endEqualsStart: 'leave'
  },
  tests: [
    { tibetan: 'སངས་རྒྱས་',  transliteration: 'sanggyé' },
    { tibetan: 'བསམ་མི་', transliteration: 'sammi' },
    { tibetan: 'རིགས་ཀྱི་', transliteration: 'rikkyi' },
    { tibetan: 'གཞོན་ནུ', transliteration: 'zhönnu' },
  ]
})
