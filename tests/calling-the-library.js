testGroups.push({
  name: 'Library - Arguments - No "ruleset" argument falls back to default',
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
  name: 'Library - Arguments - String "ruleset" argument finds the appropriate ruleset',
  tests: [
    {
      eval: `
        var transliterator = new TibetanTransliterator({ ruleset: 'english-loose' });
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expected: 'gangi lodrö'
    }
  ]
})

testGroups.push({
  name: 'Library - Arguments - String "ruleset" argument raises error if no matching ruleset',
  tests: [
    {
      eval: `
        var transliterator = new TibetanTransliterator({ ruleset: 'japanese' });
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expectedError: "no existing ruleset matching id 'japanese'"
    }
  ]
})

testGroups.push({
  name: 'Library - Arguments - Existing "ruleset" object',
  tests: [
    {
      eval: `
        var frenchRuleset = Rulesets.find('french');
        var transliterator = new TibetanTransliterator({ ruleset: frenchRuleset });
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expected: 'kangki lotreu'
    }
  ]
})

testGroups.push({
  name: 'Library - Arguments - Valid fake object "ruleset"',
  tests: [
    {
      eval: `
        var fakeRuleSet = {
          rules: { 'ö': 'eu' },
          exceptions: {}
        };
        var transliterator = new TibetanTransliterator({ ruleset: fakeRuleSet });
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expected: 'kangki lotreu'
    }
  ]
})

testGroups.push({
  name: 'Library - Arguments - Invalid fake object "ruleset" raises error',
  tests: [
    {
      eval: `
        var fakeRuleSet = {};
        var transliterator = new TibetanTransliterator({ ruleset: fakeRuleSet });
        transliterator.transliterate('གང་གི་བློ་གྲོས་');
      `,
      expectedError: "You passed an object but it doesn't return objects for 'rules' and 'exceptions'."
    }
  ]
})