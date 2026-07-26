// 第五幕 · 走向世界 1990–2001（本幕起 ussr 轴代表俄罗斯）
window.ACT_DATA = window.ACT_DATA || {};
window.ACT_DATA[5] = {
  meta: { act: 5, title: '走向世界', years: '1990–2001', turns: 7, img: 'act5',
    intro: '风波之后，制裁未散；柏林墙的碎片尚未落定，克里姆林宫的红旗已经降下。有人断言中国将是下一个。答案要靠南方的春潮、市场经济的抉择，和一场十五年的入世长跑来书写。' },

  turnZero: [
    { name: '苏东剧变冲击波', desc: '一个阵营的崩塌，震波传到北京有多强？',
      mod: [{ flag: 'sino_sov_normal', delta: 1 }, { flag: 'storm_heavy', delta: -1 }],
      outcomes: [
        { range: [1, 2], desc: '信仰危机与制裁叠加，"下一个是谁"的疑问四处流传。', fx: { res: { STB: -8, DIP: -4 }, flags: ['east_shock'] } },
        { range: [3, 4], desc: '按史实轨道：震撼巨大，但阵脚未乱。', fx: { res: { STB: -5, DIP: -2 } } },
        { range: [5, 6], desc: '率先稳住阵脚，"冷静观察、稳住阵脚"的方针见效。', fx: { res: { STB: -2 }, flags: ['calm_helm'] } },
      ] },
    { name: '制裁松动速度', desc: '西方的制裁铁幕，能撬开多快？',
      mod: [{ flag: 'storm_light', delta: 2 }, { flag: 'storm_heavy', delta: -2 }, { flag: 'hk_deal', delta: 1 }],
      outcomes: [
        { range: [1, 2], desc: '制裁铁板一块，贷款与技术一律冻结。', fx: { res: { ECO: -4 }, rel: { us: -1, eu: -1, uk: -1, jp: -1 } } },
        { range: [3, 4], desc: '按史实轨道：日本率先松动，恢复对华贷款。', fx: { rel: { jp: 1 } } },
        { range: [5, 6], desc: '解冻快于预期，高层互访与信贷接连恢复。', fx: { res: { ECO: 3 }, rel: { us: 1, eu: 1, jp: 2 } } },
      ] },
  ],

  finale: {
    title: '入世谈判 2001', year: 2001, img: 'finale5',
    desc: '二〇〇一年十一月十日，多哈。从复关到入世，十五年长跑走到最后一夜：农业补贴、市场准入、特殊保障条款——木槌落下之前，签，还是不签？',
    choices: [
      { label: '达成协议', desc: '接受谈成的一揽子条件，把中国经济押上世界的轨道。', requires: ['reform'], reqRel: { us: -3 }, reqRes: { ECO: 50 },
        roll: { ge: 2,
          ok: { desc: '木槌落下，掌声雷动。中国成为世贸组织第一百四十三个成员。', fx: { res: { ECO: 8, DIP: 6 }, rel: { us: 1, eu: 1, jp: 1 }, flags: ['wto'] } },
          bad: { desc: '最后关头被附加特殊保障等苛刻条款，权衡再三，仍然签字入世。', fx: { res: { ECO: 5, DIP: 4 }, flags: ['wto', 'wto_hard'] } } } },
      { label: '拒绝苛刻条款', desc: '谈判桌上拂袖而起，木槌没有落下。', requires: ['reform'],
        fx: { res: { DIP: -3 }, flags: ['wto_fail'] } },
      { label: '根本无意加入', desc: '关起门走自力更生的路，用枪杆子和粮袋子说话。',
        fx: { res: { MIL: 3, STB: 2, DIP: -4 }, flags: ['wto_fail', 'autarky'] } },
    ],
  },

  cards: [
    { id: 'a5_01', name: '治理整顿', year: 1990, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true,
      flavor: '双紧方针下经济骤冷，"姓社姓资"的争论压住了改革脚步。',
      event: { desc: '过热之后的收与放。',
        choices: [
          { label: '坚决压缩到位', desc: '压投资、控物价，代价是增长失速。', fx: { res: { STB: 3, ECO: -2 } } },
          { label: '适时重启增长', desc: '整顿见好就收，为改革留住火种。', fx: { res: { ECO: 3, STB: -1 } } },
        ] } },

    { id: 'a5_02', name: '北京亚运会', year: 1990, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true,
      flavor: '熊猫盼盼与亚运圣火，制裁阴影下第一次向世界敞开怀抱。',
      event: { desc: '国际地位+3，稳定+2。', fx: { res: { DIP: 3, STB: 2 } } } },

    { id: 'a5_03', priority: true, name: '苏联解体', year: 1991, type: 'crisis', ap: 3, tag: 'ussr', img: 'crisis', once: true,
      flavor: '十二月二十五日，克里姆林宫红旗落地，苏联不复存在。',
      event: { desc: '七十四年的联盟一夜终结，化作十五个国家。北方巨邻换了名字，怎么办？',
        choices: [
          { label: '与俄迅速建交划界', desc: '当天承认俄罗斯继承地位，边界谈判提上日程。', fx: { rel: { ussr: 3 }, res: { DIP: 2 }, flags: ['russia_ties'] } },
          { label: '冷淡观望', desc: '与叶利钦政权保持距离，静观其变。', fx: { rel: { ussr: -1 } } },
        ] },
      weakened: { desc: '红旗落地的冲击弥漫，队伍中弥散着迷惘。', fx: { res: { STB: -4, DIP: -1 } } } },

    { id: 'a5_04', name: '东欧剧变余波', year: 1990, type: 'event', ap: 2, tag: 'world', img: 'world', once: true,
      flavor: '从柏林到布加勒斯特，一个个红色政权次第易帜。',
      event: { desc: '阵营崩塌的余震传来，北京如何自处？',
        choices: [
          { label: '冷静观察，稳住阵脚', desc: '不当头、不扛旗，埋头做自己的事。', fx: { res: { STB: 2, DIP: 1 } } },
          { label: '全面收紧防和平演变', desc: '意识形态阵地寸土不让，代价是改革降温。', fx: { res: { STB: 3, DIP: -2, ECO: -1 } } },
        ] } },

    { id: 'a5_05', priority: true, name: '邓小平南方谈话', year: 1992, type: 'boon', ap: 3, tag: 'home', img: 'boon', once: true, requires: ['reform'],
      flavor: '八十八岁老人一路南下："不坚持改革开放，只能是死路一条。"',
      event: { desc: '经济+8，稳定+3，获得旗标"南方谈话"。', fx: { res: { ECO: 8, STB: 3 }, flags: ['south_tour'] } } },

    { id: 'a5_06', name: '社会主义市场经济体制', year: 1992, type: 'event', ap: 3, tag: 'home', img: 'economy', once: true, requires: ['south_tour'],
      flavor: '十四大一锤定音，"姓社姓资"之争到此为止。',
      event: { desc: '经济+5，国际地位+2。', fx: { res: { ECO: 5, DIP: 2 } } } },

    { id: 'a5_07', name: '浦东开发开放', year: 1990, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true,
      flavor: '烂泥渡的对岸，一座新城将在陆家嘴拔地而起。',
      event: { desc: '经济+5，获得旗标"浦东"。', fx: { res: { ECO: 5 }, flags: ['pudong'] } } },

    { id: 'a5_08', name: '分税制改革', year: 1994, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true,
      flavor: '朱镕基逐省谈判，把财权重新收归中央。',
      event: { desc: '央地财政重新切分蛋糕。',
        choices: [
          { label: '一步到位', desc: '中央财力大增，地方叫苦不迭。', fx: { res: { ECO: 4, STB: -1 } } },
          { label: '缓行妥协', desc: '保留返还安排，改革打了折扣。', fx: { res: { ECO: 1 } } },
        ] } },

    { id: 'a5_09', name: '汇率并轨', year: 1994, type: 'event', ap: 1, tag: 'home', img: 'economy', once: true,
      flavor: '官方牌价与调剂价并为一轨，人民币汇率一步到位。',
      event: { desc: '经济+3。', fx: { res: { ECO: 3 } } } },

    { id: 'a5_10', name: '国企改革与下岗潮', year: 1997, type: 'crisis', ap: 3, tag: 'home', img: 'crisis', once: true,
      flavor: '"从头再来"唱遍大街小巷，数千万职工离开工厂。',
      event: { desc: '国企亏损面过半，抓大放小还是保住饭碗？',
        choices: [
          { label: '壮士断腕', desc: '三年脱困，改制分流，闯过阵痛。', roll: { ge: 4,
            ok: { desc: '国企轻装上阵，市场化改革闯关成功。', fx: { res: { ECO: 6, STB: -4 }, flags: ['soe_reform'] } },
            bad: { desc: '脱困艰难，下岗洪峰冲击社会承受线。', fx: { res: { ECO: 2, STB: -7 } } } } },
          { label: '保就业缓改', desc: '继续输血维持，把问题留给明天。', fx: { res: { ECO: -2, STB: 2 } } },
        ] },
      weakened: { desc: '亏损面扩大，职工情绪在车间里积聚。', fx: { res: { ECO: -2, STB: -2 } } } },

    { id: 'a5_11', name: '社会保障体系起步', year: 1998, type: 'event', ap: 2, tag: 'home', img: 'home', once: true, requires: ['soe_reform'],
      flavor: '"两个确保"、三条保障线，为下岗职工兜底。',
      event: { desc: '稳定+3。', fx: { res: { STB: 3 } } } },

    { id: 'a5_12', priority: true, name: '香港回归', year: 1997, type: 'event', ap: 3, tag: 'uk', img: 'diplomacy', once: true,
      flavor: '七月一日零时，米字旗降下，五星红旗在会展中心升起。',
      event: { desc: '百年香港问题迎来终章，交接的方式由前史决定。',
        choices: [
          { label: '百年梦圆，平稳交接', desc: '按联合声明如期交接，一国两制正式起航。', requires: ['hk_deal'],
            fx: { rel: { uk: 2 }, res: { DIP: 6, STB: 4, ECO: 2 }, flags: ['hk_return'] } },
          { label: '接管动荡之城', desc: '强行收回后的香港资本外逃、人心未定，善后艰难。', requires: ['hk_force'],
            fx: { res: { DIP: 2, STB: 2, ECO: -3 }, rel: { uk: -2 } } },
        ] } },

    { id: 'a5_13', name: '澳门回归', year: 1999, type: 'event', ap: 2, tag: 'eu', img: 'diplomacy', once: true,
      flavor: '十二月二十日，濠江夜色里响起《七子之歌》。',
      event: { desc: '葡萄牙管治四百余年后，澳门回到祖国。',
        choices: [
          { label: '循香港成例，莲花绽放', desc: '平稳交接顺理成章，一国两制再下一城。', requires: ['hk_return'],
            fx: { res: { DIP: 3, STB: 2 } } },
          { label: '与葡方谈判交接', desc: '没有先例可循，交接波澜不惊但成色稍逊。',
            fx: { res: { DIP: 2, STB: 1 } } },
        ] } },

    { id: 'a5_14', name: '亚洲金融风暴', year: 1997, type: 'crisis', ap: 3, tag: 'sea', img: 'crisis', once: true,
      flavor: '从泰铢失守到汉城求援，索罗斯们的火烧遍东亚。',
      event: { desc: '风暴逼近国门，人民币贬不贬？',
        choices: [
          { label: '人民币不贬值，援港击退炒家', desc: '扛住出口压力，与国际炒家在香港决战。', roll: { ge: 3,
            ok: { desc: '金管局血战获胜，"负责任大国"声誉鹊起。', fx: { res: { DIP: 5, ECO: -3 }, rel: { sea: 3 }, flags: ['rmb_hold'] } },
            bad: { desc: '守住了汇率，但出口重挫，代价惨重。', fx: { res: { ECO: -6, DIP: 2 } } } } },
          { label: '随行贬值自保', desc: '跟着贬值保出口，邻国的怨气记在账上。', fx: { res: { ECO: 2, DIP: -3 }, rel: { sea: -3 } } },
        ] },
      weakened: { desc: '风暴波及出口与外资，周边一片风声鹤唳。', fx: { res: { ECO: -3 }, rel: { sea: -1 } } } },

    { id: 'a5_15', name: '银河号事件', year: 1993, type: 'crisis', ap: 2, tag: 'us', img: 'crisis', once: true,
      flavor: '美方指控货轮载有化武原料，公海上强行逼停三十三天。',
      event: { desc: '"银河号"漂在印度洋上，断水断油。',
        choices: [
          { label: '忍辱接受检查', desc: '第三方登船查验，一无所获，屈辱铭记在心。', fx: { res: { DIP: -3 }, rel: { us: -1 }, flags: ['yinhe'] } },
          { label: '强硬对峙', desc: '拒绝检查，公海僵持到底。', roll: { ge: 5,
            ok: { desc: '僵持数周后美方悄然退场，硬气赢得一分。', fx: { res: { DIP: 2 }, rel: { us: -2 } } },
            bad: { desc: '补给断绝被迫受检，处境更为被动。', fx: { res: { DIP: -4, ECO: -1 }, rel: { us: -2 } } } } },
        ] },
      weakened: { desc: '公海拦截事件发酵，弱国无外交的刺痛蔓延。', fx: { res: { DIP: -2, STB: -1 } } } },

    { id: 'a5_16', name: '台海导弹危机', year: 1995, type: 'crisis', ap: 3, tag: 'tw', img: 'military', once: true,
      flavor: '李登辉访美康奈尔，导弹落进海峡两端的靶区。',
      event: { desc: '"两国论"苗头初现，武吓还是冷处理？',
        choices: [
          { label: '大规模军演威慑', desc: '导弹试射、三军演习，把底线画在海上。', roll: { ge: 4,
            ok: { desc: '威慑奏效，"台独"势头受挫，代价是外部警惕。', fx: { rel: { tw: -2, us: -2 }, res: { MIL: 3, DIP: -1 } } },
            bad: { desc: '两艘美国航母开进海峡，威慑被反威慑压过。', fx: { rel: { tw: -3, us: -3 }, res: { DIP: -3 }, flags: ['carrier_96'] } } } },
          { label: '克制抗议', desc: '外交交涉为主，军事按兵不动，内部难免不满。', fx: { rel: { tw: -1 }, res: { DIP: -1, STB: -2 } } },
        ] },
      weakened: { desc: '海峡阴云不散，美台军事联系升温。', fx: { rel: { tw: -2, us: -1 } } } },

    { id: 'a5_17', name: '炸馆事件', year: 1999, type: 'crisis', ap: 3, tag: 'us', img: 'crisis', once: true,
      flavor: '五枚导弹击中中国驻南联盟使馆，三名记者殉职。',
      event: { desc: '北约的"误炸"解释无人相信，举国悲愤，如何回应？',
        choices: [
          { label: '强烈抗议，暂停军控对话', desc: '中止两军交流与军控磋商，民气可用。', fx: { rel: { us: -3 }, res: { STB: 3, DIP: 1 }, flags: ['embassy'] } },
          { label: '要求道歉赔偿后翻篇', desc: '拿到道歉与赔偿，把大局放在愤怒前面。', fx: { rel: { us: -1 }, res: { DIP: 1 } } },
        ] },
      weakened: { desc: '悲愤无处安放，使馆前的人潮迟迟不散。', fx: { rel: { us: -2 }, res: { STB: -2 } } } },

    { id: 'a5_18', name: '中美撞机事件', year: 2001, type: 'crisis', ap: 2, tag: 'us', img: 'crisis', once: true,
      flavor: '南海上空王伟坠海，美军EP-3侦察机迫降陵水机场。',
      event: { desc: '侦察机停在中国机场，二十四名机组人员在手上。',
        choices: [
          { label: '扣机检查，要求道歉', desc: '拆解研究，逼美方低头。', roll: { ge: 3,
            ok: { desc: '美方递交"两个遗憾"信函，飞机拆件运回。', fx: { rel: { us: -2 }, res: { MIL: 2, DIP: 1 } } },
            bad: { desc: '僵持发酵，对抗螺旋抬头。', fx: { rel: { us: -3 }, res: { DIP: -2 } } } } },
          { label: '快速放人放机', desc: '低调收场，为大局让路。', fx: { rel: { us: 1 }, res: { DIP: -1 } } },
        ] },
      weakened: { desc: '侦察机仍在家门口盘旋，摩擦随时再起。', fx: { rel: { us: -1 }, res: { DIP: -1 } } } },

    { id: 'a5_19', name: '最惠国待遇年审', year: 1994, type: 'crisis', ap: 2, tag: 'us', img: 'crisis', once: false,
      flavor: '每年六月，国会山都要就对华最惠国待遇吵上一轮。',
      event: { desc: '贸易地位年年过堂，人权条款年年挂钩。',
        choices: [
          { label: '全方位游说', desc: '动员商界与侨界，把经贸和政治脱钩。', roll: { ge: 3,
            ok: { desc: '延长案过关，贸易通道保住。', fx: { res: { ECO: 3 }, rel: { us: 1 } } },
            bad: { desc: '勉强过关，附加条件的杂音不断。', fx: { res: { ECO: 1, DIP: -1 } } } } },
          { label: '以市场反制', desc: '让波音与农场主替你游说，硬碰硬。', fx: { res: { ECO: 2 }, rel: { us: -1 } } },
        ] },
      weakened: { desc: '年审悬而未决，外商合同压着不签。', fx: { res: { ECO: -2 } } } },

    { id: 'a5_20', name: '克林顿访华', year: 1998, type: 'boon', ap: 2, tag: 'us', img: 'boon', once: true, reqRel: { us: 1 },
      flavor: '九天访问，从兵马俑到北大讲台，"建设性战略伙伴"写入公报。',
      event: { desc: '美国+2，国际地位+3。', fx: { rel: { us: 2 }, res: { DIP: 3 } } } },

    { id: 'a5_21', name: '朱镕基访美', year: 1999, type: 'event', ap: 2, tag: 'us', img: 'diplomacy', once: true,
      flavor: '"消消气之旅"，把入世清单直接摆上白宫的桌面。',
      event: { desc: '用市场开放换入世支持，赌注不小。',
        choices: [
          { label: '让利换入世', desc: '抛出大幅度开放清单，逼华盛顿表态。', roll: { ge: 3,
            ok: { desc: '协议虽未当场签成，入世谈判框架就此奠定。', fx: { rel: { us: 2 }, res: { DIP: 2, ECO: 1 } } },
            bad: { desc: '白宫临阵变卦，让步清单被单方面公开，国内哗然。', fx: { rel: { us: -1 }, res: { DIP: -2, STB: -1 } } } } },
          { label: '守住底线不让', desc: '寒暄而归，谈判原地踏步。', fx: { res: { DIP: -1 } } },
        ] } },

    { id: 'a5_22', name: '复关谈判受挫', year: 1994, type: 'event', ap: 2, tag: 'world', img: 'diplomacy', once: true,
      flavor: '年底复关的最后冲刺功亏一篑，长跑还要继续。',
      event: { desc: '国际地位-2，获得旗标"复关受挫"。', fx: { res: { DIP: -2 }, flags: ['gatt_setback'] } } },

    { id: 'a5_23', name: '中俄战略协作伙伴', year: 1996, type: 'event', ap: 2, tag: 'ussr', img: 'diplomacy', once: true, requires: ['russia_ties'],
      flavor: '从建设性伙伴到战略协作，两个大国背靠背取暖。',
      event: { desc: '俄罗斯+3，军事+2（苏式装备与技术重开闸门）。', fx: { rel: { ussr: 3 }, res: { MIL: 2 } } } },

    { id: 'a5_24', name: '上海五国与上合组织', year: 2001, type: 'event', ap: 2, tag: 'ussr', img: 'diplomacy', once: true, requires: ['russia_ties'],
      flavor: '从边境裁军谈起，"上海精神"写进新世纪第一个区域组织。',
      event: { desc: '国际地位+4，俄罗斯+2。', fx: { res: { DIP: 4 }, rel: { ussr: 2 } } } },

    { id: 'a5_25', name: '中韩建交', year: 1992, type: 'event', ap: 3, tag: 'sk', img: 'diplomacy', once: true,
      flavor: '汉城与北京握手，平壤的不满写在脸上。',
      event: { desc: '韩国+5，经济+3，国际地位+2，朝鲜-3。', fx: { rel: { sk: 5, nk: -3 }, res: { ECO: 3, DIP: 2 }, flags: ['sk_ties'] } } },

    { id: 'a5_26', name: '朝鲜半岛核危机', year: 1994, type: 'crisis', ap: 2, tag: 'nk', img: 'crisis', once: true,
      flavor: '宁边的核反应堆，让半岛走到战争边缘。',
      event: { desc: '美国研究打击方案，平壤扬言"汉城火海"。',
        choices: [
          { label: '斡旋促成框架协议', desc: '劝和促谈，把危机拉回谈判桌。', fx: { res: { DIP: 4 }, rel: { nk: -1, us: 1 } } },
          { label: '力挺朝鲜', desc: '公开为平壤站台，阵营旧谊压倒一切。', fx: { rel: { nk: 3, us: -2, sk: -2 } } },
        ] },
      weakened: { desc: '半岛战云密布，东北边境风声骤紧。', fx: { res: { STB: -2, DIP: -1 } } } },

    { id: 'a5_27', name: '金日成逝世', year: 1994, type: 'event', ap: 1, tag: 'nk', img: 'world', once: true,
      flavor: '执政四十六年的领袖猝然离世，半岛进入金正日时代。',
      event: { desc: '第一时间吊唁，承诺传统友谊不变。朝鲜+2。', fx: { rel: { nk: 2 } } } },

    { id: 'a5_28', name: '朝鲜苦难行军', year: 1997, type: 'event', ap: 2, tag: 'nk', img: 'home', once: true,
      flavor: '大水与饥荒席卷朝鲜，"苦难行军"的口号撑着这个国家。',
      event: { desc: '邻邦陷入饥荒，援助的分量怎么拿捏？',
        choices: [
          { label: '大规模粮食援助', desc: '粮食与石油源源过江，稳住半岛北方。', fx: { rel: { nk: 3 }, res: { ECO: -2 } } },
          { label: '有限援助', desc: '人道姿态点到为止，力气留给自己。', fx: { rel: { nk: 1 } } },
        ] } },

    { id: 'a5_29', name: '新加坡苏州工业园', year: 1994, type: 'event', ap: 2, tag: 'sea', img: 'economy', once: true,
      flavor: '李光耀把新加坡经验整园搬到金鸡湖畔。',
      event: { desc: '经济+3，东南亚+2。', fx: { res: { ECO: 3 }, rel: { sea: 2 } } } },

    { id: 'a5_30', name: '东盟对话伙伴', year: 1996, type: 'event', ap: 2, tag: 'sea', img: 'diplomacy', once: true,
      flavor: '从全面对话伙伴做起，与东南亚十国重修旧好。',
      event: { desc: '东南亚+3，国际地位+2。', fx: { rel: { sea: 3 }, res: { DIP: 2 } } } },

    { id: 'a5_31', name: '南海美济礁', year: 1995, type: 'crisis', ap: 2, tag: 'sea', img: 'crisis', once: true,
      flavor: '渔政船与高脚屋出现在美济礁，马尼拉一片哗然。',
      event: { desc: '南沙的存在之争，进还是缓？',
        choices: [
          { label: '进驻建礁', desc: '把高脚屋立成既成事实。', roll: { ge: 3,
            ok: { desc: '进驻站稳脚跟，南沙态势改观。', fx: { res: { MIL: 2 }, rel: { sea: -2 } } },
            bad: { desc: '菲方抗议引来美舰关注，周边警惕大增。', fx: { res: { DIP: -2, MIL: 1 }, rel: { sea: -3 } } } } },
          { label: '搁置争议，共同开发', desc: '重申主权但姿态放软，稳住东盟。', fx: { rel: { sea: 2 }, res: { DIP: 1 } } },
        ] },
      weakened: { desc: '南海主权争议升温，东盟疑虑加深。', fx: { rel: { sea: -1 }, res: { DIP: -1 } } } },

    { id: 'a5_32', name: '三峡工程上马', year: 1994, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true,
      flavor: '人大表决三分之一未投赞成票，大江仍被截流。',
      event: { desc: '世纪工程，功过留待后人。',
        choices: [
          { label: '高峡出平湖', desc: '百万移民、千亿投资，防洪与电力的世纪之赌。', fx: { res: { ECO: 4, STB: -1, DIP: -1 } } },
          { label: '缓建再论证', desc: '把争议留给时间，先修小坝练手。', fx: { res: { STB: 1 } } },
        ] } },

    { id: 'a5_33', name: '西部大开发', year: 2000, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true,
      flavor: '世纪之交，把目光投向占国土三分之二的西部。',
      event: { desc: '经济+2，稳定+2。', fx: { res: { ECO: 2, STB: 2 } } } },

    { id: 'a5_34', name: '九八抗洪', year: 1998, type: 'crisis', ap: 3, tag: 'home', img: 'crisis', once: true,
      flavor: '长江全流域大洪水，三十万军队上了大堤。',
      event: { desc: '第六次洪峰逼近，严防死守还是弃卒保车？',
        choices: [
          { label: '严防死守', desc: '"人在堤在"，军民用身体堵管涌。', roll: { ge: 3,
            ok: { desc: '大堤守住了，军民鱼水情空前凝聚。', fx: { res: { STB: 4, MIL: 1 } } },
            bad: { desc: '九江决口，洪水破城，损失惨重。', fx: { res: { STB: -5, ECO: -4 } } } } },
          { label: '主动分洪保重点', desc: '牺牲分洪区保武汉，账算得清，人心难平。', fx: { res: { ECO: -3, STB: 1 } } },
        ] },
      weakened: { desc: '多处漫堤溃口，灾情蔓延数省。', fx: { res: { STB: -3, ECO: -2 } } } },

    { id: 'a5_35', name: '北京申奥失败', year: 1993, type: 'event', ap: 1, tag: 'home', img: 'world', once: true,
      flavor: '蒙特卡洛之夜，两票之差败给悉尼。',
      event: { desc: '国际地位-2，稳定-1。', fx: { res: { DIP: -2, STB: -1 } } } },

    { id: 'a5_36', name: '互联网进入中国', year: 1994, type: 'boon', ap: 1, tag: 'home', img: 'boon', once: true,
      flavor: '一条64K专线接入世界，中国全功能联入互联网。',
      event: { desc: '经济+2，获得旗标"互联网"。', fx: { res: { ECO: 2 }, flags: ['internet'] } } },

    { id: 'a5_37', name: '科教兴国与211工程', year: 1995, type: 'event', ap: 1, tag: 'home', img: 'home', once: true,
      flavor: '面向二十一世纪，重点建设一百所大学。',
      event: { desc: '经济+2。', fx: { res: { ECO: 2 } } } },

    { id: 'a5_38', name: '神舟一号', year: 1999, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true, requires: ['bomb'],
      flavor: '酒泉飞天，无人飞船绕地球十四圈后安然着陆。',
      event: { desc: '国际地位+3，军事+2。', fx: { res: { DIP: 3, MIL: 2 } } } },

    { id: 'a5_39', name: '欧元区与中欧关系', year: 1999, type: 'event', ap: 2, tag: 'eu', img: 'economy', once: true,
      flavor: '欧元问世，中欧建立面向二十一世纪的全面伙伴关系。',
      event: { desc: '欧洲+2，经济+2。', fx: { rel: { eu: 2 }, res: { ECO: 2 } } } },

    { id: 'a5_40', name: '英国：平稳过渡合作', year: 1996, type: 'event', ap: 1, tag: 'uk', img: 'diplomacy', once: true, requires: ['hk_deal'],
      flavor: '中英联合联络小组逐项交接，跨越九七的安排一一敲定。',
      event: { desc: '英国+2。', fx: { rel: { uk: 2 } } } },

    { id: 'a5_41', name: '日本首相访华与历史问题', year: 1997, type: 'event', ap: 2, tag: 'jp', img: 'diplomacy', once: true,
      flavor: '"反省"与"谢罪"之间，一词之差谈了整夜。',
      event: { desc: '经贸升温撞上历史旧账，火候怎么拿？',
        choices: [
          { label: '以史为鉴，面向未来', desc: '接受口头反省，把合作做大。', fx: { rel: { jp: 2 } } },
          { label: '历史问题寸步不让', desc: '坚持书面谢罪未果，会谈不欢而散。', fx: { rel: { jp: -2 }, res: { STB: 1 } } },
        ] } },

    { id: 'a5_42', name: '北京申奥成功', year: 2001, type: 'boon', ap: 3, tag: 'home', img: 'boon', once: true,
      flavor: '萨马兰奇念出"北京"，长安街一夜无眠。',
      event: { desc: '国际地位+6，稳定+4。', fx: { res: { DIP: 6, STB: 4 } } } },
  ],
};
