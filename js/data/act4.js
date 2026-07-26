// 第四幕 · 改革开放 1977–1989
window.ACT_DATA = window.ACT_DATA || {};
window.ACT_DATA[4] = {
  meta: { act: 4, title: '改革开放', years: '1977–1989', turns: 7, img: 'act4',
    intro: '十年动乱结束，国门在长期封闭后重新打开。真理标准的讨论解冻思想，特区的塔吊竖起，十亿人的温饱与致富被重新提上日程。摸着石头过河的十年，物价、官倒与思潮的暗流也在悄悄汇聚，流向一九八九。' },

  turnZero: [
    { name: '思想解冻速度', desc: '拨乱反正走多快？旧口号还压在多少人头上？',
      mod: [ { flag: 'deng_back', delta: 1 }, { flag: 'gang_smashed', delta: 1 }, { flag: 'cr_chaos', delta: -1 } ],
      outcomes: [
        { range: [1, 2], desc: '"两个凡是"延宕时局，徘徊中前进。', fx: { res: { ECO: -3, STB: -2 }, flags: ['whatever_two'] } },
        { range: [3, 4], desc: '按史实轨道：解冻在争论中一步步推进。', fx: {} },
        { range: [5, 6], desc: '真理标准讨论提前引爆，思想闸门轰然打开。', fx: { res: { ECO: 3, DIP: 2 }, flags: ['thought_free'] } },
      ] },
    { name: '华盛顿的算盘', desc: '大洋彼岸对建交的诚意有几分？',
      mod: [ { flag: 'nixon_ok', delta: 1 }, { flag: 'nixon_missed', delta: -2 } ],
      outcomes: [
        { range: [1, 2], desc: '国会对台军售态度强硬，谈判基础被侵蚀。', fx: { rel: { us: -1, tw: -1 } } },
        { range: [3, 4], desc: '按史实轨道：接触继续，分歧犹存。', fx: {} },
        { range: [5, 6], desc: '白宫求成心切，建交条件明显放宽。', fx: { rel: { us: 2 } } },
      ] },
  ],

  finale: {
    title: '一九八九年结算', year: 1989, img: 'finale4',
    desc: '价格闯关失败，通货膨胀与官倒令不满情绪四处蔓延。学潮汇成大规模抗议，广场上人群经月不散。风波最终以戒严和清场收场，西方随即宣布制裁。大势已无可回避，你决定的是应对的方式与善后。',
    choices: [
      { label: '对话疏导', desc: '价格已理顺、家底尚稳，尚有把街头矛盾导回桌面的余地。', requires: ['price_reform_ok'], reqRes: { STB: 55 },
        roll: { ge: 3, ok: { desc: '对话降温，风波平稳落地，未酿成大规模流血。', fx: { res: { STB: -3, DIP: -2 }, flags: ['storm_light'] } },
                        bad: { desc: '局势几度反复，最终仍以强力手段收尾。', fx: { res: { STB: -6, DIP: -4 }, flags: ['storm_mid'] } } } },
      { label: '果断处置', desc: '不给事态发酵的时间，早收网、快平息。乱不起来，账也小。', requires: ['price_reform_ok'], reqRes: { STB: 55 },
        fx: { res: { STB: 2, DIP: -5 }, rel: { us: -2, uk: -1, eu: -2, jp: -1 }, flags: ['storm_mid'] } },
      { label: '戒严清场', desc: '调兵入城，武力清场。动荡就此终结，秩序与路线得以延续——账单记在外交栏上，由整个九十年代偿还。',
        fx: { res: { STB: 4, DIP: -8 }, rel: { us: -3, uk: -2, eu: -3, jp: -2 }, flags: ['storm_heavy', 'sanctioned'] } },
      { label: '让步妥协', desc: '承认诉求、改组人事，赌一个软着陆。',
        roll: { ge: 5, ok: { desc: '有限改组后局面稳住，付出了权威受损的代价。', fx: { res: { STB: -10, DIP: -3 }, flags: ['storm_concede'] } },
                        bad: { desc: '让步被解读为软弱，失控滑向更大动荡。', fx: { res: { STB: -15, ECO: -8 }, flags: ['storm_spiral'] } } } },
    ],
  },

  cards: [
    { id: 'a4_01', name: '真理标准大讨论', year: 1978, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '《实践是检验真理的唯一标准》见报，一石激起千层浪。',
      event: { desc: '思想解放的第一声惊雷，表态还是观望？',
        choices: [
          { label: '旗帜鲜明支持', desc: '为讨论撑腰，冲破"两个凡是"。', fx: { res: { STB: 2, ECO: 2 }, flags: ['thought_free'] } },
          { label: '暂不表态', desc: '让子弹再飞一会儿，稳字当头。', fx: { res: { STB: 1 } } },
        ] } },

    { id: 'a4_02', priority: true, name: '十一届三中全会', year: 1978, type: 'event', ap: 3, tag: 'home', img: 'home', once: true,
      flavor: '把党和国家工作重心转移到经济建设上来。',
      event: { desc: '历史转折。经济+6，稳定+3，获得旗标"改革"。', fx: { res: { ECO: 6, STB: 3 }, flags: ['reform'] } } },

    { id: 'a4_03', name: '小岗村包产到户', year: 1978, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true,
      flavor: '十八个红手印，按在一纸"生死契约"上。',
      event: { desc: '经济+4，稳定+2，获得旗标"包产到户"。', fx: { res: { ECO: 4, STB: 2 }, flags: ['baochan'] } } },

    { id: 'a4_04', name: '家庭联产承包推广', year: 1982, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true, requires: ['baochan'],
      flavor: '交够国家的，留足集体的，剩下都是自己的。',
      event: { desc: '经济+4，稳定+2。', fx: { res: { ECO: 4, STB: 2 } } } },

    { id: 'a4_05', name: '恢复高考', year: 1977, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true,
      flavor: '五百七十万考生从田间和车间走回考场。',
      event: { desc: '稳定+3，经济+2。', fx: { res: { STB: 3, ECO: 2 } } } },

    { id: 'a4_06', name: '平反冤假错案', year: 1978, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '数百万人摘掉帽子，人心在一纸纸改正结论里回暖。',
      event: { desc: '稳定+4。', fx: { res: { STB: 4 } } } },

    { id: 'a4_07', name: '第二代核心确立', year: 1980, type: 'event', ap: 1, tag: 'home', img: 'home', once: true,
      flavor: '华国锋渐次去职，改革派掌握了船舵。',
      event: { desc: '权力交接平稳完成。稳定+2。', fx: { res: { STB: 2 } } } },

    { id: 'a4_08', name: '经济特区', year: 1980, type: 'event', ap: 3, tag: 'home', img: 'economy', once: true, requires: ['reform'],
      flavor: '在深圳、珠海、汕头、厦门"杀出一条血路"。',
      event: { desc: '给政策不给钱，办不办特区？',
        choices: [
          { label: '大胆地试', desc: '划出四个口子引进外资，姓资姓社的争论随之而来。', roll: { ge: 3,
            ok: { desc: '特区拔地而起，成为窗口与试验场。', fx: { res: { ECO: 5, DIP: 1 }, flags: ['sez'] } },
            bad: { desc: '"租界"骂声不断，特区在争议中艰难起步。', fx: { res: { ECO: 2, STB: -2 }, flags: ['sez'] } } } },
          { label: '缓步走', desc: '先搞出口加工区试点，不担政治风险。', fx: { res: { ECO: 2 } } },
        ] } },

    { id: 'a4_09', name: '蛇口工业区', year: 1979, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true, requires: ['sez'],
      flavor: '"时间就是金钱，效率就是生命"立在工地上。',
      event: { desc: '经济+4，国际地位+1。', fx: { res: { ECO: 4, DIP: 1 } } } },

    { id: 'a4_10', priority: true, name: '中美建交', year: 1979, type: 'event', ap: 3, tag: 'us', img: 'diplomacy', once: true,
      flavor: '一九七九年一月一日，两国互相承认并建立外交关系。',
      event: { desc: '断交、废约、撤军之后，太平洋两岸正式握手。',
        choices: [
          { label: '水到渠成', desc: '当年破冰铺好的路，如今顺势走完。', requires: ['nixon_ok'],
            fx: { rel: { us: 4 }, res: { ECO: 4, DIP: 4 }, flags: ['us_normal'] } },
          { label: '艰难谈判', desc: '缺少铺垫，从头谈起，对台军售是死结。', roll: { ge: 4,
            ok: { desc: '几经拉锯终于建交，公报措辞各留余地。', fx: { rel: { us: 3 }, res: { ECO: 3, DIP: 3 }, flags: ['us_normal'] } },
            bad: { desc: '谈判在军售问题上搁浅，仅换来关系升温。', fx: { rel: { us: 1 }, res: { DIP: 1 } } } } },
        ] } },

    { id: 'a4_11', name: '《告台湾同胞书》', year: 1979, type: 'event', ap: 2, tag: 'tw', img: 'diplomacy', once: true,
      flavor: '元旦这一天，金门的炮声停了。',
      event: { desc: '停止炮击金门，呼吁两岸对话。台湾+2，国际地位+1。', fx: { rel: { tw: 2 }, res: { DIP: 1 } } } },

    { id: 'a4_12', name: '对台三通倡议', year: 1981, type: 'event', ap: 2, tag: 'tw', img: 'diplomacy',
      flavor: '通邮、通航、通商——隔着海峡递出的橄榄枝。',
      event: { desc: '善意能否穿透海峡？',
        choices: [
          { label: '持续释放善意', desc: '倡议叶九条，敞开探亲经贸之门。', roll: { ge: 4,
            ok: { desc: '台北虽答以"三不"，民间往来已暗流涌动。', fx: { rel: { tw: 2 }, res: { DIP: 1 } } },
            bad: { desc: '"不接触、不谈判、不妥协"，善意暂被挡回。', fx: { res: { DIP: 1 } } } } },
          { label: '以武促统姿态', desc: '不放弃武力选项，逼对岸上桌。', fx: { rel: { tw: -2 }, res: { MIL: 1, DIP: -1 } } },
        ] } },

    { id: 'a4_13', name: '中越战争', year: 1979, type: 'crisis', ap: 3, tag: 'sea', img: 'crisis', once: true,
      flavor: '昔日"同志加兄弟"陈兵柬埔寨，北疆战云密布。',
      event: { desc: '越南入侵柬埔寨并不断挑衅边境，打不打？',
        choices: [
          { label: '有限惩戒，速战速撤', desc: '打到谅山即止，一个月内撤军。', roll: { ge: 3,
            ok: { desc: '达成惩戒目的后全身而退，向世界展示了决心。', fx: { res: { MIL: 3, DIP: -1 }, rel: { sea: -2, ussr: -2 }, flags: ['viet_war'] } },
            bad: { desc: '装备战法落后暴露无遗，伤亡远超预期。', fx: { res: { MIL: -2, STB: -1, DIP: -2 }, rel: { sea: -2, ussr: -2 }, flags: ['viet_war'] } } } },
          { label: '深入作战', desc: '直捣河内方向，彻底解决问题。', fx: { res: { MIL: -4, ECO: -4, DIP: -3 }, rel: { sea: -3, ussr: -3 }, flags: ['viet_war'] } },
          { label: '按兵不动', desc: '外交抗议为限，不启战端。', fx: { res: { DIP: -1 }, rel: { sea: 1, ussr: -1 } } },
        ] },
      weakened: { desc: '边境冲突绵延不绝，轮战消耗着国力。', fx: { res: { STB: -2, ECO: -2 }, rel: { sea: -1 } } } },

    { id: 'a4_14', name: '中日和平友好条约', year: 1978, type: 'event', ap: 2, tag: 'jp', img: 'diplomacy', once: true, requires: ['jp_normal'],
      flavor: '邓小平访日乘新干线："就感觉到快。"',
      event: { desc: '日本+3，经济+3。', fx: { rel: { jp: 3 }, res: { ECO: 3 } } } },

    { id: 'a4_15', name: '宝钢与日元贷款', year: 1979, type: 'event', ap: 2, tag: 'jp', img: 'economy', once: true,
      flavor: '上海滩涂上立起成套引进的钢铁巨人。',
      event: { desc: '经济+4，日本+1。', fx: { res: { ECO: 4 }, rel: { jp: 1 } } } },

    { id: 'a4_16', name: '人口洪峰', year: 1980, type: 'crisis', ap: 2, tag: 'home', img: 'crisis', once: true,
      flavor: '总人口逼近十亿，粮食与就业的压力扑面而来。',
      event: { desc: '计划生育被提上基本国策，如何执行？',
        choices: [
          { label: '一孩硬性推行', desc: '一对夫妇只生一个孩子，令行禁止。', fx: { res: { STB: -1, ECO: 2 }, flags: ['one_child'] } },
          { label: '弹性提倡', desc: '晚婚晚育、优生优育，宣传引导为主。', fx: { res: { ECO: 1 } } },
        ] },
      weakened: { desc: '人口压力悬而未决，粮食就业双双趋紧。', fx: { res: { ECO: -2, STB: -1 } } } },

    { id: 'a4_17', name: '一九八三严打', year: 1983, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '治安恶化引来雷霆手段，"从重从快"响彻全国。',
      event: { desc: '整肃社会治安。',
        choices: [
          { label: '从重从快', desc: '运动式严打，声势与冤错并存。', fx: { res: { STB: 4, DIP: -1 } } },
          { label: '法制轨道', desc: '依法从严，不搞指标摊派。', fx: { res: { STB: 2 } } },
        ] } },

    { id: 'a4_18', name: '洛杉矶奥运会', year: 1984, type: 'boon', ap: 2, tag: 'world', img: 'boon', once: true,
      flavor: '许海峰一枪实现零的突破，女排姑娘完成三连冠。',
      event: { desc: '稳定+3，国际地位+3。', fx: { res: { STB: 3, DIP: 3 } } } },

    { id: 'a4_19', name: '中英香港谈判', year: 1982, type: 'crisis', ap: 3, tag: 'uk', img: 'crisis', once: true,
      flavor: '撒切尔夫人携马岛余威而来，在人民大会堂台阶上跌了一跤。',
      event: { desc: '香港前途摆上谈判桌，主权问题没有回旋余地。',
        choices: [
          { label: '以经促谈', desc: '三十年经营的窗口此刻生效：主权归我，制度不变，谈得从容。', requires: ['hk_window'],
            fx: { rel: { uk: 2 }, res: { DIP: 4, ECO: 2 }, flags: ['hk_deal'] } },
          { label: '主权底线＋一国两制', desc: '主权问题不容谈判，治权安排可以商量。', roll: { ge: 3,
            ok: { desc: '二十二轮谈判后框架敲定，港人心渐安。', fx: { rel: { uk: 2 }, res: { DIP: 4 }, flags: ['hk_deal'] } },
            bad: { desc: '谈判几度濒临破裂，港元暴跌后终达框架。', fx: { rel: { uk: 1 }, res: { DIP: 2, ECO: -2 }, flags: ['hk_deal'] } } } },
          { label: '强硬收回，不谈判', desc: '限期交还，不惜代价。', fx: { rel: { uk: -4 }, res: { ECO: -3, DIP: -2 }, flags: ['hk_force'] } },
        ] },
      weakened: { desc: '前途未明，港元动荡，资本外流。', fx: { res: { ECO: -3, DIP: -1 }, rel: { uk: -1 } } } },

    { id: 'a4_20', name: '中英联合声明签署', year: 1984, type: 'boon', ap: 2, tag: 'uk', img: 'boon', once: true, requires: ['hk_deal'],
      flavor: '一九九七年七月一日恢复行使主权——白纸黑字。',
      event: { desc: '英国+3，国际地位+3。', fx: { rel: { uk: 3 }, res: { DIP: 3 } } } },

    { id: 'a4_21', name: '中葡澳门联合声明', year: 1987, type: 'event', ap: 1, tag: 'eu', img: 'diplomacy', once: true, requires: ['hk_deal'],
      flavor: '香港方案照进濠江，一九九九回归有期。',
      event: { desc: '欧洲+1，国际地位+2。', fx: { rel: { eu: 1 }, res: { DIP: 2 }, flags: ['macau_deal'] } } },

    { id: 'a4_22', name: '价格闯关', year: 1988, type: 'crisis', ap: 3, tag: 'home', img: 'crisis', once: true,
      flavor: '"长痛不如短痛"，物价的堤坝要不要一次掘开？',
      event: { desc: '双轨制积弊已深，价格改革到了关口。',
        choices: [
          { label: '硬闯', desc: '放开大部分价格管制，赌民众承受力。', roll: { ge: 5,
            ok: { desc: '闯关成功，价格信号终于理顺。', fx: { res: { ECO: 5 }, flags: ['price_reform_ok'] } },
            bad: { desc: '抢购挤兑席卷全国，通胀失控。', fx: { res: { ECO: -6, STB: -6 }, flags: ['inflation'] } } } },
          { label: '缓行', desc: '治理整顿优先，闯关暂缓。', fx: { res: { ECO: -1 }, flags: ['price_delay'] } },
        ] },
      weakened: { desc: '双轨价差继续撕扯经济，通胀预期抬头。', fx: { res: { ECO: -3, STB: -2 } } } },

    { id: 'a4_23', name: '官倒与双轨制', year: 1986, type: 'crisis', ap: 2, tag: 'home', img: 'crisis', once: true,
      flavor: '一纸批文倒手之间，价差落进了谁的口袋？',
      event: { desc: '计划价与市场价之间，"官倒"肆意寻租，民怨渐起。',
        choices: [
          { label: '铁腕整治', desc: '清查倒卖批件的公司，不论后台。', roll: { ge: 4,
            ok: { desc: '一批皮包公司被查处，民心稍振。', fx: { res: { STB: 3, ECO: 1 } } },
            bad: { desc: '盘根错节，查处流于表面，民怨未消。', fx: { res: { STB: -2 } } } } },
          { label: '默认现状', desc: '发展要紧，睁一眼闭一眼。', fx: { res: { ECO: 1, STB: -3 } } },
        ] },
      weakened: { desc: '"官倒"骂声载道，不满在市井间积聚。', fx: { res: { STB: -3 } } } },

    { id: 'a4_24', name: '八六学潮', year: 1986, type: 'crisis', ap: 2, tag: 'home', img: 'crisis', once: true,
      flavor: '冬天的校园并不平静，一位总书记为此去职。',
      event: { desc: '多地高校学潮涌起，党内分歧公开化，胡耀邦被迫辞职。',
        choices: [
          { label: '反自由化收紧', desc: '开展反对资产阶级自由化，划清界线。', fx: { res: { STB: 2, DIP: -2 } } },
          { label: '低调降温', desc: '就事论事平息风潮，避免政治定性扩大。', roll: { ge: 4,
            ok: { desc: '风潮渐息，改革空气未受重伤。', fx: { res: { STB: 1 } } },
            bad: { desc: '处置迟疑招致党内批评，风向照旧收紧。', fx: { res: { STB: -2, DIP: -1 } } } } },
        ] },
      weakened: { desc: '校园暗流与党内分歧同时发酵。', fx: { res: { STB: -3 } } } },

    { id: 'a4_25', name: '戈尔巴乔夫上台', year: 1985, type: 'event', ap: 2, tag: 'world', img: 'world', once: true,
      flavor: '莫斯科来了位讲"新思维"的年轻总书记。',
      event: { desc: '北方的坚冰出现裂缝。',
        choices: [
          { label: '试探缓和', desc: '就"三大障碍"重开磋商。', fx: { rel: { ussr: 2 } } },
          { label: '静观其变', desc: '先看他改成什么样，不急表态。', fx: { res: { STB: 1 } } },
        ] } },

    { id: 'a4_26', name: '中苏关系正常化进程', year: 1989, type: 'event', ap: 2, tag: 'ussr', img: 'diplomacy', once: true, reqRel: { ussr: -4 },
      flavor: '"结束过去，开辟未来。"三十年恩怨作一揖了。',
      event: { desc: '苏联+3，国际地位+2。', fx: { rel: { ussr: 3 }, res: { DIP: 2 }, flags: ['sino_sov_normal'] } } },

    { id: 'a4_27', name: '百万大裁军', year: 1985, type: 'event', ap: 3, tag: 'home', img: 'military', once: true,
      flavor: '"军队要忍耐。"和平与发展被判断为时代主题。',
      event: { desc: '裁减员额一百万？',
        choices: [
          { label: '裁军一百万', desc: '消肿转型，把钱省给现代化。', fx: { res: { MIL: -5, ECO: 5, DIP: 2 }, flags: ['demob'] } },
          { label: '维持规模', desc: '北方百万陈兵未撤，不敢轻动。', fx: { res: { MIL: 1, ECO: -2 } } },
        ] } },

    { id: 'a4_28', name: '军转民', year: 1986, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true, requires: ['demob'],
      flavor: '军工生产线上，坦克让位给摩托车与冰箱。',
      event: { desc: '经济+4。', fx: { res: { ECO: 4 } } } },

    { id: 'a4_29', name: '乡镇企业异军突起', year: 1984, type: 'boon', ap: 2, tag: 'home', img: 'boon', once: true, requires: ['reform'],
      flavor: '离土不离乡，进厂不进城。',
      event: { desc: '经济+5。', fx: { res: { ECO: 5 } } } },

    { id: 'a4_30', name: '万元户与个体户', year: 1981, type: 'event', ap: 1, tag: 'home', img: 'economy',
      flavor: '第一张个体工商业执照发出，"万元户"成了新词。',
      event: { desc: '经济+3，稳定+1。', fx: { res: { ECO: 3, STB: 1 } } } },

    { id: 'a4_31', name: '引进外资合资企业', year: 1984, type: 'event', ap: 2, tag: 'us', img: 'economy', once: true,
      flavor: '可口可乐重返中国，桑塔纳驶下上海生产线。',
      event: { desc: '经济+4，美国+1，欧洲+1。', fx: { res: { ECO: 4 }, rel: { us: 1, eu: 1 } } } },

    { id: 'a4_32', name: '留学潮', year: 1978, type: 'event', ap: 2, tag: 'home', img: 'home', once: true,
      flavor: '"要成千成万地派，不是只派十个八个。"',
      event: { desc: '国门打开，人才向外流动。',
        choices: [
          { label: '放开派遣', desc: '公派自费并举，赌他们学成归来。', fx: { res: { ECO: 2, DIP: 2 }, flags: ['study_abroad'] } },
          { label: '从严控制', desc: '只派少量公派生，防人才不归。', fx: { res: { STB: 1 } } },
        ] } },

    { id: 'a4_33', name: '海南建省办特区', year: 1988, type: 'event', ap: 2, tag: 'home', img: 'economy', once: true, requires: ['sez'],
      flavor: '十万人才下海南，最大的特区在琼州海峡对岸诞生。',
      event: { desc: '经济+3，获得旗标"海南特区"。', fx: { res: { ECO: 3 }, flags: ['hainan_sez'] } } },

    { id: 'a4_34', name: '科学的春天与863计划', year: 1986, type: 'event', ap: 2, tag: 'home', img: 'military', once: true, requires: ['satellite'],
      flavor: '四位老科学家上书，高技术研究列入国家计划。',
      event: { desc: '军事+2，经济+2。', fx: { res: { MIL: 2, ECO: 2 } } } },

    { id: 'a4_35', name: '美苏缓和大势', year: 1987, type: 'event', ap: 1, tag: 'world', img: 'world', once: true,
      flavor: '《中导条约》签署，两超对峙的弦松了半分。',
      event: { desc: '大三角松动，回旋余地生变。国际地位+1，苏联+1。', fx: { res: { DIP: 1 }, rel: { ussr: 1 } } } },

    { id: 'a4_36', name: '南极长城站', year: 1985, type: 'boon', ap: 1, tag: 'world', img: 'boon', once: true,
      flavor: '五星红旗第一次插上南极洲。',
      event: { desc: '国际地位+2。', fx: { res: { DIP: 2 } } } },

    { id: 'a4_37', name: '正大集团与外资北上', year: 1979, type: 'event', ap: 2, tag: 'sea', img: 'economy', once: true,
      flavor: '深圳"外资001号"执照，发给了曼谷来的华商。',
      event: { desc: '东南亚+2，经济+2。', fx: { rel: { sea: 2 }, res: { ECO: 2 } } } },

    { id: 'a4_38', name: '新加坡经验考察', year: 1978, type: 'event', ap: 1, tag: 'sea', img: 'diplomacy', once: true,
      flavor: '花园城市与引资之道，让来访者看了又看。',
      event: { desc: '东南亚+2，获得旗标"新加坡经验"。', fx: { rel: { sea: 2 }, flags: ['sg_model'] } } },

    { id: 'a4_39', name: '中韩民间贸易萌芽', year: 1988, type: 'event', ap: 1, tag: 'sk', img: 'economy',
      flavor: '没有邦交的生意，经香港转口悄然增长。',
      event: { desc: '韩国+2，经济+1。', fx: { rel: { sk: 2 }, res: { ECO: 1 } } } },

    { id: 'a4_40', name: '汉城奥运会', year: 1988, type: 'event', ap: 2, tag: 'sk', img: 'world', once: true,
      flavor: '苏联东欧都去了汉城，平壤在等北京的答复。',
      event: { desc: '参赛还是抵制？',
        choices: [
          { label: '组团参赛', desc: '体育归体育，顺势与汉城接近。', fx: { rel: { sk: 2, nk: -2 }, res: { DIP: 2 } } },
          { label: '随朝抵制', desc: '照顾平壤感受，缺席汉城。', fx: { rel: { nk: 2, sk: -2 }, res: { DIP: -1 } } },
        ] } },

    { id: 'a4_41', name: '朝鲜的猜忌', year: 1985, type: 'crisis', ap: 1, tag: 'nk', img: 'crisis', once: true,
      flavor: '中国与汉城眉来眼去，平壤的不满溢于言表。',
      event: { desc: '老盟友对你的对韩缓和心存芥蒂。',
        choices: [
          { label: '高层安抚', desc: '重申传统友谊，解释开放方针。', roll: { ge: 3,
            ok: { desc: '面子给足，平壤暂且释然。', fx: { rel: { nk: 1 } } },
            bad: { desc: '口惠而实不至，猜忌未消。', fx: { rel: { nk: -1 } } } } },
          { label: '走自己的路', desc: '国家利益优先，不为盟友情绪转向。', fx: { rel: { nk: -2, sk: 1 } } },
        ] },
      weakened: { desc: '平壤的不满在暗中积累。', fx: { rel: { nk: -1 } } } },

    { id: 'a4_42', name: '仰光爆炸案', year: 1983, type: 'crisis', ap: 2, tag: 'nk', img: 'crisis', once: true,
      flavor: '昂山陵园一声巨响，韩国多名内阁成员罹难，矛头指向平壤。',
      event: { desc: '半岛紧张骤然升级，夹在旧盟友与新格局之间。',
        choices: [
          { label: '私下告诫平壤', desc: '劝其克制冒险行径，为半岛降温。', fx: { rel: { nk: -1, sk: 1 }, res: { DIP: 1 } } },
          { label: '不置一词', desc: '既不谴责也不背书，装聋作哑。', fx: { rel: { nk: 1, sk: -1 }, res: { DIP: -1 } } },
        ] },
      weakened: { desc: '半岛紧张牵动东北亚，各方侧目。', fx: { res: { DIP: -1 }, rel: { sk: -1 } } } },
  ],
};
