# TODO

## Features
* Add tests for all the latest special cases:
  * aFollowedByN
  * oFollowedByN
  * gFollowedByN
  * removeUntranscribedPunctuation
  * spaces before/after, exception or not
  * wa for duo-syllables
* Try to handle all suffixes for exceptions (པདྨའི, པདྨས, ...)
* Use dictionary?

## Questions to Tibetan savants
* John Rockwell's suffixes a.1 ན
  * Do we replace 'n' with 'm' before པ་ཕ་བ་མ་ ? (rimpoche, gompa)
* John Rockwell's suffixes a.2 ག
  * Do we do like he says and use 'à'?
  * Or put it always?
  * Or only when followed by a syllable part of the word?
  * For now ག at the end is always present except for dak which is always da (even in khyapda)
* John Rockwell's second suffixes a.
  * Do we use à when གས?
* Would there be a way to automate links between syllables? (i.e. ཡ་**མ**ཚན)
  * It seems there aren't any hard rules (i.e. John Rockwell's prefixes 1.a.5)
  * For now we handle every case as an exception
* How to pronounce དབའ?
  * Wa?
  * Ba?

## Questions about style
* What to do when two syllables share the same letter: དག་གིས་
  * Do we merge it? taki
  * Or join with a dash? tak-ki
* jiktral? jigdrel?
* rapjam? rabjam?
* ngakwang
* སྣང་སྲིད་ཟིལ་གནོན་ : silnön? zilnön?
* བཅུ་གསུམ་ : chuksum? chusum?
* ཚེ་དཔག་མེད : tsepakme? tsepame?

## Questions about Padmakara's style
* Are the rules for eéè okay?
* What's the rule with ཤ and ཞ? (Sha/zha? Both sha? Then how do we differentiate?)
* བསླབ་ == l**h**ap?

## Special cases
* འཕགས་མཆོག་ == pachok? p'achok? p'akchok?

## Differences between Kham and Lhasa dialects
* suffix ལ་
  * Kham
    * is pronouced
    * does not umlaut the vowel 'a'
  * Lhasa
    * is not pronounced
    * does umlaut the vowel 'a' into 'e'