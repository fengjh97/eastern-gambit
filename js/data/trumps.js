// 历史王牌：打完之后，代价巨大
window.TRUMPS = {
  sov: {
    id: 'sov', name: '苏联牌', sub: '一边倒', img: 'trump_sov', foe: 'us',
    era: '1949 · "一边倒，就是倒向社会主义一边。"',
    unlock: null,               // 开局即持有
    deadFlag: ['split_total', 'split_managed'],  // 中苏决裂后作废
    deadText: '中苏决裂，苏联牌已成废纸。',
    gain: { desc: '苏援大注入：经济+6，军事+4，苏联+2。', fx: { res: { ECO: 6, MIL: 4 }, rel: { ussr: 2 } } },
    cost: { desc: '绑上战车：美-2 英-2 欧-2 日-2，国际地位-2；埋下"依附"——中苏决裂结算时创伤加重。',
      fx: { rel: { us: -2, uk: -2, eu: -2, jp: -2 }, res: { DIP: -2 }, flags: ['yibiandao'] } },
    aftermath: '华盛顿把中国正式划入敌对阵营，环形封锁全面收紧——这张牌落入了白宫手中。',
  },
  third: {
    id: 'third', name: '第三世界牌', sub: '万隆精神', img: 'trump_third', foe: 'both',
    era: '1955 · "求同存异" —— 亚非拉的朋友，是走出来的。',
    unlock: { any: [{ requires: ['bandung'] }, { requires: ['un_seat'] }] },
    unlockDesc: '需先打出「万隆会议」或恢复联合国席位',
    gain: { desc: '亚非拉总动员：国际地位+5，东南亚+3，朝鲜+1。', fx: { res: { DIP: 5 }, rel: { sea: 3, nk: 1 } } },
    cost: { desc: '大笔援外掏空家底：经济-4；中间道路两头受气——苏美同时警惕两回合。',
      fx: { res: { ECO: -4 } } },
    aftermath: '不结盟的旗帜刺痛了两个超级大国——莫斯科与华盛顿同时把矛头转向北京。',
  },
  us: {
    id: 'us', name: '美国牌', sub: '联美制苏', img: 'trump_us', foe: 'ussr',
    era: '1972 · 太平洋上的握手，是下给莫斯科看的一步棋。',
    unlock: { any: [{ requires: ['nixon_ok'] }, { requires: ['kissinger'] }] },
    unlockDesc: '需先促成尼克松访华或基辛格密访',
    gain: { desc: '战略缓冲+技术引进：美+3，经济+4，国际地位+2。', fx: { rel: { us: 3 }, res: { ECO: 4, DIP: 2 } } },
    cost: { desc: '莫斯科视为背叛：苏-3，军事-2（北疆重压），朝鲜-2（阵营寒心）。',
      fx: { rel: { ussr: -3, nk: -2 }, res: { MIL: -2 } } },
    aftermath: '克里姆林宫的反应比预想更烈——远东军区进入战备，这张牌落入了莫斯科手中。',
  },
};
