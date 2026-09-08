(() => {
  'use strict';

  const lang = document.documentElement.dataset.lang || (location.pathname.startsWith('/cn') ? 'cn' : 'en');

  const setText = (el, value) => {
    if (!el) return;
    if (el.textContent.trim() !== value) el.textContent = value;
  };

  const setHtml = (el, value) => {
    if (!el) return;
    if (el.innerHTML !== value) el.innerHTML = value;
  };

  const setTitleKeepingLink = (el, value) => {
    if (!el) return;
    const link = el.querySelector('a');
    const current = Array.from(el.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent)
      .join('')
      .trim();
    if (current === value) return;
    el.textContent = value;
    if (link) {
      el.append(' ');
      el.append(link);
    }
  };

  const setTags = (root, values) => {
    if (!root) return;
    root.querySelectorAll('.jn-tags').forEach((el, index) => {
      if (values[index] !== undefined) setText(el, values[index]);
    });
  };

  const addStyles = () => {
    if (document.getElementById('jn-language-switch-style')) return;
    const style = document.createElement('style');
    style.id = 'jn-language-switch-style';
    style.textContent = `
      .jn-language-switch-inline{display:inline-flex;align-items:center;gap:.3rem;margin-left:.55rem;vertical-align:middle;white-space:nowrap;font-size:.78rem}
      .jn-language-switch-inline a{color:#6c757d;text-decoration:none;font-weight:600;padding:.15rem .2rem;border-radius:.25rem}
      .jn-language-switch-inline a:hover,.jn-language-switch-inline a.active{color:var(--purple,#731191)}
      .jn-language-switch-inline a.active{font-weight:800}
      .jn-language-switch-inline span{color:rgba(0,0,0,.28)}
      @media(max-width:575.98px){.jn-language-switch-inline{font-size:.72rem;margin-left:.3rem;gap:.15rem}.jn-language-switch-inline a{padding:.1rem}}
    `;
    document.head.appendChild(style);
  };

  const addSwitcher = () => {
    if (document.querySelector('.jn-language-switch-inline')) return true;
    const logoWrap = document.querySelector('#navbar-top .jn-logo');
    if (!logoWrap) return false;
    const box = document.createElement('span');
    box.className = 'jn-language-switch-inline';
    box.setAttribute('aria-label', lang === 'cn' ? '语言切换' : 'Language switcher');
    box.innerHTML = `<a href="/cn/" class="${lang === 'cn' ? 'active' : ''}">中文</a><span>/</span><a href="/en/" class="${lang === 'en' ? 'active' : ''}">EN</a>`;
    logoWrap.appendChild(box);
    return true;
  };

  const appReady = () => (
    document.querySelectorAll('#Conversations .conversation').length >= 5 &&
    document.querySelectorAll('#Abilities .jn-abilities-card').length >= 4 &&
    document.querySelectorAll('#Jobs .tab-pane').length >= 5 &&
    document.querySelectorAll('#Products .jn-product-card').length >= 7 &&
    document.querySelectorAll('#Works .jn-works-card').length >= 3 &&
    document.querySelectorAll('#Pricing .jn-card').length >= 3 &&
    document.querySelector('#Footer')
  );

  const localizeIntro = () => {
    const root = document.querySelector('#Introduce');
    if (!root) return;
    setText(root.querySelector('.jn-introduce-subtitle'), '一个没什么灵感的小说作者，一个迷路的旅行者。');
    setHtml(root.querySelector('.jn-introduce-doc > div'), `<p>你好，旅行者，在找什么吗？</p><p>欢迎来到 Zihan Huang，也就是 Henry 的线上小酒馆。这里收录了关于他的各种信息——从基本资料，到还算拿得出手的 <strong>技能</strong> 与 <strong>属性</strong>，以及曾经雇佣过他的 <strong>公司</strong>。</p><p>这个地方存在的意义？大概只是想在这片充满冒险的世界里，留下几道属于他的旅途痕迹。</p><p>在点杯喝的之前，有几件事要说明：</p><p><i class="bi bi-check-circle-fill text-purple"></i> 不含成人内容</p><p><i class="bi bi-check-circle-fill text-purple"></i> 冒险途中也可以访问</p><p><i class="bi bi-check-circle-fill text-purple"></i> 在营地休息时可以浏览</p><p><i class="bi bi-check-circle-fill text-purple"></i> 打怪时请勿观看</p><p><i class="bi bi-check-circle-fill text-purple"></i> 随时开放探索</p><p>旅行者，愿这段旅程终将通向群星！</p>`);
    const button = root.querySelector('.btn-purple');
    if (button) button.innerHTML = `链接开始！ &nbsp;<i class="bi bi-arrow-down-circle"></i>`;
  };

  const localizeConversations = () => {
    const root = document.querySelector('#Conversations');
    if (!root) return;
    setText(root.querySelector('.jn-badge'), '闲聊');
    const values = [
      '说说 Henry 吧。他出生于 1997 年，2003 年偶然接触到了人生第一款网络游戏《冒险岛》。那款游戏就像一道魔法，把他一下子拉进了游戏世界。',
      '从那以后，他就一直想着有一天能进入游戏行业。虽然玩游戏玩得很上头，成绩倒也没完全荒废，最后考进了中南大学。勉强算是一个学业和游戏两边都没彻底掉线的人。',
      '毕业以后，他在上海先后找到了两份工作。虽然始终没能进入游戏公司，日子倒也过得还算舒服。唯一的遗憾，大概就是到现在还没找到女朋友。',
      'Henry 总喜欢寻找新的冒险和科技宝藏。他的大部分金币都花在最新的数码产品上，剩下的则拿去和朋友吃吃喝喝。性格大概算是随性又大方，也总愿意照顾队伍里的其他人。',
      `这家伙喜欢研究新东西，也喜欢和朋友到处玩。为数不多的工资基本都拿去折腾新科技，剩下的就用来请朋友吃饭。真要给他贴几个标签，大概是这些：<br><span class="badge bg-white text-purple">常州人</span> <span class="badge bg-white text-purple">沪漂</span> <span class="badge bg-white text-purple">没什么大成就</span> <span class="badge bg-white text-purple">从来攒不下钱</span> <span class="badge bg-white text-purple">单身</span> <span class="badge bg-white text-purple">ISFP</span> <span class="badge bg-white text-purple">宅男</span> <span class="badge bg-white text-purple">科技爱好者</span> <span class="badge bg-white text-purple">游戏发烧友</span> <span class="badge bg-white text-purple">潮流追随者</span> <span class="badge bg-white text-purple">科技魔法师</span> <span class="badge bg-white text-purple">篮球爱好者</span> <span class="badge bg-white text-purple">冲动消费</span> <span class="badge bg-white text-purple">强迫症</span>`
    ];
    root.querySelectorAll('.conversation').forEach((el, index) => {
      if (values[index] !== undefined) setHtml(el, values[index]);
    });
  };

  const localizeAbilities = () => {
    const root = document.querySelector('#Abilities');
    if (!root) return;
    setText(root.querySelector('.jn-badge'), '技能');
    setText(root.querySelector('.jn-h2'), '一个纯粹的浪漫主义者');
    setHtml(root.querySelector('.jn-left-panel > div'), `<p>随着冒险一路升级，Henry 也攒下了不少技能点。</p><p>他多少明白技能点该怎么加，于是最后点出来的副职业大概是：</p><p><i class="bi bi-emoji-wink-fill text-success"></i> 数字内容管理者</p><p><i class="bi bi-emoji-wink-fill text-success"></i> 文学创意构筑师</p><p><i class="bi bi-emoji-wink-fill text-success"></i> 视觉叙事编排师</p><p><i class="bi bi-emoji-wink-fill text-success"></i> 魔法料理制造者</p><p>看起来很难懂？没关系，只是为了显得专业才这么写。<br>简单来说，他就是新媒体运营、小说作者、漫画编剧和厨子（虽然最后一个并不是他的正经职业）。</p>`);

    const skills = [
      ['bi-cookie', '厨师', '平时喜欢在家折腾一些中餐，最喜欢做的还是湘菜。'],
      ['bi-book', '小说作者', '纯粹出于个人爱好写一些没什么意思的中文网文，曾经还和纵横中文网签过约。'],
      ['bi-easel', '漫画编剧', '担任《大中华寻宝记》系列和《植物大战僵尸》系列漫画的主要编剧之一，负责脚本创作以及官方社交媒体账号运营。'],
      ['bi-collection-play-fill', '新媒体运营', '负责电竞新闻与内容运营的策划和管理，提升品牌曝光，并曾将“超凡电竞LOL”账号粉丝量从 200 万提升至 300 万。']
    ];
    skills.forEach(([icon, title, body]) => {
      const iconEl = root.querySelector(`.${icon}`);
      const card = iconEl ? iconEl.closest('.jn-abilities-card') : null;
      if (!card) return;
      setText(card.querySelector('.card-title'), title);
      setText(card.querySelector('.jn-card-text'), body);
    });
  };

  const localizeJobs = () => {
    const root = document.querySelector('#Jobs');
    if (!root) return;
    setText(root.querySelector('.jn-badge'), '履历');
    setText(root.querySelector('.jn-h2'), '大家都说他还不错。');
    setHtml(root.querySelector('.jn-left-panel > div'), `<p>作为一个旅行者，这些年 Henry 也接过不少任务，只不过大多数都算不上什么高等级委托。</p><p>他的任务清单包括：</p><p><i class="bi text-purple bi-emoji-expressionless-fill"></i> 写新闻报道</p><p><i class="bi text-purple bi-emoji-expressionless-fill"></i> 写媒体脚本</p><p><i class="bi text-purple bi-emoji-expressionless-fill"></i> 写漫画脚本</p><p><i class="bi text-purple bi-emoji-expressionless-fill"></i> 写网络小说</p><p><i class="bi text-purple bi-emoji-expressionless-fill"></i> 写作业</p><p>看起来 Henry 的技能点大概都加在“写东西”上了。至于写得到底怎么样……反正从来没人当着他的面说过他写得差。<br>背地里有没有说过，那他就不知道了。</p>`);

    const jobs = {
      su: {
        company: '雪城大学', title: '学生',
        html: `<p>雪城大学是一所位于美国纽约州锡拉丘兹的私立研究型大学。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 核心课程：高级媒体商业、媒体 Web 开发与设计、内容管理/开发与创新、变化中的媒体生态。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 针对现有设计痛点，重新设计 i-Tree 与 Syracuse Poster Project 的网站首页。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 围绕 Beyond Meat 开展商业增长方案，目标是提升品牌认知、改变市场固有印象，并扩大其媒体影响力。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 与三位同学组队参加学校的 No-Code Hackathon，为神经多样性群体设计名为 BookTalk 的学习 App。</p>`
      },
      jd: {
        company: '上海京鼎动漫科技有限公司', title: '编剧',
        html: `<p>上海京鼎动漫科技有限公司成立于 1998 年初，在动漫行业深耕二十余年，是中国较早发展起来的动漫企业之一。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 作为《大中华寻宝记》系列的核心内容创作者，参与策划并编写《神兽发电站》《神兽小剧场》等子系列脚本。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 负责将热门游戏 IP《植物大战僵尸》改编为漫画脚本。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 编写并出版《神兽发电站》7–12 册及《神兽小剧场》5–7 册，首印 10 万册。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 创作《植物大战僵尸·科学漫画》57–62 册及机器人系列第 21 册脚本。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 运营《大中华寻宝记》官方微信公众号，通过优质内容与互动提升粉丝数量。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 策划并编写官方抖音账号内容，共制作 61 条短视频，累计获得 25 万点赞，单条最高播放量超过 100 万。</p>`
      },
      chaofan: {
        company: '上海纳纳科技有限公司', title: '新媒体运营',
        html: `<p>超凡电竞是一家覆盖多款热门游戏的电竞资讯平台，提供赛事数据、视频、攻略等内容。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 负责电竞新闻的采编、翻译与发布，并重点策划原创游戏策略及攻略内容。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 策划并执行专题报道，围绕热点事件和重要电竞赛事展开内容制作，有效提升品牌曝光与关注度。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 将“超凡电竞LOL”微博账号粉丝量从 200 万提升至 300 万，并获评“微博2019十大影响力游戏大V”。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 与英雄联盟国服官方合作，制作《英雄联盟》官方电竞栏目《超凡前瞻》（Super Preview）。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 部分重点文章全网阅读量超过 40 万。</p>`
      },
      czdaily: {
        company: '常州日报', title: '实习记者',
        html: `<p>《常州日报》是江苏省常州市的综合性日报，报道常州及江苏省内的政治、经济、社会和文化新闻。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 负责素材收集及热点新闻跟进，编辑报刊内容，确保信息的时效性与准确性。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 执行版面和文字审核、校对工作，保障出版内容质量，并协助完成稿件撰写与文案工作。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 协助新闻采集与采访，及时整理一手资料并产出高质量新闻内容。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 参与多场本地重大活动的采访与内容运营，与团队共同完成并发表 30 余篇稿件。</p>`
      },
      csu: {
        company: '中南大学', title: '学生',
        html: `<p>中南大学是一所位于中国的公立研究型综合大学。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 专业：数字出版</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 核心课程：数字媒体技术与应用、数字出版营销与管理、网络社会与网络文化。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 与团队共同完成两部短片《成长》（Growing Up）和《不只是遇见你》（More Than Meet With You），通过视觉叙事探讨个人成长与人际关系。</p><p><i class="bi text-purple bi-arrow-right-circle-fill"></i> 毕业论文《网络游戏营销策略分析》：以热门网络游戏《DNF》为研究对象，对当时网络游戏的营销策略进行分析。</p>`
      }
    };

    Object.entries(jobs).forEach(([id, data]) => {
      const pane = root.querySelector(`#jobs-${id}`);
      if (!pane) return;
      const heading = pane.querySelector('.fs-4');
      if (heading) {
        const title = heading.querySelector('.fw-bold');
        const company = heading.querySelector('a');
        setText(title, data.title);
        setText(company, data.company);
      }
      setHtml(pane.querySelector('.mt-3.fw-light'), data.html);
      const tab = root.querySelector(`#pills-${id}-tab`);
      setText(tab, data.company);
    });
  };

  const localizeProducts = () => {
    const root = document.querySelector('#Products');
    if (!root) return;
    setText(root.querySelector('.jn-badge'), '主要项目');
    setText(root.querySelector('.jn-h2'), '喜欢创作，也一直在学习。');
    setHtml(root.querySelector('.jn-left-panel .sticky-wrapper > div'), `<p>他喜欢创造，也一直梦想成为像藤子·F·不二雄那样优秀的故事讲述者——毕竟，那可是创造了世界知名漫画角色哆啦A梦的人。</p>`);

    const data = [
      { key: 'ps-', title: '《大中华寻宝记·神兽发电站》', tags: ['漫画','少儿向','日常'], body: '《神兽发电站》是《大中华寻宝记》漫画系列的重要子栏目之一，通过神兽们的日常故事，向孩子们介绍各种科学与历史知识。' },
      { key: 'st-', title: '《大中华寻宝记·神兽小剧场》', tags: ['漫画','少儿向','日常'], body: '《神兽小剧场》是《大中华寻宝记》漫画系列的重要子栏目之一，通过神兽的人形角色展开轻松幽默的日常故事。' },
      { key: 'spp', title: 'Syracuse Poster Project 首页重设计', tags: ['Web 开发','HTML'], body: 'Syracuse Poster Project 通过创作充满社区特色的海报来展示本地艺术家，并为城市空间增添色彩。他重新设计了项目首页，以改善用户体验，并更好地展示这些作品。' },
      { key: 'itree', title: 'i-Tree 首页重设计', tags: ['网页设计','HTML'], body: 'i-Tree 是一套功能强大的软件工具，可提供城市林业分析与效益评估。他重新设计了其网站首页，以改善导航体验，并更清晰地展示树木和森林管理相关资源。' },
      { key: 'booktalk', title: 'BookTalk 无代码学习 App UI 设计', tags: ['无代码','Adalo','UI 设计'], body: '在雪城大学期间，他与同学参加了一场为期 7 天的 No-Code Hackathon，并为面向神经多样性群体的学习 App BookTalk 设计 UI。' },
      { key: 'pp-', title: 'PlayPal——在线游戏队友匹配 App', tags: ['网页设计','App 设计','产品管理'], body: 'PlayPal 是一个在线游戏社交平台，通过 AI 算法和可自定义筛选条件，帮助玩家寻找更合适的游戏队友。他与朋友 Hongjian Yu 和 Fan Shi 共同完成了这款 App 的设计与开发。' },
      { key: 'bm-', title: 'Beyond Meat 商业分析', tags: ['商业分析','报告'], body: 'Beyond Meat 商业分析项目旨在提升品牌认知、挑战市场中的固有印象，并进一步扩大公司的媒体影响力与未来触达范围。' }
    ];

    const cards = Array.from(root.querySelectorAll('.jn-product-card'));
    data.forEach((item, fallbackIndex) => {
      let card = cards.find((candidate) => {
        const src = candidate.querySelector('img')?.getAttribute('src') || '';
        return src.toLowerCase().includes(item.key.toLowerCase());
      });
      if (!card) card = cards[fallbackIndex];
      if (!card) return;
      setTitleKeepingLink(card.querySelector('h5.card-title'), item.title);
      setTags(card, item.tags);
      setText(card.querySelector('.jn-products-text'), item.body);
    });
  };

  const localizeWorks = () => {
    const root = document.querySelector('#Works');
    if (!root) return;
    setText(root.querySelector('.jn-badge'), '业余作品');
    const cards = Array.from(root.querySelectorAll('.jn-works-card'));
    const works = [
      { match: 'HappyBirthday', title: '生日企划——拯救厨师王国', tags: ['RPG Maker','生日礼物','游戏 Demo'], body: '用 RPG Maker 为一个可爱的女孩制作的小型游戏 Demo，作为生日礼物送给她。据说本人评价很高。' },
      { match: 'zongheng', title: '《猎天神道》', tags: ['小说','科幻'], body: '他的个人小说，发表于纵横中文网并曾与网站签约。不过写完以后，他自己再也没有从头到尾读过第二遍。' },
      { match: 'bilibili', title: 'B站个人频道', tags: ['视频','影视剪辑','二创'], body: '他的个人 B 站频道，偶尔会上传一些自己制作的视频。曾经做过一个叫“那些年我们看过的漫画”的栏目，不过后来因为作者太懒，已经无限期停更。' }
    ];
    works.forEach((item, fallbackIndex) => {
      let card = cards.find((candidate) => (candidate.querySelector('a')?.href || '').includes(item.match));
      if (!card) card = cards[fallbackIndex];
      if (!card) return;
      setTitleKeepingLink(card.querySelector('h5.card-title'), item.title);
      setTags(card, item.tags);
      setText(card.querySelector('.jn-card-text'), item.body);
    });
  };

  const localizePricing = () => {
    const root = document.querySelector('#Pricing');
    if (!root) return;
    setText(root.querySelector('.jn-badge'), '服务');
    const plans = [
      {
        title: '线上打游戏', subtitle: '打游戏确实是这个世界上最快乐的事情之一。',
        items: ['你想玩什么就玩什么','附赠优质单口相声','保证气氛愉快','持续提供夸夸服务','不保证能赢','有可能发挥很菜','拒绝恐怖游戏'],
        price: '人民币 9.9 元 / 月'
      },
      {
        title: '一起吃个午饭', subtitle: '什么都可以聊，吃完也许还能一起 City Walk。',
        items: ['线下畅聊任何话题','听你倾诉烦恼','陪你度过一个无聊的下午','有一定概率由他买单','不喝酒','不抽烟','吃什么由你决定'],
        price: '人民币 99 元 / 月'
      },
      {
        title: '长期合作', subtitle: '长期提供情绪价值，随时随地在线。',
        items: ['失恋安慰','失业安慰','情感咨询','旅行邀约','学习监督','陪你吐槽老板和公司','前两项服务包含在内'],
        price: '人民币 999 元 / 月'
      }
    ];
    root.querySelectorAll('.jn-card').forEach((card, index) => {
      const plan = plans[index];
      if (!plan) return;
      setText(card.querySelector('.jn-plan-title .card-title'), plan.title);
      setText(card.querySelector('.jn-plan-title .card-subtitle'), plan.subtitle);
      card.querySelectorAll('.jn-plan-detail li').forEach((li, itemIndex) => {
        const value = plan.items[itemIndex];
        if (value === undefined) return;
        const icon = li.querySelector('i')?.cloneNode(true);
        li.textContent = '';
        if (icon) {
          li.appendChild(icon);
          li.append(' ');
        }
        li.append(value);
      });
      setText(card.querySelector('.jn-plan-buy button'), plan.price);
    });
    translateToast();
  };

  const translateToast = () => {
    if (lang !== 'cn') return;
    setText(document.querySelector('#toastInfoMask .toast-header strong'), '什么？你是认真的？');
    setText(document.querySelector('#toastInfoMask .toast-body'), '在下面找一个联系方式来联系我吧！');
    const close = document.querySelector('#toastInfoMask .btn-close');
    if (close) close.setAttribute('aria-label', '关闭');
  };

  const localizeFooter = () => {
    const root = document.querySelector('#Footer');
    if (!root) return;
    const cols = root.querySelectorAll('.row > div');
    if (cols[0]) {
      setText(cols[0].querySelector('h1'), 'Zihan');
      setText(cols[0].querySelector('p'), '一个写作者、游戏玩家，也是永远的学习者。');
    }
    if (cols[1]) {
      setText(cols[1].querySelector('h3'), '怎么联系他？');
      setText(cols[1].querySelector('p'), '作为一个几乎和手机焊在一起的人，只要没睡着，他基本都会很快回复消息。遗憾的是，平时也没什么人找他。所以直接消息轰炸就好——他大概率会回！');
    }
  };

  const localizeNav = () => {
    const labels = ['介绍','闲聊','技能','经历','项目','作品','服务','联系'];
    document.querySelectorAll('#navbar-top .navbar-nav > a.nav-link').forEach((link, index) => {
      if (labels[index] !== undefined) setText(link, labels[index]);
    });
    const age = document.querySelector('#navbar-top .fw-lighter');
    if (age) age.title = '版本号就是年龄';
    const logo = document.querySelector('#navbar-top .jn-logo-img');
    if (logo) logo.alt = '网站标志';
    const toggle = document.querySelector('#navbar-top .navbar-toggler');
    if (toggle) toggle.setAttribute('aria-label', '展开或收起导航');
  };

  const localizeAll = () => {
    if (lang !== 'cn') return;
    document.documentElement.lang = 'zh-CN';
    document.title = 'Henry / Zihan 的线上小酒馆';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = 'Henry / Zihan 的线上小酒馆';
    localizeNav();
    localizeIntro();
    localizeConversations();
    localizeAbilities();
    localizeJobs();
    localizeProducts();
    localizeWorks();
    localizePricing();
    localizeFooter();
  };

  addStyles();

  let attempts = 0;
  const timer = setInterval(() => {
    addSwitcher();
    if (lang === 'cn' && appReady()) {
      clearInterval(timer);
      localizeAll();
      const toast = document.querySelector('#toastInfoMask');
      if (toast) {
        new MutationObserver(translateToast).observe(toast, { childList: true, subtree: true, characterData: true });
      }
      return;
    }
    if (lang === 'en' && document.querySelector('#navbar-top')) {
      clearInterval(timer);
      return;
    }
    attempts += 1;
    if (attempts > 200) clearInterval(timer);
  }, 50);
})();
