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

## 帳戶 / Accounts (Supabase Auth, email + password)
- 註冊即登入，不會發送任何電郵（`mailer_autoconfirm = true`），電郵地址**未經驗證**。密碼最少 8 個字元。
  Sign-up logs you in immediately; no emails are ever sent and email addresses are **not verified**. Passwords ≥ 8 chars.
- 瀏覽公開；發佈、接單、查看聯絡方法需要登入。Browsing is public; posting, taking orders and seeing contacts need sign-in.
- 「我的」可更改顯示名稱、更改密碼、刪除帳戶。忘記密碼：用註冊電郵電郵至 SITE_CONFIG.contactEmail，由管理員在 Supabase 後台處理。
  “Me” page: display name, change password, delete account. Forgot password: users email the contact address; reset manually in the Supabase dashboard.
- Site URL `https://hgc2819465493-ship-it.github.io/polyu-market/`; redirect allow-list: that URL `/**` and `http://localhost:8765/**`.
- 如日後設定自訂 SMTP，可改回電郵驗證 / 驗證碼登入（`supabase/email-template.html`）。If custom SMTP is added later, email verification / OTP can be re-enabled.

## 資料庫 / Database
- `supabase/schema_v2.sql` (applied): `profiles`, `listings`, `daigou`, `errands`, `reports`;
  RLS (owner = `auth.uid()`; `profiles.is_polyu` is no longer shown since emails are unverified), column privileges (contacts only for signed-in users; taker contact only via RPC),
  guard trigger (status transitions, image paths, rate limit), RPCs `pm_take`, `pm_release`, `pm_taker_contact`, `pm_delete_account`.
- 狀態 / statuses — listings: available / reserved / sold / removed; daigou & errands: open / taken / done / cancelled.
- Storage bucket `post-images` (public, 2 MB, jpeg/webp/png): users write/delete only under `<their uid>/…`.
  Client resizes to ≤1280 px WebP (JPEG fallback) before upload; max 4 photos per post.
- `supabase/retention.sql`: daily pg_cron clean-up (03:30 HKT) per the privacy policy. Note: it deletes rows only — photos of auto-deleted posts stay in Storage until cleaned manually.
- v1 tables were renamed `legacy_*_v1` (no grants) and kept for reference.
- `supabase/schema.sql` is the superseded v1 (owner-token) schema.

## 部署 / Deploy
GitHub Pages from `main` (root). Push → Pages rebuilds automatically.
