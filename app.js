/* 理大二手網 · PolyU Marketplace — static front-end + Supabase (Auth, Postgres, Storage) */

/* ===== Site config ===== */
const SITE_CONFIG = {
  contactEmail: '2819465493@qq.com',      // general / privacy enquiries
  complaintsEmail: '2819465493@qq.com',   // reports, complaints & infringement notices
};
/* Supabase: public URL + publishable key (safe in the browser; access is enforced by RLS) */
const SUPABASE_CONFIG = {
  url: 'https://upmzeccwedqihvfymick.supabase.co',
  key: 'sb_publishable_mRP8oBbLQX8JgyrsF2o5OA_QgtXDV0r',
  bucket: 'post-images',
};
const IMG = { maxSide: 1280, maxBytes: 2 * 1024 * 1024, maxCount: 4 };
const LS_LANG = 'pm_lang', LS_HALL = 'pm_hall', LS_TAKER = 'pm_taker_contact';
['pm_listings_v1', 'pm_requests_v1', 'pm_listings_v2', 'pm_requests_v2', 'pm_errands_v2', 'pm_reports_v2', 'pm_owner'].forEach(k => localStorage.removeItem(k)); // old local-only data

const I18N = {
  zh: {
    brand: '理大二手網', brandSub: 'PolyU Marketplace', navMarket: '二手市場', navDaigou: '代購', post: '放售',
    heroKicker: '理大同學專屬 · 校園內交收', heroTag: '閒置好物，留喺校園', heroSub: '教科書、電子產品、宿舍傢俬……搬 hall 唔使掉，交畀下一位師弟師妹。',
    searchPh: '搜尋課程編號或物品，例如 COMP1011、風扇', search: '搜尋',
    pt1: '完全免費・不收佣金', pt2: '校園內面交，安心可靠', pt3: '一分鐘上架',
    all: '全部', allItems: '全部物品', sortNew: '最新上架', sortLow: '價錢：低至高', sortHigh: '價錢：高至低',
    cat_book: '教科書', cat_tech: '電子產品', cat_furn: '宿舍傢俬', cat_wear: '服飾', cat_misc: '其他',
    cond_new: '全新', cond_likenew: '九成新', cond_good: '八成新', cond_used: '有使用痕跡',
    spot_corea: 'Core A 大堂', spot_lib: '包玉剛圖書館門口', spot_hh: '紅磡站 A1 出口', spot_hall: '學生宿舍大堂', spot_jcit: '賽馬會創新樓門口',
    emptyTitle: '仲未有人放售', emptyText: '做第一個放售嘅理大同學啦！教科書、檯燈、計數機都啱。', emptyBtn: '放售第一件物品',
    noMatchTitle: '搵唔到相關物品', noMatchText: '試下換個關鍵字，或者轉個分類。',
    seller: '賣家', spot: '交收地點', posted: '上架時間', copyContact: '複製聯絡方法', noDesc: '賣家未有填寫描述。',
    safety: '提提你：請喺校園公眾地方面交，驗貨後先俾錢。', me: '我',
    postTitle: '放售物品', fTitle: '物品名稱', fTitlePh: '例如：COMP1011 教科書（第三版）', fCat: '類別', fPrice: '價錢 (HKD)', fCond: '成色',
    fDesc: '描述', fDescPh: '購買時間、有冇筆記、配件齊唔齊……', fCtype: '聯絡方式', fContact: '帳號 / 電話（選填）', fContactPh: '例如 @polyu_boa', fSpot: '交收地點', submitPost: '確認放售',
    dgKicker: '代購 · 互助', dgTitle: '想要嘅嘢，', dgTag: '搵順路同學幫你帶', dgSub: '寫低要買咩、喺邊度買、預算同限期，有同學順路就可以接單。', postReq: '發佈代購需求',
    reg_all: '全部地區', reg_sz: '深圳', reg_jp: '日本', reg_kr: '韓國', reg_tw: '台灣', reg_mo: '澳門', reg_other: '其他',
    regShort_sz: '深', regShort_jp: '日', regShort_kr: '韓', regShort_tw: '台', regShort_mo: '澳', regShort_other: '其',
    reqTitle: '發佈代購需求', rItem: '想買咩', rItemPh: '例如：山姆瑞士卷 ×2', rFrom: '喺邊度買', rBudget: '預算 (HKD)', rDeadline: '限期', rTip: '願意俾嘅跑腿費 (HKD)', rNote: '補充', rNotePh: '顏色、尺碼、指定門市……', submitReq: '發佈需求',
    from: '來自', budget: '預算', runFee: '跑腿費', deadline: '限期', today: '今日', daysLeft: '尚餘 {n} 日', expired: '已過期',
    open: '等待接單', taken: '已有人接單', take: '接單',
    takeTitle: '確認接單？', takeText: '接單「{item}」後會顯示對方聯絡方法，請盡快聯絡確認細節。', cancel: '取消', takeOk: '確認接單',
    dgEmptyTitle: '暫時未有代購需求', dgEmptyText: '想要深圳、日本或者其他地方嘅嘢？發佈第一個需求，等順路同學幫你帶。', dgEmptyBtn: '發佈第一個需求',
    dgNoMatch: '呢個地區暫時未有需求。',
    tPosted: '已成功放售！', tReq: '需求已發佈，等同學接單～', tTaken: '接單成功！請聯絡對方確認細節', tCopied: '已複製：',
    ago_m: '{n} 分鐘前', ago_h: '{n} 小時前', ago_d: '{n} 日前', count: '{n} 件',
    foot1: '本網站為學生個人項目，與香港理工大學無關，並非官方網站。', foot2: '完全免費，不收任何佣金。',
  },
  en: {
    brand: 'PolyU Marketplace', brandSub: '理大二手網', navMarket: 'Market', navDaigou: 'Requests', post: 'Sell',
    heroKicker: 'For PolyU students · Meet on campus', heroTag: 'Pre-loved finds, kept on campus', heroSub: 'Textbooks, gadgets, hall furniture — pass them on to the next PolyU student instead of throwing them out.',
    searchPh: 'Search a course code or item, e.g. COMP1011, fan', search: 'Search',
    pt1: 'Free, no commission', pt2: 'Safe on-campus meetups', pt3: 'List in one minute',
    all: 'All', allItems: 'All items', sortNew: 'Newest', sortLow: 'Price: low to high', sortHigh: 'Price: high to low',
    cat_book: 'Textbooks', cat_tech: 'Electronics', cat_furn: 'Hall furniture', cat_wear: 'Clothing', cat_misc: 'Others',
    cond_new: 'Brand new', cond_likenew: 'Like new', cond_good: 'Good', cond_used: 'Well used',
    spot_corea: 'Core A lobby', spot_lib: 'Pao Yue-kong Library entrance', spot_hh: 'Hung Hom Station Exit A1', spot_hall: 'Student Halls lobby', spot_jcit: 'Jockey Club Innovation Tower entrance',
    emptyTitle: 'Nothing listed yet', emptyText: 'Be the first PolyU student to list something — textbooks, lamps and calculators all welcome.', emptyBtn: 'List the first item',
    noMatchTitle: 'No matching items', noMatchText: 'Try another keyword or category.',
    seller: 'Seller', spot: 'Meet-up spot', posted: 'Listed', copyContact: 'Copy contact', noDesc: 'No description provided.',
    safety: 'Tip: meet in a public spot on campus and check the item before paying.', me: 'Me',
    postTitle: 'List an item', fTitle: 'Item name', fTitlePh: 'e.g. COMP1011 textbook (3rd ed.)', fCat: 'Category', fPrice: 'Price (HKD)', fCond: 'Condition',
    fDesc: 'Description', fDescPh: 'When bought, notes inside, accessories included…', fCtype: 'Contact via', fContact: 'Handle / number (optional)', fContactPh: 'e.g. @polyu_boa', fSpot: 'Meet-up spot', submitPost: 'List item',
    dgKicker: 'Purchase on behalf', dgTitle: 'Want something?', dgTag: 'Ask a fellow student to bring it back', dgSub: 'Say what you need, where to buy it, your budget and deadline — anyone heading there can take the request.', postReq: 'Post a request',
    reg_all: 'All regions', reg_sz: 'Shenzhen', reg_jp: 'Japan', reg_kr: 'Korea', reg_tw: 'Taiwan', reg_mo: 'Macau', reg_other: 'Other',
    regShort_sz: 'SZ', regShort_jp: 'JP', regShort_kr: 'KR', regShort_tw: 'TW', regShort_mo: 'MO', regShort_other: '··',
    reqTitle: 'Post a request', rItem: 'What do you need?', rItemPh: 'e.g. Sam\u2019s Club swiss roll ×2', rFrom: 'Buy from', rBudget: 'Budget (HKD)', rDeadline: 'Needed by', rTip: 'Runner fee you\u2019ll pay (HKD)', rNote: 'Notes', rNotePh: 'Colour, size, specific store…', submitReq: 'Post request',
    from: 'From', budget: 'Budget', runFee: 'Runner fee', deadline: 'By', today: 'today', daysLeft: '{n} days left', expired: 'expired',
    open: 'Open', taken: 'Taken', take: 'Take it',
    takeTitle: 'Take this request?', takeText: 'Once you take “{item}”, the requester\u2019s contact will be shown. Reach out soon to confirm details.', cancel: 'Cancel', takeOk: 'Confirm',
    dgEmptyTitle: 'No requests yet', dgEmptyText: 'Need something from Shenzhen, Japan or elsewhere? Post the first request and let a classmate bring it back.', dgEmptyBtn: 'Post the first request',
    dgNoMatch: 'No requests for this region yet.',
    tPosted: 'Your item is listed!', tReq: 'Request posted — hang tight!', tTaken: 'Request taken! Contact them to confirm.', tCopied: 'Copied: ',
    ago_m: '{n} min ago', ago_h: '{n} h ago', ago_d: '{n} d ago', count: '{n}',
    foot1: 'Independent student project, not affiliated with The Hong Kong Polytechnic University.', foot2: 'Completely free, no commission.',
  },
};
/* ---------- compliance strings & documents ---------- */
const SCAMETER = 'https://cyberdefender.hk/en-us/scameter/';
Object.assign(I18N.zh, {
  docAbout: '關於我們', docProhibited: '禁售清單', docTerms: '使用條款', docPrivacy: '私隱政策', docDisclaimer: '免責聲明',
  picsShort: '你提交的資料（物品資料及聯絡方式）會公開顯示，只用作讓其他同學聯絡你。', 
  agreeA: '我確認內容不涉及', agreeB: '所列物品，並已閱讀及同意', agreeAnd: '及', agreeC: '。',
  scamTitle: '防騙小貼士', scamBody: '盡量校園內面交、一手交錢一手交貨；避免預付訂金或全數；交易前可用', scamLink: '防騙視伏器',
  scamTail: '查核對方電話、帳號或連結。',
  report: '舉報', reportTitle: '舉報內容', reportReason: '原因', reportNote: '補充說明（選填）', reportSubmit: '提交舉報',
  rr_prohibited: '禁售物品', rr_scam: '懷疑詐騙', rr_fake: '假貨 / 侵權', rr_offensive: '不當或冒犯內容', rr_other: '其他',
  reportTarget: '舉報：「{x}」', reportMail: '投訴及侵權通知電郵：', tReported: '已收到舉報，多謝你幫手維護社群。', placeholder: '待更新',
  student: '理大同學', tError: '提交失敗，請稍後再試。', tRate: '操作太頻密，請稍後再試。', tNotAllowed: '只可以修改自己發佈的內容。', tOffline: '暫時連唔到伺服器，資料只會儲存喺呢個瀏覽器。',
  del: '刪除', delConfirm: '確定刪除？刪除後無法復原。', tDeleted: '已刪除',
});
Object.assign(I18N.en, {
  docAbout: 'About', docProhibited: 'Prohibited items', docTerms: 'Terms of use', docPrivacy: 'Privacy policy', docDisclaimer: 'Disclaimer',
  picsShort: 'What you submit (item details and contact) is shown publicly, solely so other students can reach you.',
  agreeA: 'I confirm this does not involve ', agreeB: ', and I have read and agree to the ', agreeAnd: ' and ', agreeC: '.',
  scamTitle: 'Stay safe', scamBody: 'Meet in person on campus and pay on delivery; avoid deposits or paying in full upfront. Before dealing, check numbers, accounts or links with ', scamLink: 'Scameter',
  scamTail: '.',
  report: 'Report', reportTitle: 'Report content', reportReason: 'Reason', reportNote: 'Details (optional)', reportSubmit: 'Submit report',
  rr_prohibited: 'Prohibited item', rr_scam: 'Suspected scam', rr_fake: 'Counterfeit / infringement', rr_offensive: 'Inappropriate content', rr_other: 'Other',
  reportTarget: 'Reporting: “{x}”', reportMail: 'Complaints & infringement notices: ', tReported: 'Report received — thanks for keeping the community safe.', placeholder: 'To be added',
  student: 'PolyU student', tError: 'Something went wrong — please try again.', tRate: 'Too many actions — please wait a moment.', tNotAllowed: 'You can only change your own posts.', tOffline: 'Can\u2019t reach the server — data will only be saved in this browser.',
  del: 'Delete', delConfirm: 'Delete this? This cannot be undone.', tDeleted: 'Deleted',
});
const REPORT_REASONS = ['prohibited', 'scam', 'fake', 'offensive', 'other'];
const mail = k => SITE_CONFIG[k] ? `<a href="mailto:${esc(SITE_CONFIG[k])}">${esc(SITE_CONFIG[k])}</a>` : `<span class="pf">${t('placeholder')}</span>`;
const ul = a => '<ul>' + a.map(x => `<li>${x}</li>`).join('') + '</ul>';
const DOCS = {
  zh: {
    about: () => `<h3>關於我們</h3>
      <p><b>理大二手網</b>是由學生自發營運的個人項目，讓理大同學免費放售閒置物品及發佈代購需求，不收任何佣金。</p>
      <p class="note">本網站為學生個人項目，與香港理工大學無關，並非官方網站。本網站沒有使用任何大學校徽或官方標誌。</p>
      <p>一般查詢：${mail('contactEmail')}<br>投訴及侵權通知：${mail('complaintsEmail')}</p>`,
    prohibited: () => `<h3>禁售清單</h3><p>以下物品或服務<b>不得</b>放售，亦不得透過代購要求：</p>` + ul([
      '電子煙、加熱煙及其配件', '煙草產品及酒類', '藥物，包括處方藥物及受管制藥物', '假冒或侵犯商標的貨品',
      '盜版或影印教科書、翻版及破解軟件、序號或帳號', '武器、仿製武器、攻擊性物品及其他受管制物品',
      '學生證、校園帳戶、Wi-Fi 帳戶或任何身份證明文件的轉讓或借用', '未經收件人授權代領他人包裹', '任何違反香港法律或內地海關規定的物品',
      '<b>相片：</b>不得上載他人的個人照片或可識別他人的影像、身份證明文件、色情、暴力或侵犯版權的圖片；相片只可用作展示物品']) +
      `<p class="muted small">違規內容會被移除，有關帳戶可被禁止使用本網站。</p>`,
    terms: () => `<h3>使用條款</h3>` + ul([
      '本網站只提供資訊發佈平台，<b>並不參與、促成或保證任何交易</b>，亦不代收或代付任何款項。',
      '買賣雙方及代購雙方須自行核實物品、身份及付款安排，並自行承擔交易風險。',
      '你須確保發佈的內容真實、合法，不涉及<a href="#" data-doc="prohibited">禁售清單</a>所列物品，亦不侵犯他人權利。',
      '代購須遵守香港及內地（或相關地區）海關、進出口及稅務規定，包括攜帶限額及申報要求。',
      '宿舍跑腳只屬同學之間的互助安排：取件碼須私下傳送；跑腳費由雙方自行協定及直接交收，本網站不收取任何費用，亦不處理任何付款或爭議。',
      '發佈、接單須以電郵及密碼登入帳戶。本網站不會驗證電郵地址，你只可以使用屬於你本人的電郵地址註冊，不得使用他人電郵或冒認他人。請使用安全的密碼並妥善保管，你須對帳戶下的所有活動負責。每人只應使用一個帳戶。',
      '站內「聊一聊」只可用於交易相關溝通，不得發送騷擾、詐騙、垃圾或違法內容；被舉報的對話可能會由管理員查閱。',
      '你上載的相片須為你擁有或有權使用的物品相片，並符合<a href="#" data-doc="prohibited">禁售清單</a>的相片規定。',
      '我們可在毋須通知的情況下移除任何內容、暫停或刪除任何帳戶。',
      '使用本網站即表示你同意本條款、<a href="#" data-doc="privacy">私隱政策</a>及<a href="#" data-doc="disclaimer">免責聲明</a>。']),
    privacy: () => `<h3>私隱政策及收集個人資料聲明</h3>
      <p class="muted small">根據《個人資料（私隱）條例》（第 486 章）</p>
      <h4>收集的資料</h4><p>（一）帳戶資料：你用作登入的電郵地址、密碼（只以加密雜湊形式儲存，我們無法得知你的密碼）及你設定的顯示名稱；（二）你發佈的放售、代購或跑腳資料（只需宿舍及座數 / 樓層，毋須完整房號）、上載的物品相片，以及你自願提供的聯絡方式（WhatsApp / WeChat / Instagram 帳號或電話）；（三）接單時你提供的聯絡方式；（四）你在站內「聊一聊」傳送的訊息及相片。請勿提供不必要的個人資料。</p>
      <h4>收集目的</h4><p>用作登入及管理你的帳戶與內容、在網站上顯示你的放售或需求、讓買賣或接單雙方聯絡，以及處理舉報及維護網站安全。我們不會將資料作直接促銷或出售予第三方。</p>
      <h4>誰可看到</h4><p>你的電郵地址不會公開。顯示名稱、發佈內容及相片會公開顯示；聯絡方式只向已登入的使用者顯示；接單者的聯絡方式只有發佈者及接單者本人可見。站內訊息只有對話雙方可以閱讀；訊息相片儲存於私人空間，只以限時連結顯示給對話雙方。網站管理員為處理舉報及維護秩序，可查閱舉報紀錄及所有帖子（包括已隱藏者），並只會在對話被舉報後查閱該對話內容；管理員可隱藏或刪除違規內容及封鎖帳戶，所有管理操作均會記錄。除法律要求外，我們不會向第三方披露你的資料。</p>
      <h4>儲存地點</h4><p>資料及相片儲存於 Supabase 雲端服務，伺服器位於日本東京，即資料會轉移至香港以外地方儲存。本網站不會向你發送任何電郵，亦不會驗證你的電郵地址。</p>
      <h4>保留期限</h4><p>系統每日自動清理：代購需求於限期過後 30 日、跑腳單於日期過後 30 日、放售物品於發佈 180 日後（已售出 / 已下架者於 60 日後）、已取消的需求於 30 日後自動刪除；對話於最後一則訊息 180 日後自動刪除；舉報及管理操作紀錄保留 365 日。帳戶資料保留至你刪除帳戶為止。</p>
      <h4>查閱、更正及刪除</h4><p>你可隨時於「我的」頁面修改顯示名稱、編輯或刪除自己的內容（相片會一併刪除），更改密碼，或按「刪除帳戶」永久刪除帳戶及所有內容。忘記密碼的話，請用你註冊的電郵地址電郵至 ${mail('contactEmail')} 求助。如需查閱或更正資料，或有任何私隱查詢，請電郵：${mail('contactEmail')}</p>`,
    disclaimer: () => `<h3>免責聲明</h3><p class="muted small">在香港法律容許的最大範圍內適用。</p><ol>
      <li><b>只提供資訊平台。</b>理大二手網（「本網站」）只供使用者發佈及瀏覽二手物品及代購資訊，並非任何交易的一方，不參與、促成、代收或保證任何交易或付款。</li>
      <li><b>不作任何保證。</b>本網站不就任何物品的質素、合法性、真偽、安全性、狀況或描述是否準確，以及任何使用者的身份、資格或可靠程度作出任何明示或隱含的保證或陳述。</li>
      <li><b>使用者自行負責。</b>使用者須就其發佈的內容、交易、會面交收、付款安排，以及代購涉及的海關、進出口、稅務及其他法律規定，自行負上全部責任並承擔所有風險。</li>
      <li><b>責任限制。</b>對於因使用或無法使用本網站，或因任何交易、會面、內容而引致的任何損失或損害，包括但不限於金錢損失、財物損毀、詐騙、人身傷害、資料遺失、服務中斷或停止運作，本網站及其營運者概不負責。</li>
      <li><b>宿舍跑腳。</b>跑腳安排純屬使用者之間的私人協議。對於任何包裹或外賣的遺失、損毀、延誤、錯誤交付，食物的安全、衛生、致敏原或品質問題，以及使用者之間有關跑腳費或其他付款的任何爭議，本網站概不負責。</li>
      <li><b>使用者內容。</b>網站上的所有放售及代購內容均由使用者提供，並不代表本網站的立場，本網站亦不作任何認可。</li>
      <li><b>移除內容。</b>本網站可隨時在毋須通知或給予理由的情況下，移除任何內容或禁止任何使用者使用本網站。</li>
      <li><b>彌償。</b>如因你違反本聲明、使用條款或任何法律，或因你的內容或交易而引致任何第三方索償，你同意就此向本網站營運者作出彌償，並使其免受損害。</li>
      <li><b>非官方網站。</b>本網站為學生個人項目，與香港理工大學無關，並非官方網站，亦未獲其認可或贊助。</li>
      <li><b>不可排除的責任。</b>本聲明的任何內容均不排除或限制根據適用法律不能排除或限制的任何責任。</li>
      <li><b>可分割性。</b>如本聲明任何條文被裁定無效或不可執行，其餘條文仍然完全有效。</li>
      <li><b>修訂。</b>本網站可隨時修訂本聲明，修訂後的版本於網站發佈時即時生效。</li>
      <li><b>管轄法律。</b>本聲明受香港特別行政區法律管轄，並按其詮釋。</li>
      <li><b>語言。</b>本聲明備有中文及英文版本，如兩者有任何歧異，概以中文（繁體）版本為準。</li></ol><p class="muted small">查詢、投訴及侵權通知：${mail('complaintsEmail')}</p>`,
  },
  en: {
    about: () => `<h3>About</h3>
      <p><b>PolyU Marketplace</b> (理大二手網) is an independent, student-run project that lets PolyU students list pre-loved items and post purchase-on-behalf requests for free, with no commission.</p>
      <p class="note">Independent student project, not affiliated with The Hong Kong Polytechnic University. This is not an official website and uses no university logo or emblem.</p>
      <p>General enquiries: ${mail('contactEmail')}<br>Complaints & infringement notices: ${mail('complaintsEmail')}</p>`,
    prohibited: () => `<h3>Prohibited items</h3><p>The following may <b>not</b> be listed or requested:</p>` + ul([
      'E-cigarettes, heated tobacco products and their accessories', 'Tobacco products and alcohol', 'Medicines, including prescription and controlled drugs', 'Counterfeit or trademark-infringing goods',
      'Pirated or photocopied textbooks, cracked software, licence keys or accounts', 'Weapons, imitation weapons, offensive or other controlled items',
      'Transfer or lending of student IDs, campus / Wi-Fi accounts or any identity documents', 'Collecting someone else\u2019s parcel without the recipient\u2019s authorisation', 'Anything that breaches Hong Kong law or Mainland customs rules',
      '<b>Photos:</b> no photos of other people or images that identify them, no ID documents, no sexual, violent or copyright-infringing images — photos must show the item only']) +
      `<p class="muted small">Violating content will be removed and the user may be barred from the site.</p>`,
    terms: () => `<h3>Terms of use</h3>` + ul([
      'This site only hosts information. It <b>does not take part in, arrange or guarantee any transaction</b>, and never handles payments.',
      'Buyers, sellers and requesters must verify items, identities and payment arrangements themselves and bear all transaction risks.',
      'Your content must be truthful and lawful, must not involve <a href="#" data-doc="prohibited">prohibited items</a>, and must not infringe anyone\u2019s rights.',
      'Purchase-on-behalf requests must comply with Hong Kong and Mainland (or other relevant) customs, import/export and tax rules, including allowances and declarations.',
      'Hall errands are informal favours between students: share pickup codes privately only; runner fees are agreed and paid directly between users — the site charges nothing and does not handle payments or disputes.',
      'Posting and taking orders require an account (email + password). Email addresses are not verified: you may only register with an email address that belongs to you — never someone else\u2019s — and must not impersonate anyone. Use a strong password and keep it safe; you are responsible for all activity under your account. One account per person.',
      'On-site Chat is for deal-related messages only — no harassment, scams, spam or illegal content. Reported conversations may be reviewed by moderators.',
      'Photos you upload must be of items you own or have the right to show, and must follow the photo rules in the <a href="#" data-doc="prohibited">Prohibited items</a> list.',
      'We may remove any content, or suspend or delete any account, without notice.',
      'By using the site you agree to these terms, the <a href="#" data-doc="privacy">Privacy policy</a> and the <a href="#" data-doc="disclaimer">Disclaimer</a>.']),
    privacy: () => `<h3>Privacy policy & Personal Information Collection Statement</h3>
      <p class="muted small">Under the Personal Data (Privacy) Ordinance (Cap. 486)</p>
      <h4>What we collect</h4><p>(1) Account data: the email you sign in with, your password (stored only as a one-way hash — we can\u2019t see it) and the display name you set; (2) what you post — listings, requests or errands (hall and block/floor only, no full room number needed), item photos, and the contact you choose to provide (WhatsApp / WeChat / Instagram handle or phone); (3) the contact you give when taking an order; (4) messages and photos you send through on-site Chat. Please don\u2019t share more personal data than needed.</p>
      <h4>Purpose</h4><p>To sign you in and let you manage your account and posts, show your listings and requests, let the two sides of a deal contact each other, and handle reports and keep the site safe. We never use it for direct marketing or sell it to third parties.</p>
      <h4>Who can see what</h4><p>Your email address is never shown. Display names, posts and photos are public; contact details are shown only to signed-in users; a taker\u2019s contact is visible only to the poster and the taker. Chat messages can only be read by the two people in the conversation; chat photos are stored privately and shown to them through short-lived links. To handle reports, site moderators can see reports and all posts (including hidden ones), and read a conversation only after it has been reported; they may hide or delete content and ban accounts, and every moderation action is logged. We do not disclose your data to third parties except as required by law.</p>
      <h4>Storage location</h4><p>Data and photos are stored with Supabase, with servers in Tokyo, Japan, i.e. transferred outside Hong Kong. The site never sends you emails and does not verify your email address.</p>
      <h4>Retention</h4><p>Automatic daily clean-up: requests 30 days after their deadline, errands 30 days after their date, listings 180 days after posting (sold/removed ones after 60 days), cancelled requests after 30 days; conversations are deleted 180 days after their last message; reports and the moderation log are kept for 365 days. Account data is kept until you delete your account.</p>
      <h4>Access, correction & deletion</h4><p>On the “Me” page you can change your display name, edit or delete your posts (photos are deleted with them), change your password, or tap “Delete account” to permanently delete your account and all your content. If you forget your password, email ${mail('contactEmail')} from your registered email address for help. For access or correction requests, or any privacy enquiry, email: ${mail('contactEmail')}</p>`,
    disclaimer: () => `<h3>Disclaimer</h3><p class="muted small">Applies to the fullest extent permitted by the laws of Hong Kong.</p><ol>
      <li><b>Information platform only.</b> PolyU Marketplace (the “Site”) only allows users to post and browse second-hand and purchase-on-behalf information. It is not a party to any transaction and does not take part in, arrange, collect payment for or guarantee any transaction.</li>
      <li><b>No warranties.</b> The Site makes no express or implied warranty or representation as to the quality, legality, authenticity, safety, condition or accuracy of description of any item, or the identity, capacity or reliability of any user.</li>
      <li><b>User responsibility.</b> Users are solely responsible for, and bear all risks of, their content, transactions, meet-ups, payment arrangements and compliance with customs, import/export, tax and other legal requirements for purchase-on-behalf.</li>
      <li><b>Limitation of liability.</b> The Site and its operator shall not be liable for any loss or damage arising from the use of or inability to use the Site, or from any transaction, meeting or content, including without limitation financial loss, property damage, fraud, personal injury, data loss, downtime or discontinuation of service.</li>
      <li><b>Hall errands.</b> Errand arrangements are private agreements between users. The Site is not responsible for any lost, damaged, delayed or misdelivered parcel or food order, for food safety, hygiene, allergen or quality issues, or for any dispute between users over runner fees or other payments.</li>
      <li><b>User-generated content.</b> All listings and requests are provided by users and are not endorsed by, nor do they represent the views of, the Site.</li>
      <li><b>Removal.</b> The Site may remove any content or bar any user at any time, without notice or reason.</li>
      <li><b>Indemnity.</b> You agree to indemnify and hold harmless the Site\u2019s operator against any third-party claim arising from your breach of this Disclaimer, the Terms of use or any law, or from your content or transactions.</li>
      <li><b>Not official.</b> Independent student project, not affiliated with, endorsed or sponsored by The Hong Kong Polytechnic University.</li>
      <li><b>Non-excludable liability.</b> Nothing in this Disclaimer excludes or limits any liability that cannot be excluded or limited under applicable law.</li>
      <li><b>Severability.</b> If any provision is held invalid or unenforceable, the remaining provisions remain in full force and effect.</li>
      <li><b>Amendments.</b> The Site may amend this Disclaimer at any time; the amended version takes effect when published on the Site.</li>
      <li><b>Governing law.</b> This Disclaimer is governed by and construed in accordance with the laws of the Hong Kong Special Administrative Region.</li>
      <li><b>Language.</b> This Disclaimer is available in Chinese and English. In case of any inconsistency, the Traditional Chinese version prevails.</li></ol><p class="muted small">Enquiries, complaints & infringement notices: ${mail('complaintsEmail')}</p>`,
  },
};
let curDoc = null;
function openDoc(k) { curDoc = k; $('#docBody').innerHTML = DOCS[lang][k](); $('#docModal').hidden = false; $('#docModal .modal-card').scrollTop = 0; document.body.style.overflow = 'hidden'; }
const scamHtml = () => `<div class="scam"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg><p><b>${t('scamTitle')}</b>${lang === 'zh' ? '：' : ': '}${t('scamBody')}<a href="${SCAMETER}" target="_blank" rel="noopener">${t('scamLink')}</a>${t('scamTail')}</p></div>`;
let reportTarget = null;
function openReport(kind, id) {
  const it = findPost(kind, id); if (!it) return;
  reportTarget = { kind, id, title: it.title || it.item || (t('type_' + it.type) + ' · ' + it.pickup) };
  $('#reportReason').innerHTML = REPORT_REASONS.map(r => `<option value="${r}">${t('rr_' + r)}</option>`).join('');
  $('#reportTarget').textContent = t('reportTarget', { x: reportTarget.title });
  $('#reportContact').innerHTML = t('reportMail') + mail('complaintsEmail');
  $('#reportModal').hidden = false; document.body.style.overflow = 'hidden';
}

const CATS = [{ id: 'book', c: ['#8C1D2F', '#c4495d'] }, { id: 'tech', c: ['#1f2d4a', '#4a6596'] }, { id: 'furn', c: ['#6e4a2a', '#b88c5c'] }, { id: 'wear', c: ['#4b3470', '#8d70bb'] }, { id: 'misc', c: ['#24584a', '#5a9e88'] }];
const CONDS = ['new', 'likenew', 'good', 'used'];
const SPOTS = ['corea', 'lib', 'hh', 'hall', 'jcit'];
const REGIONS = ['sz', 'jp', 'kr', 'tw', 'mo', 'other'];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DAY = 864e5;
let lang = localStorage.getItem(LS_LANG) === 'en' ? 'en' : 'zh';
const t = (k, v = {}) => (I18N[lang][k] ?? I18N.zh[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x]);

const state = { cat: 'all', q: '', sort: 'new', dg: 'all' };
const ymd = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
const ago = ts => { const m = (Date.now() - ts) / 6e4; return m < 60 ? t('ago_m', { n: Math.max(1, m | 0) }) : m < 1440 ? t('ago_h', { n: m / 60 | 0 }) : t('ago_d', { n: m / 1440 | 0 }); };

/* ---------- placeholder art ---------- */
const ICON = {
  book: '<path d="M100 70h70a10 10 0 0 1 10 10v80H110a10 10 0 0 1-10-10z" fill="rgba(255,255,255,.14)"/><path d="M100 150a10 10 0 0 1 10-10h70"/><path d="M120 92h40M120 108h30"/>',
  tech: '<rect x="88" y="72" width="104" height="66" rx="6" fill="rgba(255,255,255,.14)"/><path d="M76 150h128l-8 12H84z"/><circle cx="140" cy="105" r="8"/>',
  furn: '<path d="M110 70h60l14 40h-88z" fill="rgba(255,255,255,.14)"/><path d="M140 110v44M118 160h44"/>',
  wear: '<path d="M120 66l-34 18 12 26 14-6v58h56v-58l14 6 12-26-34-18c-4 10-12 16-20 16s-16-6-20-16z" fill="rgba(255,255,255,.14)"/>',
  misc: '<path d="M90 92l50-24 50 24v52l-50 24-50-24z" fill="rgba(255,255,255,.14)"/><path d="M90 92l50 24 50-24M140 116v52"/>',
};
function art(item) {
  const c = (CATS.find(x => x.id === item.cat) || CATS[4]).c;
  const h = [...(item.title || '')].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const cx = 40 + (h % 200), cy = 20 + (h % 160), gid = 'g' + item.id;
  return `<svg viewBox="0 0 280 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs>
    <rect width="280" height="210" fill="url(#${gid})"/><circle cx="${cx}" cy="${cy}" r="90" fill="rgba(255,255,255,.07)"/><circle cx="${280 - cx}" cy="${210 - cy}" r="60" fill="rgba(255,255,255,.05)"/>
    <g fill="none" stroke="#fff" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round">${ICON[item.cat] || ICON.misc}</g></svg>`;
}
const EMPTY_ART = `<svg viewBox="0 0 120 96" aria-hidden="true"><rect x="14" y="24" width="92" height="62" rx="10" fill="#f6e9eb"/><path d="M14 40h92" stroke="#e6c9ce" stroke-width="2"/><path d="M38 24l8-14h28l8 14" fill="none" stroke="#8C1D2F" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="62" r="11" fill="none" stroke="#8C1D2F" stroke-width="3"/><path d="M60 57v10M55 62h10" stroke="#8C1D2F" stroke-width="3" stroke-linecap="round"/></svg>`;

/* ---------- hall errands ---------- */
const ER_TYPES = ['parcel', 'food'];
const HALLS = ['hh', 'hmt'];
Object.assign(I18N.zh, {
  fabReq: '發佈需求', fabErr: '發佈跑腳', navErrands: '宿舍跑腳', erKicker: '宿舍跑腳 · 互助', erTitle: '快遞外賣，', erTag: '順路同學幫你攞上 hall',
  erSub: '順豐櫃、郵件室嘅包裹，或者喺門口等緊嘅外賣，搵順路同學幫你帶上宿舍。跑腳費由你自訂，雙方直接交收，網站分文不收。',
  postErr: '發佈跑腳單', errFormTitle: '發佈跑腳單', eType: '類型', type_all: '全部類型', type_parcel: '快遞', type_food: '外賣',
  eFee: '跑腳費 (HKD，選填)', ePickup: '取件地點', ePickupPh: '例如：Core S 順豐智能櫃、校園郵件室、正門外賣員',
  eHall: '送到宿舍', eFloor: '座數 / 樓層（選填）', eFloorPh: '例如：B 座 12 樓', eRoomHint: '為保障私隱，毋須填寫完整房號，接單後再私下確認。',
  eDate: '日期', eFrom: '由', eTo: '至', eNotePh: '件數、大概大小、外賣平台……（切勿在此公開取件碼）', submitErr: '發佈跑腳單',
  hall_hh: '紅磡學生宿舍', hall_hmt: '何文田學生宿舍', openCount: '張待接單', totalCount: '張總數',
  pickup: '取件', dropoff: '送到', window: '時間', fee: '跑腳費', feeNone: '未定 / 面議',
  er_open: '等待接單', er_taken: '已接單', er_done: '已完成', markDone: '標記完成',
  erTakeText: '接單後會顯示對方聯絡方法。請先私下確認取件碼及交收細節。', tErr: '跑腳單已發佈！', tDone: '已標記完成',
  erEmptyTitle: '{hall}暫時未有跑腳單', erEmptyText: '住喺{hall}？有快遞或者外賣想人幫手攞上 hall，發佈第一張跑腳單啦。', erEmptyBtn: '發佈第一張跑腳單', erNoMatch: '呢個宿舍暫時未有呢類跑腳單。',
  erSafeTitle: '安全提示', erSafeBody: '交收時當面核對物品；取件碼請私訊傳送，切勿公開張貼；跑腳費由雙方直接交收，網站不收取任何費用。',
});
Object.assign(I18N.en, {
  fabReq: 'Post request', fabErr: 'Post errand', navErrands: 'Errands', erKicker: 'Hall Errands', erTitle: 'Parcel or takeaway?', erTag: 'Get a hallmate to bring it up',
  erSub: 'A parcel at the SF locker or mailroom, or a delivery rider waiting at the gate — ask someone heading back to bring it to your hall. You set the runner fee and pay each other directly; the site takes nothing.',
  postErr: 'Post an errand', errFormTitle: 'Post an errand', eType: 'Type', type_all: 'All types', type_parcel: 'Parcel', type_food: 'Food delivery',
  eFee: 'Runner fee (HKD, optional)', ePickup: 'Pick-up location', ePickupPh: 'e.g. SF locker at Core S, campus mailroom, rider at main gate',
  eHall: 'Deliver to hall', eFloor: 'Block / floor (optional)', eFloorPh: 'e.g. Block B, 12/F', eRoomHint: 'For privacy, no full room number needed — confirm it privately once someone takes the errand.',
  eDate: 'Date', eFrom: 'From', eTo: 'To', eNotePh: 'Number of items, size, delivery app… (never post pickup codes here)', submitErr: 'Post errand',
  hall_hh: 'Hung Hom Halls', hall_hmt: 'Homantin Halls', openCount: 'open', totalCount: 'total',
  pickup: 'Pick up', dropoff: 'Deliver to', window: 'Time', fee: 'Runner fee', feeNone: 'Not set / negotiable',
  er_open: 'Open', er_taken: 'Taken', er_done: 'Completed', markDone: 'Mark completed',
  erTakeText: 'Once you take it, the poster\u2019s contact will be shown. Get the pickup code and details privately.', tErr: 'Errand posted!', tDone: 'Marked as completed',
  erEmptyTitle: 'No errands at {hall} yet', erEmptyText: 'Live at {hall}? Got a parcel or takeaway you\u2019d like brought up? Post the first errand.', erEmptyBtn: 'Post the first errand', erNoMatch: 'No errands of this type at this hall yet.',
  erSafeTitle: 'Stay safe', erSafeBody: 'Check the item together at hand-over; send pickup codes privately, never post them publicly; runner fees are settled directly between you — the site takes nothing.',
});
const erState = { type: 'all', hall: HALLS.includes(localStorage.getItem(LS_HALL)) ? localStorage.getItem(LS_HALL) : 'hh' };
function setHall(h) { erState.hall = h; localStorage.setItem(LS_HALL, h); renderErrands(); }
const safetyHtml = () => `<div class="scam"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg><p><b>${t('erSafeTitle')}</b>${lang === 'zh' ? '：' : ': '}${t('erSafeBody')}</p></div>`;
const ER_ICON = { parcel: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>', food: '<path d="M5 11h14a7 7 0 0 1-14 0z"/><path d="M3 11h18M9 7c0-1.5 1-2 1-3M13 7c0-1.5 1-2 1-3"/>' };

/* ---------- account / status / photo strings ---------- */
Object.assign(I18N.zh, {
  login: '登入', logout: '登出', navMe: '我的', loginTitle: '登入 / 註冊', loginIntro: '用電郵登入，毋須密碼。首次登入會自動建立帳戶。',
  email: '電郵地址', emailPh: '你本人的電郵地址', password: '密碼', passwordPh: '最少 8 個字元', password2: '確認密碼', password2Ph: '再輸入一次密碼',
  tabLogin: '登入', tabSignup: '註冊', doLogin: '登入', doSignup: '註冊並登入', showPw: '顯示密碼', hidePw: '隱藏密碼', forgotPw: '忘記密碼？',
  forgotText: '本網站不會發送電郵，所以未能自動重設密碼。請用你註冊時的電郵地址電郵至 {mail} 求助，並註明你的顯示名稱。',
  signupNote: '請使用你本人的電郵地址。本網站不會驗證電郵，亦不會發送任何電郵。',
  loginHint: '登入後可以發佈、接單及查看聯絡方法。',
  changePw: '更改密碼', newPw: '新密碼', newPw2: '確認新密碼', tPwChanged: '密碼已更改', tSignedUp: '註冊成功，已登入',
  tWrongPw: '電郵或密碼不正確。', tEmailTaken: '呢個電郵已經註冊，請直接登入。', tWeakPw: '密碼太弱：最少 8 個字元，並避免常見密碼。', tPwMismatch: '兩次輸入的密碼不一樣。', tSamePw: '新密碼不可以同舊密碼一樣。', tBadEmail: '電郵地址格式不正確。',
  tLoggedIn: '已登入', tLoggedOut: '已登出', loginToContact: '登入後查看聯絡方法', tLogin: '請先登入',
  myTitle: '我的', myProfile: '個人資料', displayName: '顯示名稱', save: '儲存', myPosts: '我的發佈', myTaken: '我接的單',
  noPosts: '你仲未發佈任何內容。', noTaken: '你仲未接任何單。', edit: '編輯', deleteAccount: '刪除帳戶',
  delAccConfirm: '確定永久刪除帳戶及所有內容（包括相片）？此操作無法復原。', tAccDeleted: '帳戶已刪除',
  st_available: '在售', st_reserved: '已預約', st_sold: '已售出', st_removed: '已下架', st_open: '待接單', st_taken: '已接單', st_done: '已完成', st_cancelled: '已取消',
  markReserved: '標記已預約', markSold: '標記已售出', markRemoved: '下架', markAvailable: '重新上架', cancelPost: '取消', completePost: '標記完成', reopen: '重新開放',
  release: '放棄接單', releaseConfirm: '確定放棄接單？需求會重新開放畀其他人。', tReleased: '已放棄接單', tStatus: '狀態已更新', tSaved: '已儲存',
  takerLabel: '接單者', posterLabel: '發佈者', takeIntro: '接單後雙方會見到對方聯絡方法。請留低你嘅聯絡方法（只有發佈者見到）。',
  photos: '相片（最多 4 張）', photosOpt: '相片（選填，最多 4 張）', addPhoto: '＋ 相片', tTooMany: '最多 4 張相片', tNotImage: '只可上載圖片檔案', tTooLarge: '相片太大，請換一張', uploading: '上載中…',
  editTitle: '編輯內容', submitSave: '儲存變更', kind_listings: '放售', kind_daigou: '代購', kind_errands: '跑腳',
  tOffline: '暫時連唔到伺服器，請稍後再試。', tBadTransition: '呢個狀態而家唔可以咁改。', photoOf: '第 {n} 張相片',
});
Object.assign(I18N.en, {
  login: 'Sign in', logout: 'Sign out', navMe: 'Me', loginTitle: 'Sign in / Sign up', loginIntro: 'Sign in with your email — no password. An account is created on first sign-in.',
  email: 'Email', emailPh: 'Your own email address', password: 'Password', passwordPh: 'At least 8 characters', password2: 'Confirm password', password2Ph: 'Type it again',
  tabLogin: 'Sign in', tabSignup: 'Sign up', doLogin: 'Sign in', doSignup: 'Sign up & sign in', showPw: 'Show password', hidePw: 'Hide password', forgotPw: 'Forgot password?',
  forgotText: 'This site doesn\u2019t send emails, so passwords can\u2019t be reset automatically. Email {mail} from the address you registered with, and include your display name.',
  signupNote: 'Please use your own email address. The site does not verify emails or send any.',
  loginHint: 'Sign in to post, take orders and see contact details.',
  changePw: 'Change password', newPw: 'New password', newPw2: 'Confirm new password', tPwChanged: 'Password changed', tSignedUp: 'Account created — you\u2019re signed in',
  tWrongPw: 'Wrong email or password.', tEmailTaken: 'This email is already registered — please sign in.', tWeakPw: 'Password too weak: at least 8 characters, avoid common passwords.', tPwMismatch: 'The passwords don\u2019t match.', tSamePw: 'New password must differ from the old one.', tBadEmail: 'That email address doesn\u2019t look right.',
  tLoggedIn: 'Signed in', tLoggedOut: 'Signed out', loginToContact: 'Sign in to see contact', tLogin: 'Please sign in first',
  myTitle: 'Me', myProfile: 'Profile', displayName: 'Display name', save: 'Save', myPosts: 'My posts', myTaken: 'Orders I took',
  noPosts: 'You haven\u2019t posted anything yet.', noTaken: 'You haven\u2019t taken any orders yet.', edit: 'Edit', deleteAccount: 'Delete account',
  delAccConfirm: 'Permanently delete your account and all your content (including photos)? This cannot be undone.', tAccDeleted: 'Account deleted',
  st_available: 'For sale', st_reserved: 'Reserved', st_sold: 'Sold', st_removed: 'Removed', st_open: 'Open', st_taken: 'Taken', st_done: 'Completed', st_cancelled: 'Cancelled',
  markReserved: 'Mark reserved', markSold: 'Mark sold', markRemoved: 'Take down', markAvailable: 'Relist', cancelPost: 'Cancel', completePost: 'Mark completed', reopen: 'Reopen',
  release: 'Release', releaseConfirm: 'Release this order? It will reopen for others.', tReleased: 'Order released', tStatus: 'Status updated', tSaved: 'Saved',
  takerLabel: 'Taken by', posterLabel: 'Posted by', takeIntro: 'Once you take it, you\u2019ll both see each other\u2019s contact. Leave your contact (only the poster sees it).',
  photos: 'Photos (up to 4)', photosOpt: 'Photos (optional, up to 4)', addPhoto: '＋ Photo', tTooMany: 'Up to 4 photos', tNotImage: 'Images only', tTooLarge: 'Photo too large — try another', uploading: 'Uploading…',
  editTitle: 'Edit post', submitSave: 'Save changes', kind_listings: 'Listing', kind_daigou: 'Request', kind_errands: 'Errand',
  tOffline: 'Can\u2019t reach the server — please try again later.', tBadTransition: 'That status change isn\u2019t allowed right now.', photoOf: 'Photo {n}',
});

/* ---------- admin strings ---------- */
Object.assign(I18N.zh, {
  navAdmin: '管理', adminTitle: '管理', aOpen: '待處理舉報', aHandled: '已處理', aBans: '封鎖用戶', aLog: '操作紀錄',
  aView: '查看帖子', aHide: '隱藏', aUnhide: '取消隱藏', aDelete: '刪除', aBan: '封鎖發佈者', aUnban: '解除封鎖', aMarkHandled: '標記已處理', aReopen: '重新開啟',
  aPostGone: '帖子已不存在', aPoster: '發佈者', aReporter: '舉報者', aAnon: '未登入用戶', aSelf: '自己', aNoReports: '暫時冇舉報。', aNoBans: '冇被封鎖嘅用戶。', aNoLog: '暫時冇紀錄。',
  aHiddenTag: '已被管理員隱藏', aDelConfirm: '以管理員身份永久刪除呢個帖子及其相片？', aBanConfirm: '封鎖「{name}」？對方將不能發佈或接單。', aBannedTag: '已封鎖',
  aAdminBar: '管理員', aReason: '原因', aNote: '補充', aBannedAt: '封鎖於', aAdminNote: '只有管理員看到此頁。所有操作均會記錄。',
  tHidden: '已隱藏', tUnhidden: '已取消隱藏', tBanned: '你的帳戶已被封鎖，暫時不能發佈或接單。如有疑問請電郵 {mail}。', tBannedOk: '已封鎖', tUnbannedOk: '已解除封鎖', tAdminDeleted: '已刪除', tHandled: '已更新', aCantBanAdmin: '不可以封鎖管理員。',
  act_hide: '隱藏帖子', act_unhide: '取消隱藏', act_delete: '刪除帖子', act_ban: '封鎖用戶', act_unban: '解除封鎖', act_report_handled: '處理舉報', act_report_reopened: '重開舉報',
});
Object.assign(I18N.en, {
  navAdmin: 'Admin', adminTitle: 'Moderation', aOpen: 'Open reports', aHandled: 'Handled', aBans: 'Banned users', aLog: 'Activity log',
  aView: 'View post', aHide: 'Hide', aUnhide: 'Unhide', aDelete: 'Delete', aBan: 'Ban poster', aUnban: 'Unban', aMarkHandled: 'Mark handled', aReopen: 'Reopen',
  aPostGone: 'Post no longer exists', aPoster: 'Poster', aReporter: 'Reporter', aAnon: 'signed-out user', aSelf: 'self', aNoReports: 'No reports.', aNoBans: 'No banned users.', aNoLog: 'Nothing logged yet.',
  aHiddenTag: 'Hidden by moderator', aDelConfirm: 'Permanently delete this post and its photos as admin?', aBanConfirm: 'Ban “{name}”? They won\u2019t be able to post or take orders.', aBannedTag: 'Banned',
  aAdminBar: 'Admin', aReason: 'Reason', aNote: 'Note', aBannedAt: 'Banned', aAdminNote: 'Only admins can see this page. Every action is logged.',
  tHidden: 'Hidden', tUnhidden: 'Unhidden', tBanned: 'Your account is banned from posting and taking orders. Questions? Email {mail}.', tBannedOk: 'User banned', tUnbannedOk: 'User unbanned', tAdminDeleted: 'Deleted', tHandled: 'Updated', aCantBanAdmin: 'Admins can\u2019t be banned.',
  act_hide: 'Hid post', act_unhide: 'Unhid post', act_delete: 'Deleted post', act_ban: 'Banned user', act_unban: 'Unbanned user', act_report_handled: 'Handled report', act_report_reopened: 'Reopened report',
});

/* ---------- chat strings ---------- */
Object.assign(I18N.zh, {
  navMsg: '訊息', chatBtn: '聊一聊', chatTitle: '訊息', chatEmpty: '仲未有對話。喺帖子撳「聊一聊」就可以同對方傾。', chatPick: '揀一個對話開始傾。',
  chatPh: '輸入訊息…', chatSend: '傳送', chatImg: '相片', chatRead: '已讀', chatBack: '返回', chatReport: '舉報對話', chatYou: '你：', chatImgMsg: '[相片]',
  chatPostGone: '帖子已刪除', chatWith: '與 {name}', chatToday: '今日', chatLoginHint: '登入後可以同對方直接傾。', chatOptHint: '可留空：買家可以用網站內的「聊一聊」聯絡你。',
  chatReportTitle: '舉報此對話', chatReportNote: '管理員只會在對話被舉報後查閱內容。', tChatReported: '已舉報對話，管理員會跟進。', tChatTooLong: '訊息最多 1000 字。',
  tOwnPost: '呢個係你自己嘅帖子。', tPostGone: '帖子已下架或不存在。', kind_chat: '對話', aViewChat: '查看對話', aChatTitle: '被舉報的對話', act_view_chat: '查看被舉報對話', aBanUser: '封鎖 {name}',
  noContact: '未有留聯絡方法，請用「聊一聊」。', takeOptHint: '聯絡方法可留空，你哋可以用「聊一聊」。',
});
Object.assign(I18N.en, {
  navMsg: 'Messages', chatBtn: 'Chat', chatTitle: 'Messages', chatEmpty: 'No conversations yet. Tap “Chat” on a post to message the poster.', chatPick: 'Pick a conversation.',
  chatPh: 'Type a message…', chatSend: 'Send', chatImg: 'Photo', chatRead: 'Read', chatBack: 'Back', chatReport: 'Report chat', chatYou: 'You: ', chatImgMsg: '[Photo]',
  chatPostGone: 'Post deleted', chatWith: 'with {name}', chatToday: 'Today', chatLoginHint: 'Sign in to chat with the poster.', chatOptHint: 'Optional — buyers can reach you through on-site Chat.',
  chatReportTitle: 'Report this chat', chatReportNote: 'Moderators only read a chat after it has been reported.', tChatReported: 'Chat reported — a moderator will review it.', tChatTooLong: 'Messages are limited to 1000 characters.',
  tOwnPost: 'This is your own post.', tPostGone: 'This post is no longer available.', kind_chat: 'Chat', aViewChat: 'View chat', aChatTitle: 'Reported chat', act_view_chat: 'Viewed reported chat', aBanUser: 'Ban {name}',
  noContact: 'No contact left — use Chat.', takeOptHint: 'Contact is optional — you can use Chat.',
});

/* ===== Data layer =====
 * Everything that touches Supabase lives here. UI code only calls Api.* / Auth.*.
 */
let sb = null;
const Auth = {
  user: null, profile: null, isAdmin: false, banned: false,
  get uid() { return this.user?.id || null; },
  async init(onChange) {
    if (!window.supabase) throw new Error('offline');
    sb = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
    const { data } = await sb.auth.getSession();
    await this._set(data.session?.user || null);
    sb.auth.onAuthStateChange((evt, session) => {
      const nu = session?.user || null;
      if (!nu) { this.user = null; this.profile = null; this.isAdmin = false; this.banned = false; }
      if ((nu?.id || null) === this.uid && evt !== 'USER_UPDATED') return;
      setTimeout(async () => { await this._set(nu); onChange && onChange(evt); }, 0);
    });
  },
  async _set(user) {
    this.user = user; this.profile = null; this.isAdmin = false; this.banned = false;
    if (user) {
      const me = await sb.rpc('pm_me'); if (me.data && me.data[0]) { this.isAdmin = !!me.data[0].is_admin; this.banned = !!me.data[0].banned; }
      const { data } = await sb.from('profiles').select('id,display_name').eq('id', user.id).maybeSingle();
      this.profile = data || { id: user.id, display_name: t('student') };
    }
  },
  async signUp(email, password) {
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) throw error;
    // with confirmations off a session comes back; an empty identities list means the email is taken
    if (!data.session) { const e = new Error(data.user && !data.user.identities?.length ? 'user_already_exists' : 'signup_failed'); throw e; }
    await this._set(data.user); return data.user;
  },
  async signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error; await this._set(data.user); return data.user;
  },
  async changePassword(password) { const { error } = await sb.auth.updateUser({ password }); if (error) throw error; },
  // drop the local user first so no query asks for contact columns with an anon token mid-sign-out
  async signOut() { this.user = null; this.profile = null; this.isAdmin = false; this.banned = false; await sb.auth.signOut(); },
  async setName(name) {
    const { data, error } = await sb.from('profiles').update({ display_name: name }).eq('id', this.uid).select('id,display_name').single();
    if (error) throw error; this.profile = data;
  },
  async deleteAccount() {
    for (const kind of ['listings', 'daigou', 'errands']) {
      const { data } = await sb.storage.from(SUPABASE_CONFIG.bucket).list(`${this.uid}/${kind}`, { limit: 1000 });
      const paths = (data || []).filter(f => f.id).map(f => `${this.uid}/${kind}/${f.name}`);
      if (paths.length) await sb.storage.from(SUPABASE_CONFIG.bucket).remove(paths);
    }
    const { data: convs } = await sb.from('conversations').select('id');
    for (const c of convs || []) {
      const { data } = await sb.storage.from('chat-images').list(`${c.id}/${this.uid}`, { limit: 1000 });
      const paths = (data || []).filter(f => f.id).map(f => `${c.id}/${this.uid}/${f.name}`);
      if (paths.length) await sb.storage.from('chat-images').remove(paths);
    }
    const { error } = await sb.rpc('pm_delete_account'); if (error) throw error;
    this.user = null; this.profile = null;
    await sb.auth.signOut({ scope: 'local' }); // the server session went with the user
  },
};

const imgUrl = p => `${SUPABASE_CONFIG.url}/storage/v1/object/public/${SUPABASE_CONFIG.bucket}/${p.split('/').map(encodeURIComponent).join('/')}`;

const Api = (() => {
  const hm = v => (v || '').slice(0, 5);
  const OWNER = c => `owner:profiles!${c}_user_id_fkey(display_name)`;
  const TAKER = c => `taker:profiles!${c}_taker_id_fkey(display_name)`;
  const BASE = {
    listings: 'id,created_at,user_id,title,cat,price,cond,description,spot,images,status,hidden_at',
    daigou: 'id,created_at,user_id,item,from_region,budget,tip,deadline,note,images,status,taker_id,taken_at,hidden_at',
    errands: 'id,created_at,user_id,type,pickup,hall,floor,date,time_from,time_to,fee,note,images,status,taker_id,taken_at,hidden_at',
  };
  const cols = c => BASE[c] + (Auth.uid ? ',ctype,contact' : '') + ',' + OWNER(c) + (c === 'listings' ? '' : ',' + TAKER(c));
  const common = r => ({ id: r.id, t: Date.parse(r.created_at), userId: r.user_id, images: r.images || [], status: r.status, ctype: r.ctype, contact: r.contact,
    owner: r.owner || null, taker: r.taker || null, hidden: !!r.hidden_at, takerId: r.taker_id || null, mine: !!Auth.uid && r.user_id === Auth.uid, takenByMe: !!Auth.uid && r.taker_id === Auth.uid });
  const toUI = {
    listings: r => ({ ...common(r), kind: 'listings', title: r.title, cat: r.cat, price: r.price, cond: r.cond, desc: r.description, spot: r.spot }),
    daigou: r => ({ ...common(r), kind: 'daigou', item: r.item, from: r.from_region, budget: r.budget, tip: r.tip, deadline: r.deadline, note: r.note }),
    errands: r => ({ ...common(r), kind: 'errands', type: r.type, pickup: r.pickup, hall: r.hall, floor: r.floor, date: r.date, from: hm(r.time_from), to: hm(r.time_to), fee: r.fee, note: r.note }),
  };
  const toDB = {
    listings: d => ({ title: d.title, cat: d.cat, price: d.price, cond: d.cond, description: d.desc || '', ctype: d.ctype, contact: d.contact, spot: d.spot }),
    daigou: d => ({ item: d.item, from_region: d.from, budget: d.budget, tip: d.tip || 0, deadline: d.deadline, note: d.note || '', ctype: d.ctype, contact: d.contact }),
    errands: d => ({ type: d.type, pickup: d.pickup, hall: d.hall, floor: d.floor || '', date: d.date, time_from: d.from, time_to: d.to, fee: d.fee || 0, note: d.note || '', ctype: d.ctype, contact: d.contact }),
  };
  const ACTIVE = { listings: ['available', 'reserved'], daigou: ['open', 'taken'], errands: ['open', 'taken'] };
  const fail = e => { const x = new Error(e.message || 'request_failed'); x.code = e.code; throw x; };
  const store = () => sb.storage.from(SUPABASE_CONFIG.bucket);
  async function upload(c, blobs) {
    const paths = [];
    for (const b of blobs) {
      const ext = b.type === 'image/webp' ? 'webp' : b.type === 'image/png' ? 'png' : 'jpg';
      const path = `${Auth.uid}/${c}/${crypto.randomUUID()}.${ext}`;
      const { error } = await store().upload(path, b, { contentType: b.type, cacheControl: '31536000', upsert: false });
      if (error) { if (paths.length) await store().remove(paths); fail(error); }
      paths.push(path);
    }
    return paths;
  }
  return {
    async board(c) {
      const { data, error } = await sb.from(c).select(cols(c)).in('status', ACTIVE[c]).is('hidden_at', null).order('created_at', { ascending: false }).limit(300);
      if (error) fail(error); return data.map(toUI[c]);
    },
    async mine() {
      if (!Auth.uid) return { posts: [], taken: [] };
      const q = c => sb.from(c).select(cols(c)).eq('user_id', Auth.uid).order('created_at', { ascending: false });
      const qt = c => sb.from(c).select(cols(c)).eq('taker_id', Auth.uid).order('taken_at', { ascending: false });
      const res = await Promise.all([q('listings'), q('daigou'), q('errands'), qt('daigou'), qt('errands')]);
      res.forEach(r => r.error && fail(r.error));
      return { posts: [...res[0].data.map(toUI.listings), ...res[1].data.map(toUI.daigou), ...res[2].data.map(toUI.errands)],
        taken: [...res[3].data.map(toUI.daigou), ...res[4].data.map(toUI.errands)] };
    },
    async create(c, d, blobs = []) {
      if (!Auth.uid) throw new Error('login_required');
      const images = await upload(c, blobs);
      const { data, error } = await sb.from(c).insert({ ...toDB[c](d), images }).select(cols(c)).single();
      if (error) { if (images.length) await store().remove(images); fail(error); }
      return toUI[c](data);
    },
    async update(c, id, d, { keep = null, blobs = [] } = {}) {
      if (!Auth.uid) throw new Error('login_required');
      const { data: cur, error: e0 } = await sb.from(c).select('images,user_id').eq('id', id).single(); if (e0) fail(e0);
      if (cur.user_id !== Auth.uid) throw new Error('not_allowed');
      const kept = keep ? cur.images.filter(p => keep.includes(p)) : cur.images;
      const added = await upload(c, blobs.slice(0, Math.max(0, IMG.maxCount - kept.length)));
      const patch = d ? { ...toDB[c](d), images: [...kept, ...added] } : { images: [...kept, ...added] };
      const { data, error } = await sb.from(c).update(patch).eq('id', id).select(cols(c));
      if (error || !data.length) { if (added.length) await store().remove(added); error ? fail(error) : (() => { throw new Error('not_allowed'); })(); }
      const dropped = cur.images.filter(p => !kept.includes(p)); if (dropped.length) await store().remove(dropped);
      return toUI[c](data[0]);
    },
    async setStatus(c, id, status) {
      const { data, error } = await sb.from(c).update({ status }).eq('id', id).select('id');
      if (error) fail(error); if (!data.length) throw new Error('not_allowed'); return true;
    },
    async remove(c, id) {
      const { data, error } = await sb.from(c).delete().eq('id', id).select('images');
      if (error) fail(error); if (!data.length) throw new Error('not_allowed');
      const imgs = data[0].images || []; if (imgs.length) await store().remove(imgs);
      return true;
    },
    async take(c, id, ctype, contact) {
      const { data, error } = await sb.rpc('pm_take', { p_kind: c, p_id: id, p_ctype: ctype, p_contact: contact });
      if (error) fail(error); if (!data) throw new Error('not_allowed'); return true;
    },
    async release(c, id) {
      const { data, error } = await sb.rpc('pm_release', { p_kind: c, p_id: id });
      if (error) fail(error); if (!data) throw new Error('not_allowed'); return true;
    },
    async takerContact(c, id) {
      const { data, error } = await sb.rpc('pm_taker_contact', { p_kind: c, p_id: id });
      if (error) fail(error); return data && data[0] || null;
    },
    /* ---- admin (every call is re-checked in the database) ---- */
    async adminData() {
      const [rep, bans, log] = await Promise.all([
        sb.from('reports').select('id,created_at,reporter_id,target_kind,target_id,target_title,reason,note,handled_at').order('created_at', { ascending: false }).limit(300),
        sb.from('bans').select('user_id,reason,created_at,user:profiles!bans_user_id_fkey(display_name)').order('created_at', { ascending: false }),
        sb.from('mod_log').select('id,created_at,admin_id,action,target_kind,target_id,target_user,note').order('id', { ascending: false }).limit(100),
      ]);
      [rep, bans, log].forEach(r => r.error && fail(r.error));
      const posts = {};
      await Promise.all(['listings', 'daigou', 'errands'].map(async c => {
        const ids = [...new Set(rep.data.filter(r => r.target_kind === c).map(r => r.target_id))];
        if (!ids.length) return;
        const { data, error } = await sb.from(c).select(cols(c)).in('id', ids); if (error) fail(error);
        data.forEach(r => posts[r.id] = toUI[c](r));
      }));
      const uids = [...new Set(log.data.flatMap(l => [l.admin_id, l.target_user]).filter(Boolean))];
      const names = {};
      if (uids.length) { const { data } = await sb.from('profiles').select('id,display_name').in('id', uids); (data || []).forEach(p => names[p.id] = p.display_name); }
      return { reports: rep.data, posts, bans: bans.data, log: log.data, names };
    },
    async adminGet(c, id) { const { data, error } = await sb.from(c).select(cols(c)).eq('id', id).maybeSingle(); if (error) fail(error); return data && toUI[c](data); },
    async adminHide(c, id, hidden) { const { data, error } = await sb.rpc('pm_admin_hide', { p_kind: c, p_id: id, p_hidden: hidden, p_note: '' }); if (error) fail(error); if (!data) throw new Error('not_allowed'); },
    async adminDelete(c, id) {
      const { data, error } = await sb.rpc('pm_admin_delete', { p_kind: c, p_id: id, p_note: '' }); if (error) fail(error);
      if (data === null) throw new Error('not_allowed');
      if (data.length) { const r = await store().remove(data); if (r.error) console.warn(r.error); }
    },
    async adminReport(id, handled) { const { error } = await sb.rpc('pm_admin_report', { p_id: id, p_handled: handled }); if (error) fail(error); },
    async adminBan(uid, banned, reason = '') { const { data, error } = await sb.rpc('pm_admin_ban', { p_user: uid, p_banned: banned, p_reason: reason }); if (error) fail(error); if (!data) throw new Error('not_allowed'); },
    /* ---- chat ---- */
    async chatOpen(c, id) { const { data, error } = await sb.rpc('pm_chat_open', { p_kind: c, p_id: id }); if (error) fail(error); return data; },
    async chatList() {
      const { data, error } = await sb.from('conversations').select('*,owner:profiles!conversations_owner_id_fkey(display_name),other:profiles!conversations_other_id_fkey(display_name)')
        .order('last_message_at', { ascending: false, nullsFirst: false }).limit(200);
      if (error) fail(error);
      return data.map(c => { const me = Auth.uid, iAmOwner = c.owner_id === me, readAt = Date.parse(iAmOwner ? c.owner_read_at : c.other_read_at);
        return { ...c, peer: iAmOwner ? c.other : c.owner, peerId: iAmOwner ? c.other_id : c.owner_id, peerReadAt: Date.parse(iAmOwner ? c.other_read_at : c.owner_read_at),
          unread: !!c.last_message_at && c.last_sender !== me && Date.parse(c.last_message_at) > readAt + 500 }; });
    },
    async chatMessages(conv, afterId = 0) {
      const { data, error } = await sb.from('messages').select('id,conversation_id,sender_id,body,image,created_at').eq('conversation_id', conv).gt('id', afterId).order('id').limit(500);
      if (error) fail(error); return data;
    },
    async chatSend(conv, body, blob) {
      let path = null;
      if (blob) {
        path = `${conv}/${Auth.uid}/${crypto.randomUUID()}.${blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg'}`;
        const up = await sb.storage.from('chat-images').upload(path, blob, { contentType: blob.type, upsert: false }); if (up.error) fail(up.error);
      }
      const { data, error } = await sb.from('messages').insert({ conversation_id: conv, body: body || '', image: path }).select('id,conversation_id,sender_id,body,image,created_at').single();
      if (error) { if (path) await sb.storage.from('chat-images').remove([path]); fail(error); }
      return data;
    },
    async chatRead(conv) { await sb.rpc('pm_chat_read', { p_conv: conv }); },
    async chatReport(conv, reason, note) { const { error } = await sb.rpc('pm_chat_report', { p_conv: conv, p_reason: reason, p_note: note || '' }); if (error) fail(error); },
    async chatSigned(paths) {
      if (!paths.length) return {};
      const { data, error } = await sb.storage.from('chat-images').createSignedUrls(paths, 3600); if (error) fail(error);
      const o = {}; (data || []).forEach(d => { if (d.signedUrl) o[d.path] = d.signedUrl; }); return o;
    },
    async adminChat(conv) { const { data, error } = await sb.rpc('pm_admin_chat', { p_conv: conv }); if (error) fail(error); return data; },
    async report(d) {
      const { error } = await sb.from('reports').insert({ target_kind: d.target_kind, target_id: d.target_id, target_title: (d.target_title || '').slice(0, 120), reason: d.reason, note: d.note || '' });
      if (error) fail(error); return true;
    },
  };
})();

/* ===== Images: client-side resize & compress ===== */
async function compressImage(file) {
  if (!/^image\//.test(file.type)) throw new Error('not_image');
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch (e) { bmp = await new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => no(new Error('not_image')); im.src = URL.createObjectURL(file); }); }
  const w0 = bmp.width, h0 = bmp.height, k = Math.min(1, IMG.maxSide / Math.max(w0, h0));
  let w = Math.round(w0 * k), h = Math.round(h0 * k);
  const cv = document.createElement('canvas');
  const toBlob = (type, q) => new Promise(r => cv.toBlob(r, type, q));
  for (let attempt = 0; attempt < 6; attempt++) {
    cv.width = w; cv.height = h; const ctx = cv.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.drawImage(bmp, 0, 0, w, h);
    for (const q of [0.82, 0.7, 0.6]) {
      let b = await toBlob('image/webp', q);
      if (!b || b.type !== 'image/webp') b = await toBlob('image/jpeg', q);
      if (b && b.size <= IMG.maxBytes) return b;
    }
    w = Math.round(w * 0.8); h = Math.round(h * 0.8);
  }
  throw new Error('too_large');
}

/* ===================== UI ===================== */
let listings = [], requests = [], errands = [], my = { posts: [], taken: [] };
const COL = { l: 'listings', r: 'daigou', e: 'errands', c: 'chat' };
const KEY = { listings: 'l', daigou: 'r', errands: 'e', chat: 'c' };
const findPost = (k, id) => { const c = COL[k] || k; return [...({ listings, daigou: requests, errands }[c] || []), ...my.posts, ...my.taken].find(x => x.id === id && x.kind === c); };
let online = false;
async function refresh(...cols) {
  if (!online) return;
  const want = cols.length ? cols : ['listings', 'daigou', 'errands', 'mine'];
  await Promise.all(want.map(async c => {
    if (c === 'mine') my = await Api.mine();
    else { const d = await Api.board(c); if (c === 'listings') listings = d; else if (c === 'daigou') requests = d; else errands = d; }
  }));
}
const who = x => x.mine ? t('me') : (x.owner?.display_name || t('student'));
const badge = () => '';
const thumbHtml = x => x.images?.length ? `<img src="${imgUrl(x.images[0])}" alt="" loading="lazy" decoding="async">` : art(x);
const loggedIn = () => !!Auth.uid;
const adminBar = x => !Auth.isAdmin ? '' : `<div class="admin-bar"><span>🛡 ${t('aAdminBar')}</span>
  <button class="link-btn" data-ahide="${KEY[x.kind]}:${x.id}:${x.hidden ? 0 : 1}">${t(x.hidden ? 'aUnhide' : 'aHide')}</button>
  <button class="link-btn danger" data-adel="${KEY[x.kind]}:${x.id}">${t('aDelete')}</button>
  ${x.mine ? '' : `<button class="link-btn danger" data-aban="${x.userId}:1:${esc(x.owner?.display_name || '')}">${t('aBan')}</button>`}</div>`;
function needLogin(then) { if (loggedIn()) return false; pendingAfterLogin = then || null; openLogin(); toast(t('tLogin')); return true; }
let pendingAfterLogin = null;

/* ---------- i18n apply ---------- */
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
  document.title = lang === 'zh' ? '理大二手網 · PolyU Marketplace' : 'PolyU Marketplace · 理大二手網';
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $$('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  const fill = (sel, arr, fn) => { const v = $(sel).value; $(sel).innerHTML = arr.map(x => `<option value="${x}">${fn(x)}</option>`).join(''); if (v) $(sel).value = v; };
  fill('#postCat', CATS.map(c => c.id), x => t('cat_' + x)); fill('#postCond', CONDS, x => t('cond_' + x)); if (!$('#postCond').dataset.init) { $('#postCond').value = 'good'; $('#postCond').dataset.init = 1; }
  fill('#postSpot', SPOTS, x => t('spot_' + x)); fill('#reqFrom', REGIONS, x => t('reg_' + x));
  fill('#errType', ER_TYPES, x => t('type_' + x)); fill('#errHall', HALLS, x => t('hall_' + x));
  $('#reqForm [name=deadline]').min = ymd(Date.now()); $('#errForm [name=date]').min = ymd(Date.now());
  renderHeader(); renderAll();
  if (!$('#docModal').hidden && curDoc) openDoc(curDoc);
}
function setLang(l) { lang = l; localStorage.setItem(LS_LANG, l); applyLang(); }
function renderHeader() {
  $('#adminBtn').hidden = !Auth.isAdmin; renderMsgBadge();
  const b = $('#meBtn');
  if (loggedIn()) { const n = Auth.profile?.display_name || ''; b.innerHTML = `<span class="avatar">${esc([...n][0] || '?').toUpperCase()}</span><span class="me-label">${t('navMe')}</span>`; b.classList.add('in'); }
  else { b.innerHTML = `<span class="me-label">${t('login')}</span>`; b.classList.remove('in'); }
}

/* ---------- market ---------- */
function renderCats() {
  $('#cats').innerHTML = [{ id: 'all' }, ...CATS].map(c => `<button class="chip ${state.cat === c.id ? 'active' : ''}" data-cat="${c.id}">${c.id === 'all' ? t('all') : t('cat_' + c.id)}</button>`).join('');
}
function emptyBlock(title, text, btn, action) {
  return `<div class="empty-card">${EMPTY_ART}<h3>${title}</h3><p>${text}</p>${btn ? `<button class="btn btn-primary" data-action="${action}">＋ ${btn}</button>` : ''}</div>`;
}
function renderGrid() {
  const q = state.q.trim().toLowerCase();
  const arr = listings.filter(l => (state.cat === 'all' || l.cat === state.cat) &&
    (!q || [l.title, l.desc, I18N.zh['cat_' + l.cat], I18N.en['cat_' + l.cat]].join(' ').toLowerCase().includes(q)));
  const by = { new: (a, b) => b.t - a.t, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price };
  arr.sort((a, b) => (a.status === 'reserved') - (b.status === 'reserved') || by[state.sort](a, b));
  $('#grid').innerHTML = arr.map(l => `
    <article class="card ${l.status === 'reserved' ? 'is-reserved' : ''}" data-id="${l.id}" tabindex="0">
      <div class="thumb">${thumbHtml(l)}<span class="thumb-cat">${t('cat_' + l.cat)}</span>${l.status === 'reserved' ? `<span class="st-badge">${t('st_reserved')}</span>` : ''}${l.images.length > 1 ? `<span class="img-count">${l.images.length}</span>` : ''}</div>
      <div class="card-b">
        <div class="card-t">${esc(l.title)}</div>
        <div class="price"><small>HK$</small>${l.price}</div>
        <div class="meta"><span class="tag">${t('cond_' + l.cond)}</span><span>${ago(l.t)}</span></div>
      </div>
    </article>`).join('');
  const e = $('#empty');
  e.hidden = arr.length > 0;
  e.innerHTML = listings.length === 0 ? emptyBlock(t('emptyTitle'), t('emptyText'), t('emptyBtn'), 'post') : emptyBlock(t('noMatchTitle'), t('noMatchText'));
  const base = state.cat === 'all' ? t('allItems') : t('cat_' + state.cat);
  $('#listTitle').innerHTML = `${esc(base)}${q ? ` · “${esc(state.q)}”` : ''} <span class="count">${arr.length}</span>`;
}
function gallery(x) {
  if (!x.images?.length) return `<div class="d-img">${art(x)}</div>`;
  return `<div class="gallery"><div class="g-main"><img id="gMain" src="${imgUrl(x.images[0])}" alt="${esc(t('photoOf', { n: 1 }))}"></div>
    ${x.images.length > 1 ? `<div class="g-thumbs">${x.images.map((p, i) => `<button class="g-th ${i ? '' : 'active'}" data-gimg="${imgUrl(p)}" aria-label="${esc(t('photoOf', { n: i + 1 }))}"><img src="${imgUrl(p)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}</div>`;
}
const chatBtnHtml = (x, cls = 'btn btn-primary') => x.mine ? '' : `<button class="${cls}" data-chat="${KEY[x.kind]}:${x.id}">💬 ${t('chatBtn')}</button>`;
function contactBlock(x) {
  if (!loggedIn()) return `<button class="btn btn-primary btn-block" data-chat="${KEY[x.kind]}:${x.id}">💬 ${t('chatBtn')}</button><p class="hint center">🔒 ${t('chatLoginHint')}</p>`;
  return `<div class="contact-btns">${chatBtnHtml(x, 'btn btn-primary btn-block')}${x.contact ? `<button class="btn btn-ghost btn-block" data-copy="${esc(x.contact)}">${esc(x.ctype)} · ${esc(x.contact)} — ${t('copyContact')}</button>` : ''}</div>`;
}
function openDetail(id) {
  const l = listings.find(x => x.id === id) || my.posts.find(x => x.id === id); if (!l) return;
  $('#detailBody').innerHTML = `
    ${gallery(l)}
    <h3 class="d-title">${esc(l.title)}</h3>
    <div class="d-row"><span class="price"><small>HK$</small>${l.price}</span><span class="tag">${t('cond_' + l.cond)}</span><span class="tag">${t('cat_' + l.cat)}</span>${l.status !== 'available' ? `<span class="tag st-${l.status}">${t('st_' + l.status)}</span>` : ''}</div>
    <p class="d-desc">${esc(l.desc || t('noDesc'))}</p>
    <div class="d-box">
      <div><span>${t('seller')}</span><b>${esc(who(l))} ${badge(l.owner)}</b></div>
      <div><span>${t('spot')}</span><b>${t('spot_' + l.spot)}</b></div>
      <div><span>${t('posted')}</span><b>${ago(l.t)}</b></div>
    </div>
    ${l.mine ? `<button class="btn btn-ghost btn-block" data-nav="me">${t('navMe')} → ${t('edit')}</button>` : contactBlock(l)}
    ${scamHtml()}
    <div class="d-actions"><span></span><button class="link-btn" data-report="l:${l.id}">⚑ ${t('report')}</button></div>${adminBar(l)}`;
  show('#detailModal');
}

/* ---------- daigou / errands cards ---------- */
function orderActions(x) {
  const k = KEY[x.kind];
  const chat = chatBtnHtml(x, 'btn btn-ghost');
  if (x.status === 'open' && !x.mine) return `<span class="req-right">${chat}<button class="btn btn-primary" data-take="${k}:${x.id}">${t('take')}</button></span>`;
  if (x.status === 'taken' && x.takenByMe) return `<span class="req-right">${chat}${x.contact ? `<button class="btn btn-ghost" data-copy="${esc(x.contact)}">${esc(x.ctype)} · ${esc(x.contact)}</button>` : ''}</span>`;
  if (x.status === 'taken' && !x.mine) return `<span class="req-right">${chat}</span>`;
  if (x.mine) return `<button class="btn btn-ghost" data-nav="me">${t('navMe')}</button>`;
  return '';
}
function imgStrip(x) { return x.images?.length ? `<div class="img-strip">${x.images.map(p => `<a href="${imgUrl(p)}" target="_blank" rel="noopener"><img src="${imgUrl(p)}" alt="" loading="lazy"></a>`).join('')}</div>` : ''; }
function renderDg() {
  $('#dgScam').innerHTML = scamHtml();
  $('#dgFilters').innerHTML = ['all', ...REGIONS].map(f => `<button class="chip ${state.dg === f ? 'active' : ''}" data-dg="${f}">${t('reg_' + f)}</button>`).join('');
  const arr = requests.filter(r => state.dg === 'all' || r.from === state.dg).sort((a, b) => (a.status === 'taken') - (b.status === 'taken') || b.t - a.t);
  if (!arr.length) {
    $('#reqList').innerHTML = requests.length ? `<div class="empty-card">${EMPTY_ART}<p>${t('dgNoMatch')}</p></div>` : emptyBlock(t('dgEmptyTitle'), t('dgEmptyText'), t('dgEmptyBtn'), 'req');
    return;
  }
  $('#reqList').innerHTML = arr.map(r => {
    const left = Math.round((new Date(r.deadline + 'T00:00') - new Date(ymd(Date.now()) + 'T00:00')) / DAY);
    const dl = left < 0 ? t('expired') : left === 0 ? t('today') : t('daysLeft', { n: left });
    return `<div class="req ${r.status === 'open' ? 'open' : 'taken'}">
      <div class="req-top"><div class="flag">${t('regShort_' + r.from)}</div>
        <div class="req-h"><h4>${esc(r.item)}</h4><div class="req-info"><span>${t('from')} <b>${t('reg_' + r.from)}</b></span><span>${esc(who(r))} ${badge(r.owner)} · ${ago(r.t)}</span></div></div></div>
      <div class="req-info"><span>${t('budget')} <b>HK$${r.budget}</b></span><span>${t('runFee')} <b>HK$${r.tip || 0}</b></span>
        <span class="${left <= 3 ? 'urgent' : ''}">${t('deadline')} ${esc(r.deadline)} · ${dl}</span></div>
      ${r.note ? `<p class="req-note">${esc(r.note)}</p>` : ''}${imgStrip(r)}
      <div class="req-foot"><span class="req-left"><span class="status ${r.status === 'open' ? 'open' : 'taken'}">${t('st_' + r.status)}</span><button class="link-btn" data-report="r:${r.id}">⚑ ${t('report')}</button></span>
        ${orderActions(r)}</div>${adminBar(r)}
    </div>`;
  }).join('');
}
function renderErrands() {
  $('#erSafety').innerHTML = safetyHtml();
  $('#erTypes').innerHTML = ['all', ...ER_TYPES].map(x => `<button class="chip ${erState.type === x ? 'active' : ''}" data-ertype="${x}">${t('type_' + x)}</button>`).join('');
  $('#hallSwitch').innerHTML = HALLS.map(h => {
    const all = errands.filter(x => x.hall === h), open = all.filter(x => x.status === 'open').length;
    return `<button class="hall-card ${erState.hall === h ? 'active' : ''}" data-hall="${h}" role="tab" aria-selected="${erState.hall === h}">
      <span class="hall-name">${t('hall_' + h)}</span><span class="hall-alt">${I18N[lang === 'zh' ? 'en' : 'zh']['hall_' + h]}</span>
      <span class="hall-count"><b>${open}</b> ${t('openCount')}${all.length > open ? ` · ${all.length} ${t('totalCount')}` : ''}</span></button>`;
  }).join('');
  const inHall = errands.filter(x => x.hall === erState.hall);
  const arr = inHall.filter(x => erState.type === 'all' || x.type === erState.type).sort((a, b) => (a.status === 'taken') - (b.status === 'taken') || b.t - a.t);
  if (!arr.length) {
    const hn = t('hall_' + erState.hall);
    $('#errList').innerHTML = inHall.length ? `<div class="empty-card">${EMPTY_ART}<p>${t('erNoMatch')}</p></div>` : emptyBlock(t('erEmptyTitle', { hall: hn }), t('erEmptyText', { hall: hn }), t('erEmptyBtn'), 'err');
    return;
  }
  $('#errList').innerHTML = arr.map(x => `<div class="req ${x.status === 'open' ? 'open' : 'taken'}">
      <div class="req-top"><div class="flag er-${x.type}"><svg viewBox="0 0 24 24" aria-hidden="true">${ER_ICON[x.type]}</svg></div>
        <div class="req-h"><h4>${t('type_' + x.type)}${x.floor ? ` <span class="muted">${esc(x.floor)}</span>` : ''}</h4>
        <div class="req-info"><span>${esc(who(x))} ${badge(x.owner)} · ${ago(x.t)}</span></div></div></div>
      <div class="er-grid">
        <span>${t('pickup')}</span><b>${esc(x.pickup)}</b>
        <span>${t('window')}</span><b>${esc(x.date)} ${esc(x.from)}–${esc(x.to)}</b>
        <span>${t('fee')}</span><b>${x.fee ? 'HK$' + x.fee : t('feeNone')}</b>
      </div>
      ${x.note ? `<p class="req-note">${esc(x.note)}</p>` : ''}${imgStrip(x)}
      <div class="req-foot"><span class="req-left"><span class="status ${x.status === 'open' ? 'open' : 'taken'}">${t('st_' + x.status)}</span>
        <button class="link-btn" data-report="e:${x.id}">⚑ ${t('report')}</button></span>
        ${orderActions(x)}</div>${adminBar(x)}
    </div>`).join('');
}

/* ---------- 我的 / Me ---------- */
const NEXT = {
  listings: { available: ['reserved', 'sold', 'removed'], reserved: ['available', 'sold', 'removed'], sold: ['available'], removed: ['available'] },
  orders: { open: ['cancelled'], taken: ['done', 'cancelled'], cancelled: ['open'], done: [] },
};
const ST_BTN = { reserved: 'markReserved', sold: 'markSold', removed: 'markRemoved', available: 'markAvailable', cancelled: 'cancelPost', done: 'completePost', open: 'reopen' };
const takerInfo = {};
function postTitle(x) { return x.kind === 'listings' ? x.title : x.kind === 'daigou' ? x.item : `${t('type_' + x.type)} · ${t('hall_' + x.hall)}`; }
function postSub(x) {
  if (x.kind === 'listings') return `HK$${x.price} · ${t('cond_' + x.cond)}`;
  if (x.kind === 'daigou') return `${t('reg_' + x.from)} · ${t('budget')} HK$${x.budget} · ${esc(x.deadline)}`;
  return `${esc(x.pickup)} · ${esc(x.date)} ${esc(x.from)}–${esc(x.to)}`;
}
function meRow(x, taken) {
  const k = KEY[x.kind], thumb = x.images?.length ? `<img src="${imgUrl(x.images[0])}" alt="" loading="lazy">` : (x.kind === 'listings' ? art(x) : `<span class="me-kind-ic">${x.kind === 'daigou' ? '✈' : '⇪'}</span>`);
  let actions = '', extra = '';
  if (taken) {
    extra = `<div class="me-contact"><span>${t('posterLabel')}</span><b>${esc(x.owner?.display_name || t('student'))}</b> · ${x.contact ? `<button class="link-btn" data-copy="${esc(x.contact)}">${esc(x.ctype)} · ${esc(x.contact)}</button> · ` : ''}<button class="link-btn" data-chat="${k}:${x.id}">💬 ${t('chatBtn')}</button></div>`;
    if (x.status === 'taken') actions = `<button class="btn btn-ghost btn-sm" data-release="${k}:${x.id}">${t('release')}</button>`;
  } else {
    const next = (x.kind === 'listings' ? NEXT.listings : NEXT.orders)[x.status] || [];
    actions = next.map(s => `<button class="btn btn-ghost btn-sm" data-st="${k}:${x.id}:${s}">${t(ST_BTN[s])}</button>`).join('');
    if (x.kind === 'listings' || x.status === 'open' || x.status === 'cancelled') actions += `<button class="btn btn-ghost btn-sm" data-edit="${k}:${x.id}">${t('edit')}</button>`;
    actions += `<button class="btn btn-ghost btn-sm danger" data-del="${k}:${x.id}">${t('del')}</button>`;
    if (x.kind !== 'listings' && x.status !== 'open' && x.takerId) {
      const ti = takerInfo[x.id];
      extra = `<div class="me-contact"><span>${t('takerLabel')}</span><b>${esc(ti?.display_name || x.taker?.display_name || t('student'))}</b> ${badge(x.taker)}${ti?.contact ? ` · <button class="link-btn" data-copy="${esc(ti.contact)}">${esc(ti.ctype)} · ${esc(ti.contact)}</button>` : ''}</div>`;
    }
  }
  return `<div class="me-row" data-kind="${x.kind}" data-id="${x.id}">
    <div class="me-thumb">${thumb}</div>
    <div class="me-main"><div class="me-top"><span class="tag">${t('kind_' + x.kind)}</span><span class="pill st-${x.status}">${t('st_' + x.status)}</span>${x.hidden ? `<span class="pill st-hidden">${t('aHiddenTag')}</span>` : ''}<span class="muted">${ago(x.t)}</span></div>
      <div class="me-title">${esc(postTitle(x))}</div><div class="me-sub">${postSub(x)}</div>${extra}
      <div class="me-actions">${actions}</div></div></div>`;
}
function renderMe() {
  const box = $('#meBody'); if (!box) return;
  if (!loggedIn()) { box.innerHTML = `<div class="empty-card">${EMPTY_ART}<h3>${t('login')}</h3><p>${t('loginHint')}</p><button class="btn btn-primary" data-action="login">${t('login')}</button></div>`; return; }
  const p = Auth.profile || {};
  // keep whatever the user is typing in the profile forms across re-renders
  const keep = $$('#meBody form input').map(i => [i.closest('form').id, i.name, i.value, i === document.activeElement]);
  const dirty = keep.filter(([f, n, v]) => v && (f === 'pwForm' || document.activeElement?.closest?.('#' + f)));
  box.innerHTML = `
    <section class="me-card">
      <div class="me-prof"><span class="avatar lg">${esc([...(p.display_name || '?')][0]).toUpperCase()}</span>
        <div><div class="me-name">${esc(p.display_name || '')} ${badge(p)}</div><div class="muted">${esc(Auth.user.email || '')}</div></div></div>
      <form id="nameForm" class="me-name-form"><label><span>${t('displayName')}</span><input name="name" maxlength="30" minlength="1" required value="${esc(p.display_name || '')}"></label><button class="btn btn-primary btn-sm">${t('save')}</button></form>
      <form id="pwForm" class="me-pw-form"><b>${t('changePw')}</b>
        <div class="me-pw-row"><label><span>${t('newPw')}</span><input name="pw" type="password" minlength="8" required autocomplete="new-password" placeholder="${t('passwordPh')}"></label>
        <label><span>${t('newPw2')}</span><input name="pw2" type="password" minlength="8" required autocomplete="new-password"></label>
        <button class="btn btn-primary btn-sm">${t('changePw')}</button></div></form>
      <div class="me-acc"><button class="btn btn-ghost btn-sm" data-action="logout">${t('logout')}</button><button class="link-btn danger" data-action="delacc">${t('deleteAccount')}</button></div>
    </section>
    <h2 class="sec-title">${t('myPosts')} <span class="count">${my.posts.length}</span></h2>
    <div class="me-list">${my.posts.length ? my.posts.sort((a, b) => b.t - a.t).map(x => meRow(x, false)).join('') : `<p class="muted me-empty">${t('noPosts')}</p>`}</div>
    <h2 class="sec-title">${t('myTaken')} <span class="count">${my.taken.length}</span></h2>
    <div class="me-list">${my.taken.length ? my.taken.map(x => meRow(x, true)).join('') : `<p class="muted me-empty">${t('noTaken')}</p>`}</div>`;
  dirty.forEach(([f, n, v, focused]) => { const inp = $(`#${f} [name=${n}]`); if (inp) { inp.value = v; if (focused) inp.focus(); } });
}
async function loadMe() {
  if (!loggedIn()) { my = { posts: [], taken: [] }; return renderMe(); }
  await refresh('mine');
  await Promise.all(my.posts.filter(x => x.kind !== 'listings' && x.takerId && !takerInfo[x.id]).map(async x => { try { takerInfo[x.id] = await Api.takerContact(x.kind, x.id); } catch (e) {} }));
  renderMe();
}

/* ---------- photo fields ---------- */
const Photos = {};
function photoField(form, kind) {
  const root = form.querySelector('[data-photos]'); if (!root) return;
  const st = Photos[form.id] = { keep: [], blobs: [], kind, root };
  root.addEventListener('change', async e => {
    const input = e.target; if (input.type !== 'file') return;
    const files = [...input.files]; input.value = '';
    for (const f of files) {
      if (st.keep.length + st.blobs.length >= IMG.maxCount) { toast(t('tTooMany')); break; }
      if (!/^image\//.test(f.type)) { toast(t('tNotImage')); continue; }
      try { const b = await compressImage(f); st.blobs.push({ blob: b, url: URL.createObjectURL(b) }); } catch (err) { toast(t(err.message === 'too_large' ? 'tTooLarge' : 'tNotImage')); }
    }
    drawPhotos(form.id);
  });
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-rm]'); if (!b) return; e.preventDefault();
    const [type, i] = b.dataset.rm.split(':');
    if (type === 'k') st.keep.splice(+i, 1); else { URL.revokeObjectURL(st.blobs[+i].url); st.blobs.splice(+i, 1); }
    drawPhotos(form.id);
  });
  drawPhotos(form.id);
}
function drawPhotos(fid) {
  const st = Photos[fid]; if (!st) return;
  const items = [...st.keep.map((p, i) => ({ src: imgUrl(p), rm: 'k:' + i })), ...st.blobs.map((b, i) => ({ src: b.url, rm: 'n:' + i }))];
  st.root.querySelector('.pf-grid').innerHTML = items.map((x, i) => `<div class="pf"><img src="${x.src}" alt="${esc(t('photoOf', { n: i + 1 }))}"><button type="button" class="pf-rm" data-rm="${x.rm}" aria-label="×">×</button></div>`).join('')
    + (items.length < IMG.maxCount ? `<label class="pf pf-add"><span>${t('addPhoto')}</span><input type="file" class="pf-input" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*" multiple></label>` : '');
}
function resetPhotos(fid, keep = []) { const st = Photos[fid]; if (!st) return; st.blobs.forEach(b => URL.revokeObjectURL(b.url)); st.keep = [...keep]; st.blobs = []; drawPhotos(fid); }

/* ---------- forms: create & edit ---------- */
const FORM = { listings: '#postForm', daigou: '#reqForm', errands: '#errForm' };
function bannedStop() { if (!Auth.banned) return false; toast(t('tBanned', { mail: SITE_CONFIG.contactEmail })); return true; }
function openForm(c, x) {
  if (needLogin(() => openForm(c, x))) return;
  if (!x && bannedStop()) return;
  const f = $(FORM[c]); f.reset(); applyLang();
  f.dataset.edit = x ? x.id : '';
  const title = f.closest('.modal').querySelector('.modal-title'), sub = f.querySelector('button[type=submit]');
  title.dataset.i18n = x ? 'editTitle' : { listings: 'postTitle', daigou: 'reqTitle', errands: 'errFormTitle' }[c];
  sub.dataset.i18n = x ? 'submitSave' : { listings: 'submitPost', daigou: 'submitReq', errands: 'submitErr' }[c];
  title.textContent = t(title.dataset.i18n); sub.textContent = t(sub.dataset.i18n);
  const set = (n, v) => { const el = f.querySelector(`[name=${n}]`); if (el && v != null) el.value = v; };
  if (x) {
    const m = { listings: { title: x.title, cat: x.cat, price: x.price, cond: x.cond, desc: x.desc, spot: x.spot },
      daigou: { item: x.item, from: x.from, budget: x.budget, tip: x.tip, deadline: x.deadline, note: x.note },
      errands: { type: x.type, pickup: x.pickup, hall: x.hall, floor: x.floor, date: x.date, from: x.from, to: x.to, fee: x.fee, note: x.note } }[c];
    Object.entries({ ...m, ctype: x.ctype, contact: x.contact }).forEach(([k, v]) => set(k, v));
  } else {
    if (c === 'errands') set('hall', erState.hall);
    const last = localStorage.getItem(LS_TAKER); if (last) try { const o = JSON.parse(last); set('ctype', o.ctype); set('contact', o.contact); } catch (e) {}
  }
  resetPhotos(f.id, x ? x.images : []);
  show('#' + f.closest('.modal').id);
}
function formData(c, f) {
  return {
    listings: () => ({ title: f.title.trim(), cat: f.cat, price: +f.price, cond: f.cond, desc: f.desc.trim(), ctype: f.ctype, contact: f.contact.trim(), spot: f.spot }),
    daigou: () => ({ item: f.item.trim(), from: f.from, budget: +f.budget, tip: +f.tip || 0, deadline: f.deadline, note: f.note.trim(), ctype: f.ctype, contact: f.contact.trim() }),
    errands: () => ({ type: f.type, pickup: f.pickup.trim(), hall: f.hall, floor: f.floor.trim(), date: f.date, from: f.from, to: f.to, fee: +f.fee || 0, note: f.note.trim(), ctype: f.ctype, contact: f.contact.trim() }),
  }[c]();
}
async function submitForm(c, e) {
  e.preventDefault();
  if (needLogin()) return;
  const form = e.target, f = Object.fromEntries(new FormData(form)), st = Photos[form.id], btn = form.querySelector('button[type=submit]');
  const d = formData(c, f), editId = form.dataset.edit;
  localStorage.setItem(LS_TAKER, JSON.stringify({ ctype: d.ctype, contact: d.contact }));
  btn.disabled = true; const label = btn.textContent; if (st.blobs.length) btn.textContent = t('uploading');
  try {
    if (editId) await Api.update(c, editId, d, { keep: st.keep, blobs: st.blobs.map(b => b.blob) });
    else await Api.create(c, d, st.blobs.map(b => b.blob));
  } catch (err) { btn.disabled = false; btn.textContent = label; return toast(errMsg(err)); }
  btn.disabled = false; btn.textContent = label;
  form.reset(); resetPhotos(form.id); form.dataset.edit = ''; hideAll();
  await refresh(c, 'mine').catch(() => {});
  if (editId) { renderAll(); renderMe(); return toast(t('tSaved')); }
  if (c === 'listings') { state.cat = 'all'; state.q = ''; $('#q').value = ''; go('market'); toast(t('tPosted')); }
  else if (c === 'daigou') { state.dg = 'all'; go('daigou'); toast(t('tReq')); }
  else { erState.type = 'all'; erState.hall = d.hall; localStorage.setItem(LS_HALL, d.hall); go('errands'); toast(t('tErr')); }
  renderAll();
}

/* ---------- login (email + password, no emails sent) ---------- */
let loginTab = 'login';
function setLoginTab(tab) {
  loginTab = tab;
  $$('#loginModal [data-tab]').forEach(b => { b.classList.toggle('active', b.dataset.tab === tab); b.setAttribute('aria-selected', b.dataset.tab === tab); });
  $('#loginForm').classList.toggle('is-signup', tab === 'signup');
  $('#loginPw2').required = tab === 'signup'; $('#loginPw2Wrap').hidden = tab !== 'signup'; $('#signupNote').hidden = tab !== 'signup';
  $('#loginPw').autocomplete = tab === 'signup' ? 'new-password' : 'current-password';
  const sub = $('#loginSubmit'); sub.dataset.i18n = tab === 'signup' ? 'doSignup' : 'doLogin'; sub.textContent = t(sub.dataset.i18n);
  $('#forgotBox').hidden = true; $('#loginErr').hidden = true;
}
function openLogin(tab = 'login') {
  $$('.modal').forEach(m => { if (m.id !== 'loginModal') m.hidden = true; });
  $('#loginForm').reset(); $$('#loginModal [data-pwtoggle]').forEach(b => { $('#' + b.dataset.pwtoggle).type = 'password'; b.setAttribute('aria-pressed', 'false'); b.textContent = t('showPw'); }); setLoginTab(tab);
  $('#loginModal').hidden = false; document.body.style.overflow = 'hidden';
  setTimeout(() => $('#loginEmail').focus(), 50);
}
function loginError(msg) { const el = $('#loginErr'); el.textContent = msg; el.hidden = false; }
$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault(); const btn = $('#loginSubmit');
  const email = $('#loginEmail').value.trim().toLowerCase(), pw = $('#loginPw').value;
  $('#loginErr').hidden = true;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return loginError(t('tBadEmail'));
  if (pw.length < 8) return loginError(t('tWeakPw'));
  if (loginTab === 'signup' && pw !== $('#loginPw2').value) return loginError(t('tPwMismatch'));
  btn.disabled = true;
  try { loginTab === 'signup' ? await Auth.signUp(email, pw) : await Auth.signIn(email, pw); }
  catch (err) { btn.disabled = false; return loginError(errMsg(err)); }
  btn.disabled = false; await afterAuth(loginTab === 'signup' ? 'signup' : true);
});
async function afterAuth(fromForm) {
  closeModal($('#loginModal')); renderHeader(); chatSubscribe(); loadConvs().catch(() => {});
  await refresh().catch(() => {}); renderAll(); await loadMe().catch(() => {});
  if (fromForm) toast(t(fromForm === 'signup' ? 'tSignedUp' : 'tLoggedIn'));
  const next = pendingAfterLogin; pendingAfterLogin = null; if (next) next();
}

/* ---------- helpers ---------- */
function renderAll() { renderCats(); renderGrid(); renderDg(); renderErrands(); renderMe(); renderAdmin(); if (!$('#view-chat').hidden) { renderConvList(); renderThread(); } }
function show(sel) { $$('.modal').forEach(m => m.hidden = true); $(sel).hidden = false; document.body.style.overflow = 'hidden'; }
function closeModal(m) { if (!m) return; m.hidden = true; if (m.id === 'docModal') curDoc = null; if ($$('.modal').every(x => x.hidden)) document.body.style.overflow = ''; }
function hideAll() { $$('.modal').forEach(m => m.hidden = true); document.body.style.overflow = ''; }
let tt; function toast(msg) { const el = $('#toast'); el.textContent = msg; el.hidden = false; clearTimeout(tt); tt = setTimeout(() => el.hidden = true, 2600); }
function go(view) {
  if (view === 'me' && !loggedIn()) { pendingAfterLogin = () => go('me'); return openLogin(); }
  if (view === 'admin' && !Auth.isAdmin) view = 'market';
  if (view === 'chat' && !loggedIn()) { pendingAfterLogin = () => go('chat'); return openLogin(); }
  $$('.view').forEach(v => v.hidden = v.id !== 'view-' + view);
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.nav === view));
  $('#meBtn').classList.toggle('active', view === 'me'); $('#adminBtn').classList.toggle('active', view === 'admin'); $('#msgBtn').classList.toggle('active', view === 'chat'); document.body.classList.toggle('in-chat', view === 'chat');
  const fl = $('#openPost [data-i18n]'); fl.dataset.i18n = { market: 'post', daigou: 'fabReq', errands: 'fabErr', me: 'post', admin: 'post', chat: 'post' }[view]; fl.textContent = t(fl.dataset.i18n);
  history.replaceState(null, '', view === 'market' ? location.pathname : '#' + view); window.scrollTo(0, 0);
  if (view === 'me') loadMe().catch(e => toast(errMsg(e)));
  else if (view === 'admin') loadAdmin().catch(e => toast(errMsg(e)));
  else if (view === 'chat') { renderConvList(); renderThread(); loadConvs().catch(e => toast(errMsg(e))); }
  if (view !== 'chat') chat.open = null;
  else if (window.__pmReload) window.__pmReload();
}
const errMsg = e => {
  const m = (e?.message || '') + ' ' + (e?.code || '');
  if (/over_request_rate|rate limit|too many/i.test(m)) return t('tRate');
  if (/invalid login credentials|invalid_credentials/i.test(m)) return t('tWrongPw');
  if (/already registered|user_already_exists|email_exists/i.test(m)) return t('tEmailTaken');
  if (/same_password|should be different/i.test(m)) return t('tSamePw');
  if (/weak_password|password should|password is known|at least 8/i.test(m)) return t('tWeakPw');
  if (/email_address_invalid|invalid format|validate email|is invalid/i.test(m)) return t('tBadEmail');
  if (/pw_mismatch/.test(m)) return t('tPwMismatch');
  if (/\bbanned\b/.test(m)) { Auth.banned = true; return t('tBanned', { mail: SITE_CONFIG.contactEmail }); }
  if (/cannot_ban_admin/.test(m)) return t('aCantBanAdmin');
  if (/own_post/.test(m)) return t('tOwnPost');
  if (/post_unavailable/.test(m)) return t('tPostGone');
  if (/not_admin/.test(m)) return t('tNotAllowed');
  if (/rate_limited/.test(m)) return t('tRate');
  if (/bad_transition/.test(m)) return t('tBadTransition');
  if (/login_required|JWT/i.test(m)) return t('tLogin');
  if (/not_allowed|row-level security|42501|permission denied/i.test(m)) return t('tNotAllowed');
  if (/too_large|exceeded the maximum/i.test(m)) return t('tTooLarge');
  if (/Failed to fetch|NetworkError|offline/i.test(m)) return t('tOffline');
  return t('tError');
};
async function guard(fn) { try { await fn(); } catch (e) { console.warn(e); toast(errMsg(e)); } }
let pendingTake = null;

/* ---------- 訊息 / chat ---------- */
const chat = { convs: [], open: null, msgs: [], urls: {}, channel: null, rtOk: false, pending: null, loading: false };
const hhmm = ts => { const d = new Date(ts); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const dayLabel = ts => { const d = ymd(ts); return d === ymd(Date.now()) ? t('chatToday') : d; };
function unreadCount() { return chat.convs.filter(c => c.unread).length; }
function renderMsgBadge() {
  const b = $('#msgBtn'); if (!b) return;
  b.hidden = !loggedIn();
  const n = unreadCount(); const badge = b.querySelector('.badge');
  badge.textContent = n > 9 ? '9+' : n; badge.hidden = !n;
}
async function loadConvs() { if (!loggedIn()) { chat.convs = []; return renderMsgBadge(); } chat.convs = await Api.chatList(); renderMsgBadge(); if (!$('#view-chat').hidden) renderConvList(); }
function convThumb(c) { return c.post_thumb ? `<img src="${imgUrl(c.post_thumb)}" alt="" loading="lazy">` : `<span>${c.post_kind === 'listings' ? '🏷' : c.post_kind === 'daigou' ? '✈' : '⇪'}</span>`; }
function renderConvList() {
  const box = $('#convList'); if (!box) return;
  box.innerHTML = `<h2 class="chat-h">${t('chatTitle')}</h2>` + (chat.convs.length ? chat.convs.map(c => {
    const last = c.last_message_at ? `${c.last_sender === Auth.uid ? t('chatYou') : ''}${c.last_message === '[image]' ? t('chatImgMsg') : esc(c.last_message)}` : '';
    return `<button class="conv ${c.id === chat.open ? 'active' : ''} ${c.unread ? 'unread' : ''}" data-conv="${c.id}">
      <span class="conv-thumb">${convThumb(c)}</span>
      <span class="conv-main"><span class="conv-top"><b>${esc(c.peer?.display_name || t('student'))}</b><span class="muted">${c.last_message_at ? ago(Date.parse(c.last_message_at)) : ''}</span></span>
        <span class="conv-post">${t('kind_' + c.post_kind)} · ${esc(c.post_title)}</span>
        <span class="conv-last">${last}</span></span>${c.unread ? '<span class="dot"></span>' : ''}</button>`;
  }).join('') : `<p class="muted chat-empty">${t('chatEmpty')}</p>`);
}
function msgHtml(m, c) {
  const mine = m.sender_id === Auth.uid;
  const img = m.image ? (chat.urls[m.image] ? `<a href="${chat.urls[m.image]}" target="_blank" rel="noopener"><img src="${chat.urls[m.image]}" alt="${t('chatImg')}" loading="lazy"></a>` : `<span class="img-wait">${t('chatImgMsg')}</span>`) : '';
  return `<div class="msg ${mine ? 'mine' : ''}" data-mid="${m.id}"><div class="bubble">${img}${m.body ? `<span class="txt">${esc(m.body)}</span>` : ''}</div><span class="msg-time">${hhmm(Date.parse(m.created_at))}</span></div>`;
}
function renderThread() {
  const pane = $('#chatPane'); if (!pane) return;
  const c = chat.convs.find(x => x.id === chat.open);
  $('#chatShell').classList.toggle('has-open', !!c);
  if (!c) { pane.innerHTML = `<div class="chat-pick muted">${t('chatPick')}</div>`; return; }
  let html = '', lastDay = '';
  chat.msgs.forEach(m => { const d = dayLabel(Date.parse(m.created_at)); if (d !== lastDay) { html += `<div class="day-sep"><span>${d}</span></div>`; lastDay = d; } html += msgHtml(m, c); });
  const myLast = [...chat.msgs].reverse().find(m => m.sender_id === Auth.uid);
  if (myLast && c.peerReadAt >= Date.parse(myLast.created_at)) html += `<div class="read-receipt">${t('chatRead')} ✓</div>`;
  const keep = $('#chatInput')?.value || '';
  pane.innerHTML = `<div class="chat-head">
      <button class="link-btn chat-back" data-chatback>‹ ${t('chatBack')}</button>
      <div class="chat-peer"><b>${esc(c.peer?.display_name || t('student'))}</b></div>
      <button class="link-btn" data-chatreport="${c.id}">⚑ ${t('chatReport')}</button></div>
    <button class="chat-post" data-chatpost="${c.post_kind}:${c.post_id}"><span class="conv-thumb">${convThumb(c)}</span><span><span class="muted">${t('kind_' + c.post_kind)}</span><b>${esc(c.post_title)}</b></span></button>
    <div class="chat-msgs" id="chatMsgs">${html}</div>
    <form class="chat-form" id="chatForm">
      <label class="chat-img-btn" title="${t('chatImg')}">📷<input type="file" id="chatFile" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*" hidden></label>
      <div class="chat-input-wrap">${chat.pending ? `<div class="chat-preview"><img src="${chat.pending.url}" alt=""><button type="button" class="pf-rm" data-chatunpend>×</button></div>` : ''}
        <textarea id="chatInput" rows="1" maxlength="1000" placeholder="${t('chatPh')}"></textarea></div>
      <button class="btn btn-primary" id="chatSendBtn" type="submit">${t('chatSend')}</button></form>`;
  $('#chatInput').value = keep;
  const box = $('#chatMsgs'); box.scrollTop = box.scrollHeight;
  box.querySelectorAll('img').forEach(i => i.addEventListener('load', () => { box.scrollTop = box.scrollHeight; }, { once: true }));
}
async function signImages(msgs) {
  const need = msgs.filter(m => m.image && !chat.urls[m.image]).map(m => m.image);
  if (need.length) Object.assign(chat.urls, await Api.chatSigned(need));
}
async function openConv(id) {
  chat.open = id; chat.msgs = []; renderConvList(); renderThread();
  const msgs = await Api.chatMessages(id); await signImages(msgs);
  if (chat.open !== id) return;
  chat.msgs = msgs; renderThread(); markRead(id);
}
let readTimer = null;
function markRead(id) {
  clearTimeout(readTimer);
  readTimer = setTimeout(async () => {
    if (document.hidden || chat.open !== id || $('#view-chat').hidden) return;
    const c = chat.convs.find(x => x.id === id); if (c && c.unread) { c.unread = false; renderMsgBadge(); renderConvList(); }
    await Api.chatRead(id).catch(() => {});
  }, 300);
}
async function pullNew() {  // polling fallback + catch-up
  if (!chat.open) return;
  const after = chat.msgs.length ? chat.msgs[chat.msgs.length - 1].id : 0;
  const fresh = await Api.chatMessages(chat.open, after); if (!fresh.length) return;
  await signImages(fresh); fresh.forEach(m => { if (!chat.msgs.some(x => x.id === m.id)) chat.msgs.push(m); });
  renderThread(); markRead(chat.open);
}
async function onRealtimeMessage(m) {
  if (m.conversation_id === chat.open && !$('#view-chat').hidden) {
    if (!chat.msgs.some(x => x.id === m.id)) { await signImages([m]); chat.msgs.push(m); chat.msgs.sort((a, b) => a.id - b.id); renderThread(); }
    markRead(m.conversation_id);
  }
  loadConvs().catch(() => {});
}
function chatSubscribe() {
  chatUnsubscribe(); if (!loggedIn()) return;
  chat.channel = sb.channel('pm-chat-' + Auth.uid)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, p => onRealtimeMessage(p.new))
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, p => {
      const c = chat.convs.find(x => x.id === p.new.id);
      if (c) { const before = c.peerReadAt; loadConvs().then(() => { const n = chat.convs.find(x => x.id === p.new.id); if (n && n.peerReadAt !== before && chat.open === n.id) renderThread(); }).catch(() => {}); }
      else loadConvs().catch(() => {});
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, () => loadConvs().catch(() => {}))
    .subscribe(st => { chat.rtOk = st === 'SUBSCRIBED'; document.documentElement.dataset.rt = st; });
}
function chatUnsubscribe() { if (chat.channel) { sb.removeChannel(chat.channel); chat.channel = null; chat.rtOk = false; } }
async function startChat(k, id) {
  if (needLogin(() => startChat(k, id))) return;
  if (bannedStop()) return;
  const x = findPost(k, id); if (x?.mine) return toast(t('tOwnPost'));
  const conv = await Api.chatOpen(COL[k], id);
  hideAll(); go('chat'); await loadConvs(); await openConv(conv);
  setTimeout(() => $('#chatInput')?.focus(), 50);
}
async function sendChat() {
  const input = $('#chatInput'), body = input.value.trim(), pend = chat.pending, id = chat.open;
  if (!id || (!body && !pend) || chat.loading) return;
  if (body.length > 1000) return toast(t('tChatTooLong'));
  chat.loading = true; $('#chatSendBtn').disabled = true;
  try {
    const m = await Api.chatSend(id, body, pend?.blob);
    input.value = ''; if (pend) { URL.revokeObjectURL(pend.url); chat.pending = null; }
    await signImages([m]); if (!chat.msgs.some(x => x.id === m.id)) chat.msgs.push(m);
    renderThread(); loadConvs().catch(() => {});
  } catch (e) { toast(errMsg(e)); }
  chat.loading = false; const b = $('#chatSendBtn'); if (b) b.disabled = false; $('#chatInput')?.focus();
}
function openChatPost(kind, id) {
  const k = KEY[kind], x = findPost(k, id);
  if (kind === 'listings' && x) return openDetail(id);
  if (!x) return toast(t('tPostGone'));
  go(kind === 'daigou' ? 'daigou' : 'errands');
  setTimeout(() => { const el = document.querySelector(`[data-report="${k}:${id}"]`)?.closest('.req'); if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1600); } }, 300);
}
async function openAdminChat(conv) {
  const msgs = await Api.adminChat(conv);
  const urls = msgs.some(m => m.image) ? await Api.chatSigned(msgs.filter(m => m.image).map(m => m.image)) : {};
  const senders = [...new Map(msgs.map(m => [m.sender_id, m.sender_name])).entries()];
  $('#detailBody').innerHTML = `<h3 class="d-title">🛡 ${t('aChatTitle')}</h3>
    <div class="adm-chat">${msgs.map(m => `<div class="adm-msg"><span class="muted">${ymd(Date.parse(m.created_at))} ${hhmm(Date.parse(m.created_at))}</span> <b>${esc(m.sender_name || '?')}</b>：${esc(m.body)}${m.image && urls[m.image] ? `<br><img src="${urls[m.image]}" alt="">` : ''}</div>`).join('') || '—'}</div>
    <div class="admin-bar"><span>🛡 ${t('aAdminBar')}</span>${senders.map(([uid, name]) => `<button class="link-btn danger" data-aban="${uid}:1:${esc(name || '')}">${t('aBanUser', { name: esc(name || uid.slice(0, 8)) })}</button>`).join('')}</div>`;
  show('#detailModal');
}

/* ---------- 管理 / admin panel (UI only; the database enforces admin rights) ---------- */
const adminState = { tab: 'open', data: null };
async function loadAdmin() { if (!Auth.isAdmin) return; adminState.data = await Api.adminData(); renderAdmin(); }
function postLabel(x) { return x ? postTitle(x) : ''; }
function renderAdmin() {
  const box = $('#adminBody'); if (!box) return;
  if (!Auth.isAdmin) { box.innerHTML = ''; return; }
  const D = adminState.data; if (!D) { box.innerHTML = `<p class="muted">…</p>`; return; }
  const banned = new Set(D.bans.map(b => b.user_id));
  const open = D.reports.filter(r => !r.handled_at), done = D.reports.filter(r => r.handled_at);
  const tabs = [['open', t('aOpen'), open.length], ['handled', t('aHandled'), done.length], ['bans', t('aBans'), D.bans.length], ['log', t('aLog'), D.log.length]];
  let body = '';
  if (adminState.tab === 'open' || adminState.tab === 'handled') {
    const list = adminState.tab === 'open' ? open : done;
    body = list.length ? list.map(r => {
      const x = D.posts[r.target_id], k = KEY[r.target_kind], isChat = r.target_kind === 'chat';
      const poster = x ? `${esc(x.owner?.display_name || t('student'))}${banned.has(x.userId) ? ` <span class="pill st-cancelled">${t('aBannedTag')}</span>` : ''}` : '—';
      return `<div class="adm-row">
        <div class="me-top"><span class="tag">${t('kind_' + r.target_kind)}</span><span class="pill st-taken">${t('rr_' + r.reason)}</span>
          ${isChat ? '' : x ? `<span class="pill st-${x.status}">${t('st_' + x.status)}</span>${x.hidden ? `<span class="pill st-hidden">${t('aHiddenTag')}</span>` : ''}` : `<span class="pill st-removed">${t('aPostGone')}</span>`}
          <span class="muted">${ago(Date.parse(r.created_at))}</span></div>
        <div class="me-title">${esc(x ? postLabel(x) : r.target_title || '')}</div>
        ${r.note ? `<div class="me-sub">${t('aNote')}：${esc(r.note)}</div>` : ''}
        <div class="me-sub">${isChat ? '' : `${t('aPoster')}：<b>${poster}</b> · `}${t('aReporter')}：${r.reporter_id ? esc(r.reporter_id.slice(0, 8)) : t('aAnon')}</div>
        <div class="me-actions">
          ${isChat ? `<button class="btn btn-ghost btn-sm" data-achat="${r.target_id}">💬 ${t('aViewChat')}</button>` : ''}
          ${x ? `<button class="btn btn-ghost btn-sm" data-aview="${k}:${x.id}">${t('aView')}</button>
          <button class="btn btn-ghost btn-sm" data-ahide="${k}:${x.id}:${x.hidden ? 0 : 1}">${t(x.hidden ? 'aUnhide' : 'aHide')}</button>
          <button class="btn btn-ghost btn-sm danger" data-adel="${k}:${x.id}">${t('aDelete')}</button>
          ${banned.has(x.userId) ? `<button class="btn btn-ghost btn-sm" data-aban="${x.userId}:0:">${t('aUnban')}</button>` : (x.mine ? '' : `<button class="btn btn-ghost btn-sm danger" data-aban="${x.userId}:1:${esc(x.owner?.display_name || '')}">${t('aBan')}</button>`)}` : ''}
          <button class="btn btn-primary btn-sm" data-arep="${r.id}:${r.handled_at ? 0 : 1}">${t(r.handled_at ? 'aReopen' : 'aMarkHandled')}</button>
        </div></div>`;
    }).join('') : `<p class="muted me-empty">${t('aNoReports')}</p>`;
  } else if (adminState.tab === 'bans') {
    body = D.bans.length ? D.bans.map(b => `<div class="adm-row"><div class="me-title">${esc(b.user?.display_name || b.user_id.slice(0, 8))}</div>
      <div class="me-sub">${t('aBannedAt')} ${ago(Date.parse(b.created_at))}${b.reason ? ` · ${t('aReason')}：${esc(b.reason)}` : ''}</div>
      <div class="me-actions"><button class="btn btn-ghost btn-sm" data-aban="${b.user_id}:0:">${t('aUnban')}</button></div></div>`).join('') : `<p class="muted me-empty">${t('aNoBans')}</p>`;
  } else {
    body = D.log.length ? `<div class="adm-log">${D.log.map(l => `<div><span class="muted">${ago(Date.parse(l.created_at))}</span>
      <b>${esc(D.names[l.admin_id] || (l.admin_id || '').slice(0, 8))}</b> · ${t('act_' + l.action)}${l.target_kind && l.target_kind !== 'reports' ? ` · ${t('kind_' + l.target_kind)}` : ''}
      ${l.target_user ? ` · ${esc(D.names[l.target_user] || l.target_user.slice(0, 8))}` : ''}${l.note ? ` · <span class="muted">${esc(l.note)}</span>` : ''}</div>`).join('')}</div>` : `<p class="muted me-empty">${t('aNoLog')}</p>`;
  }
  box.innerHTML = `<p class="muted adm-note">🛡 ${t('aAdminNote')}</p>
    <div class="cats adm-tabs">${tabs.map(([k, l, n]) => `<button class="chip ${adminState.tab === k ? 'active' : ''}" data-atab="${k}">${l} <span class="count">${n}</span></button>`).join('')}</div>
    <div class="me-list">${body}</div>`;
}
function openAdminDetail(x) {
  const k = KEY[x.kind];
  const rows = x.kind === 'listings' ? [[t('seller'), esc(who(x))], ['HK$', x.price], [t('spot'), t('spot_' + x.spot)]]
    : x.kind === 'daigou' ? [[t('aPoster'), esc(who(x))], [t('from'), t('reg_' + x.from)], [t('budget'), 'HK$' + x.budget], [t('deadline'), esc(x.deadline)]]
    : [[t('aPoster'), esc(who(x))], [t('pickup'), esc(x.pickup)], [t('dropoff'), t('hall_' + x.hall)], [t('window'), `${esc(x.date)} ${esc(x.from)}–${esc(x.to)}`]];
  $('#detailBody').innerHTML = `${gallery(x)}
    <h3 class="d-title">${esc(postTitle(x))}</h3>
    <div class="d-row"><span class="tag">${t('kind_' + x.kind)}</span><span class="tag st-${x.status}">${t('st_' + x.status)}</span>${x.hidden ? `<span class="tag st-hidden">${t('aHiddenTag')}</span>` : ''}</div>
    <p class="d-desc">${esc(x.desc || x.note || '')}</p>
    <div class="d-box">${rows.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('')}<div><span>${esc(x.ctype)}</span><b>${esc(x.contact)}</b></div><div><span>${t('posted')}</span><b>${ago(x.t)}</b></div></div>
    ${adminBar(x)}`;
  show('#detailModal');
}
async function adminAfter(msg) {
  await Promise.all([refresh('listings', 'daigou', 'errands').catch(() => {}), loadAdmin().catch(() => {})]);
  renderAll(); toast(msg);
}

/* ---------- events ---------- */
document.addEventListener('click', async e => {
  if (e.target.classList.contains('modal')) return closeModal(e.target);
  const el = e.target.closest('[data-cat],[data-dg],[data-nav],[data-close],[data-copy],[data-take],[data-lang],[data-action],[data-doc],[data-report],[data-del],[data-ertype],[data-hall],[data-st],[data-edit],[data-release],[data-gimg],[data-tab],[data-pwtoggle],[data-atab],[data-aview],[data-ahide],[data-adel],[data-aban],[data-arep],[data-chat],[data-conv],[data-chatback],[data-chatreport],[data-chatpost],[data-chatunpend],[data-achat],.card');
  if (!el) return;
  const d = el.dataset;
  if (d.lang) setLang(d.lang);
  else if (d.cat) { state.cat = d.cat; renderCats(); renderGrid(); }
  else if (d.dg) { state.dg = d.dg; renderDg(); }
  else if (d.ertype) { erState.type = d.ertype; renderErrands(); }
  else if (d.hall) setHall(d.hall);
  else if (d.nav) { e.preventDefault(); hideAll(); go(d.nav); }
  else if (el.hasAttribute('data-close')) closeModal(el.closest('.modal'));
  else if (d.doc) { e.preventDefault(); openDoc(d.doc); }
  else if (d.report) { const [k, id] = d.report.split(':'); openReport(k, id); }
  else if (d.gimg) { $('#gMain').src = d.gimg; $$('.g-th').forEach(b => b.classList.toggle('active', b === el)); }
  else if (d.st) {
    const [k, id, s] = d.st.split(':');
    guard(async () => { await Api.setStatus(COL[k], id, s); await refresh(COL[k], 'mine'); renderAll(); await loadMe(); toast(t('tStatus')); });
  }
  else if (d.edit) { const [k, id] = d.edit.split(':'); const x = findPost(k, id); if (x) openForm(COL[k], x); }
  else if (d.release) {
    const [k, id] = d.release.split(':'); if (!confirm(t('releaseConfirm'))) return;
    guard(async () => { await Api.release(COL[k], id); await refresh(COL[k], 'mine'); renderAll(); toast(t('tReleased')); });
  }
  else if (d.del) {
    const [k, id] = d.del.split(':');
    if (!confirm(t('delConfirm'))) return;
    guard(async () => { await Api.remove(COL[k], id); await refresh(COL[k], 'mine'); hideAll(); renderAll(); toast(t('tDeleted')); });
  }
  else if (d.copy) { navigator.clipboard?.writeText(d.copy).catch(() => {}); toast(t('tCopied') + d.copy); }
  else if (d.action === 'login') openLogin();
  else if (d.action === 'logout') guard(async () => { chatUnsubscribe(); chat.convs = []; chat.open = null; await Auth.signOut(); my = { posts: [], taken: [] }; go('market'); await refresh(); renderHeader(); renderAll(); toast(t('tLoggedOut')); });
  else if (d.action === 'delacc') {
    if (!confirm(t('delAccConfirm'))) return;
    guard(async () => { chatUnsubscribe(); await Auth.deleteAccount(); chat.convs = []; chat.open = null; my = { posts: [], taken: [] }; go('market'); await refresh(); renderHeader(); renderAll(); toast(t('tAccDeleted')); });
  }
  else if (d.tab) setLoginTab(d.tab);
  else if (d.atab) { adminState.tab = d.atab; renderAdmin(); }
  else if (d.chat) { const [k, id] = d.chat.split(':'); guard(() => startChat(k, id)); }
  else if (d.conv) guard(() => openConv(d.conv));
  else if (el.hasAttribute('data-chatback')) { chat.open = null; renderConvList(); renderThread(); }
  else if (d.chatpost) { const [kind, id] = d.chatpost.split(':'); openChatPost(kind, id); }
  else if (el.hasAttribute('data-chatunpend')) { URL.revokeObjectURL(chat.pending.url); chat.pending = null; renderThread(); }
  else if (d.chatreport) {
    const c = chat.convs.find(x => x.id === d.chatreport); if (!c) return;
    reportTarget = { kind: 'c', id: c.id, title: c.post_title };
    $('#reportReason').innerHTML = REPORT_REASONS.map(r => `<option value="${r}">${t('rr_' + r)}</option>`).join('');
    $('#reportTarget').textContent = t('chatReportTitle') + ' — ' + t('chatReportNote');
    show('#reportModal');
  }
  else if (d.achat) guard(() => openAdminChat(d.achat));
  else if (d.aview) { const [k, id] = d.aview.split(':'); guard(async () => { const x = await Api.adminGet(COL[k], id); x ? openAdminDetail(x) : toast(t('aPostGone')); }); }
  else if (d.ahide) { const [k, id, h] = d.ahide.split(':'); guard(async () => { await Api.adminHide(COL[k], id, h === '1'); hideAll(); await adminAfter(t(h === '1' ? 'tHidden' : 'tUnhidden')); }); }
  else if (d.adel) { const [k, id] = d.adel.split(':'); if (!confirm(t('aDelConfirm'))) return; guard(async () => { await Api.adminDelete(COL[k], id); hideAll(); await adminAfter(t('tAdminDeleted')); }); }
  else if (d.aban) {
    const [uid, b, ...rest] = d.aban.split(':'); const name = rest.join(':') || uid.slice(0, 8);
    if (b === '1' && !confirm(t('aBanConfirm', { name }))) return;
    guard(async () => { await Api.adminBan(uid, b === '1'); hideAll(); await adminAfter(t(b === '1' ? 'tBannedOk' : 'tUnbannedOk')); });
  }
  else if (d.arep) { const [id, h] = d.arep.split(':'); guard(async () => { await Api.adminReport(id, h === '1'); await adminAfter(t('tHandled')); }); }
  else if (d.action === 'forgot') { $('#forgotBox').innerHTML = t('forgotText', { mail: `<a href="mailto:${SITE_CONFIG.contactEmail}">${SITE_CONFIG.contactEmail}</a>` }); $('#forgotBox').hidden = !$('#forgotBox').hidden; }
  else if (d.pwtoggle !== undefined) { const inp = $('#' + d.pwtoggle), show = inp.type === 'password'; inp.type = show ? 'text' : 'password'; el.setAttribute('aria-pressed', show); el.textContent = t(show ? 'hidePw' : 'showPw'); }
  else if (d.action) openForm({ post: 'listings', req: 'daigou', err: 'errands' }[d.action]);
  else if (d.take) {
    const [k, id] = d.take.split(':'); const x = findPost(k, id); if (!x) return;
    if (needLogin(() => document.querySelector(`[data-take="${d.take}"]`)?.click())) return;
    if (bannedStop()) return;
    pendingTake = { kind: k, id };
    $('#takeText').textContent = (k === 'r' ? t('takeText', { item: x.item }) : t('erTakeText')) + ' ' + t('takeIntro');
    const last = localStorage.getItem(LS_TAKER); if (last) try { const o = JSON.parse(last); $('#takeForm [name=ctype]').value = o.ctype; $('#takeForm [name=contact]').value = o.contact; } catch (err) {}
    show('#takeModal');
  }
  else if (el.classList.contains('card')) openDetail(d.id);
});
document.addEventListener('submit', e => { if (e.target.id === 'chatForm') { e.preventDefault(); sendChat(); } });
document.addEventListener('keydown', e => { if (e.target.id === 'chatInput' && e.key === 'Enter' && !e.shiftKey && !e.isComposing && matchMedia('(min-width: 720px)').matches) { e.preventDefault(); sendChat(); } });
document.addEventListener('change', async e => {
  if (e.target.id !== 'chatFile') return; const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  if (!/^image\//.test(f.type)) return toast(t('tNotImage'));
  try { const blob = await compressImage(f); if (chat.pending) URL.revokeObjectURL(chat.pending.url); chat.pending = { blob, url: URL.createObjectURL(blob) }; renderThread(); }
  catch (err) { toast(t(err.message === 'too_large' ? 'tTooLarge' : 'tNotImage')); }
});
document.addEventListener('visibilitychange', () => { if (!document.hidden && chat.open) { pullNew().catch(() => {}); markRead(chat.open); } });
$('#takeForm').addEventListener('submit', async e => {
  e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)), pt = pendingTake || {};
  localStorage.setItem(LS_TAKER, JSON.stringify({ ctype: f.ctype, contact: f.contact.trim() }));
  try { await Api.take(COL[pt.kind], pt.id, f.ctype, (f.contact || '').trim()); } catch (err) { await refresh(COL[pt.kind]).catch(() => {}); renderAll(); return toast(errMsg(err)); }
  hideAll(); await refresh(COL[pt.kind], 'mine').catch(() => {}); renderAll(); toast(t('tTaken'));
});
$('#reportForm').addEventListener('submit', async e => {
  e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
  try { reportTarget.kind === 'c' ? await Api.chatReport(reportTarget.id, f.reason, f.note) : await Api.report({ target_kind: COL[reportTarget.kind], target_id: reportTarget.id, target_title: reportTarget.title, reason: f.reason, note: f.note }); } catch (err) { return toast(errMsg(err)); }
  const wasChat = reportTarget.kind === 'c'; e.target.reset(); closeModal($('#reportModal')); toast(t(wasChat ? 'tChatReported' : 'tReported'));
});
document.addEventListener('submit', async e => {
  if (e.target.id !== 'pwForm') return; e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  if (f.pw.length < 8) return toast(t('tWeakPw'));
  if (f.pw !== f.pw2) return toast(t('tPwMismatch'));
  guard(async () => { await Auth.changePassword(f.pw); e.target.reset(); toast(t('tPwChanged')); });
});
document.addEventListener('submit', async e => {
  if (e.target.id !== 'nameForm') return; e.preventDefault();
  const name = new FormData(e.target).get('name').trim(); if (!name) return;
  guard(async () => { await Auth.setName(name); renderHeader(); renderMe(); await refresh().catch(() => {}); renderAll(); toast(t('tSaved')); });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const top = ['#docModal', '#reportModal'].map(x => $(x)).find(m => !m.hidden); top ? closeModal(top) : hideAll(); } if (e.key === 'Enter' && e.target.classList?.contains('card')) openDetail(e.target.dataset.id); });
$('#searchForm').addEventListener('submit', e => { e.preventDefault(); state.q = $('#q').value; renderGrid(); $('#cats').scrollIntoView({ behavior: 'smooth' }); });
$('#q').addEventListener('input', e => { state.q = e.target.value; renderGrid(); });
$('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
$('#meBtn').onclick = () => go('me');
$('#msgBtn').onclick = () => go('chat');
$('#openPost').onclick = () => openForm(!$('#view-daigou').hidden ? 'daigou' : !$('#view-errands').hidden ? 'errands' : 'listings');
$('#openErr').onclick = () => openForm('errands');
$('#openReq').onclick = () => openForm('daigou');
photoField($('#postForm'), 'listings'); photoField($('#reqForm'), 'daigou'); photoField($('#errForm'), 'errands');
$('#postForm').addEventListener('submit', e => submitForm('listings', e));
$('#reqForm').addEventListener('submit', e => submitForm('daigou', e));
$('#errForm').addEventListener('submit', e => submitForm('errands', e));

(async () => {
  applyLang();
  try { await Auth.init(evt => { renderHeader(); if (evt === 'SIGNED_IN') afterAuth(false); else if (evt === 'SIGNED_OUT') { my = { posts: [], taken: [] }; refresh().then(renderAll).catch(() => {}); } }); online = true; }
  catch (e) { online = false; }
  document.documentElement.dataset.store = online ? 'remote' : 'offline';
  renderHeader();
  try { await refresh(); } catch (e) { online = false; }
  renderAll();
  if (!online) toast(t('tOffline'));
  let busy = false;
  const live = async () => { if (busy || document.hidden || !online) return; busy = true; try { await refresh('listings', 'daigou', 'errands'); renderAll(); } catch (e) {} busy = false; };
  document.addEventListener('visibilitychange', live);
  setInterval(live, 60000);
  window.__pmReload = live;
  if (loggedIn()) { chatSubscribe(); loadConvs().catch(() => {}); }
  // fallback polling when Realtime isn't connected (and a slow safety net when it is)
  setInterval(() => { if (loggedIn() && !document.hidden && !chat.rtOk) { pullNew().catch(() => {}); loadConvs().catch(() => {}); } }, 4000);
  setInterval(() => { if (loggedIn() && !document.hidden) { loadConvs().catch(() => {}); if (chat.open) pullNew().catch(() => {}); } }, 60000);
  const fromHash = () => { const h = location.hash.slice(1); if (['market', 'daigou', 'errands', 'me', 'admin', 'chat'].includes(h)) go(h); else if (!h) go('market'); };
  if (location.hash) fromHash();
  window.addEventListener('hashchange', fromHash);
})();
