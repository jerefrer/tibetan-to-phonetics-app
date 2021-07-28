testGroups.push({
  name: 'Formatting - Special characters',
  tests: '྾྿࿀࿁࿂࿃࿄࿅࿆࿇࿈࿉࿊࿋࿌࿎࿏࿐࿑࿒࿓࿔࿕࿖࿗࿘࿙༄༅༆༇༈༉༊'.split(/(?:)/u).map((char) => {
    return { tibetan: char, transliteration: '' }
  })
})
