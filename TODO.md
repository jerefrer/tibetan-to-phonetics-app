# TODO

## Code
* Wrap the code nicely like modern apps do, so that nothing leaks outside
  of the library scope and that it can be imported easily in other projects
  through npm and other package managers.
* Add a complete normalization of combined letters (like  for སྤྲ).

## Features
* Maybe distinguish between endLinkChars that result in being pronounced as
  one syllable, and the ones that result in two syllables. For instance in the
  CYDZO the suffix 'ang doesn't add an extra syllable, but the suffix -o adds
  one. Can we consider these behaviors to be reliable across all prayers or
  should it be turned into an option at the top.
  How detailed should the option be?
    * For each SUFFIX: "Character to use when linking SUFFIX: ..."
    * Or just distinguishing between some of them?
* ཉི་ཟླའི་གའུ་འོད་འབར་དབུས༔
  * "Nyidé ka-u-ö barü" should be "Nyidé ka-u öbar ü"
* Maybe handle bo as ending particle when coming after a syllabe that ends
  with ba. For example chub bo should be chup po and not chup wo.
  Seen in CYDZO:
    སྤྲོས་བྲལ་ཐིག་ལེའི་ངང་དུ་འུབ་ཆུབ་བོ། །
* For exception modifiers check thoroughly what could be every possible modifiers.
  * For now we handle འི་, ས་ and ར་ but there might be more.
* Add dash before nga more often (for instance yum-ngé)
  * Maybe always before vowels, for instance ལུས་ངག་ lü-ngak
  * Handle སྟེ་ལྔ་ as té-nga or གནས་ལྔར་ཚེ as né-ngar
  * རིགས་ལྔའི་ as rik-ngé?
* Optionally use dictionary to group words together? Is that even possible?

## Tests
* Pass the test of "Künkyi tsémo ösel chokmin_gyur" in Exceptions - Spaces
* Add tests for spaces before/after, exception or not

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
* དྭངས
  * Tang?
  * Dang?
  * General rule or exception?
* སྨྲ
  * Ma?
  * Mra? (Orgyenla pronounces 'mra' in CYDZO #5 and CYDZO #11)
* འལ་འོལ
  * el-öl?
  * al-öl?
* ཕྱད་ཆད་
  * chéché?
  * cham-ché?
  * chang-ché?
* པ་མིའམ་ཅི་ཡིས་
  * pami-am chiyi?
  * pami amchi yi?
  * See a-am and a-ang test file
* འོག་མ་
  * Okma?
  * Oma?
  * O-ma?

## Questions about style
* ཆ་ : cha? ch'a?
* What to do when two syllables share the same letter: དག་གིས་
  * Do we merge it? taki
  * Or join with a dash? tak-ki
  * What about completion particles, like ཅན་ནོ : cheno or chen-no?
  => Seems to be safer and better to join with a dash every time,
     then one can simplify when proof-reading, instead of the other way around
* Are the rules for eéè okay?
* French: DoubleS only between vowels, or are there other cases?

## Special cases
* པའང and པའམ are handled, but can there be things such as གྱེའང་ or བགའོང་?
  * Should they be included in the possible modifiers after exceptions?
* རྱ
* དྷ
* བྷ
* བསླབ་ == l**h**ap?
* བ་སྤུ = papu? bapu? wapu?
* mangs == mang || gné ? (clue: mang' is pronounced nga (Translating Buddhism p.283))
* སེང་གེ : sengé
* Add hypen between k and ng for better readability? (ex: Suk-ngu)
* Add hypen before vowel alone? (ex: rang-ö)
* མན་ངག་ comes as mengak, not men-ngak, why?
* jiktral? jigdrel?
* rapjam? rabjam?
* ngakwang
* མ་འགག་ maNgak?
* མི་འགག་ miNgak?
* སྣང་སྲིད་ཟིལ་གནོན་ : silnön? zilnön?
* བཅུ་གསུམ་ : chuksum? chusum?
* ཚེ་དཔག་མེད་ : tsepakme? tsepame?
* སྐྱེ་འགགས་ : kyengak? kyégak?
* མཆོད་རྟེན་ : chöten? chorten?
* མགོན་པོ་ : gönpo? gompo? gonpo?
* འཕགས་མཆོག་ == pachok? p'achok? p'akchok?
* རྣམ་པར་སྨིན་པའང་བསམ་མི་ཁྱབ། །
  * Should it be 'Nampar minpa-ang sami khyap'?
    * which is the case currently and is how it's done in the Prayer Book 1
  * Or 'Nampar minpa angsam mi khyap'?

## Differences between Kham and Lhasa dialects
* suffix ལ་
  * Kham
    * is pronouced
    * does not umlaut the vowel 'a'
  * Lhasa
    * **is not pronounced** (?)
    * does umlaut the vowel 'a' into 'e'

## Leads for a "proper" implementation
* There are definitely existing tools and ways to parse, define and transliterate languages
* See the "morphology" files in GoldenDict that define prefixes, suffixes and so on.