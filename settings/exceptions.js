/*----------------------------------------------------------------------------
| Each line defines one exception.
|
| If any of the values on the left of the colon is found in the line to be
| transliterated, then it will be treated as if it was the value on the right
| of the colon.
|
| Tibetan characters will be transliterated as they would be normally.
| Latin characters will be inserted as-is within the transliteration.
|
| If using Latin characters, then between each syllable you need to add an
| underscore to help the system determine how many syllables the word is made
| of, even if it does not exactly match how the word is composed.
|
| For instance if you want to have སངས་རྒྱས་ always transliterated as 'sangye',
| you would do:
|
| 'སངས་རྒྱས': 'san_gye'
| but not
| 'སངས་རྒྱས': 'sang_gye'
|
| If a line is defined with a left value that is included in another line with
| a longer left value, then the longer one will be used.
|
| For instance if these two rules are defined:
|
| 'སངས': 'SAN'
| 'སངས་རྒྱས': 'san_GYE'
|
| Then སངས་རྒྱས་ would be transliterated as sanGYE,  ignoring the first rule.
----------------------------------------------------------------------------*/

var defaultGeneralExceptions = {

  // Mute suffixes
  'བདག': 'སྡ',
  'ཤོག': 'ཤོ',

  // Links between syllables
  'ཡ་མཚན': 'ཡམ་མཚན',
  'གོ་འཕང': 'གོམ་འཕང',
  'ཨོ་རྒྱན': 'ཨོར་རྒྱན',
  'རྒྱ་མཚོ': 'རྒྱམ་མཚོ',
  'མཁའ་འགྲོ': 'མཁའn_འགྲོ',
  'མཁའ་འགྲོའི': 'མཁའn_འགྲོའི',
  'མཁའ་འགྲོས': 'མཁའn_འགྲོས',
  'རྗེ་འབངས': 'རྗེམ་འབངས',
  'དགེ་འདུན': 'དགེན་འདུན',
  'འཕྲོ་འདུ': 'འཕྲོn_འདུ',
  'མི་འགྱུར': 'མིན་འགྱུར',
  'རྒྱ་མཚོའི': 'རྒྱམ་མཚོའི',
  'མཆོད་རྟེན': 'མཆོར་རྟེན',
  'སྤྲོ་བསྡུ': 'སྤྲོn_འདུ',
  'འོད་མཐའ་ཡས': 'འོན་མཐའ་ཡས',
  'རྡོ་རྗེ': 'རྡོར་རྗེ',
  'རྟ་མགྲིན': 'རྟམ་མགྲིན',
  'བཀའ་འགྱུར་': 'བཀའn་འགྱུར་',
  'ན་བཟའ་': 'ནམ་བཟའ་',
  'མ་འགགས་': 'མn་འགགས་',

  // Complicated spacing
  'ལ་གསོལ་བ་འདེབས': 'ལ་ གསོལ་བ་ འདེབས',

  // Mistakes that become so common we keep them
  'རབ་འབྱམས': 'རb_འབྱམས',

  // Sanskrit stuff
  'ༀ': 'ཨོམ ',
  'ཨཱ': 'འh ',
  'ཧཱུཾ': 'hའུང ',
  'བྷྲཱུཾ': 'bhrའུམ',
  'ཧྲཱི': 'ཧྲི ',
  'མ་ཎི': 'ma_ni',
  'རཾ་ཡཾ་ཁཾ': 'ram yam kham ',
  'ཧ་ཧོ་ཧྲཱི': 'ha ho hri ',
  'ཨ་ཨ་ཨ།': 'a a a ',
  'བཾ': 'bam ',
  'ཨཾ': 'ang ',
  'ཀརྨ': 'ཀར་མ',
  'དྷུ': 'dhའུ',
  'དྷི': 'dhའི',
  'དྷ': 'dhའ',
  'བྷ': 'bh',
  'བྷ་ག': 'bhའ_རྒ',
  'བཛྲ': 'va_jra',
  'ཏནྟྲ': 'tan_tra',
  'སིདྡྷི': 'sid_dhi',
  'ཛྙཱ': 'རྒྱ',
  'པདྨ': 'པd_མ',
  'པདྨོ': 'པd_མོ',
  'པདྨེ': 'པd_མེ',
  'པཎྜི': 'པn_སྡི',
  'པཎྜིཏ': 'པn_སྡི_ཏ',
  'བཾ་རོ': 'བམ་རོ',
  'ཤྲཱི': 'ཤི་རི',
  'གུ་རུ': 'gའུ་རུ',
  'ཨུཏྤལ': 'ཨུt_པལ',
  'ཏདྱཐཱ': 'tའd_ཡ_ཏ',
  'སྭསྟི': 'svའ_stའི',
  'སྭ་སྟི': 'svའ_stའི',
  'ཝཱ་རཱ་ཧཱི': 'ཝ_ར_ཧི',
  'ཁ་ཊྭཾ་ག': 'ཀ_ཏང_ཀ',
  'ཨེ་མ་ཧོ': 'ཨེ_མ_ཧོ',
  'གུ་རུ': 'སྒུ་རུ',
  'སམྦྷ་ཝར': 'སམ_bhའ_ཝར',
  'དིཔྟ་ཙཀྲ': 'dའི_ptའ tsའk_trའ',
  'ཀྲོསྡ': 'krའོ_dhའ',
  'ༀ་ཨ་ར་པ་ཙ་ན་སྡིཿསྡིཿསྡིཿ': 'ༀ ཨ ར པ ཙ ན རྡི རྡི རྡི',
  'སརྦ': 'sའr_wའ',
  'བྷུ': 'bhའུ',
  'ས་པ་རི་ཝཱ་ར': 'ས་པ་རི་ཝ་ར',
  'ས་མ་ཡ': 'ས་མ་ཡ',
  'ས་མ་ཡ་ཛཿ': 'ས་མ་ཡ ཛ',
  'ཏིཥྛ་ལྷན༔': 'tish_tha lhan',
  'ཨ་ཏི་པཱུ་ཧོཿ': 'a_ti_pའུ ho',
  'པྲ་ཏཱིཙྪ་ཧོཿ': 'pra_ti_tsa ho',
  'ཨརྒྷཾ': 'ar_gham',
  'པཱ་དྱཾ': 'pa_dyam',
  'པུཥྤེ': 'pའུsh_པེ',
  'དྷཱུ་པེ': 'dhའུ_པེ',
  'ཨཱ་ལོ་ཀེ': 'a_lo_ཀེ',
  'གནྡྷེ': 'gan_dhཨེ',
  'ནཻ་ཝི་དྱ': 'nai_win_dyའེ',
  'ནཻ་ཝི་ཏྱ': 'nai_win_dyའེ',
  'ཤཔྡ': 'sha_pta',
  'པྲ་ཏཱིཙྪ་': 'pra_ti_tsa ',
  'པྲ་ཏཱིཙྪ་ཡེ': 'pra_ti_tsa_yའེ',
  'སྭཱ་ཧཱ': 'sva_ha',
  'སྭཱཧཱ': 'sva_ha',
  'དྷརྨ': 'dhar_ma',
  'དྷརྨཱ': 'dhar_ma',
  'དྷརྨ་པཱ་ལ': 'dhar_ma_pa_la',
  'དྷརྨཱ་པཱ་ལ': 'dhar_ma_pa_la',
  'ཨི་དཾ': 'i_dam',
  'བ་ལིངྟ': 'ba_ling_ta',
  'བ་ལིཾ་ཏ': 'ba_ling_ta',
  'པཉྩ': 'pañ_tsa',
  'ཨ་མྲྀ་ཏ': 'am_ri_ta',
  'ཨམྲྀ་ཏ': 'am_ri_ta',
  'ཀུཎྜ་ལཱི': 'kའུn_da_li',
  'རཀྟ': 'rak_ta',
  'པཱུ་ཛ': 'pའུ_ja',
  'ཁ་ཁ་ཁཱ་ཧི་ཁཱ་ཧི': 'kha kha kha_hi kha_hi',
  'མཎྜལ': 'man_da_la',
  'མཎྜ་ལ': 'man_da_la',
  'ཤྲཱི': 'shi_ri',
  'དྷེ་ཝ': 'dé_wa',
  'ཤཱནྟ': 'shen_ta',
  'ཀྲོ་དྷ': 'kro_dha',
  'དྷ་ཀ': 'སྡ_ཀ',
  'དྷཱ་ཀི་ནཱི': 'སྡ_ཀི_ནི',
  'ཌཱཀྐི་ནི': 'སྡ_ཀི_ནི',
  'ཌཱ་ཀི་ནཱི་': 'སྡ_ཀི_ནི',
  'དྷཱ་ཀི': 'སྡ_ཀི',
  'ཌཱ་ཀི': 'སྡ_ཀི',
  'ཌཱཀྐི': 'སྡ_ཀི',
  'བ་སུ་དེ་ཝ': 'wa_sའུ dé_wa',
  'ནཱི་དྷི་པ་ཏི': 'ni_dhi_pa_ti',
  'བྷཱུ་མི་པ་ཏི': 'bhའུ_mi_pa_ti',
  'མ་ཧཱ་ཀཱ་ལ': 'ma_ha_ka_la',
  'མ་ཧཱ་ཀཱ་ལཱ': 'ma_ha_ka_la_ya',
  'ཏ་ཐཱ་ག་ཏ': 'ta_tha_ga_ta',
  'བྷྱོ': 'ba_yo',
  'བི་ཤྭ': 'bi_shའུ',
  'མུ་ཁེ་བྷྱ': 'mའུ_ké_bé',
  'ཨུདྒཏེ': 'འུt_ga_té',
  'སྥར': 'sa_par',
  'སྥ་ར་ཎ': 'ས_པ_ར_ན',
  'ག་ག་ན་ཁཾ': 'སྒ_སྒ_ན ཁམ',
  'ཏིཥྛ': 'tish_tha',
  'ཏིཥྛནྟུ': 'tish_then_tའུ',
  'ཀཱ་ཝཱ་ཙི': 'ཀ ཝ ཙི',
  'ཝཱཀ': 'ཝ_ཀ',
  'ཙིཏྟ': 'ཆི_tཏ',
  'རཀྵ': 'རk_ཤ',
  'བོ་དྷི': 'སྦོ_དྷི',
  'པཱཀྵ': 'པཱk_ཤ',
  'པུཎྱཻ་': 'པུ_ཉེ',
  'སྭ་བྷཱ་ཝ': 'so_bha_wa',
  'ཤུདྡྷྭ': 'shའུd_do',
  'ཤུདྡྷོ': 'shའུd_do',
  'ཤུདྡྷོ྅ཧཾ': 'shའུd_do hang',
  'ཀ་མ་ལཱ་ཡེ': 'ka_ma_la yé',
  'སྟྭཾ': 'tam',
  'རཏྣ': 'rat_na',
  'ཨཱརྻ': 'a_rya',
  'ཨཱརྻཱ': 'a_rya',
  'ཨཱརྱ': 'a_rya',
  'ཨཱརྱཱ': 'a_rya',
  'པདྨཱནྟ': 'pad_man_ta',
  'ཀྲྀཏ': 'krit ',
  'ཧྱ་གྲཱྀ་ཝ': 'ha_ya gri_wa',
  'བིགྷྣཱན': 'bi_gha_nen',
  'ཧ་ན་ཧ་ན་': 'hana hana',
  'ཕཊ྄': 'phet',
  'ཕཊ': 'phet',
  'མཉྫུ་གྷོ་ཥ': 'man_ju_go_sha',
  'དྷརྨཱ་ཎཾ': 'dhar_ma nam',
  'ཨ་ཀཱ་རོ': 'a_ka_ro',
  'ཨཱདྱ་ནུཏྤནྣ': 'adi anütpena',
  'ཏོཏྟ': 'to_ta',
  'ཏུཏྟཱ': 'tut_ta',
  'ཏུཏྟཱ་ར': 'tut_ta_ra',
  'རསྟུ': 'ར_sཏུ',
}
