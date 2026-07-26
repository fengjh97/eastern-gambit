// 第三幕 · 严峻岁月 1966–1976
window.ACT_DATA = window.ACT_DATA || {};
window.ACT_DATA[3] = {
  meta: { act: 3, title: '严峻岁月', years: '1966–1976', turns: 7, img: 'act3',
    intro: '一九六六年夏，一张大字报点燃全国。革命吞噬秩序，外交陷于孤立，北疆陈兵百万，核阴云压城。然而至暗时刻里，小球转动了大球，棋盘另一端伸来了意想不到的手。熬过严峻岁月，才等得到破局的黎明。' },

  turnZero: [
    { name: '文革烈度', desc: '这场"触及灵魂的大革命"，将以何等烈度席卷全国？',
      mod: [{ flag: 'lushan_purge', delta: -1 }, { flag: 'antirightist_wide', delta: -1 }],
      outcomes: [
        { range: [1, 2], desc: '全面内乱：武斗蔓延各省，工厂停产，驻外使节几乎尽数召回。', fx: { res: { STB: -12, ECO: -8, DIP: -6 }, flags: ['cr_chaos'] } },
        { range: [3, 4], desc: '按史实轨道：运动席卷全国，秩序与生产严重受损。', fx: { res: { STB: -8, ECO: -5, DIP: -4 } } },
        { range: [5, 6], desc: '冲击相对可控：军队与老干部勉力维持住了基本盘。', fx: { res: { STB: -5, ECO: -3 }, flags: ['cr_limited'] } },
      ] },
    { name: '北方百万大军', desc: '中苏交恶之后，莫斯科在边境线上压上了多少筹码？',
      mod: [{ flag: 'split_total', delta: -2 }, { flag: 'split_managed', delta: -1 }, { flag: 'split_avoided', delta: 2 }],
      outcomes: [
        { range: [1, 2], desc: '核威胁阴云：苏军百万陈兵，导弹阴影笼罩北方各城。', fx: { res: { MIL: -3, STB: -2 }, rel: { ussr: -2 }, flags: ['sov_threat'] } },
        { range: [3, 4], desc: '按史实轨道：边境重兵对峙，摩擦时有发生。', fx: { res: { MIL: -1 }, rel: { ussr: -1 } } },
        { range: [5, 6], desc: '边境相对平静：对峙仍在，火药味稍淡。', fx: {} },
      ] },
  ],

  finale: {
    title: '尼克松访华窗口', year: 1972, img: 'finale3',
    desc: '一九七二年二月，"空军一号"降落北京。华盛顿要从越南泥潭脱身、借中国制衡莫斯科；北京要打破孤立、解除北方百万大军之忧。冷战棋盘上，两个宿敌的战略需求第一次交汇。这扇窗，开与不开？',
    choices: [
      { label: '抓住窗口', desc: '跨越太平洋的握手。会谈桌上，台湾问题是绕不开的硬骨头。', reqRel: { us: -4 },
        roll: { ge: 3,
          ok: { desc: '《上海公报》签订，"只有一个中国"写入文本，世界格局为之一变。', fx: { rel: { us: 4, jp: 2 }, res: { DIP: 8 }, flags: ['nixon_ok'] } },
          bad: { desc: '会谈成果有限，公报措辞含糊，但坚冰已经打破。', fx: { rel: { us: 2 }, res: { DIP: 4 }, flags: ['nixon_ok'] } } } },
      { label: '有限接触', desc: '见面可以，深交不必。只谈反霸，不谈其他。',
        fx: { rel: { us: 2 }, res: { DIP: 3 }, flags: ['nixon_cold'] } },
      { label: '拒之门外', desc: '革命外交优先，不与帝国主义头子握手。孤立仍将继续。',
        fx: { res: { DIP: -3, STB: 2 }, flags: ['nixon_missed'] } },
    ],
  },

  cards: [
    { id: 'a3_01', name: '文化大革命全面发动', year: 1966, type: 'event', ap: 3, tag: 'home', img: 'crisis', once: true,
      flavor: '五一六通知下达，一张大字报贴上高墙，八次接见红卫兵的声浪席卷全国。',
      event: { desc: '"天下大乱"开始了。狂潮无可阻挡，但驾驭方式仍在你手中。',
        choices: [
          { label: '因势利导', desc: '把运动的狂热导入路线与权威的巩固——意识形态空前统一，秩序与生产为之让路。', fx: { res: { STB: 2, ECO: -4, DIP: -3 } } },
          { label: '勉力约束', desc: '抓革命、促生产，军队和老干部尽力兜住基本盘，两头都不讨好。', fx: { res: { STB: -4, ECO: -1 } } },
        ] } },

    { id: 'a3_02', name: '红卫兵与破四旧', year: 1966, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '大串联的列车挤满全国，抄家的火光里，文物与人一同蒙难。',
      event: { desc: '狂潮已起，是放任还是约束？',
        choices: [
          { label: '放任狂潮', desc: '革命无罪，造反有理。动员的狂热巩固权威，代价由整个社会承担。', fx: { res: { STB: 2, DIP: -3, ECO: -2 } } },
          { label: '军队保护文物与干部', desc: '顶着风头下达保护名单，故宫关门，老干部转移。', fx: { res: { STB: -1, DIP: 1 }, flags: ['cadres_protected'] } },
        ] } },

    { id: 'a3_03', name: '火烧英国代办处', year: 1967, type: 'crisis', ap: 2, tag: 'uk', img: 'crisis', once: true,
      flavor: '八月二十二日夜，造反派翻墙纵火，外交官从火场中被拖出殴打。',
      event: { desc: '外交底线被践踏，伦敦震怒。如何收场？',
        choices: [
          { label: '道歉善后', desc: '承认错误，赔偿修复，约束极左外交。', roll: { ge: 3,
            ok: { desc: '善后得体，风波渐平，损失被控制住。', fx: { rel: { uk: -2 }, res: { DIP: -1 } } },
            bad: { desc: '伦敦不接受轻描淡写的解释，关系深度受损。', fx: { rel: { uk: -3 }, res: { DIP: -2 } } } } },
          { label: '强硬到底', desc: '"革命行动"不容指责。西方舆论一片哗然。', fx: { rel: { uk: -5 }, res: { DIP: -3, STB: 1 } } },
        ] },
      weakened: { desc: '排外风潮冲击各国使馆，外交声誉受损。', fx: { rel: { uk: -2, eu: -1 }, res: { DIP: -2 } } } },

    { id: 'a3_04', name: '外交系统瘫痪', year: 1967, type: 'event', ap: 2, tag: 'world', img: 'crisis', once: true,
      flavor: '外交部被夺权，驻外大使仅余一人在任，照会写成了檄文。',
      event: { desc: '国际地位-4，英国、欧洲、日本、东南亚各-1。', fx: { res: { DIP: -4 }, rel: { uk: -1, eu: -1, jp: -1, sea: -1 } } } },

    { id: 'a3_05', name: '武汉七二〇事件', year: 1967, type: 'crisis', ap: 2, tag: 'home', img: 'crisis', once: true,
      flavor: '"百万雄师"冲进东湖宾馆，中央代表被扣，长江边武斗枪声不绝。',
      event: { desc: '地方失控，军队卷入派性。如何处置？',
        choices: [
          { label: '中央强力介入', desc: '调兵压阵，收缴枪械，重立权威。', roll: { ge: 3,
            ok: { desc: '局面被控制，武汉恢复秩序。', fx: { res: { STB: -1 } } },
            bad: { desc: '武斗蔓延长江沿线，军队威信受损。', fx: { res: { STB: -4, MIL: -1 } } } } },
          { label: '就地安抚妥协', desc: '各打五十大板，息事宁人，隐患未除。', fx: { res: { STB: -2, MIL: -2 } } },
        ] },
      weakened: { desc: '武斗枪声不断，地方陷入失序。', fx: { res: { STB: -3 } } } },

    { id: 'a3_06', name: '知识青年上山下乡', year: 1968, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '"农村是一个广阔的天地。"一千六百万青年背起行囊离开城市。',
      event: { desc: '城市就业压力与红卫兵狂潮，一并转移向农村。',
        choices: [
          { label: '大规模推行', desc: '整建制下乡，城市迅速安静下来，一代人的学业就此中断。', fx: { res: { STB: 3, ECO: -2 } } },
          { label: '控制规模', desc: '部分下乡、部分安排就业升学，为将来留一点元气。', fx: { res: { STB: 1, ECO: 1 } } },
        ] } },

    { id: 'a3_07', name: '珍宝岛冲突', year: 1969, type: 'crisis', ap: 3, tag: 'ussr', img: 'military', once: true,
      flavor: '三月的乌苏里江冰面上，两个社会主义大国的士兵开火了。',
      event: { desc: '苏军装甲车碾过界江，边境战火一触即发。',
        choices: [
          { label: '坚决反击', desc: '寸土不让，打出军威国威。', roll: { ge: 3,
            ok: { desc: '自卫反击得手，缴获T-62坦克，举国振奋。', fx: { res: { MIL: 4, DIP: 2, STB: 2 }, rel: { ussr: -3 }, flags: ['zhenbao'] } },
            bad: { desc: '战斗胶着伤亡不小，边境全线吃紧。', fx: { res: { MIL: 1, STB: -1, ECO: -2 }, rel: { ussr: -3 }, flags: ['zhenbao'] } } } },
          { label: '克制周旋', desc: '外交抗议为主，避免边境战争扩大。', fx: { rel: { ussr: -1 }, res: { STB: -2 } } },
        ] },
      weakened: { desc: '边境摩擦不断，北疆压力剧增。', fx: { res: { STB: -2 }, rel: { ussr: -2 } } } },

    { id: 'a3_08', name: '核威胁与"深挖洞"', year: 1969, type: 'crisis', ap: 3, tag: 'ussr', img: 'crisis', once: true, requires: ['sov_threat'],
      flavor: '莫斯科放风"外科手术式核打击"，北京的地下，防空洞连夜开挖。',
      event: { desc: '核讹诈当前，"深挖洞、广积粮、不称霸"。',
        choices: [
          { label: '全民备战', desc: '疏散城市、三线建设、全民挖洞。安全感用经济换。', fx: { res: { MIL: 4, STB: 2, ECO: -5 } } },
          { label: '外交斡旋', desc: '借柯西金过境之机，机场会谈摸清底线。', roll: { ge: 4,
            ok: { desc: '机场会谈达成默契，边境谈判开启，核阴云消散大半。', fx: { rel: { ussr: 1 }, res: { DIP: 2, STB: 1 } } },
            bad: { desc: '会谈无果，威胁阴云不散，人心惶惶。', fx: { res: { STB: -2 }, rel: { ussr: -1 } } } } },
        ] },
      weakened: { desc: '核阴云压城，恐慌情绪蔓延。', fx: { res: { STB: -3, ECO: -1 } } } },

    { id: 'a3_09', name: '林彪事件', year: 1971, type: 'crisis', ap: 3, tag: 'home', img: 'crisis', once: true,
      flavor: '九一三凌晨，三叉戟坠毁在温都尔汗草原，"亲密战友"成了叛逃者。',
      event: { desc: '副统帅折戟沙漠，信仰的地基被震出裂缝。稳定-6，军事-2，国际地位-2。',
        fx: { res: { STB: -6, MIL: -2, DIP: -2 } } },
      weakened: { desc: '副统帅出逃的传闻四处流传，人心剧震。', fx: { res: { STB: -4, DIP: -1 } } } },

    { id: 'a3_10', priority: true, name: '乒乓外交', year: 1971, type: 'boon', ap: 2, tag: 'us', img: 'boon', once: true,
      flavor: '小球转动了大球。美国乒乓球队跨过罗湖桥，世界屏息。',
      event: { desc: '美国+2，国际地位+3，获得旗标"乒乓外交"。', fx: { rel: { us: 2 }, res: { DIP: 3 }, flags: ['pingpong'] } } },

    { id: 'a3_11', name: '基辛格秘密访华', year: 1971, type: 'event', ap: 2, tag: 'us', img: 'diplomacy', once: true, requires: ['pingpong'],
      flavor: '"肚子疼"的国家安全顾问从巴基斯坦消失了四十八小时。',
      event: { desc: '波罗行动：美国+2，国际地位+2，获得旗标"基辛格"。', fx: { rel: { us: 2 }, res: { DIP: 2 }, flags: ['kissinger'] } } },

    { id: 'a3_12', priority: true, name: '联合国恢复席位', year: 1971, type: 'event', ap: 3, tag: 'world', img: 'world', once: true,
      flavor: '"是非洲兄弟把我们抬进了联合国。"乔冠华仰头大笑。',
      event: { desc: '第2758号决议表决在即，第三世界纷纷抬轿。', roll: { ge: 2,
        ok: { desc: '七十六票赞成，压倒性通过，台北代表退场。', fx: { res: { DIP: 8 }, rel: { tw: -1 }, flags: ['un_seat'] } },
        bad: { desc: '阿尔巴尼亚提案惊险过关，斗争激烈，胜得艰难。', fx: { res: { DIP: 5 }, rel: { tw: -1 }, flags: ['un_seat'] } } } } },

    { id: 'a3_13', name: '中日邦交正常化', year: 1972, type: 'event', ap: 3, tag: 'jp', img: 'diplomacy', once: true, reqRel: { jp: -2 },
      flavor: '"言必信，行必果。"中日联合声明在北京落笔，一衣带水恩仇暂放。',
      event: { desc: '日本+4，经济+3，国际地位+3，获得旗标"中日建交"。', fx: { rel: { jp: 4 }, res: { ECO: 3, DIP: 3 }, flags: ['jp_normal'] } } },

    { id: 'a3_14', name: '田中角荣访华', year: 1972, type: 'boon', ap: 2, tag: 'jp', img: 'boon', once: true, requires: ['jp_normal'],
      flavor: '茅台酒与"添了麻烦"的措辞之争，都成了历史的注脚。',
      event: { desc: '日本+2，经济+2。', fx: { rel: { jp: 2 }, res: { ECO: 2 } } } },

    { id: 'a3_15', name: '中美互设联络处', year: 1973, type: 'event', ap: 2, tag: 'us', img: 'diplomacy', once: true, requires: ['nixon_ok'],
      flavor: '没有邦交的"准大使馆"，在华盛顿和北京同时挂牌。',
      event: { desc: '美国+2，国际地位+1。', fx: { rel: { us: 2 }, res: { DIP: 1 } } } },

    { id: 'a3_16', name: '西沙海战', year: 1974, type: 'crisis', ap: 2, tag: 'sea', img: 'military', once: true,
      flavor: '南越军舰闯入永乐群岛，猎猎风帆之下，炮口已经互相瞄准。',
      event: { desc: '西沙告急，舰队规模不如对手。战，还是让？',
        choices: [
          { label: '坚决收复', desc: '以小艇搏巨舰，一举收复三岛。', fx: { res: { MIL: 3, DIP: 1 }, rel: { sea: -1 }, flags: ['xisha'] } },
          { label: '避战退让', desc: '避免冲突扩大，岛礁易手，军心受挫。', fx: { res: { MIL: -2, DIP: -2 } } },
        ] },
      weakened: { desc: '南越舰艇在西沙海域反复袭扰。', fx: { res: { DIP: -1 }, rel: { sea: -1 } } } },

    { id: 'a3_17', name: '东方红一号', year: 1970, type: 'event', ap: 3, tag: 'home', img: 'military', once: true, requires: ['qian'],
      flavor: '《东方红》乐曲从三百公里高空传来，全世界都听见了。',
      event: { desc: '第五个把卫星送上天的国家。国际地位+4，军事+2，获得旗标"卫星上天"。',
        fx: { res: { DIP: 4, MIL: 2 }, flags: ['satellite'] } } },

    { id: 'a3_18', name: '氢弹试爆成功', year: 1967, type: 'event', ap: 3, tag: 'home', img: 'military', once: true, requires: ['bomb'],
      flavor: '从原子弹到氢弹，美国用了七年，中国只用了两年八个月。',
      event: { desc: '军事+5，国际地位+3。', fx: { res: { MIL: 5, DIP: 3 } } } },

    { id: 'a3_19', name: '核潜艇下水', year: 1970, type: 'event', ap: 2, tag: 'home', img: 'military', once: true, requires: ['bomb'],
      flavor: '"核潜艇，一万年也要搞出来。"长征一号悄然入水。',
      event: { desc: '军事+3，经济-2。', fx: { res: { MIL: 3, ECO: -2 } } } },

    { id: 'a3_20', name: '批林批孔', year: 1974, type: 'event', ap: 1, tag: 'home', img: 'home', once: true,
      flavor: '运动的矛头指向两千年前的古人，也指向近在咫尺的今人。',
      event: { desc: '运动再起，是顺势推动还是低调冷置？',
        choices: [
          { label: '顺势推动', desc: '再度统一思想口径，路线权威得到重申，生产秩序再受搅动。', fx: { res: { STB: 2, ECO: -3 } } },
          { label: '低调冷置', desc: '文件照转、大会少开，把精力留给国民经济。', fx: { res: { STB: -1, ECO: 1 } } },
        ] } },

    { id: 'a3_21', name: '四届人大与四个现代化', year: 1975, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true,
      flavor: '重病中的总理重申四个现代化宏图，掌声经久不息。',
      event: { desc: '经济+3，稳定+3，获得旗标"四个现代化"。', fx: { res: { ECO: 3, STB: 3 }, flags: ['four_mod'] } } },

    { id: 'a3_22', name: '邓小平复出与全面整顿', year: 1975, type: 'event', ap: 3, tag: 'home', img: 'home', once: true,
      flavor: '"人才难得。"铁路要先行，钢铁要上去，军队要整顿。',
      event: { desc: '整顿初见成效，风向却在收紧。押注哪边？',
        choices: [
          { label: '支持整顿', desc: '放手让他干，把国民经济从崩溃边缘拉回来。', fx: { res: { ECO: 4, STB: 2 }, flags: ['deng_back'] } },
          { label: '再次打倒', desc: '"翻案不得人心"。整顿中断，人心离散。', fx: { res: { STB: -3 }, flags: ['deng_down'] } },
        ] } },

    { id: 'a3_23', name: '总理逝世与四五运动', year: 1976, type: 'crisis', ap: 2, tag: 'home', img: 'crisis', once: true,
      flavor: '十里长街送总理。清明时节，悼念的花圈与诗抄铺满广场。',
      event: { desc: '悼念的人潮聚在天安门，矛头暗指当权者。如何应对？',
        choices: [
          { label: '定性反革命事件', desc: '连夜清场，秩序当即恢复——广场安静了，人心的账留到日后再算。', fx: { res: { STB: 2, DIP: -2 } } },
          { label: '克制处理', desc: '不定性、不扩大，让悼念自然落幕。', roll: { ge: 3,
            ok: { desc: '人潮自然散去，民心未再受创。', fx: { res: { STB: -1 } } },
            bad: { desc: '强行清场仍难避免，怨愤郁积于野。', fx: { res: { STB: -3 } } } } },
        ] },
      weakened: { desc: '巨星陨落，举国哀恸，政局暗流涌动。', fx: { res: { STB: -3 } } } },

    { id: 'a3_24', name: '唐山大地震', year: 1976, type: 'crisis', ap: 3, tag: 'home', img: 'crisis', once: true,
      flavor: '七月二十八日凌晨三点四十二分，一座百万人口的城市在二十三秒内被夷平。',
      event: { desc: '二十四万人罹难。国际社会表示愿意驰援。',
        choices: [
          { label: '拒绝国际援助', desc: '自力更生，十万解放军徒手刨进废墟。', fx: { res: { STB: -3, ECO: -5, DIP: -2 } } },
          { label: '接受外部援助', desc: '打开国门接受援助，打破惯例。', fx: { res: { STB: -4, ECO: -5, DIP: 2 }, rel: { uk: 1, eu: 1, jp: 1 } } },
        ] },
      weakened: { desc: '华北大地满目疮痍，救灾迟缓民怨积聚。', fx: { res: { STB: -4, ECO: -4 } } } },

    { id: 'a3_25', name: '毛泽东逝世', year: 1976, type: 'event', ap: 3, tag: 'home', img: 'crisis', once: true,
      flavor: '九月九日，广播里响起哀乐，八亿人屏住了呼吸。',
      event: { desc: '一个时代落幕，权力的真空令各方屏息。稳定-5，国际地位-1。', fx: { res: { STB: -5, DIP: -1 } } } },

    { id: 'a3_26', name: '粉碎四人帮', year: 1976, type: 'boon', ap: 3, tag: 'home', img: 'boon', once: true,
      flavor: '怀仁堂尘埃落定。街头巷尾，螃蟹卖到脱销——三公一母。',
      event: { desc: '十年动乱落幕。稳定+6，获得旗标"粉碎四人帮"。', fx: { res: { STB: 6 }, flags: ['gang_smashed'] } } },

    { id: 'a3_27', name: '杂交水稻', year: 1973, type: 'boon', ap: 1, tag: 'home', img: 'boon', once: true,
      flavor: '袁隆平在海南寻到那株"野败"，中国人的饭碗从此多了底气。',
      event: { desc: '经济+3。', fx: { res: { ECO: 3 } } } },

    { id: 'a3_28', name: '坦赞铁路', year: 1970, type: 'event', ap: 2, tag: 'world', img: 'world', once: true,
      flavor: '五万建设者远赴东非，一千八百六十公里钢轨穿过草原与山谷。',
      event: { desc: '勒紧裤带的对外援助，换来第三世界的人心。国际地位+3，经济-2。', fx: { res: { DIP: 3, ECO: -2 } } } },

    { id: 'a3_29', name: '中英升格大使级', year: 1972, type: 'event', ap: 1, tag: 'uk', img: 'diplomacy', once: true,
      flavor: '代办处纵火的旧账翻过，伦敦与北京互换大使。',
      event: { desc: '英国+2，国际地位+1。', fx: { rel: { uk: 2 }, res: { DIP: 1 } } } },

    { id: 'a3_30', name: '西哈努克流亡北京', year: 1970, type: 'event', ap: 1, tag: 'sea', img: 'diplomacy', once: true,
      flavor: '朗诺政变后，亲王在东交民巷组建流亡政府，一住五年。',
      event: { desc: '东南亚+1，国际地位+1。', fx: { rel: { sea: 1 }, res: { DIP: 1 } } } },

    { id: 'a3_31', name: '援越抗美高峰', year: 1968, type: 'event', ap: 2, tag: 'sea', img: 'military', once: true, requires: ['vietnam_aid'],
      flavor: '三十二万防空与工程部队先后入越，胡志明小道昼夜不息。',
      event: { desc: '东南亚+2，朝鲜+1，国际地位+1，经济-3。', fx: { rel: { sea: 2, nk: 1 }, res: { DIP: 1, ECO: -3 } } } },

    { id: 'a3_32', name: '巴黎协定后的印支', year: 1973, type: 'event', ap: 2, tag: 'sea', img: 'diplomacy', once: true,
      flavor: '美军撤出越南，印度支那的棋局并未终盘，只是换了下法。',
      event: { desc: '后美国时代的印支，援助路线如何摆？',
        choices: [
          { label: '继续输出支援', desc: '将革命进行到底，援助管道不停。', fx: { rel: { sea: 2, us: -1 }, res: { ECO: -2 } } },
          { label: '转向国家关系', desc: '收缩输出，与东南亚各国政府修好。', fx: { rel: { sea: 1 }, res: { DIP: 2 } } },
        ] } },

    { id: 'a3_33', name: '朝鲜关系升温', year: 1970, type: 'event', ap: 1, tag: 'nk', img: 'diplomacy',
      flavor: '在中苏两大邻居之间摇摆多年后，平壤又向北京靠了靠。',
      event: { desc: '朝鲜+2。', fx: { rel: { nk: 2 } } } },

    { id: 'a3_34', name: '缅甸排华风潮', year: 1967, type: 'crisis', ap: 1, tag: 'sea', img: 'crisis', once: true,
      flavor: '仰光街头，华侨学校被砸，佩戴像章成了罪名。',
      event: { desc: '排华流血事件蔓延，侨社告急。',
        choices: [
          { label: '强烈抗议施压', desc: '召回大使、断绝援助，逼仰光收手。', roll: { ge: 4,
            ok: { desc: '仰光有所收敛，侨民境遇改善。', fx: { res: { DIP: 1 }, rel: { sea: -1 } } },
            bad: { desc: '两国关系跌入冰点，侨民处境更艰。', fx: { rel: { sea: -2 }, res: { DIP: -1 } } } } },
          { label: '低调接侨', desc: '不扩大事态，组织侨民分批归国安置。', fx: { rel: { sea: -1 }, res: { STB: 1 } } },
        ] },
      weakened: { desc: '排华风潮蔓延东南亚，侨社惶惶不安。', fx: { rel: { sea: -1 }, res: { DIP: -1 } } } },

    { id: 'a3_35', name: '"两报一刊"与个人崇拜', year: 1967, type: 'event', ap: 1, tag: 'home', img: 'home',
      flavor: '社论定调一切，"最高指示"发表不过夜，连夜上街传达。',
      event: { desc: '舆论一律，崇拜登峰。稳定+1，国际地位-1。', fx: { res: { STB: 1, DIP: -1 } } } },

    { id: 'a3_36', name: '五七干校', year: 1968, type: 'event', ap: 1, tag: 'home', img: 'home',
      flavor: '部长与教授在干校同锄一垄地，"接受贫下中农再教育"。',
      event: { desc: '干部下放，机关精简。稳定+1，经济-1。', fx: { res: { STB: 1, ECO: -1 } } } },

    { id: 'a3_37', name: '赤脚医生', year: 1968, type: 'boon', ap: 1, tag: 'home', img: 'boon', once: true,
      flavor: '药箱与斗笠，一根银针一把草药，走遍田埂阡陌。',
      event: { desc: '农村合作医疗铺开，稳定+3。', fx: { res: { STB: 3 } } } },

    { id: 'a3_38', name: '青瓦台事件与半岛紧张', year: 1968, type: 'crisis', ap: 1, tag: 'sk', img: 'crisis', once: true,
      flavor: '朝鲜特工摸到青瓦台墙外，"普韦布洛"号被扣押，半岛骤然剑拔弩张。',
      event: { desc: '半岛火药桶再度冒烟，北京如何站位？',
        choices: [
          { label: '声援朝鲜', desc: '谴责美韩挑衅，力挺平壤。', fx: { rel: { nk: 2, sk: -2, us: -1 } } },
          { label: '谨慎降温', desc: '私下劝平壤适可而止，避免再开一条战线。', fx: { rel: { nk: -1 }, res: { DIP: 1 } } },
        ] },
      weakened: { desc: '半岛火药味弥漫，东北边境戒备升级。', fx: { rel: { sk: -1 }, res: { DIP: -1 } } } },

    { id: 'a3_39', name: '西欧建交潮', year: 1972, type: 'event', ap: 2, tag: 'eu', img: 'diplomacy', once: true,
      flavor: '罗马、波恩相继与北京握手，欧陆的大门次第打开。',
      event: { desc: '欧洲+3，国际地位+2。', fx: { rel: { eu: 3 }, res: { DIP: 2 } } } },

    { id: 'a3_40', name: '蒋介石去世', year: 1975, type: 'event', ap: 2, tag: 'tw', img: 'diplomacy', once: true,
      flavor: '一个时代的对手在台北去世，遗愿是灵柩暂厝、归葬故土。',
      event: { desc: '海峡对岸换了主事人，是否递出橄榄枝？',
        choices: [
          { label: '隔海释放善意', desc: '"奉化之墓庐依然"，托密使传话试探。', roll: { ge: 4,
            ok: { desc: '两岸出现微妙缓和，炮击金门渐成单打双不打的默契。', fx: { rel: { tw: 2 }, res: { DIP: 1 } } },
            bad: { desc: '台北方面无意接触，试探暂时落空。', fx: {} } } },
          { label: '静观其变', desc: '不急表态，看蒋经国往哪里走。', fx: { res: { STB: 1 } } },
        ] } },
  ],
};
