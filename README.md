# 理大二手網 · PolyU Marketplace (prototype)

二手市場、代購、宿舍跑腳。純靜態網站（HTML / CSS / JS），資料儲存在瀏覽器 localStorage，暫時毋須後端。
Market, purchase-on-behalf requests and hall errands. Static site (HTML / CSS / JS). Data is stored in the browser's localStorage; no backend yet.

## 本地運行 / Run locally
    cd polyu-market
    python3 -m http.server 8765
打開 / Open http://localhost:8765 （亦可直接開啟 index.html / or just open index.html）

## 設定 / Config
編輯 app.js 頂部的 SITE_CONFIG（一般查詢及投訴電郵）。
Edit SITE_CONFIG at the top of app.js (contact & complaints emails).

## 清除資料 / Reset data
瀏覽器 Console / browser console: localStorage.clear(); location.reload();

## 部署 / Deploy
將整個資料夾上載到 Netlify Drop、GitHub Pages 或 Vercel 即可。
Upload the folder to Netlify Drop, GitHub Pages or Vercel.

## 後端 / Backend (Supabase)
- 共用資料儲存於 Supabase（project `upmzeccwedqihvfymick`，region ap-northeast-1 Tokyo）。如連線失敗，網站會自動改用瀏覽器 localStorage。
- Shared data lives in Supabase; if it is unreachable the site falls back to localStorage.
- `supabase/schema.sql`: tables (listings, daigou, errands, reports), RLS, column privileges, rate guard, RPCs (`pm_delete_post`, `pm_take_post`, `pm_complete_errand`).
- `supabase/retention.sql`: daily pg_cron clean-up matching the privacy policy.
- `app.js` → `SUPABASE_CONFIG` holds the public URL + publishable key (safe to ship; access is enforced by RLS). Never put the service_role / secret key or access tokens in this repo.
- 擁有權：每個瀏覽器有隨機 owner token（localStorage `pm_owner`），只公開其 SHA-256，用作刪除 / 完成自己的內容。
