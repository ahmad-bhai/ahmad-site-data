// api/qx.js (Vercel Serverless Function)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id, url, dash, win } = req.query;
    res.setHeader('Content-Type', 'text/html');

    if (!id) {
        return res.status(200).send("id required");
    }

    const dbURL = "https://reactions-maker-site-default-rtdb.firebaseio.com/users.json";
    const baseURL = "https://ahmad-bhai-scripts.vercel.app/";

    try {
        const fbRes = await fetch(dbURL);
        const fbData = await fbRes.json();
        const userData = fbData ? Object.values(fbData).find(u => u.id === id) : null;

        if (!userData) {
            return res.status(200).send(getLockScreenHTML(id));
        }

        let targetFile = null;
        let routeKey = null;
        const targetUrl = url ? url.toLowerCase() : "";

        // User-Agent detection for Device Mode
        const userAgent = req.headers['user-agent'] || "";
        const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

        // ─── UPGRADED ROUTING LOGIC ──────────────────────────────────────────
        
        // Priority 1: Dashboard Dashboard Toggle
        if (dash === 'true') {
            targetFile = "BLS.html";
            routeKey = "lb";
        } 
        // Priority 2: URL check for Core trading interface (Supercedes element checks on Desktop)
        else if (targetUrl.includes("demo-trade")) {
            targetFile = isMobile ? "androidis.html" : "pcis.html";
            routeKey = isMobile ? "android" : "pc";
        }
        // Priority 3: Win element state trigger (Sirf Mobile par active hoga, Desktop auto-bypass)
        else if (win === 'true' && isMobile) {
            targetFile = "winis.html";
            routeKey = "win";
        } 
        // Priority 4: Financial pages and stats
        else if (targetUrl.includes("withdrawal")) {
            targetFile = "pis.html";
            routeKey = "p";
        } 
        else if (targetUrl.includes("balance")) {
            targetFile = "tis.html";
            routeKey = "t";
        } 
        else if (targetUrl.includes("analytics")) {
            targetFile = "anais.html";
            routeKey = "ana";
        }
        // Fallback for desktop defaults if directly loading generic trading components
        else if (!isMobile) {
            targetFile = "pcis.html";
            routeKey = "pc";
        }

        if (userData.permissions && userData.permissions[routeKey] === false) {
            return res.status(200).send(getLockScreenHTML(id));
        }

        if (!targetFile) {
            return res.status(200).send(getErrorPopupHTML());
        }

        const fileRes = await fetch(baseURL + targetFile);
        if (!fileRes.ok) throw new Error("File not found on script server");
        
        const htmlContent = await fileRes.text();
        return res.status(200).send(htmlContent);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

// ─── UI TEMPLATES (LOCK / ERROR) ───────────────────────────────────────────
function getLockScreenHTML(uid) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Magic Scripts - Locked</title>
    <style>
        body { background-color: #0c0a1c; margin: 0; padding: 0; }
        dialog#ahmadLock {
            border: none;
            padding: 0;
            background: transparent;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", 'Inter', sans-serif;
            display: block;
            margin: 15vh auto;
        }
        .glass {
            width: 420px;
            max-width: 92vw;
            padding: 28px 24px 26px;
            border-radius: 12px;
            background: transparent;
            border: none;
            box-shadow: none;
            color: #ffffff;
            text-align: center;
            position: relative;
            -webkit-font-smoothing: antialiased;
        }
        .info {
            margin: 2rem 0;
            background: rgba(255, 255, 255, 0.07);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 10px;
            padding: 12px 14px;
            text-align: left;
            backdrop-filter: blur(2px);
        }
        .label { font-size: 0.7rem; letter-spacing: 0.5px; opacity: 0.6; margin-bottom: 4px; font-weight: 600; color: #D0BDF4; }
        .value-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .value { font-size: 0.95rem; font-weight: 600; word-break: break-all; color: #ffffff; }
        .copy-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; opacity: 0.7; transition: opacity 0.2s ease; flex-shrink: 0; }
        .copy-btn:hover { opacity: 1; }
        .copy-btn svg { width: 18px; height: 18px; fill: #fff; }
        .copy-btn .tooltip { position: absolute; top: -40px; left: 50%; transform: translateX(-50%); background: rgba(44, 44, 46, 0.9); backdrop-filter: blur(4px); color: #fff; padding: 6px 10px; border-radius: 6px; font-size: 10px; opacity: 0; pointer-events: none; transition: 0.25s ease; border: 1px solid rgba(255, 255, 255, 0.1); }
        .copy-btn.show-tooltip .tooltip { opacity: 1; transform: translateX(-50%) translateY(-4px); }
        .heart-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; }
        .heart-bg::before, .heart-bg::after { content: '💜'; position: absolute; font-size: 24px; color: rgba(255, 111, 197, 0.2); animation: floatHearts 7s infinite linear; }
        .heart-bg::before { left: 20%; animation-delay: 0s; }
        .heart-bg::after { left: 75%; animation-delay: 3.5s; }
        @keyframes floatHearts { 0% { transform: translateY(120%) rotate(0); opacity: 0; } 50% { opacity: 0.4; } 100% { transform: translateY(-120%) rotate(360deg); opacity: 0; } }
        .lock-icon { display: flex; justify-content: center; align-items: center; margin-bottom: 1rem; }
        .lock-icon img { width: 90px; height: auto; margin-bottom: 1rem; }
        .logo-pulse { animation: pulseLogo 1.5s infinite ease-in-out; }
        @keyframes pulseLogo { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.06); opacity: 1; } }
        .footer-social { display: flex; justify-content: center; margin-top: 3rem; margin-bottom: 1rem; }
        .telegram-btn { background: linear-gradient(135deg, rgba(34, 158, 217, 0.85), rgba(29, 78, 216, 0.85)); border: 1px solid rgba(255, 255, 255, 0.15); color: #fff; padding: 10px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 15px rgba(34, 158, 217, 0.25); transition: all 0.2s ease; animation: pulse 1.8s infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); box-shadow: 0 6px 20px rgba(34, 158, 217, 0.35); } }
        .close-cross { position: absolute; top: 12px; right: 18px; font-size: 1.3rem; font-weight: 500; color: #DC8DE6; cursor: pointer; transition: all 0.2s ease; z-index: 10; opacity: 0.8; }
        .close-cross:hover { opacity: 1; transform: scale(1.05); }
    </style>
</head>
<body>
<dialog id="ahmadLock">
<div class="glass">
  <div class="heart-bg"></div>
  <div class="close-cross" onclick="window.close()">&times;</div>
  <div class="lock-icon logo-pulse"><img src="https://i.ibb.co/xqXhx24Z/MS.png" alt="Logo"/></div>
  <div style="font-size:2rem;font-weight:900;color:#fff;letter-spacing:1px;margin-bottom:10px;margin-top:1rem;">MAGIC SCRIPTS</div>
  <div style="font-size:1rem;color:#DC8DE6;margin:1rem 0;letter-spacing:1px;">(🔒 LOCKED 🔒)</div>
  <div class="info">
    <div class="label">ID</div>
    <div class="value-row">
      <div class="value">${uid}</div>
      <button class="copy-btn" id="copyBtnAhmad">
        <svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v16h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/></svg>
        <span class="tooltip">Copied ✓</span>
      </button>
    </div>
  </div>
  <div class="footer-social"><a href="https://t.me/Magic_Scripts" target="_blank" class="telegram-btn">🚀 Telegram @Magic_Scripts</a></div>
</div>
</dialog>
<script>
    document.getElementById("copyBtnAhmad").onclick = function () {
        navigator.clipboard.writeText("${uid}").then(() => {
            this.classList.add('show-tooltip');
            setTimeout(() => this.classList.remove('show-tooltip'), 1200);
        });
    };
</script>
</body>
</html>`;
}

// ─── ERROR POPUP DESIGN (Non-blocking Top Bar) ──────────────────────────────
function getErrorPopupHTML() {
    return `
    <div id="ahmadErrorPopup" style="
        position: fixed;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #e63946, #b7094c);
        color: white;
        padding: 14px 32px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: bold;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        z-index: 2147483647;
        box-shadow: 0 10px 30px rgba(230, 57, 70, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.2);
        letter-spacing: 0.5px;
        text-align: center;
        pointer-events: none;
        animation: ahmadFadeIn 0.3s ease-out;
    ">
        ⚠️ APPLY ON CORRECT URL ⚠️
    </div>
    <style>
        @keyframes ahmadFadeIn {
            from { top: -50px; opacity: 0; }
            to { top: 20px; opacity: 1; }
        }
    </style>
    `;
}
