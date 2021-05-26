# TODO

## Features
* Find a way to handle variants of exceptions, for instance:
    མཁའ་འགྲོ => མཁའn_འགྲོ doesn't handle མཁའ་འགྲོའི
* Handle long a + syllable, for instance in ཝཱ་རཱ་ཧཱི༔
* Add dash before nga more often (for instance yum-ngé)
  * Maybe always before vowels, for instance ལུས་ངག་ lü-ngak

* Add a little documentation on how to define exceptions
* Add tests for all the latest special cases:
  * aFollowedByN
  * oFollowedByN
  * gFollowedByN
  * removeUntranscribedPunctuation
  * spaces before/after, exception or not
  * wa for duo-syllables
* Try to handle all suffixes for exceptions (པདྨའི, པདྨས, ...)
* Use dictionary?

## Leads for a "proper" implementation
* There are definitely existing tools and ways to parse, define and transliterate languages
* See the "morphology" files in GoldenDict that define prefixes, suffixes and so on.

## Questions to Tibetan savants
* In 'Translating Buddhism':
  གི and གྱི because they are merely particles—are naturally unstressed syllables.
  They are, therefore. pronounced gi and gyi. respectively.
* བྱ་ == ཅ་ or ཆ་ ?
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
* ཆ་ : cha? ch'a?
* What to do when two syllables share the same letter: དག་གིས་
  * Do we merge it? taki
  * Or join with a dash? tak-ki
  * What about completion particles, like ཅན་ནོ : cheno or chen-no?
  => Seems to be safer and better to join with a dash every time, then one can simplify when reviewing, instead of the other way around

## Questions about Padmakara's style
* Are the rules for eéè okay?
* What's the rule with ཤ and ཞ? (Sha/zha? Both sha? Then how do we differentiate? And in French?)
* བསླབ་ == l**h**ap?
* French: ལྷ་: lha? l'a?
* French: Decide when to use doubleS

## Special cases
* རྱ
* དྷ
* བྷ
* བ་སྤུ = papu? bapu? wapu?
* འབྲས་བུ = drePu not dreWu (remember to handle འབྲས་བུའི as well)
* mangs == mang || gné ? (clue: mang' is pronounced nga (Translating Buddhism p.283))
* སེང་གེ : sengé
* Add hypen between k and ng for better readability? (ex: Suk-ngu)
* Add hypen before vowel alone? (ex: rang-ö)
* མན་ངག་ comes as mengak, not men-ngak, why?
* jiktral? jigdrel?
* rapjam? rabjam?
* ngakwang
* སྣང་སྲིད་ཟིལ་གནོན་ : silnön? zilnön?
* བཅུ་གསུམ་ : chuksum? chusum?
* ཚེ་དཔག་མེད་ : tsepakme? tsepame?
* སྐྱེ་འགགས་ : kyengak? kyégak?
* མཆོད་རྟེན་ : chöten? chorten?
* མགོན་པོ་ : gönpo? gompo? gonpo?
* འཕགས་མཆོག་ == pachok? p'achok? p'akchok?

## Differences between Kham and Lhasa dialects
* suffix ལ་
  * Kham
    * is pronouced
    * does not umlaut the vowel 'a'
  * Lhasa
    * is not pronounced
    * does umlaut the vowel 'a' into 'e'