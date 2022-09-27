testGroups.push({
  name: 'Calling the library - No "setting" argument falls back to default',
  tests: [
    {
      eval: `
        var transliterator = new TibetanTransliterator();
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expected: 'kangki lotrö'
    }
  ]
})

testGroups.push({
  name: 'Calling the library - String "setting" argument finds the appropriate setting',
  tests: [
    {
      eval: `
        var transliterator = new TibetanTransliterator({ setting: 'english-loose' });
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expected: 'gang-gi lodrö'
    }
  ]
})

testGroups.push({
  name: 'Calling the library - String "setting" argument raises error if no matching setting',
  tests: [
    {
      eval: `
        var transliterator = new TibetanTransliterator({ setting: 'japanese' });
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expectedError: "no existing setting matching id 'japanese'"
    }
  ]
})

testGroups.push({
  name: 'Calling the library - Object - Existing "setting" object works',
  tests: [
    {
      eval: `
        var frenchSetting = Settings.find('french');
        var transliterator = new TibetanTransliterator({ setting: frenchSetting });
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expected: 'kangki lotreu'
    }
  ]
})

testGroups.push({
  name: 'Calling the library - Object - Valid fake object for "setting" argument works',
  tests: [
    {
      eval: `
        var fakeRuleSet = {
          rules: { 'ö': 'eu' },
          exceptions: {}
        };
        var transliterator = new TibetanTransliterator({ setting: fakeRuleSet });
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expected: 'kangki lotreu'
    }
  ]
})

testGroups.push({
  name: 'Calling the library - Object - Invalid fake object "setting" raises error',
  tests: [
    {
      eval: `
        var fakeRuleSet = {};
        var transliterator = new TibetanTransliterator({ setting: fakeRuleSet });
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expectedError: "You passed an object but it doesn't return objects for 'rules' and 'exceptions'."
    }
  ]
})
