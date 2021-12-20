testGroups.push({
  name: 'Exceptions - A-am and a-ang',
  tests: [
    { tibetan: 'མིའམ་ཅི་ཡིས་', transliteration: 'mi-am chiyi' },
    { tibetan: 'ནའང་མི་ཤེས', transliteration: "na-ang mishé" }, // -ang on first syllable
    { tibetan: 'ཤར་བའང་མི་ཤེས', transliteration: "sharwa-ang mishé" }, // -ang on second syllable

    // Should this following one be like that?
    // Or should it be 'pami amchi yi'?
    { tibetan: 'པ་མིའམ་ཅི་ཡིས་', transliteration: 'pami-am chiyi' },
  ]
})
