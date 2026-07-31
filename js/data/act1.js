// 第一幕 · 建国立足 1949–1957
window.ACT_DATA = window.ACT_DATA || {};
window.ACT_DATA[1] = {
  meta: { act: 1, title: '建国立足', years: '1949–1957', turns: 7, img: 'act1',
    intro: '一九四九年十月一日，天安门城楼上宣告了一个新政权的诞生。百废待兴，强敌环伺：北面是需要小心侍奉的盟主，东面是败退台湾的旧政权与横亘西太平洋的美国舰队。第一步棋，落在哪里？' },

  turnZero: [
    { name: '苏联援助力度', desc: '莫斯科对这个新生政权的热情有多高？',
      outcomes: [
        { range: [1, 2], desc: '斯大林疑虑重重，援助口惠而实不至。', fx: { rel: { ussr: -1 }, res: { ECO: -2 } } },
        { range: [3, 4], desc: '按史实轨道：有条件的援助，附带利益索取。', fx: {} },
        { range: [5, 6], desc: '莫斯科出手慷慨，成套设备与贷款先行到位。', fx: { rel: { ussr: 1 }, res: { ECO: 4 } } },
      ] },
    { name: '国际承认浪潮', desc: '西方世界对新政权的第一反应。',
      outcomes: [
        { range: [1, 2], desc: '铁幕迅速落下，仅社会主义阵营承认。', fx: { res: { DIP: -2 } } },
        { range: [3, 4], desc: '按史实轨道：英国等出于利益率先承认。', fx: { rel: { uk: 1 } } },
        { range: [5, 6], desc: '承认浪潮超出预期，多国抢先建交。', fx: { res: { DIP: 3 }, rel: { uk: 2, eu: 1 } } },
      ] },
  ],

  finale: {
    title: '一九五七年的岔路口', year: 1957, img: 'finale1',
    desc: '一五计划超额完成，苏共二十大的震波未平。"多快好省"的口号已经响起，庐山之上，一场关于速度的豪赌正在酝酿。你如何选择？',
    choices: [
      { label: '全面跃进', desc: '超英赶美，跑步进入共产主义。动员的热情是真实的，代价也将是真实的。',
        fx: { res: { STB: 4 }, flags: ['leap_full'] } },
      { label: '稳中求进', desc: '顶住"反冒进"的政治压力，按比例发展。你会被批评右倾，但饭碗更稳。',
        roll: { ge: 3, ok: { desc: '压力被顶住了，经济轨道保持平稳。', fx: { res: { STB: -2 }, flags: ['leap_moderate'] } },
                        bad: { desc: '你被扣上右倾帽子，政治风向仍朝跃进倾斜，只是烈度稍减。', fx: { res: { STB: -4 }, flags: ['leap_half'] } } } },
      { label: '深化苏联模式', desc: '继续押注老大哥：引进、听从、跟随。', reqRel: { ussr: 4 },
        fx: { res: { ECO: 4 }, rel: { ussr: 2 }, flags: ['soviet_path', 'leap_moderate'] } },
    ],
  },

  cards: [
    { id: 'a1_01', name: '开国大典', year: 1949, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true,
      flavor: '中国人民从此站起来了。',
      event: { desc: '稳定+5，国际地位+3。', fx: { res: { STB: 5, DIP: 3 } } } },

    { id: 'a1_02', name: '中苏友好同盟互助条约', year: 1950, type: 'event', ap: 3, tag: 'ussr', img: 'diplomacy', once: true,
      flavor: '毛泽东在莫斯科滞留两月，谈判桌上的每一寸都要争。',
      event: { desc: '与苏联结盟，代价与收益并存。',
        choices: [
          { label: '全盘接受条件', desc: '尽快签约，旅顺口、外蒙问题暂且搁置。', fx: { rel: { ussr: 3 }, res: { ECO: 4, MIL: 2, DIP: -1 }, flags: ['sov_pact'] } },
          { label: '据理力争', desc: '为主权条款硬顶到底。', roll: { ge: 4,
            ok: { desc: '斯大林让步，条约体面签订。', fx: { rel: { ussr: 2 }, res: { ECO: 4, MIL: 2, DIP: 2 }, flags: ['sov_pact'] } },
            bad: { desc: '谈判拖延，条约缩水，莫斯科不快。', fx: { rel: { ussr: 1 }, res: { ECO: 2 }, flags: ['sov_pact'] } } } },
        ] } },

    { id: 'a1_03', priority: true, name: '朝鲜战争爆发', year: 1950, type: 'crisis', ap: 3, tag: 'nk', img: 'crisis', once: true,
      flavor: '一九五〇年六月二十五日，三八线枪声骤起，战火烧向鸭绿江。',
      event: { desc: '美军越过三八线，兵锋直指东北边境。抉择时刻。',
        choices: [
          { label: '抗美援朝', desc: '打得一拳开，免得百拳来。', roll: { ge: 3,
            ok: { desc: '志愿军把战线推回三八线，世界为之侧目。', fx: { res: { MIL: 8, DIP: 6, STB: 3, ECO: -6 }, rel: { nk: 3, us: -3, ussr: 2 }, flags: ['korea_war'] } },
            bad: { desc: '伤亡惨重，战线仍稳在三八线，但代价沉重。', fx: { res: { MIL: 4, DIP: 4, STB: -2, ECO: -8 }, rel: { nk: 2, us: -3, ussr: 1 }, flags: ['korea_war'] } } } },
          { label: '陈兵不出', desc: '守住鸭绿江即可，不与美军直接交手。',
            fx: { res: { ECO: 2, STB: -3, DIP: -3 }, rel: { nk: -5, ussr: -4, us: 1 }, flags: ['no_korea'] } },
        ] },
      weakened: { desc: '战火在半岛蔓延，边境陷入长期紧张。', fx: { res: { STB: -3, ECO: -2 }, rel: { nk: -2 } } } },

    { id: 'a1_04', name: '上甘岭战役', year: 1952, type: 'event', ap: 2, tag: 'nk', img: 'military', once: true, requires: ['korea_war'],
      flavor: '四十三天，反复争夺的两个高地成为意志的试金石。',
      event: { desc: '军事+3，国际地位+3，稳定+1，美国-1。', fx: { res: { MIL: 3, DIP: 3, STB: 1 }, rel: { us: -1 } } } },

    { id: 'a1_05', name: '板门店停战', year: 1953, type: 'boon', ap: 2, tag: 'nk', img: 'boon', once: true, requires: ['korea_war'],
      flavor: '签字桌前，克拉克说他是美国历史上第一个在没有胜利的停战协定上签字的司令官。',
      event: { desc: '稳定+3，经济+2，国际地位+3。', fx: { res: { STB: 3, ECO: 2, DIP: 3 } } } },

    { id: 'a1_06', name: '土地改革', year: 1950, type: 'event', ap: 3, tag: 'home', img: 'home', once: true,
      flavor: '三亿农民分到了土地，两千年的地租制度轰然倒塌。',
      event: { desc: '重塑农村，方式决定烈度。',
        choices: [
          { label: '疾风骤雨', desc: '发动群众彻底清算，运动式推进。', fx: { res: { STB: 5, ECO: 3, DIP: -2 } } },
          { label: '依法有序', desc: '按部就班，保留富农经济。', fx: { res: { STB: 3, ECO: 4 } } },
        ] } },

    { id: 'a1_07', name: '镇压反革命', year: 1951, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '新政权用铁腕清扫旧时代的残余势力。',
      event: { desc: '肃清与震慑。',
        choices: [
          { label: '从重从快', desc: '大规模处决与关押，秩序迅速建立。', fx: { res: { STB: 6, DIP: -3 } } },
          { label: '区别对待', desc: '首恶必办，胁从不问。', fx: { res: { STB: 3, DIP: -1 } } },
        ] } },

    { id: 'a1_08', name: '三反五反运动', year: 1952, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '反贪污、反浪费、反官僚主义，运动的枪口对准了自己队伍。',
      event: { desc: '稳定+3，经济+2，但工商界人心浮动。', fx: { res: { STB: 3, ECO: 2 }, rel: {} } } },

    { id: 'a1_09', name: '第一个五年计划', year: 1953, type: 'event', ap: 3, tag: 'home', img: 'economy', once: true,
      flavor: '以苏联援建项目为骨架，中国开始了真正意义上的工业化。',
      event: { desc: '经济+6，获得旗标"一五计划"。', fx: { res: { ECO: 6 }, flags: ['fyp1'] } } },

    { id: 'a1_10', name: '一五六项工程', year: 1953, type: 'event', ap: 3, tag: 'ussr', img: 'economy', once: true, reqRel: { ussr: 3 },
      flavor: '从长春一汽到武钢，苏联成套设备铺开了工业地基。',
      event: { desc: '经济+6，军事+2，苏联+1。', fx: { res: { ECO: 6, MIL: 2 }, rel: { ussr: 1 } } } },

    { id: 'a1_11', name: '苏联专家来华', year: 1954, type: 'event', ap: 2, tag: 'ussr', img: 'diplomacy', once: true, reqRel: { ussr: 2 },
      flavor: '上万名苏联工程师带来了图纸，也带来了体系。',
      event: { desc: '经济+3，军事+3，苏联+1。', fx: { res: { ECO: 3, MIL: 3 }, rel: { ussr: 1 } } } },

    { id: 'a1_12', name: '抗法援越', year: 1953, type: 'event', ap: 2, tag: 'sea', img: 'military', once: true,
      flavor: '中国顾问团与物资越过边境，奠边府的炮声里有中国的回响。',
      event: { desc: '国际地位+3，东南亚+2，美国-1，经济-2。', fx: { res: { DIP: 3, ECO: -2 }, rel: { sea: 2, us: -1 } } } },

    { id: 'a1_13', name: '日内瓦会议', year: 1954, type: 'event', ap: 3, tag: 'world', img: 'diplomacy', once: true,
      flavor: '周恩来第一次把新中国带上大国会议桌。',
      event: { desc: '国际地位+5，英国+1，欧洲+1，东南亚+1。', fx: { res: { DIP: 5 }, rel: { uk: 1, eu: 1, sea: 1 } } } },

    { id: 'a1_14', name: '和平共处五项原则', year: 1954, type: 'event', ap: 2, tag: 'world', img: 'diplomacy', once: true,
      flavor: '与印缅共同倡导，成为此后半个世纪外交的底色。',
      event: { desc: '国际地位+4，东南亚+2。', fx: { res: { DIP: 4 }, rel: { sea: 2 } } } },

    { id: 'a1_15', name: '万隆会议', year: 1955, type: 'event', ap: 3, tag: 'sea', img: 'diplomacy', once: true,
      flavor: '"求同存异"四个字，让二十九个亚非国家听见了中国。',
      event: { desc: '亚非舞台的高光时刻。', roll: { ge: 2,
        ok: { desc: '会议大获成功，第三世界向北京投来目光。', fx: { res: { DIP: 6 }, rel: { sea: 3 }, flags: ['bandung'] } },
        bad: { desc: '暗流与猜忌干扰议程，成果打了折扣。', fx: { res: { DIP: 3 }, rel: { sea: 1 }, flags: ['bandung'] } } } } },

    { id: 'a1_16', name: '克什米尔公主号事件', year: 1955, type: 'crisis', ap: 2, tag: 'tw', img: 'crisis', once: true,
      flavor: '一枚定时炸弹在包机上引爆，目标本是赴万隆的周恩来。',
      event: { desc: '国民党特务的暗杀阴谋败露。',
        choices: [
          { label: '公开揭露', desc: '把证据摊在国际社会面前。', roll: { ge: 3,
            ok: { desc: '舆论哗然，台湾当局形象受创。', fx: { res: { DIP: 3 }, rel: { tw: -1, uk: 1 } } },
            bad: { desc: '西方媒体轻描淡写，追责不了了之。', fx: { res: { DIP: 1 }, rel: { tw: -1 } } } } },
          { label: '按下不表', desc: '不让暗杀干扰万隆大局。', fx: { res: { STB: 1, DIP: 1 } } },
        ] },
      weakened: { desc: '特务活动阴影不散，人心微澜。', fx: { res: { STB: -1, DIP: -1 } } } },

    { id: 'a1_17', name: '第一次台海危机', year: 1954, type: 'crisis', ap: 3, tag: 'tw', img: 'military', once: true,
      flavor: '一江山岛的炮声，试探着美国协防的底线。',
      event: { desc: '沿海岛屿之战。',
        choices: [
          { label: '攻取沿海岛屿', desc: '解放一江山、大陈，展示决心。', roll: { ge: 3,
            ok: { desc: '陆海空首次协同作战成功，沿海态势改观。', fx: { res: { MIL: 5, STB: 2 }, rel: { tw: -1, us: -2 } } },
            bad: { desc: '强攻受挫，伤亡不小，美舰队高调巡弋。', fx: { res: { MIL: 1, STB: -2 }, rel: { us: -2 } } } } },
          { label: '炮击但不登陆', desc: '保持压力，避免与美军摊牌。', fx: { res: { MIL: 2 }, rel: { tw: -1, us: -1 } } },
        ] },
      weakened: { desc: '海峡对峙升温，美台走近。', fx: { rel: { us: -1, tw: -1 } } } },

    { id: 'a1_18', name: '美台共同防御条约', year: 1954, type: 'crisis', ap: 2, tag: 'us', img: 'crisis', once: true,
      flavor: '华盛顿与台北签约，第七舰队的存在被条约固定下来。',
      event: { desc: '遏制链条收紧。',
        choices: [
          { label: '强硬声明+军事施压', desc: '宣示决不承认，福建前线加强备战。', fx: { res: { MIL: 2, DIP: -1, ECO: -2 }, rel: { us: -2, tw: -2 } } },
          { label: '冷处理', desc: '抗议照会之外不升级，把精力留给建设。', fx: { res: { DIP: -2 }, rel: { tw: -1 } } },
        ] },
      weakened: { desc: '条约既成事实，统一议程被长期搁置。', fx: { res: { DIP: -2 }, rel: { tw: -2, us: -1 } } } },

    { id: 'a1_19', name: '西藏和平解放', year: 1951, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '十七条协议签订，五星红旗插上高原。',
      event: { desc: '稳定+4，国际地位-1（西方非议）。', fx: { res: { STB: 4, DIP: -1 } } } },

    { id: 'a1_20', name: '根治水患', year: 1951, type: 'event', ap: 2, tag: 'home', img: 'economy',
      flavor: '"一定要把淮河修好。"数百万民工上了河堤。',
      event: { desc: '经济+3，稳定+2。', fx: { res: { ECO: 3, STB: 2 } } } },

    { id: 'a1_21', name: '扫盲运动', year: 1952, type: 'event', ap: 1, tag: 'home', img: 'home',
      flavor: '识字班的煤油灯，点亮在田间地头。',
      event: { desc: '稳定+2，经济+1。', fx: { res: { STB: 2, ECO: 1 } } } },

    { id: 'a1_22', name: '婚姻法颁布', year: 1950, type: 'event', ap: 1, tag: 'home', img: 'home', once: true,
      flavor: '废除包办婚姻，妇女能顶半边天。',
      event: { desc: '稳定+2，国际地位+1。', fx: { res: { STB: 2, DIP: 1 } } } },

    { id: 'a1_23', name: '公私合营', year: 1956, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true,
      flavor: '锣鼓声中，资本家们"敲锣打鼓进入社会主义"。',
      event: { desc: '社会主义改造完成的方式。',
        choices: [
          { label: '一步到位', desc: '全行业公私合营，迅速完成改造。', fx: { res: { ECO: 3, STB: 2 }, flags: ['socialist_transform'] } },
          { label: '赎买渐进', desc: '定息赎买，留出缓冲。', fx: { res: { ECO: 4 }, flags: ['socialist_transform'] } },
        ] } },

    { id: 'a1_24', name: '统购统销', year: 1953, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true,
      flavor: '国家的手伸进了粮仓，为工业化积累每一粒粮食。',
      event: { desc: '经济+3，稳定-1。', fx: { res: { ECO: 3, STB: -1 } } } },

    { id: 'a1_25', name: '双百方针', year: 1956, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '百花齐放，百家争鸣——知识分子的早春天气。',
      event: { desc: '开放言路，收放之间。',
        choices: [
          { label: '真诚放开', desc: '鼓励鸣放，听取批评。', fx: { res: { DIP: 2, STB: -1 }, flags: ['hundred_flowers'] } },
          { label: '谨慎控场', desc: '口号照提，边界收紧。', fx: { res: { STB: 1 } } },
        ] } },

    { id: 'a1_26', name: '反右运动', year: 1957, type: 'crisis', ap: 2, tag: 'home', img: 'crisis', once: true,
      flavor: '鸣放的言论被定性为"毒草"，五十五万人戴上了帽子。',
      event: { desc: '风向逆转，如何划线？',
        choices: [
          { label: '扩大化', desc: '宁可错划，不可漏网。短期整齐划一，长远寒了人心。', fx: { res: { STB: 3, DIP: -2 }, flags: ['antirightist_wide'] } },
          { label: '严控范围', desc: '划线从严掌握，保护多数知识分子。', roll: { ge: 4,
            ok: { desc: '运动被控制在小范围，元气得存。', fx: { res: { STB: 1 } } },
            bad: { desc: '基层层层加码，范围仍然失控。', fx: { res: { STB: 2, DIP: -1 }, flags: ['antirightist_wide'] } } } },
        ] },
      weakened: { desc: '政治风向收紧，知识界噤声。', fx: { res: { DIP: -1, STB: 1 } } } },

    { id: 'a1_27', name: '苏共二十大', year: 1956, type: 'crisis', ap: 3, tag: 'ussr', img: 'crisis', once: true,
      flavor: '赫鲁晓夫的秘密报告，震塌了斯大林的神像，也震裂了阵营的地基。',
      event: { desc: '去斯大林化冲击波来袭。',
        choices: [
          { label: '有保留地跟进', desc: '"三七开"评价斯大林，保持阵营团结的表象。', fx: { rel: { ussr: -1 }, res: { STB: 1, DIP: 1 } } },
          { label: '公开分歧', desc: '发表文章阐明不同立场，埋下裂痕的种子。', fx: { rel: { ussr: -2 }, res: { STB: 2 }, flags: ['destalin_rift'] } },
        ] },
      weakened: { desc: '阵营内思想混乱蔓延。', fx: { rel: { ussr: -1 }, res: { STB: -1 } } } },

    { id: 'a1_28', name: '波匈事件', year: 1956, type: 'event', ap: 2, tag: 'world', img: 'world', once: true,
      flavor: '布达佩斯街头的坦克，让整个阵营屏住了呼吸。',
      event: { desc: '东欧动荡，北京表态。',
        choices: [
          { label: '支持苏联出兵', desc: '维护阵营纪律高于一切。', fx: { rel: { ussr: 2, eu: -2 }, res: { DIP: -1 } } },
          { label: '劝和促谈', desc: '主张平等协商，赢得东欧好感。', fx: { rel: { ussr: -1, eu: 1 }, res: { DIP: 2 } } },
        ] } },

    { id: 'a1_29', name: '中日民间贸易协定', year: 1952, type: 'event', ap: 2, tag: 'jp', img: 'economy',
      flavor: '政冷经热——没有邦交，生意先行。',
      event: { desc: '经济+2，日本+2。', fx: { res: { ECO: 2 }, rel: { jp: 2 } } } },

    { id: 'a1_30', name: '归国侨汇', year: 1955, type: 'event', ap: 1, tag: 'sea', img: 'economy',
      flavor: '南洋的血汗钱，汇入百废待兴的故土。',
      event: { desc: '经济+3，东南亚+1。', fx: { res: { ECO: 3 }, rel: { sea: 1 } } } },

    { id: 'a1_31', name: '钱学森归国', year: 1955, type: 'boon', ap: 3, tag: 'home', img: 'boon', once: true,
      flavor: '"他一个人抵得上五个师。"美国人扣了他五年。',
      event: { desc: '军事+4，获得旗标"导弹之父"。', fx: { res: { MIL: 4 }, flags: ['qian'] } } },

    { id: 'a1_32', name: '人民空军初建', year: 1951, type: 'event', ap: 2, tag: 'home', img: 'military', once: true,
      flavor: '米格走廊上，年轻的飞行员与世界头号空军过招。',
      event: { desc: '军事+4，经济-2。', fx: { res: { MIL: 4, ECO: -2 } } } },

    { id: 'a1_33', name: '海军起步', year: 1953, type: 'event', ap: 2, tag: 'home', img: 'military', once: true,
      flavor: '从缴获的旧舰起家，面朝一万八千公里海岸线。',
      event: { desc: '军事+3，经济-2。', fx: { res: { MIL: 3, ECO: -2 } } } },

    { id: 'a1_34', name: '武汉长江大桥', year: 1957, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true,
      flavor: '一桥飞架南北，天堑变通途。',
      event: { desc: '经济+3，稳定+2，国际地位+1。', fx: { res: { ECO: 3, STB: 2, DIP: 1 } } } },

    { id: 'a1_35', name: '第一辆解放牌汽车', year: 1956, type: 'boon', ap: 1, tag: 'home', img: 'boon', once: true,
      flavor: '长春一汽下线，中国人不能造汽车的历史结束了。',
      event: { desc: '经济+3。', fx: { res: { ECO: 3 } } } },

    { id: 'a1_36', name: '鞍钢复产', year: 1950, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true,
      flavor: '共和国钢铁工业的长子重新点燃高炉。',
      event: { desc: '经济+4。', fx: { res: { ECO: 4 } } } },

    { id: 'a1_37', name: '中缅边界谈判', year: 1956, type: 'event', ap: 1, tag: 'sea', img: 'diplomacy',
      flavor: '主动让步换取信任，为周边外交立下样板。',
      event: { desc: '东南亚+2，国际地位+2。', fx: { rel: { sea: 2 }, res: { DIP: 2 } } } },

    { id: 'a1_38', name: '联合国席位之争', year: 1955, type: 'event', ap: 2, tag: 'world', img: 'world',
      flavor: '每年一次的表决，每年一次的封杀。',
      event: { desc: '发起外交攻势冲击封锁。', roll: { ge: 4,
        ok: { desc: '支持票显著增加，封锁出现松动迹象。', fx: { res: { DIP: 3 } } },
        bad: { desc: '美国操纵"缓议案"再次得逞。', fx: { res: { DIP: 1 }, rel: { us: -1 } } } } } },

    { id: 'a1_39', name: '禁毒禁娼', year: 1950, type: 'event', ap: 1, tag: 'home', img: 'home', once: true,
      flavor: '两百年烟毒，三年扫清。',
      event: { desc: '稳定+4。', fx: { res: { STB: 4 } } } },

    { id: 'a1_40', name: '收回旅顺口', year: 1955, type: 'event', ap: 2, tag: 'ussr', img: 'diplomacy', once: true, reqRel: { ussr: 3 },
      flavor: '苏军撤离，军港回到中国手中——盟友关系里也要寸土必争。',
      event: { desc: '国际地位+3，军事+1，苏联-1。', fx: { res: { DIP: 3, MIL: 1 }, rel: { ussr: -1 } } } },

    { id: 'a1_41', name: '党内整风', year: 1957, type: 'event', ap: 1, tag: 'home', img: 'home',
      flavor: '整顿作风，也在校准权力的天平。',
      event: { desc: '稳定+2。', fx: { res: { STB: 2 } } } },

    { id: 'a1_42', name: '外贸破冰', year: 1957, type: 'event', ap: 2, tag: 'eu', img: 'economy',
      flavor: '广交会开幕，铁幕缝隙里做成的第一批生意。',
      event: { desc: '经济+3，英国+1，欧洲+1。', fx: { res: { ECO: 3 }, rel: { uk: 1, eu: 1 } } } },

    { id: 'a1_43', name: '英国承认新中国', year: 1950, type: 'event', ap: 2, tag: 'uk', img: 'diplomacy', once: true,
      flavor: '为了香港与在华利益，伦敦成了第一个承认北京的西方大国。',
      event: { desc: '如何回应这份"半心半意"的承认？',
        choices: [
          { label: '顺水推舟', desc: '建立代办级关系，留下对西方的一扇窗。', fx: { rel: { uk: 3 }, res: { DIP: 3 }, flags: ['uk_recognition'] } },
          { label: '冷眼相待', desc: '斥其两面下注（仍在联合国投票支持台北），关系冷淡。', fx: { rel: { uk: 1, ussr: 1 }, res: { DIP: 1 } } },
        ] } },

    { id: 'a1_44', name: '香港：长期打算', year: 1949, type: 'event', ap: 2, tag: 'uk', img: 'diplomacy', once: true,
      flavor: '大军陈于深圳河北岸，却不过河——留着这个口岸，另有大用。',
      event: { desc: '确立"长期打算、充分利用"方针。经济+3，英国+2，获得旗标"香港窗口"。',
        fx: { res: { ECO: 3 }, rel: { uk: 2 }, flags: ['hk_window'] } } },
  ],
};
