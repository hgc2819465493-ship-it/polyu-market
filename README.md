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
- 瀏覽公開；發佈、接單及聊天需要登入。Browsing is public; posting, taking orders and chatting need sign-in.
- 「我的」可更改顯示名稱、更改密碼、刪除帳戶。忘記密碼：用註冊電郵電郵至 SITE_CONFIG.contactEmail，由管理員在 Supabase 後台處理。
  “Me” page: display name, change password, delete account. Forgot password: users email the contact address; reset manually in the Supabase dashboard.
- Site URL `https://hgc2819465493-ship-it.github.io/polyu-market/`; redirect allow-list: that URL `/**` and `http://localhost:8765/**`.
- 如日後設定自訂 SMTP，可改回電郵驗證 / 驗證碼登入（`supabase/email-template.html`）。If custom SMTP is added later, email verification / OTP can be re-enabled.

## 資料庫 / Database
- `supabase/schema_v2.sql` (applied): `profiles`, `listings`, `daigou`, `errands`, `reports`;
  RLS (owner = `auth.uid()`; `profiles.is_polyu` is no longer shown since emails are unverified), column privileges,
  guard trigger (status transitions, image paths, rate limit), RPCs `pm_take`, `pm_release`, `pm_delete_account` (contact columns and `pm_taker_contact` were removed in v4).
- 狀態 / statuses — listings: available / reserved / sold / removed; daigou & errands: open / taken / done / cancelled.
- Storage bucket `post-images` (public, 2 MB, jpeg/webp/png): users write/delete only under `<their uid>/…`.
  Client resizes to ≤1280 px WebP (JPEG fallback) before upload; max 4 photos per post.
- `supabase/retention.sql`: daily pg_cron clean-up (03:30 HKT) per the privacy policy. Note: it deletes rows only — photos of auto-deleted posts stay in Storage until cleaned manually.
- v1 tables were renamed `legacy_*_v1` (no grants) and kept for reference.
- `supabase/schema.sql` is the superseded v1 (owner-token) schema.

## 管理 / Moderation (`supabase/schema_admin.sql`, applied)
- 管理員名單只存在資料庫：`public.admins`（user id），由 `public.is_admin()` 檢查；前端「管理」按鈕只是介面，所有權限由 RLS / RPC 執行。
  Admin rights live only in the DB (`public.admins`, checked by `public.is_admin()`); the UI button is cosmetic.
- 種子：`public.admin_emails`（現為 2819465493@qq.com）。新註冊而電郵在名單上的帳戶會自動成為管理員（只限註冊時；之後改電郵不會獲得權限）。
- 新增管理員 / Add an admin (SQL editor): `insert into public.admins (user_id) select id from auth.users where email = '...';`
- 權力 / Powers (RPCs): `pm_admin_hide`, `pm_admin_delete` (returns photo paths, client removes them), `pm_admin_report` (handled / reopen), `pm_admin_ban` (cannot ban admins).
  Admins can read `reports`, `bans`, `mod_log` and all posts (incl. hidden / removed). Every action is written to `mod_log`.
- 封鎖 / Bans (`public.bans`): DB triggers block posting and 接單, storage policy blocks photo uploads.

## 部署 / Deploy
GitHub Pages from `main` (root). Push → Pages rebuilds automatically.

## Languages

- 繁 (zh-HK, default), 简 (Mainland wording, written separately — not machine-converted) and EN; toggle 繁 / 简 / EN, saved in `localStorage.pm_lang`. First visit: zh-CN / zh-SG / zh-Hans → 简, other Chinese → 繁, anything else → 繁. Legal precedence: the Traditional Chinese version prevails.

## Chat (站內訊息)

- 1:1 chat per post + pair (`public.conversations`, `public.messages`, `supabase/schema_chat.sql`). Only the two participants can read/send (RLS); banned users cannot send; limits 20 msgs/min, 1000/day, 30 new chats/hour.
- Text ≤ 1000 chars, optional photo in the **private** `chat-images` bucket (`<conversation>/<sender>/<file>.webp`), shown via 1-hour signed URLs.
- Realtime (`supabase_realtime` publication) with a 4 s polling fallback when the socket is down, plus a 60 s safety poll.
- Unread = last message from the other side newer than my `*_read_at`; read receipts use the peer's `*_read_at`.
- 「舉報對話」 → `pm_chat_report` (participants only). Admins can read a chat only after it is reported, via `pm_admin_chat` (logged as `view_chat`).
- Retention: `pm_retention` (daily) deletes conversations 180 days after the last message unless they have an unhandled report.

## No personal contact details (v4, `supabase/schema_v4.sql`)

- The `contact` / `ctype` / `taker_contact` / `taker_ctype` columns and the `pm_taker_contact` RPC are gone; `pm_take(kind, id)` takes no contact. On-site Chat is the only way to get in touch. (The unused `legacy_*_v1` tables still have their old columns and are left untouched.)

## Deal completion → chat deletion (v4)

- **Both sides must confirm**: the poster confirms by marking the post 已售出 (`sold`) / 已完成 (`done`) (a confirm dialog warns that chats will be deleted; reverting the status withdraws it); the buyer / taker taps 「確認交易完成」 in the chat (`pm_chat_confirm`). Columns: `conversations.owner_confirmed_at`, `other_confirmed_at`, `purge_after`.
- When both have confirmed, a **dispute window** starts (`purge_after = now() + pm_config.chat_dispute_hours`, default **48**), shown in the chat: 「48 小時內如有爭議請舉報，之後聊天記錄會自動刪除」.
- `pm_chat_purge()` runs **hourly** (pg_cron job `pm_chat_purge`, minute 5) and deletes conversations whose window has passed **and that have no unhandled report**. A reported chat is kept until a moderator marks the report handled; it is then deleted on the next run. Chats confirmed by only one side fall back to the 180-day rule.
- To change the window: `update public.pm_config set value = '24' where key = 'chat_dispute_hours';` (applies to windows that start afterwards).

## Storage clean-up queue (v4)

- Triggers queue every deleted chat photo (`messages` delete, incl. cascades from conversations / accounts) and every deleted post's photos into `public.storage_trash` (service-role only).
- The **`pm-sweep` Edge Function** (`supabase/functions/pm-sweep`, `verify_jwt=false`, uses the service role injected by Supabase) removes the queued files via the Storage API and deletes the queue rows; failures are retried (up to 20 attempts). pg_cron job `pm_storage_sweep` calls it hourly (minute 20) through `pg_net`. It is safe to call publicly: it only deletes paths the database queued.
- Deploy: `supabase functions deploy pm-sweep --no-verify-jwt` (or the Management API).
