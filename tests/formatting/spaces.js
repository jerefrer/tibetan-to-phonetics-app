testGroups.push({
  name: 'Formatting - Spaces',
  tests: [
    { tibetan: 'སངས་རྒྱས་དང་། །ཆོས།',  transliteration: 'sangyé tang chö' },
    { tibetan: 'ཧཱུྃ༔ ཨོ་རྒྱན་ཡུལ་གྱི་ནུབ་བྱང་མཚམས༔', transliteration: "hung orgyen yülkyi nupchang tsam" },
    { tibetan: 'ཨེ་མ་ཧོཿ སྤྲོས་བྲལ་ཆོས་ཀྱི་དབྱིངས་ཀྱི་ཞིང་ཁམས་སུ༔ ', transliteration: "émaho trötrel chökyi yingkyi zhingkham su" },
    { tibetan: 'བཞིན་དུ་ཚོར་བ་དང་། འདུ་ཤེས་དང་། འདུ་བྱེད་དང་། རྣམ་པར་ཤེས་པ་རྣམས་སྟོང་པའོ། །', transliteration: "zhintu tsorwa tang dushé tang duché tang nampar shépa namtong pa-o" },
  ]
})

testGroups.push({
  name: 'Formatting - Spaces with capitalization',
  capitalize: true,
  tests: [
    { tibetan: 'སངས་རྒྱས་དང་། །ཆོས།',  transliteration: 'Sangyé tang Chö' },
    { tibetan: 'ཧཱུྃ༔ ཨོ་རྒྱན་ཡུལ་གྱི་ནུབ་བྱང་མཚམས༔', transliteration: "Hung Orgyen yülkyi nupchang tsam" },
    { tibetan: 'ཨེ་མ་ཧོཿ སྤྲོས་བྲལ་ཆོས་ཀྱི་དབྱིངས་ཀྱི་ཞིང་ཁམས་སུ༔ ', transliteration: "Émaho Trötrel chökyi yingkyi zhingkham su" },
    { tibetan: 'བཞིན་དུ་ཚོར་བ་དང་། འདུ་ཤེས་དང་། འདུ་བྱེད་དང་། རྣམ་པར་ཤེས་པ་རྣམས་སྟོང་པའོ། །', transliteration: "Zhintu tsorwa tang Dushé tang Duché tang Nampar shépa namtong pa-o" },
  ]
})