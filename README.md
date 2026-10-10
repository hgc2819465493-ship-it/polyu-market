# 理大二手網 · PolyU Marketplace

二手市場、代購、宿舍跑腳。純靜態前端（HTML / CSS / JS，無 build step）＋ Supabase（Auth、Postgres、Storage）。
Market, purchase-on-behalf requests and hall errands. Static front-end + Supabase (Auth, Postgres, Storage).
學生個人項目，與香港理工大學無關。Student project, not affiliated with PolyU.

Live: https://hgc2819465493-ship-it.github.io/polyu-market/

## 本地運行 / Run locally
    cd polyu-market
    python3 -m http.server 8765
打開 / Open http://localhost:8765 （http://localhost:8765/** 已加入 Auth redirect allow-list）

## 設定 / Config
- `app.js` → `SITE_CONFIG`：一般查詢及投訴電郵 / contact & complaints emails.
- `app.js` → `SUPABASE_CONFIG`：public URL + publishable key（可公開，權限由 RLS 控制 / safe to ship, access enforced by RLS）。
- **切勿**把 service_role / secret key 或 access token 放入此 repo. Never commit secret keys or tokens.

## 帳戶 / Accounts (Supabase Auth, email OTP)
- 任何電郵都可登入；@connect.polyu.hk 會顯示「理大同學」標記。Any email works; @connect.polyu.hk gets a “PolyU student” badge.
- 瀏覽公開；發佈、接單、查看聯絡方法需要登入。Browsing is public; posting, taking orders and seeing contacts need sign-in.
- Site URL: `https://hgc2819465493-ship-it.github.io/polyu-market/`; redirect allow-list: that URL `/**` and `http://localhost:8765/**`. OTP length 6, expiry 10 min.
- **電郵限制 / Email limits:** Supabase 內建寄件服務只會寄給 project 團隊成員電郵，約每小時 2 封，亦不能改範本。
  公開使用前必須設定自訂 SMTP（例如 Resend、Brevo），再把 `supabase/email-template.html` 貼到
  Auth → Email Templates → Magic Link（範本含 `{{ .Token }}` 6 位數驗證碼）。
  The built-in sender only delivers to project team members (~2/hour) and templates can’t be edited on the free tier without custom SMTP.
  Until then users get a sign-in **link** (the UI accepts both link and 6-digit code).

## 資料庫 / Database
- `supabase/schema_v2.sql` (applied): `profiles`, `listings`, `daigou`, `errands`, `reports`;
  RLS (owner = `auth.uid()`), column privileges (contacts only for signed-in users; taker contact only via RPC),
  guard trigger (status transitions, image paths, rate limit), RPCs `pm_take`, `pm_release`, `pm_taker_contact`, `pm_delete_account`.
- 狀態 / statuses — listings: available / reserved / sold / removed; daigou & errands: open / taken / done / cancelled.
- Storage bucket `post-images` (public, 2 MB, jpeg/webp/png): users write/delete only under `<their uid>/…`.
  Client resizes to ≤1280 px WebP (JPEG fallback) before upload; max 4 photos per post.
- `supabase/retention.sql`: daily pg_cron clean-up (03:30 HKT) per the privacy policy. Note: it deletes rows only — photos of auto-deleted posts stay in Storage until cleaned manually.
- v1 tables were renamed `legacy_*_v1` (no grants) and kept for reference.
- `supabase/schema.sql` is the superseded v1 (owner-token) schema.

## 部署 / Deploy
GitHub Pages from `main` (root). Push → Pages rebuilds automatically.
