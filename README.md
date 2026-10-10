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
