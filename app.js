/* 理大二手網 · PolyU Marketplace — static prototype (data stored in this browser via localStorage) */

/* ===== Site config — edit these placeholders before going live ===== */
const SITE_CONFIG = {
  contactEmail: '2819465493@qq.com',      // general / privacy enquiries, e.g. 'hello@example.com'
  complaintsEmail: '2819465493@qq.com',   // reports, complaints & infringement notices, e.g. 'report@example.com'
};
/* ==================================================================== */

/* ===== Data layer =====
 * All persistence goes through Store. UI code never touches localStorage for data.
 * To move to Supabase later, re-implement these four async methods, e.g.
 *   list:   (c) => supabase.from(c).select('*').order('t', { ascending: false }).then(r => r.data)
 *   create: (c, d) => supabase.from(c).insert(d).select().single().then(r => r.data)
 *   update: (c, id, p) => supabase.from(c).update(p).eq('id', id).select().single().then(r => r.data)
 *   remove: (c, id) => supabase.from(c).delete().eq('id', id).then(() => true)
 * Collections: listings, daigou, errands, reports.
 */
const STORE_VER = 'v2';
const Store = (() => {
  const KEYS = { listings: 'pm_listings_', daigou: 'pm_requests_', errands: 'pm_errands_', reports: 'pm_reports_' };
  ['pm_listings_v1', 'pm_requests_v1'].forEach(k => localStorage.removeItem(k)); // drop old seeded demo data
  const key = c => { if (!KEYS[c]) throw new Error('Unknown collection: ' + c); return KEYS[c] + STORE_VER; };
  const read = c => { try { const v = JSON.parse(localStorage.getItem(key(c))); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
  const write = (c, arr) => localStorage.setItem(key(c), JSON.stringify(arr));
  const uid = c => c[0] + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  return {
    async list(c) { return read(c).sort((a, b) => b.t - a.t); },
    async create(c, data) { const item = { ...data, id: uid(c), t: Date.now() }; write(c, [item, ...read(c)]); return item; },
    async update(c, id, patch) { let out = null; write(c, read(c).map(x => x.id === id ? (out = { ...x, ...patch, id }) : x)); return out; },
    async remove(c, id) { write(c, read(c).filter(x => x.id !== id)); return true; },
  };
})();
/* ====================== */
const LS_LANG = 'pm_lang', LS_HALL = 'pm_hall';

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
    fDesc: '描述', fDescPh: '購買時間、有冇筆記、配件齊唔齊……', fCtype: '聯絡方式', fContact: '帳號 / 電話', fContactPh: '例如 @polyu_boa', fSpot: '交收地點', submitPost: '確認放售',
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
    foot1: '本網站為學生個人項目，與香港理工大學無關，並非官方網站。', foot2: '完全免費，不收任何佣金。資料暫時只儲存喺你嘅瀏覽器。',
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
    fDesc: 'Description', fDescPh: 'When bought, notes inside, accessories included…', fCtype: 'Contact via', fContact: 'Handle / number', fContactPh: 'e.g. @polyu_boa', fSpot: 'Meet-up spot', submitPost: 'List item',
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
    foot1: 'Independent student project, not affiliated with The Hong Kong Polytechnic University.', foot2: 'Completely free, no commission. Data is currently stored only in your browser.',
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
  del: 'Delete', delConfirm: 'Delete this? This cannot be undone.', tDeleted: 'Deleted',
});
const REPORT_REASONS = ['prohibited', 'scam', 'fake', 'offensive', 'other'];
const mail = k => SITE_CONFIG[k] ? `<a href="mailto:${esc(SITE_CONFIG[k])}">${esc(SITE_CONFIG[k])}</a>` : `<span class="ph">${t('placeholder')}</span>`;
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
      '學生證、校園帳戶、Wi-Fi 帳戶或任何身份證明文件的轉讓或借用', '未經收件人授權代領他人包裹', '任何違反香港法律或內地海關規定的物品']) +
      `<p class="muted small">違規內容會被移除，有關帳戶可被禁止使用本網站。</p>`,
    terms: () => `<h3>使用條款</h3>` + ul([
      '本網站只提供資訊發佈平台，<b>並不參與、促成或保證任何交易</b>，亦不代收或代付任何款項。',
      '買賣雙方及代購雙方須自行核實物品、身份及付款安排，並自行承擔交易風險。',
      '你須確保發佈的內容真實、合法，不涉及<a href="#" data-doc="prohibited">禁售清單</a>所列物品，亦不侵犯他人權利。',
      '代購須遵守香港及內地（或相關地區）海關、進出口及稅務規定，包括攜帶限額及申報要求。',
      '宿舍跑腳只屬同學之間的互助安排：取件碼須私下傳送；跑腳費由雙方自行協定及直接交收，本網站不收取任何費用，亦不處理任何付款或爭議。',
      '我們可在毋須通知的情況下移除任何內容或暫停任何使用者。',
      '使用本網站即表示你同意本條款、<a href="#" data-doc="privacy">私隱政策</a>及<a href="#" data-doc="disclaimer">免責聲明</a>。']),
    privacy: () => `<h3>私隱政策及收集個人資料聲明</h3>
      <p class="muted small">根據《個人資料（私隱）條例》（第 486 章）</p>
      <h4>收集的資料</h4><p>物品、代購或跑腳資料（只需宿舍及座數 / 樓層，毋須完整房號），以及你自願提供的聯絡方式（WhatsApp / WeChat / Instagram 帳號或電話）。請勿提供不必要的個人資料。</p>
      <h4>收集目的</h4><p>只用作在網站上公開顯示你的放售或代購資料，讓其他使用者聯絡你，以及處理舉報及維護網站安全。我們不會將資料作直接促銷或出售予第三方。</p>
      <h4>公開及轉移</h4><p>你的聯絡方式會公開顯示予網站訪客。除法律要求外，我們不會向第三方披露你的資料。</p>
      <h4>保留期限</h4><p>現階段原型版本的資料只儲存在你自己的瀏覽器內，不會上載至伺服器。日後正式版本中，資料會在物品下架或需求完成後 30 日內刪除。</p>
      <h4>查閱、更正及刪除</h4><p>你可隨時刪除自己發佈的內容。如需查閱或更正資料，或有任何私隱查詢，請電郵：${mail('contactEmail')}</p>`,
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
      'Transfer or lending of student IDs, campus / Wi-Fi accounts or any identity documents', 'Collecting someone else\u2019s parcel without the recipient\u2019s authorisation', 'Anything that breaches Hong Kong law or Mainland customs rules']) +
      `<p class="muted small">Violating content will be removed and the user may be barred from the site.</p>`,
    terms: () => `<h3>Terms of use</h3>` + ul([
      'This site only hosts information. It <b>does not take part in, arrange or guarantee any transaction</b>, and never handles payments.',
      'Buyers, sellers and requesters must verify items, identities and payment arrangements themselves and bear all transaction risks.',
      'Your content must be truthful and lawful, must not involve <a href="#" data-doc="prohibited">prohibited items</a>, and must not infringe anyone\u2019s rights.',
      'Purchase-on-behalf requests must comply with Hong Kong and Mainland (or other relevant) customs, import/export and tax rules, including allowances and declarations.',
      'Hall errands are informal favours between students: share pickup codes privately only; runner fees are agreed and paid directly between users — the site charges nothing and does not handle payments or disputes.',
      'We may remove any content or suspend any user without notice.',
      'By using the site you agree to these terms, the <a href="#" data-doc="privacy">Privacy policy</a> and the <a href="#" data-doc="disclaimer">Disclaimer</a>.']),
    privacy: () => `<h3>Privacy policy & Personal Information Collection Statement</h3>
      <p class="muted small">Under the Personal Data (Privacy) Ordinance (Cap. 486)</p>
      <h4>What we collect</h4><p>Item, request or errand details (hall and block/floor only — no full room number needed), and the contact you choose to provide (WhatsApp / WeChat / Instagram handle or phone). Please don\u2019t share more personal data than needed.</p>
      <h4>Purpose</h4><p>Solely to display your listing or request publicly so others can contact you, and to handle reports and keep the site safe. We never use it for direct marketing or sell it to third parties.</p>
      <h4>Disclosure</h4><p>Your contact is shown publicly to site visitors. We do not disclose your data to third parties except as required by law.</p>
      <h4>Retention</h4><p>In this prototype, data stays only in your own browser and is never uploaded. In a future live version, data will be deleted within 30 days after an item is removed or a request is completed.</p>
      <h4>Access, correction & deletion</h4><p>You can delete your own posts at any time. For data access or correction requests, or any privacy enquiry, email: ${mail('contactEmail')}</p>`,
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
  const it = (kind === 'l' ? listings : kind === 'e' ? errands : requests).find(x => x.id === id); if (!it) return;
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

let listings = [], requests = [], errands = [];
const COL = { l: 'listings', r: 'daigou', e: 'errands' };
async function refresh(...cols) {
  const want = cols.length ? cols : ['listings', 'daigou', 'errands'];
  const got = await Promise.all(want.map(c => Store.list(c)));
  want.forEach((c, i) => { if (c === 'listings') listings = got[i]; else if (c === 'daigou') requests = got[i]; else errands = got[i]; });
}
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

/* ---------- i18n apply ---------- */
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
  document.title = lang === 'zh' ? '理大二手網 · PolyU Marketplace' : 'PolyU Marketplace · 理大二手網';
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $$('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  const keep = id => $(id).value;
  const cat = keep('#postCat'), cond = keep('#postCond') || 'good', spot = keep('#postSpot'), from = keep('#reqFrom');
  $('#postCat').innerHTML = CATS.map(c => `<option value="${c.id}">${t('cat_' + c.id)}</option>`).join('');
  $('#postCond').innerHTML = CONDS.map(c => `<option value="${c}">${t('cond_' + c)}</option>`).join('');
  $('#postSpot').innerHTML = SPOTS.map(s => `<option value="${s}">${t('spot_' + s)}</option>`).join('');
  $('#reqFrom').innerHTML = REGIONS.map(r => `<option value="${r}">${t('reg_' + r)}</option>`).join('');
  if (cat) $('#postCat').value = cat; $('#postCond').value = cond; if (spot) $('#postSpot').value = spot; if (from) $('#reqFrom').value = from;
  $('#reqForm [name=deadline]').min = ymd(Date.now());
  const et = $('#errType').value, eh = $('#errHall').value;
  $('#errType').innerHTML = ER_TYPES.map(x => `<option value="${x}">${t('type_' + x)}</option>`).join('');
  $('#errHall').innerHTML = HALLS.map(h => `<option value="${h}">${t('hall_' + h)}</option>`).join('');
  if (et) $('#errType').value = et; if (eh) $('#errHall').value = eh;
  $('#errForm [name=date]').min = ymd(Date.now());
  renderAll();
  if (!$('#docModal').hidden && curDoc) openDoc(curDoc);
}
function setLang(l) { lang = l; localStorage.setItem(LS_LANG, l); applyLang(); }

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
  arr.sort(by[state.sort]);
  $('#grid').innerHTML = arr.map(l => `
    <article class="card" data-id="${l.id}" tabindex="0">
      <div class="thumb">${art(l)}<span class="thumb-cat">${t('cat_' + l.cat)}</span></div>
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
function openDetail(id) {
  const l = listings.find(x => x.id === id); if (!l) return;
  $('#detailBody').innerHTML = `
    <div class="d-img">${art(l)}</div>
    <h3 class="d-title">${esc(l.title)}</h3>
    <div class="d-row"><span class="price"><small>HK$</small>${l.price}</span><span class="tag">${t('cond_' + l.cond)}</span><span class="tag">${t('cat_' + l.cat)}</span></div>
    <p class="d-desc">${esc(l.desc || t('noDesc'))}</p>
    <div class="d-box">
      <div><span>${t('seller')}</span><b>${esc(l.seller === '__me' ? t('me') : l.seller)}</b></div>
      <div><span>${esc(l.ctype)}</span><b>${esc(l.contact)}</b></div>
      <div><span>${t('spot')}</span><b>${t('spot_' + l.spot)}</b></div>
      <div><span>${t('posted')}</span><b>${ago(l.t)}</b></div>
    </div>
    <button class="btn btn-primary btn-block" data-copy="${esc(l.contact)}">${t('copyContact')}</button>
    ${scamHtml()}
    <div class="d-actions">${l.seller === '__me' ? `<button class="link-btn" data-del="l:${l.id}">${t('del')}</button>` : '<span></span>'}<button class="link-btn" data-report="l:${l.id}">⚑ ${t('report')}</button></div>`;
  show('#detailModal');
}

/* ---------- daigou ---------- */
function renderDg() {
  $('#dgScam').innerHTML = scamHtml();
  $('#dgFilters').innerHTML = ['all', ...REGIONS].map(f => `<button class="chip ${state.dg === f ? 'active' : ''}" data-dg="${f}">${t('reg_' + f)}</button>`).join('');
  const arr = requests.filter(r => state.dg === 'all' || r.from === state.dg)
    .sort((a, b) => (a.status === 'taken') - (b.status === 'taken') || b.t - a.t);
  if (!arr.length) {
    $('#reqList').innerHTML = requests.length ? `<div class="empty-card">${EMPTY_ART}<p>${t('dgNoMatch')}</p></div>` : emptyBlock(t('dgEmptyTitle'), t('dgEmptyText'), t('dgEmptyBtn'), 'req');
    return;
  }
  $('#reqList').innerHTML = arr.map(r => {
    const left = Math.round((new Date(r.deadline + 'T00:00') - new Date(ymd(Date.now()) + 'T00:00')) / DAY);
    const dl = left < 0 ? t('expired') : left === 0 ? t('today') : t('daysLeft', { n: left });
    return `<div class="req ${r.status}">
      <div class="req-top"><div class="flag">${t('regShort_' + r.from)}</div>
        <div class="req-h"><h4>${esc(r.item)}</h4><div class="req-info"><span>${t('from')} <b>${t('reg_' + r.from)}</b></span><span>${esc(r.who === '__me' ? t('me') : r.who)} · ${ago(r.t)}</span></div></div></div>
      <div class="req-info"><span>${t('budget')} <b>HK$${r.budget}</b></span><span>${t('runFee')} <b>HK$${r.tip || 0}</b></span>
        <span class="${left <= 3 ? 'urgent' : ''}">${t('deadline')} ${esc(r.deadline)} · ${dl}</span></div>
      ${r.note ? `<p class="req-note">${esc(r.note)}</p>` : ''}
      <div class="req-foot"><span class="req-left"><span class="status ${r.status}">${t(r.status)}</span><button class="link-btn" data-report="r:${r.id}">⚑ ${t('report')}</button>${r.who === '__me' ? `<button class="link-btn" data-del="r:${r.id}">${t('del')}</button>` : ''}</span>
        ${r.status === 'open' ? `<button class="btn btn-primary" data-take="${r.id}">${t('take')}</button>` : `<button class="btn btn-ghost" data-copy="${esc(r.contact)}">${esc(r.ctype)} · ${esc(r.contact)}</button>`}</div>
    </div>`;
  }).join('');
}

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
function renderErrands() {
  $('#erSafety').innerHTML = safetyHtml();
  $('#erTypes').innerHTML = ['all', ...ER_TYPES].map(x => `<button class="chip ${erState.type === x ? 'active' : ''}" data-ertype="${x}">${t('type_' + x)}</button>`).join('');
  $('#hallSwitch').innerHTML = HALLS.map(h => {
    const all = errands.filter(x => x.hall === h), open = all.filter(x => x.status === 'open').length;
    return `<button class="hall-card ${erState.hall === h ? 'active' : ''}" data-hall="${h}" role="tab" aria-selected="${erState.hall === h}">
      <span class="hall-name">${t('hall_' + h)}</span><span class="hall-alt">${I18N[lang === 'zh' ? 'en' : 'zh']['hall_' + h]}</span>
      <span class="hall-count"><b>${open}</b> ${t('openCount')}${all.length > open ? ` · ${all.length} ${t('totalCount')}` : ''}</span></button>`;
  }).join('');
  const order = { open: 0, taken: 1, done: 2 };
  const inHall = errands.filter(x => x.hall === erState.hall);
  const arr = inHall.filter(x => erState.type === 'all' || x.type === erState.type)
    .sort((a, b) => order[a.status] - order[b.status] || b.t - a.t);
  if (!arr.length) {
    const hn = t('hall_' + erState.hall);
    $('#errList').innerHTML = inHall.length ? `<div class="empty-card">${EMPTY_ART}<p>${t('erNoMatch')}</p></div>` : emptyBlock(t('erEmptyTitle', { hall: hn }), t('erEmptyText', { hall: hn }), t('erEmptyBtn'), 'err');
    return;
  }
  $('#errList').innerHTML = arr.map(x => {
    const mine = x.who === '__me';
    const right = x.status === 'open' ? `<button class="btn btn-primary" data-ertake="${x.id}">${t('take')}</button>`
      : `<button class="btn btn-ghost" data-copy="${esc(x.contact)}">${esc(x.ctype)} · ${esc(x.contact)}</button>`;
    return `<div class="req ${x.status === 'open' ? 'open' : 'taken'}">
      <div class="req-top"><div class="flag er-${x.type}"><svg viewBox="0 0 24 24" aria-hidden="true">${ER_ICON[x.type]}</svg></div>
        <div class="req-h"><h4>${t('type_' + x.type)}${x.floor ? ` <span class="muted">${esc(x.floor)}</span>` : ''}</h4>
        <div class="req-info"><span>${esc(x.who === '__me' ? t('me') : x.who)} · ${ago(x.t)}</span></div></div></div>
      <div class="er-grid">
        <span>${t('pickup')}</span><b>${esc(x.pickup)}</b>
        <span>${t('window')}</span><b>${esc(x.date)} ${esc(x.from)}–${esc(x.to)}</b>
        <span>${t('fee')}</span><b>${x.fee ? 'HK$' + x.fee : t('feeNone')}</b>
      </div>
      ${x.note ? `<p class="req-note">${esc(x.note)}</p>` : ''}
      <div class="req-foot"><span class="req-left"><span class="status ${x.status === 'open' ? 'open' : 'taken'}">${t('er_' + x.status)}</span>
        <button class="link-btn" data-report="e:${x.id}">⚑ ${t('report')}</button>
        ${mine && x.status !== 'done' ? `<button class="link-btn" data-erdone="${x.id}">✓ ${t('markDone')}</button>` : ''}
        ${mine ? `<button class="link-btn" data-del="e:${x.id}">${t('del')}</button>` : ''}</span>
        ${x.status === 'done' ? '' : right}</div>
    </div>`;
  }).join('');
}

/* ---------- helpers ---------- */
function renderAll() { renderCats(); renderGrid(); renderDg(); renderErrands(); }
function show(sel) { $$('.modal').forEach(m => m.hidden = true); if (sel === '#errModal') $('#errHall').value = erState.hall; $(sel).hidden = false; document.body.style.overflow = 'hidden'; }
function closeModal(m) { if (!m) return; m.hidden = true; if (m.id === 'docModal') curDoc = null; if ($$('.modal').every(x => x.hidden)) document.body.style.overflow = ''; }
function hideAll() { $$('.modal').forEach(m => m.hidden = true); document.body.style.overflow = ''; }
let tt; function toast(msg) { const el = $('#toast'); el.textContent = msg; el.hidden = false; clearTimeout(tt); tt = setTimeout(() => el.hidden = true, 2400); }
function go(view) {
  $$('.view').forEach(v => v.hidden = v.id !== 'view-' + view);
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.nav === view));
  const fl = $('#openPost [data-i18n]'); fl.dataset.i18n = { market: 'post', daigou: 'fabReq', errands: 'fabErr' }[view]; fl.textContent = t(fl.dataset.i18n);
  history.replaceState(null, '', view === 'market' ? location.pathname : '#' + view); window.scrollTo(0, 0);
}
let pendingTake = null;

/* ---------- events ---------- */
document.addEventListener('click', async e => {
  if (e.target.classList.contains('modal')) return closeModal(e.target);
  const el = e.target.closest('[data-cat],[data-dg],[data-nav],[data-close],[data-copy],[data-take],[data-lang],[data-action],[data-doc],[data-report],[data-del],[data-ertype],[data-ertake],[data-erdone],[data-hall],.card');
  if (!el) return;
  const d = el.dataset;
  if (d.lang) setLang(d.lang);
  else if (d.cat) { state.cat = d.cat; renderCats(); renderGrid(); }
  else if (d.dg) { state.dg = d.dg; renderDg(); }
  else if (d.ertype) { erState.type = d.ertype; renderErrands(); }
  else if (d.hall) setHall(d.hall);
  else if (d.ertake) { const x = errands.find(y => y.id === d.ertake); if (!x) return; pendingTake = { kind: 'e', id: x.id }; $('#confirmText').textContent = t('erTakeText'); show('#confirmModal'); }
  else if (d.erdone) { await Store.update('errands', d.erdone, { status: 'done' }); await refresh('errands'); renderErrands(); toast(t('tDone')); }
  else if (d.nav) { e.preventDefault(); go(d.nav); }
  else if (el.hasAttribute('data-close')) closeModal(el.closest('.modal'));
  else if (d.doc) { e.preventDefault(); openDoc(d.doc); }
  else if (d.report) { const [k, id] = d.report.split(':'); openReport(k, id); }
  else if (d.del) {
    const [k, id] = d.del.split(':');
    if (!confirm(t('delConfirm'))) return;
    await Store.remove(COL[k], id); await refresh(COL[k]); hideAll(); renderAll(); toast(t('tDeleted'));
  }
  else if (d.copy) { navigator.clipboard?.writeText(d.copy).catch(() => {}); toast(t('tCopied') + d.copy); }
  else if (d.action) show({ post: '#postModal', req: '#reqModal', err: '#errModal' }[d.action]);
  else if (d.take) {
    const r = requests.find(x => x.id === d.take); if (!r) return;
    pendingTake = { kind: 'r', id: r.id }; $('#confirmText').textContent = t('takeText', { item: r.item }); show('#confirmModal');
  }
  else if (el.classList.contains('card')) openDetail(d.id);
});
$('#reportForm').addEventListener('submit', async e => {
  e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
  await Store.create('reports', { target_kind: COL[reportTarget.kind], target_id: reportTarget.id, target_title: reportTarget.title, reason: f.reason, note: f.note });
  e.target.reset(); closeModal($('#reportModal')); toast(t('tReported'));
});
$('#confirmOk').onclick = async () => {
  const pt = pendingTake || {};
  if (pt.id && await Store.update(COL[pt.kind], pt.id, { status: 'taken' })) { await refresh(COL[pt.kind]); renderDg(); renderErrands(); toast(t('tTaken')); }
  hideAll();
};
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const top = ['#docModal', '#reportModal'].map(x => $(x)).find(m => !m.hidden); top ? closeModal(top) : hideAll(); } if (e.key === 'Enter' && e.target.classList?.contains('card')) openDetail(e.target.dataset.id); });
$('#searchForm').addEventListener('submit', e => { e.preventDefault(); state.q = $('#q').value; renderGrid(); $('#cats').scrollIntoView({ behavior: 'smooth' }); });
$('#q').addEventListener('input', e => { state.q = e.target.value; renderGrid(); });
$('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
$('#openPost').onclick = () => show(!$('#view-daigou').hidden ? '#reqModal' : !$('#view-errands').hidden ? '#errModal' : '#postModal');
$('#openErr').onclick = () => show('#errModal');
$('#errForm').addEventListener('submit', async e => {
  e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
  await Store.create('errands', { type: f.type, pickup: f.pickup.trim(), hall: f.hall, floor: f.floor.trim(), date: f.date, from: f.from, to: f.to, fee: +f.fee || 0, note: f.note.trim(), ctype: f.ctype, contact: f.contact.trim(), who: '__me', status: 'open' });
  await refresh('errands'); e.target.reset(); applyLang(); hideAll(); erState.type = 'all'; setHall(f.hall); toast(t('tErr'));
});
$('#openReq').onclick = () => show('#reqModal');
$('#postForm').addEventListener('submit', async e => {
  e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
  await Store.create('listings', { title: f.title.trim(), cat: f.cat, price: +f.price, cond: f.cond, desc: f.desc.trim(), ctype: f.ctype, contact: f.contact.trim(), spot: f.spot, seller: '__me' });
  await refresh('listings'); e.target.reset(); applyLang(); hideAll(); state.cat = 'all'; state.q = ''; $('#q').value = ''; go('market'); renderAll(); toast(t('tPosted'));
});
$('#reqForm').addEventListener('submit', async e => {
  e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
  await Store.create('daigou', { item: f.item.trim(), from: f.from, budget: +f.budget, tip: +f.tip || 0, deadline: f.deadline, note: f.note.trim(), ctype: f.ctype, contact: f.contact.trim(), who: '__me', status: 'open' });
  await refresh('daigou'); e.target.reset(); applyLang(); hideAll(); state.dg = 'all'; renderDg(); toast(t('tReq'));
});

(async () => {
  await refresh();
  applyLang();
  if (['#daigou', '#errands'].includes(location.hash)) go(location.hash.slice(1));
})();
