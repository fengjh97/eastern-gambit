// 终局成就卡 + 建国小作文（对比2002年史实中国）
window.ACHIEVEMENTS = [
  // 军事 mil
  { id: 'korea', cat: 'mil', name: '立国之战', img: 'ach/ach_korea', cond: { flags: ['korea_war'] },
    t: '鸭绿江对岸，年轻的共和国与世界头号强权掰了手腕——从此无人再敢小看这个国家的意志。' },
  { id: 'bomb', cat: 'mil', name: '东方巨响', img: 'ach/ach_bomb', cond: { flags: ['bomb'] },
    t: '罗布泊的蘑菇云，是这个国家买不来、讨不来、只能自己造出来的安全感。' },
  { id: 'satellite', cat: 'tech', name: '巡天遥看', img: 'ach/ach_satellite', cond: { flags: ['satellite'] },
    t: '《东方红》的旋律从近地轨道传回大地——太空俱乐部从此有了中文席位。' },
  { id: 'twobombs', cat: 'tech', name: '两弹一星', img: 'ach/ach_twobombs', cond: { flags: ['bomb', 'satellite'] },
    t: '勒紧裤腰带铸出的国之重器，让所有谈判桌都重新摆放了座次。' },
  { id: 'mil70', cat: 'mil', name: '钢铁长城', img: 'ach/ach_mil', cond: { res: { MIL: 70 } },
    t: '从小米加步枪到现代化铁流，这道长城不再是砖石砌的。' },
  // 外交 dip
  { id: 'bandung', cat: 'dip', name: '万隆精神', img: 'ach/ach_bandung', cond: { flags: ['bandung'] },
    t: '"求同存异"四个字，为一个被封锁的国家赢得了大半个亚非。' },
  { id: 'un', cat: 'dip', name: '重返联合国', img: 'ach/ach_un', cond: { flags: ['un_seat'] },
    t: '被挡在门外二十二年之后，五星红旗在东河之滨升起。' },
  { id: 'pingpong', cat: 'dip', name: '小球转大球', img: 'ach/ach_pingpong', cond: { flags: ['pingpong'] },
    t: '一只乒乓球撬动了冷战铁幕——外交史上最轻盈的破冰。' },
  { id: 'nixon', cat: 'dip', name: '跨洋握手', img: 'ach/ach_nixon', cond: { flags: ['nixon_ok'] },
    t: '太平洋上空的航线打通那一刻，世界棋盘重新洗牌。' },
  { id: 'usnormal', cat: 'dip', name: '中美建交', img: 'ach/ach_usnormal', cond: { flags: ['us_normal'] },
    t: '三十年坚冰化为建交公报上的墨迹。' },
  { id: 'jp', cat: 'dip', name: '一衣带水', img: 'ach/ach_jp', cond: { flags: ['jp_normal'] },
    t: '恩仇未忘，来往先行——邻居终究是搬不走的。' },
  { id: 'sk', cat: 'dip', name: '汉江破冰', img: 'ach/ach_sk', cond: { flags: ['sk_ties'] },
    t: '跨过意识形态的三八线，黄海两岸的货轮先讲起了生意。' },
  { id: 'dip70', cat: 'dip', name: '万国来朝', img: 'ach/ach_dip', cond: { res: { DIP: 70 } },
    t: '从被封锁的孤岛到举足轻重的一极，世界学会了倾听北京。' },
  // 经济 eco
  { id: 'reform', cat: 'eco', name: '改革开放', img: 'ach/ach_reform', cond: { flags: ['reform'] },
    t: '真理标准的讨论撞开了那扇大门，门后是四十年的奇迹。' },
  { id: 'southtour', cat: 'eco', name: '春天的故事', img: 'ach/ach_southtour', cond: { flags: ['south_tour'] },
    t: '"发展才是硬道理"——一位老人在南海边写下的这句话，价值连城。' },
  { id: 'sez', cat: 'eco', name: '杀出血路', img: 'ach/ach_sez', cond: { flags: ['sez'] },
    t: '从渔村滩涂到摩天森林，特区是这个国家胆识的计量单位。' },
  { id: 'wto', cat: 'eco', name: '叩开世界', img: 'ach/ach_wto', cond: { flags: ['wto'] },
    t: '十五年长跑，一槌定音——世界工厂领到了全球市场的入场券。' },
  { id: 'eco70', cat: 'eco', name: '世界工厂', img: 'ach/ach_eco', cond: { res: { ECO: 70 } },
    t: '集装箱从每一个港口涌向七大洲，Made in China 成了时代的注脚。' },
  // 统一 unity
  { id: 'hk', cat: 'unity', name: '明珠归还', img: 'ach/ach_hk', cond: { flags: ['hk_return'] },
    t: '一百五十六年的等待，以一场安静的仪式落幕。' },
  { id: 'strait', cat: 'unity', name: '海峡春潮', img: 'ach/ach_strait', cond: { rel: { tw: 5 } },
    t: '对峙的炮位改成了灯塔，海峡的温度计终于回暖。' },
  // 内政 home
  { id: 'stb60', cat: 'home', name: '政通人和', img: 'ach/ach_stb', cond: { res: { STB: 60 } },
    t: '仓廪实而知礼节——安定的人心是一切伟业的地基。' },
  // 博弈 game
  { id: 'spy4', cat: 'game', name: '庙算先胜', img: 'ach/ach_spy', cond: { counter: 'agendaFoiled', n: 4 },
    t: '两强的暗棋一次次被你识破于未发——上兵伐谋。' },
  { id: 'trump2', cat: 'game', name: '落子无悔', img: 'ach/ach_trump', cond: { counter: 'trumpsPlayed', n: 2 },
    t: '大国牌不是用来收藏的——你深谙每一张王牌的分量与代价。' },
  { id: 'survive', cat: 'home', name: '砥柱中流', img: 'ach/ach_survive', cond: { survived: true },
    t: '五十二年惊涛骇浪，四项国基无一倾覆——活下来，本身就是史诗。' },
];

// 类别名
window.ACH_CATS = { mil: '军事', dip: '外交', eco: '经济', tech: '科技', unity: '统一', home: '内政', game: '博弈' };

// 建国小作文：按成就类别与国力对照2002年史实中国
window.buildEssay = function (earned, st, ending) {
  const cats = {};
  earned.forEach(a => { cats[a.cat] = (cats[a.cat] || 0) + 1; });
  const r = st.res, has = f => st.flags.includes(f);
  const p = [];

  // 开篇（按结局）
  const open = {
    reunion: '二〇〇二年的钟声敲响时，你缔造的是一个完成了世纪和解的国家。',
    golden: '二〇〇二年的钟声敲响时，你缔造的是一个比历史更从容的国家。',
    hide_shine: '二〇〇二年的钟声敲响时，你缔造的是一个沿着史实轨道稳步前行的国家。',
    burden: '二〇〇二年的钟声敲响时，你缔造的是一个带伤入场、负重前行的国家。',
    nonaligned: '二〇〇二年的钟声敲响时，你缔造的是一个把第三条路走成大道的国家。',
    iron_east: '二〇〇二年的钟声敲响时，你缔造的是一个以剑为犁、令人生畏的国家。',
    red_fortress: '二〇〇二年的钟声敲响时，你缔造的是一面拒绝降下的红旗。',
    drift: '二〇〇二年的钟声敲响时，你缔造的是一个仍在江心徘徊的国家。',
  };
  if (ending.kind === 'collapse') p.push('棋至中盘，大厦已倾。但即便这段戛然而止的国运里，也留下了值得记取的落子。');
  else p.push(open[ending.id] || open.drift);

  // 维度段
  const seg = [];
  if ((cats.mil || 0) + (cats.tech || 0) >= 2) seg.push('它的军队与国防工业令四邻侧目');
  else if (r.MIL < 40) seg.push('它的国防单薄得让边境线不安');
  if ((cats.eco || 0) >= 2) seg.push('它的工厂与港口昼夜不息');
  else if (r.ECO < 40) seg.push('它的经济仍在温饱线上挣扎');
  if ((cats.dip || 0) >= 3) seg.push('它的使节在五大洲都有座位');
  else if (r.DIP < 40) seg.push('它在国际场合的声音微弱');
  if (r.STB >= 60) seg.push('它的社会安定而有生气');
  else if (r.STB < 40) seg.push('它的内部仍有未愈的裂痕');
  if (seg.length) p.push(seg.join('；') + '。');

  // 与2002年史实对照（基准：经济62/军事52/外交62/稳定62，入世、港澳回归、两岸僵持）
  const cmp = [];
  const diff = (v, base, name, upper, lower) => {
    if (v >= base + 12) cmp.push(name + upper);
    else if (v <= base - 12) cmp.push(name + lower);
  };
  diff(r.ECO, 62, '经济', '远比史实中国强健', '落后于史实中国');
  diff(r.MIL, 52, '军力', '超出史实中国一个身位', '弱于史实同期');
  diff(r.DIP, 62, '国际地位', '高于史实中国', '不及史实中国');
  diff(r.STB, 62, '社会稳定', '优于史实中国', '逊于史实中国');
  if (has('wto') === false) cmp.push('史实中国已在2001年入世，而你的国家仍在门外');
  if (!has('hk_return')) cmp.push('史实中国已收回香港，而你的棋盘上明珠仍悬');
  if (st.rel.tw >= 5) cmp.push('两岸关系远好于史实的对峙僵局');
  p.push(cmp.length ? '与真实的2002年中国相比：' + cmp.join('；') + '。' : '总体而言，这个国家与真实的2002年中国走到了相近的位置——历史的重量，你亲手掂过了。');

  // 收束
  p.push('这盘五十二年的棋，共落下' + earned.length + '枚可载入史册的棋子。');
  return p;
};
