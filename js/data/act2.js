// 第二幕 · 风雨飘摇 1958–1965
window.ACT_DATA = window.ACT_DATA || {};
window.ACT_DATA[2] = {
  meta: { act: 2, title: '风雨飘摇', years: '1958–1965', turns: 7, img: 'act2',
    intro: '公社的红旗与小高炉的火光一夜烧遍原野，账本上的数字却在悄悄崩塌。饥馑正在逼近，庐山起了风；北方的盟友从导师变成论敌，援助之手正在收回。狂热与裂缝之间，你要独自撑过这七年。' },

  turnZero: [
    { name: '三年困难时期烈度', desc: '天灾与人祸叠加到什么程度？此前的跃进抉择将决定深渊的深度。',
      mod: [{ flag: 'leap_full', delta: -2 }, { flag: 'leap_half', delta: -1 }, { flag: 'leap_moderate', delta: 1 }],
      outcomes: [
        { range: [1, 1], desc: '公共食堂的锅底刮净了。饿殍载道，浮肿病蔓延，基层瞒报层层加码。', fx: { res: { STB: -12, ECO: -10, DIP: -3 }, flags: ['famine'] } },
        { range: [2, 2], desc: '粮食大幅减产，征购却未松手，农村最先陷入饥馑。', fx: { res: { STB: -8, ECO: -7, DIP: -2 }, flags: ['famine'] } },
        { range: [3, 4], desc: '按史实轨道：连年歉收，城乡定量一再压低，代价沉重。', fx: { res: { STB: -6, ECO: -5, DIP: -1 }, flags: ['famine'] } },
        { range: [5, 6], desc: '灾害较轻，纠偏及时，饥馑被控制在局部。', fx: { res: { STB: -3, ECO: -2 } } },
      ] },
    { name: '莫斯科的风向', desc: '赫鲁晓夫对北京的耐心还剩多少？',
      mod: [{ flag: 'destalin_rift', delta: -1 }, { flag: 'soviet_path', delta: 1 }],
      outcomes: [
        { range: [1, 2], desc: '莫斯科提前收紧口袋：施压、索债、放风撤援。', fx: { rel: { ussr: -2 }, res: { ECO: -3 } } },
        { range: [3, 4], desc: '按史实轨道：貌合神离，分歧在会议桌下积累。', fx: { rel: { ussr: -1 } } },
        { range: [5, 6], desc: '合作表象暂时维持，援建项目照常推进。', fx: { rel: { ussr: 1 }, res: { ECO: 2 } } },
      ] },
  ],

  finale: {
    title: '中苏决裂结算', year: 1965, img: 'finale2',
    desc: '论战已经公开化，从意识形态吵到国家关系，边境线也开始陈兵。同盟条约还挂在墙上，同盟本身早已名存实亡。这道裂缝，你打算撕开、缝住，还是跪着捧住？',
    choices: [
      { label: '彻底决裂', desc: '公开点名批判修正主义，与"苏修"一刀两断，用外部敌人凝聚内部。',
        fx: { rel: { ussr: -4 }, res: { STB: 3 }, flags: ['split_total'] } },
      { label: '斗而不破', desc: '论战照打，国家关系留一线，不给对方翻脸的口实。',
        roll: { ge: 4,
          ok: { desc: '分寸拿捏得住：吵而不崩，各留余地，世界看到了一个独立的中国。', fx: { rel: { ussr: -2 }, res: { DIP: 2 }, flags: ['split_managed'] } },
          bad: { desc: '骂战自有其惯性，措辞一路升级，关系仍滑向彻底破裂。', fx: { rel: { ussr: -3 }, flags: ['split_total'] } } } },
      { label: '委曲求全', desc: '压下论战保住同盟——援助或许回来，但从此仰人鼻息。', reqRel: { ussr: 2 },
        fx: { rel: { ussr: 1 }, res: { DIP: -3, STB: -3 }, flags: ['split_avoided'] } },
    ],
  },

  cards: [
    { id: 'a2_01', name: '人民公社化', year: 1958, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '一大二公，吃饭不要钱——一个夏天，公社的牌子挂遍全国乡村。',
      event: { desc: '组织形式的豪赌。',
        choices: [
          { label: '一大二公', desc: '公共食堂敞开吃，跑步进入共产主义。', fx: { res: { STB: 3, ECO: -3 } } },
          { label: '保留自留地', desc: '顶住风头，给农户留一条家庭副业的活路。', fx: { res: { STB: 1, ECO: 2 } } },
        ] } },

    { id: 'a2_02', name: '土法炼钢', year: 1958, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true,
      flavor: '小高炉的火光映红夜空，炼出的却多是不能用的烧结铁。',
      event: { desc: '一〇七〇万吨的军令状压下来了。',
        choices: [
          { label: '及时纠偏', desc: '承认蛮干无效，把九千万劳力赶回田里。', fx: { res: { ECO: 1, STB: -2 } } },
          { label: '全民加码', desc: '砸锅献铁，山头树尽，指标层层加码。', fx: { res: { STB: 2, ECO: -5 } } },
        ] } },

    { id: 'a2_03', name: '庐山会议', year: 1959, type: 'crisis', ap: 3, tag: 'home', img: 'crisis', once: true,
      flavor: '彭德怀的万言书摆上桌面，纠"左"的会议急转为反右倾。',
      event: { desc: '一封信引发的政治风暴，如何收场？',
        choices: [
          { label: '批判彭德怀', desc: '定性为右倾机会主义反党集团，会场重归一个声音。', fx: { res: { STB: 4, DIP: -1 }, flags: ['lushan_purge'] } },
          { label: '接受意见', desc: '承认"有失有得"，让会议回到纠偏轨道。', roll: { ge: 4,
            ok: { desc: '压力被顶住了，经济政策提前止血。', fx: { res: { ECO: 4, STB: -2 } } },
            bad: { desc: '风向已成，纠偏者反被卷入漩涡，反右倾照样铺开。', fx: { res: { STB: -3, ECO: 1 }, flags: ['lushan_purge'] } } } },
        ] },
      weakened: { desc: '反右倾之风吹遍党内，敢说真话的人少了。', fx: { res: { STB: -2, DIP: -1 } } } },

    { id: 'a2_04', name: '七千人大会', year: 1962, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true, requires: ['famine'],
      flavor: '"白天出气，晚上看戏"——一场罕见的党内民主生活。',
      event: { desc: '初步总结灾难教训，人心稍安。稳定+5，经济+3。', fx: { res: { STB: 5, ECO: 3 } } } },

    { id: 'a2_05', name: '调整巩固充实提高', year: 1961, type: 'event', ap: 3, tag: 'home', img: 'economy', once: true,
      flavor: '八字方针落地，狂热之后重新学会算账。',
      event: { desc: '经济+5，稳定+2。', fx: { res: { ECO: 5, STB: 2 } } } },

    { id: 'a2_06', name: '第二次台海危机', year: 1958, type: 'crisis', ap: 3, tag: 'tw', img: 'military', once: true,
      flavor: '万炮齐发金门。华盛顿紧张，莫斯科更恼火——事先无人被通报。',
      event: { desc: '炮击金门，打给三方看。',
        choices: [
          { label: '打打停停', desc: '单日打双日不打，把金门变成一根牵着美台的绳。', fx: { res: { MIL: 3, DIP: 2 }, rel: { tw: -1, us: -1, ussr: -1 } } },
          { label: '大打登陆', desc: '趁势夺取外岛，赌美军不敢下场。', roll: { ge: 5,
            ok: { desc: '外岛易手，世界震动，美舰队环伺却未开火。', fx: { res: { MIL: 4, STB: 2 }, rel: { tw: -3, us: -3, ussr: -1 } } },
            bad: { desc: '强攻受挫于滩头，美军护航兑现，莫斯科拒绝背书。', fx: { res: { MIL: -3, STB: -3, DIP: -2 }, rel: { us: -2, ussr: -1 } } } } },
        ] },
      weakened: { desc: '炮声起落，海峡与盟邦同时紧张。', fx: { res: { DIP: -1 }, rel: { us: -1, ussr: -1 } } } },

    { id: 'a2_07', priority: true, name: '苏联撤走专家', year: 1960, type: 'crisis', ap: 3, tag: 'ussr', img: 'crisis', once: true,
      flavor: '一千三百九十名专家携图纸而去，半途的工地静了下来。',
      event: { desc: '援助链条骤然断裂，二百五十七个项目悬在半空。',
        choices: [
          { label: '自力更生', desc: '勒紧裤带也要把项目续上，就是十年也要搞出来。', fx: { res: { ECO: -6, MIL: -3, STB: 2 }, flags: ['experts_gone'] } },
          { label: '低调挽回', desc: '压下怒火交涉，争取放缓撤离。', roll: { ge: 5,
            ok: { desc: '部分合同保住，撤离步伐放缓。', fx: { res: { ECO: -3, MIL: -2 }, rel: { ussr: 1 }, flags: ['experts_gone'] } },
            bad: { desc: '莫斯科不为所动，专家如期撤空，还带走了图纸。', fx: { res: { ECO: -6, MIL: -4, DIP: -1 }, flags: ['experts_gone'] } } } },
        ] },
      weakened: { desc: '合作项目陆续停摆，工地上只剩中方技术员。', fx: { res: { ECO: -3, MIL: -2 }, rel: { ussr: -1 } } } },

    { id: 'a2_08', name: '九评苏共', year: 1963, type: 'event', ap: 2, tag: 'ussr', img: 'diplomacy', once: true,
      flavor: '《人民日报》连发九篇雄文，论战从暗涌走向白刃。',
      event: { desc: '公开论战，火力如何拿捏？',
        choices: [
          { label: '火力全开', desc: '指名道姓批修正主义，内部士气为之一振。', fx: { rel: { ussr: -2 }, res: { STB: 2, DIP: -1 } } },
          { label: '点到为止', desc: '讲理不骂街，争取国际共运的中间派。', fx: { rel: { ussr: -1 }, res: { DIP: 1 } } },
        ] } },

    { id: 'a2_09', name: '中印边界战争', year: 1962, type: 'crisis', ap: 3, tag: 'sea', img: 'military', once: true,
      flavor: '喜马拉雅的雪线上，克制多年的边境终于开火。',
      event: { desc: '自卫反击战全线告捷，下一步走哪？',
        choices: [
          { label: '主动撤军', desc: '胜利后单方面后撤二十公里，归还缴获。', roll: { ge: 2,
            ok: { desc: '大胜之后全线后撤，世界看清了中国的分寸。', fx: { res: { MIL: 4, DIP: 4 }, rel: { ussr: -1 } } },
            bad: { desc: '仗打赢了，撤军的善意却被宣传成虚弱。', fx: { res: { MIL: 3, DIP: 1 }, rel: { ussr: -1, sea: -1 } } } } },
          { label: '乘胜进攻', desc: '一路向南，把谈判桌摆到平原上。', fx: { res: { MIL: 2, DIP: -4, ECO: -3 }, rel: { sea: -2, ussr: -2 } } },
        ] },
      weakened: { desc: '边境对峙持续，补给线在雪山上空转。', fx: { res: { ECO: -2, DIP: -1 }, rel: { sea: -1 } } } },

    { id: 'a2_10', name: '古巴导弹危机', year: 1962, type: 'event', ap: 2, tag: 'world', img: 'world', once: true,
      flavor: '加勒比对峙十三天，赫鲁晓夫撤走了导弹。',
      event: { desc: '莫斯科退让，北京如何表态？',
        choices: [
          { label: '批"投降主义"', desc: '嘲讽先冒险后投降，帝国主义都是纸老虎。', fx: { rel: { ussr: -2 }, res: { STB: 1 } } },
          { label: '保持沉默', desc: '不落井下石，留一分体面。', fx: { res: { DIP: 1 } } },
        ] } },

    { id: 'a2_11', name: 'U-2侦察机被击落', year: 1962, type: 'event', ap: 2, tag: 'us', img: 'military', once: true,
      flavor: '两万米高空来去无踪的黑色幽灵，终于被导弹追上。',
      event: { desc: '台湾飞行员驾美制U-2一再穿越大陆纵深。', roll: { ge: 3,
        ok: { desc: '萨姆导弹首开纪录，U-2残骸摆进军事博物馆。', fx: { res: { MIL: 3, DIP: 2 }, rel: { us: -1, tw: -1 } } },
        bad: { desc: '侦察机再次全身而退，防空网仍有缺口。', fx: { res: { MIL: 1 }, rel: { us: -1 } } } } } },

    { id: 'a2_12', name: '中法建交', year: 1964, type: 'event', ap: 3, tag: 'eu', img: 'diplomacy', once: true,
      flavor: '戴高乐撬开西方铁板，世界称之为"外交核爆炸"。',
      event: { desc: '国际地位+5，欧洲+3。', fx: { res: { DIP: 5 }, rel: { eu: 3 } } } },

    { id: 'a2_13', priority: true, name: '第一颗原子弹', year: 1964, type: 'boon', ap: 3, tag: 'home', img: 'boon', once: true, requires: ['qian'],
      flavor: '罗布泊一声巨响，蘑菇云升起在戈壁上空。',
      event: { desc: '军事+8，国际地位+6，获得旗标"核门槛"。', fx: { res: { MIL: 8, DIP: 6 }, flags: ['bomb'] } } },

    { id: 'a2_14', name: '导弹研制', year: 1960, type: 'event', ap: 2, tag: 'home', img: 'military', once: true, requires: ['qian'],
      flavor: '东风一号从戈壁腾空——仿制的尽头，是自己的图纸。',
      event: { desc: '军事+4，经济-2，获得旗标"导弹"。', fx: { res: { MIL: 4, ECO: -2 }, flags: ['missile'] } } },

    { id: 'a2_15', name: '大庆油田', year: 1960, type: 'event', ap: 3, tag: 'home', img: 'economy', once: true,
      flavor: '松辽平原的荒原上，井架在零下三十度竖起。',
      event: { desc: '经济+5，获得旗标"大庆"。摘掉贫油国帽子。', fx: { res: { ECO: 5 }, flags: ['daqing'] } } },

    { id: 'a2_16', name: '铁人王进喜', year: 1960, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true, requires: ['daqing'],
      flavor: '"宁可少活二十年，拼命也要拿下大油田。"',
      event: { desc: '经济+3，稳定+2。', fx: { res: { ECO: 3, STB: 2 } } } },

    { id: 'a2_17', name: '学雷锋运动', year: 1963, type: 'event', ap: 1, tag: 'home', img: 'home', once: true,
      flavor: '一个二十二岁士兵的日记，成了整个时代的道德课本。',
      event: { desc: '稳定+3。', fx: { res: { STB: 3 } } } },

    { id: 'a2_18', name: '三线建设', year: 1964, type: 'event', ap: 3, tag: 'home', img: 'military', once: true,
      flavor: '好人好马上三线，工厂钻进大山与山洞。',
      event: { desc: '把工业腹地向内陆纵深转移。',
        choices: [
          { label: '大搞快上', desc: '靠山、分散、隐蔽，不惜代价抢建。', fx: { res: { MIL: 5, ECO: -4 }, flags: ['third_front'] } },
          { label: '适度布点', desc: '择要而建，兼顾沿海既有工业。', fx: { res: { MIL: 2, ECO: -1 } } },
        ] } },

    { id: 'a2_19', name: '四清运动', year: 1963, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '社会主义教育运动下乡，清账目，也清人心。',
      event: { desc: '基层整肃的尺度。',
        choices: [
          { label: '层层发动', desc: '工作队进村夺权清查，阶级斗争之弦绷紧。', fx: { res: { STB: 3, DIP: -2 } } },
          { label: '控制范围', desc: '重在清经济账，不搞人人过关。', fx: { res: { STB: 1 } } },
        ] } },

    { id: 'a2_20', name: '越南战争升级', year: 1965, type: 'crisis', ap: 3, tag: 'sea', img: 'crisis', once: true,
      flavor: '北部湾事件之后，美机的轰炸线一路向北推移。',
      event: { desc: '战火烧到中国南大门。',
        choices: [
          { label: '大规模援越抗美', desc: '高炮部队与工程兵入越，物资源源过境。', fx: { rel: { sea: 2, nk: 1, us: -2 }, res: { ECO: -4, DIP: 2 }, flags: ['vietnam_aid'] } },
          { label: '有限支援', desc: '给物资不出兵，划出美机不得越过的红线。', fx: { rel: { sea: 1, us: -1 }, res: { ECO: -1 } } },
        ] },
      weakened: { desc: '战火迫近南疆，边境警报频传。', fx: { res: { STB: -2, ECO: -1 } } } },

    { id: 'a2_21', name: '印尼九三〇事件', year: 1965, type: 'crisis', ap: 2, tag: 'sea', img: 'crisis', once: true,
      flavor: '雅加达一夜变天，排华的浪潮随大清洗而来。',
      event: { desc: '数十万人死于清洗，华侨首当其冲。',
        choices: [
          { label: '撤侨并公开抗议', desc: '派船接侨，把暴行公之于世。', fx: { rel: { sea: -3 }, res: { DIP: 1, STB: 1 } } },
          { label: '克制低调', desc: '避免刺激，保住残存的外交管道。', fx: { rel: { sea: -2 }, res: { DIP: -1 } } },
        ] },
      weakened: { desc: '排华愈演愈烈，侨社在恐惧中离散。', fx: { rel: { sea: -3 }, res: { DIP: -1 } } } },

    { id: 'a2_22', name: '赫鲁晓夫下台', year: 1964, type: 'event', ap: 2, tag: 'ussr', img: 'world', once: true,
      flavor: '克里姆林宫一夜换帅——是转机，还是照旧？',
      event: { desc: '勃列日涅夫上台，北京要不要伸手试探？',
        choices: [
          { label: '试探缓和', desc: '派团赴十月革命节，看看新领导的底牌。', roll: { ge: 4,
            ok: { desc: '气氛短暂回暖，边贸与往来略有恢复。', fx: { rel: { ussr: 2 }, res: { DIP: 1 } } },
            bad: { desc: '"没有赫鲁晓夫的赫鲁晓夫主义"，试探碰壁而回。', fx: { rel: { ussr: -1 } } } } },
          { label: '继续对峙', desc: '换汤不换药，论战照打不误。', fx: { rel: { ussr: -1 }, res: { STB: 1 } } },
        ] } },

    { id: 'a2_23', name: '中巴划界与友好', year: 1963, type: 'event', ap: 1, tag: 'sea', img: 'diplomacy', once: true,
      flavor: '喀喇昆仑的界碑立定，一段穿越冰山的友谊起笔。',
      event: { desc: '东南亚+2，国际地位+2。', fx: { rel: { sea: 2 }, res: { DIP: 2 } } } },

    { id: 'a2_24', name: '西藏平叛', year: 1959, type: 'crisis', ap: 3, tag: 'home', img: 'crisis', once: true,
      flavor: '拉萨枪声骤起，达赖连夜南越国境。',
      event: { desc: '武装叛乱与百万农奴制度，一并摊牌。',
        choices: [
          { label: '坚决平叛并改革', desc: '平叛与民主改革同步推进，废除农奴制。', roll: { ge: 3,
            ok: { desc: '叛乱迅速平定，百万农奴翻身，西方抗议声浪高涨。', fx: { res: { STB: 4, MIL: 2, DIP: -3 }, rel: { sea: -1 } } },
            bad: { desc: '平叛旷日持久，流亡的声音占据国际讲台。', fx: { res: { STB: 2, MIL: 1, DIP: -4 }, rel: { sea: -2 } } } } },
          { label: '军事控制改革缓行', desc: '先稳住局面，改革留待时机。', fx: { res: { STB: 2, DIP: -2 } } },
        ] },
      weakened: { desc: '高原局势糜烂，流亡政府在境外立足。', fx: { res: { STB: -3, DIP: -2 } } } },

    { id: 'a2_25', name: '边界条约连签', year: 1961, type: 'event', ap: 1, tag: 'world', img: 'diplomacy', once: true,
      flavor: '与缅甸、尼泊尔、蒙古逐一划定边界，珠峰也有了归属。',
      event: { desc: '国际地位+3，东南亚+1。', fx: { res: { DIP: 3 }, rel: { sea: 1 } } } },

    { id: 'a2_26', name: '世乒赛夺冠', year: 1961, type: 'boon', ap: 1, tag: 'home', img: 'boon', once: true,
      flavor: '第26届世乒赛在北京举行，庄则栋们让国歌一再奏响。',
      event: { desc: '国际地位+2，稳定+2。', fx: { res: { DIP: 2, STB: 2 } } } },

    { id: 'a2_27', name: '农业学大寨', year: 1964, type: 'event', ap: 1, tag: 'home', img: 'home',
      flavor: '七沟八梁一面坡，虎头山下人造梯田。',
      event: { desc: '经济+2，稳定+1。', fx: { res: { ECO: 2, STB: 1 } } } },

    { id: 'a2_28', name: '哈军工与国防科技', year: 1959, type: 'event', ap: 2, tag: 'home', img: 'military', once: true,
      flavor: '陈赓办学，教授与将军同堂，为两弹一星储备第一批人。',
      event: { desc: '军事+3，经济-1。', fx: { res: { MIL: 3, ECO: -1 } } } },

    { id: 'a2_29', name: '氢弹预研', year: 1965, type: 'event', ap: 2, tag: 'home', img: 'military', once: true, requires: ['bomb'],
      flavor: '于敏带着一支小队，钻进理论的深水区。',
      event: { desc: '军事+2，获得旗标"氢弹预研"。', fx: { res: { MIL: 2 }, flags: ['hbomb_pre'] } } },

    { id: 'a2_30', name: '侨务风波', year: 1960, type: 'event', ap: 2, tag: 'sea', img: 'diplomacy', once: true,
      flavor: '排华令下，接侨船一次次往返于南海。',
      event: { desc: '南洋反华排华抬头，侨胞何去何从？',
        choices: [
          { label: '派船接侨', desc: '数万难侨回国安置，侨心可用。', fx: { res: { STB: 2, ECO: -1, DIP: 1 } } },
          { label: '隐忍交涉', desc: '顾全当地关系，让侨胞自谋出路。', fx: { rel: { sea: 1 }, res: { STB: -1 } } },
        ] } },

    { id: 'a2_31', name: 'LT贸易备忘录', year: 1962, type: 'event', ap: 2, tag: 'jp', img: 'economy', once: true,
      flavor: '廖承志与高碕达之助签字，半官方的管道穿过冷战。',
      event: { desc: '经济+3，日本+2。', fx: { res: { ECO: 3 }, rel: { jp: 2 } } } },

    { id: 'a2_32', name: '逃港潮', year: 1962, type: 'crisis', ap: 2, tag: 'uk', img: 'crisis', once: true,
      flavor: '饥馑之年，数万人翻山泅水涌向边境铁丝网。',
      event: { desc: '深圳河边人潮汹涌，港英当局措手不及。',
        choices: [
          { label: '暂开闸门', desc: '默许出境泄压，交由港英消化。', roll: { ge: 3,
            ok: { desc: '压力悄然释放，港英低调收容，边境复归平静。', fx: { res: { STB: 1 }, rel: { uk: 1 } } },
            bad: { desc: '边境失序成了西方报纸的头条照片。', fx: { res: { STB: 1, DIP: -2 } } } } },
          { label: '严堵劝返', desc: '收紧边防遣返偷渡者，民怨积于堤内。', fx: { res: { STB: -2 } } },
        ] },
      weakened: { desc: '边境风潮起落，流言四散。', fx: { res: { STB: -2, DIP: -1 } } } },

    { id: 'a2_33', name: '广交会扩大', year: 1959, type: 'event', ap: 1, tag: 'home', img: 'economy',
      flavor: '封锁之下，珠江边的展馆一年两度灯火通明。',
      event: { desc: '经济+3。', fx: { res: { ECO: 3 } } } },

    { id: 'a2_34', name: '备战备荒', year: 1965, type: 'event', ap: 2, tag: 'home', img: 'military', once: true,
      flavor: '"备战、备荒、为人民"，算盘从建设拨向战争。',
      event: { desc: '军事+2，稳定+1，经济-2，获得旗标"备战"。', fx: { res: { MIL: 2, STB: 1, ECO: -2 }, flags: ['war_prep'] } } },

    { id: 'a2_35', name: '东风压倒西风', year: 1958, type: 'event', ap: 1, tag: 'home', img: 'home',
      flavor: '莫斯科会议上的著名论断，宣传机器全速开动。',
      event: { desc: '稳定+2。', fx: { res: { STB: 2 } } } },

    { id: 'a2_36', name: '汉城军人政变', year: 1961, type: 'event', ap: 1, tag: 'sk', img: 'world', once: true,
      flavor: '朴正熙的坦克开进汉城，半岛南侧进入军政府时代。',
      event: { desc: '对南方保持警惕。军事+1，韩国-1。', fx: { res: { MIL: 1 }, rel: { sk: -1 } } } },

    { id: 'a2_37', name: '伊塔事件', year: 1962, type: 'crisis', ap: 2, tag: 'ussr', img: 'crisis', once: true,
      flavor: '六万边民一夜越境，苏联领事馆的侨证发到了牧区。',
      event: { desc: '新疆边境人口外流，背后有人递梯子。',
        choices: [
          { label: '关闭口岸公开抗议', desc: '封边、抗议、清理境外势力渗透。', fx: { res: { STB: 2 }, rel: { ussr: -2 } } },
          { label: '内紧外松', desc: '不声张，安置善后为先。', roll: { ge: 4,
            ok: { desc: '边境悄然稳住，未落对方口实。', fx: { res: { STB: 1, DIP: 1 } } },
            bad: { desc: '外逃未止，谣言四起。', fx: { res: { STB: -2 }, rel: { ussr: -1 } } } } },
        ] },
      weakened: { desc: '西陲人心浮动，边境线漏风。', fx: { res: { STB: -2 }, rel: { ussr: -1 } } } },

    { id: 'a2_38', name: '精简城镇人口', year: 1961, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true,
      flavor: '两千万人返乡务农，城市卸下养不起的重负。',
      event: { desc: '大饥馑后的收缩。',
        choices: [
          { label: '坚决精简', desc: '三年压缩城镇人口两千六百万，快刀断腕。', fx: { res: { ECO: 4, STB: -2 } } },
          { label: '分批缓行', desc: '边安置边压缩，阵痛拉长但可控。', fx: { res: { ECO: 2 } } },
        ] } },

    { id: 'a2_39', name: '送瘟神', year: 1958, type: 'boon', ap: 1, tag: 'home', img: 'boon', once: true,
      flavor: '余江县消灭血吸虫，"华佗无奈小虫何"的时代结束了。',
      event: { desc: '稳定+3，经济+1。', fx: { res: { STB: 3, ECO: 1 } } } },

    { id: 'a2_40', name: '中朝友好合作互助条约', year: 1961, type: 'event', ap: 2, tag: 'nk', img: 'diplomacy', once: true,
      flavor: '金日成在北京与莫斯科之间两头下注，北京先给了条约。',
      event: { desc: '朝鲜+2，国际地位+1。', fx: { rel: { nk: 2 }, res: { DIP: 1 } } } },

    { id: 'a2_41', name: '登顶珠穆朗玛', year: 1960, type: 'boon', ap: 1, tag: 'home', img: 'boon', once: true,
      flavor: '凌晨四点二十分，三人从北坡站上地球之巅。',
      event: { desc: '稳定+2，国际地位+2。', fx: { res: { STB: 2, DIP: 2 } } } },

    { id: 'a2_42', name: '周恩来访非十四国', year: 1963, type: 'event', ap: 2, tag: 'world', img: 'diplomacy', once: true,
      flavor: '五十四天，横跨亚非十四国，援外八项原则随行。',
      event: { desc: '把外交纵深伸向第三世界。', roll: { ge: 2,
        ok: { desc: '第三世界的朋友圈迅速扩大，联大票仓开始松动。', fx: { res: { DIP: 5 }, rel: { sea: 1 } } },
        bad: { desc: '部分行程受干扰，成果仍然可观。', fx: { res: { DIP: 3 } } } } } },
  ],
};
