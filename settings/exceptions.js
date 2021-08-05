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
| 'སངས་': 'SAN'
| 'སངས་རྒྱས': 'san_GYE'
|
| Then སངས་རྒྱས་ would be transliterated as sanGYE,  ignoring the first rule.
----------------------------------------------------------------------------*/

var exceptions = {
  // Complicated spaces
  'ལ་གསོལ་བ་འདེབས': 'ལ་ གསོལ་བ་ འདེབས་',
  // Mute suffixes
  'བདག': 'da',
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
  // Mistakes that become so common we keep them
  'རབ་འབྱམས': 'རb_འབྱམས',
  // Sanskrit stuff
  'ༀ': 'om ',
  'ཨཱ': 'ah ',
  'ཧཱུཾ': 'hung ',
  'ཧཱུྃ': 'hung ',
  'ཧཱུྂ': 'hung ',
  'རྃ': 'ram ',
  'ཡྃ': 'yam ',
  'ཁྃ': 'kham ',
  'རཾ་ཡཾ་ཁཾ': 'ram yam kham ',
  'རྃ་ཡྃ་ཁྃ': 'ram yam kham ',
  'རྂ་ཡྂ་ཁྂ': 'ram yam kham ',
  'ཧ་ཧོ་ཧྲཱི': 'ha ho hri ',
  'ཨ་ཨ་ཨ།': 'a a a ',
  'བཾ': 'bam ',
  'ཨཾ': 'ang ',
  'ཀརྨ': 'ཀར་མ',
  'དྷུ': 'dhའུ',
  'བྷ': 'bh',
  'བྷ་ག': 'bha_ga',
  'ཕཊ': "phet'",
  'བཛྲ': 'va_jra',
  'ཏནྟྲ': 'tan_tra',
  'སིདྡྷི': 'sid_dhi',
  'ཛྙཱ': 'རྒྱ',
  'པདྨ': 'pad_མ',
  'པདྨོ': 'pad_མོ',
  'མ་ཧཱ': 'ma_ha',
  'བཾ་རོ': 'བམ་རོ',
  'ཤྲཱི': 'ཤི་རི',
  'གུ་རུ': 'སྒུ་རུ',
  'ཨུཏྤལ': 'ཨུt_པལ',
  'སྭ་སྟི': 'sva_sti',
  'ཝཱ་རཱ་ཧཱི': 'wa_ra_hi',
  'ཁ་ཊྭཾ་ག': 'ka_tang_ka',
  'ཨེ་མ་ཧོ': 'é_ma_ho',
  'གུ་རུའི': 'སྒུ་རུའི',
  'བཾ་རོའི': 'བམ་རོའི',
  'སམྦྷ་ཝར': 'sam_bha_war',
  'ཀཱི་ལ་ཡ': 'ki_la_ya',
  'དིཔྟ་ཙཀྲ་': 'di_pta tsak_tra',
  'ཀྲོསྡ་': 'kro_dha',
  'ༀ་ཨ་ར་པ་ཙ་ན་སྡིཿསྡིཿསྡིཿ': 'om a ra pa tsa na di di di',
  'སརྦ་': 'sar_wa',
  'བྷུ་': 'bhu',
  'ས་པ་རི་ཝཱ་ར་': 'sa_pa_ri_wa_ra',
  'ས་མ་ཡ་': 'sa_ma_ya',
  'ས་མ་ཡ་ཛཿ': 'sa_ma_ya dza',
  'ཏིཥྛ་ལྷན༔': 'tish_tha lhan',
  'ཨ་ཏི་པཱུ་ཧོཿ': 'a_ti_pu ho',
  'པྲ་ཏཱིཙྪ་ཧོཿ': 'pra_ti_tsa ho',
  'ཨརྒྷཾ་': 'ar_ghaṃ',
  'པཱ་དྱཾ་': 'pa_dyaṃ',
  'པུཥྤེ་': 'push_pe',
  'དྷཱུ་པེ་': 'dhu_pe',
  'ཨཱ་ལོ་ཀེ་': 'a_lo_ke',
  'གནྡྷེ་': 'gan_dhe',
  'ནཻ་ཝི་དྱ་': 'nai_win_dye',
  'ཤཔྡ་': 'sha_pta',
  'པྲ་ཏཱིཙྪ་ཡེ་': 'pra_ti_tsa_ye',
  'སྭཱ་ཧཱ།': 'sva_ha',
  'དྷརྨ་': 'dhar_ma',
  'དྷརྨཱ་': 'dhar_ma',
  'དྷརྨ་པཱ་ལ་': 'dhar_ma_pa_la',
  'དྷརྨཱ་པཱ་ལ་': 'dhar_ma_pa_la',
  'ཨི་དཾ་': 'i_dam',
  'བ་ལིངྟ་': 'ba_ling_ta',
  'བ་ལིཾ་ཏ་': 'ba_ling_ta',
  'པཉྩ་': 'pañ_tsa',
  'ཨ་མྲྀ་ཏ་': 'am_ri_ta',
  'རཀྟ་': 'rak_ta',
  'པཱུ་ཛ་': 'pu_ja',
  'ཁ་ཁ་ཁཱ་ཧི་ཁཱ་ཧི': 'kha kha khahi khahi',
  'མཎྜལ་': 'man_del',
  'མཎྜ་ལ་': 'man_da_la',
  'ཤྲཱི་': 'shi_ri',
  'དྷེ་ཝ་': 'dé_wa',
  'ཤཱནྟ་': 'shen_ta',
  'ཀྲོ་དྷ་': 'kro_dha',
  'དྷ་ཀ་': 'da_ka',
  'དྷཱ་ཀི་ནཱི་': 'da_ki_ni',
  'བ་སུ་དེ་ཝ་': 'wa_su dé_wa',
  'ནཱི་དྷི་པ་ཏི་': 'ni_dhi_pa_ti',
  'བྷཱུ་མི་པ་ཏི་': 'bhu_mi_pa_ti',
  'མ་ཧཱ་ཀཱ་ལ་': 'ma_ha_ka_la',
  'མ་ཧཱ་ཀཱ་ལཱ་': 'ma_ha_ka_la_ya',
  'ཏ་ཐཱ་ག་ཏ་': 'ta_tha_ga_ta',
  'བྷྱོ': 'ba_yo',
  'བི་ཤྭ་': 'bi_shu',
  'མུ་ཁེ་བྷྱ': 'mu_ké_bé',
  'ཨུདྒཏེ་': 'ut_ga_té',
  'སྥ་ར་ཎ་': 'sa_pa_ra_na',
  'ག་ག་ན་ཁཾ་': 'ga_ga_né kham',
  'ཏིཥྛ་': 'tish_tha',
}
