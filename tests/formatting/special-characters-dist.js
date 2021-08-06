"use strict";

testGroups.push({
  name: 'Formatting - Special characters',
  tests: '྾྿࿀࿁࿂࿃࿄࿅࿆࿇࿈࿉࿊࿋࿌࿎࿏࿐࿑࿒࿓࿔࿕࿖࿗࿘࿙༄༅༆༇༈༉༊'.split(/(?:)/).map(function (_char) {
    return {
      tibetan: _char,
      transliteration: ''
    };
  })
});