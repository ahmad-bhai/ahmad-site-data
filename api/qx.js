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

// ─── AHMED LOCK SCREEN DESIGN (Luv Scripts Div Style Integration) ───────────
function getLockScreenHTML(uid) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Magic Scripts - Locked</title>
    <style>
        /* RESET dialog */
        dialog {
            border: none;
            padding: 0;
            background: transparent;
        }

        dialog::backdrop {
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
        }

        /* Glass container */
        .glass {
            width: 420px;
            max-width: 92vw;
            padding: 28px 24px 26px;
            border-radius: 22px;
            background: linear-gradient(160deg, #1e1e1e, #2a2a2a);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #f3f3f3;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55);
            font-family: 'Inter', sans-serif;
            position: relative;
            animation: popIn 0.35s ease-out;
            margin: 12vh auto;
        }

        @keyframes popIn {
            from { transform: scale(0.85); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .lock-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1rem;
        }

        .lock-icon img {
            width: 90px;
            height: auto;
            margin-bottom: 1rem;
        }

        .logo-pulse {
            animation: pulseLogo 1.5s infinite ease-in-out;
        }

        @keyframes pulseLogo {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.12); }
        }

        /* Info rows */
        .info {
            margin: 2rem 0;
            background: rgba(255, 255, 255, 0.04);
            border-radius: 14px;
            padding: 12px 14px;
            text-align: left;
        }

        .label {
            font-size: 0.7rem;
            letter-spacing: 1px;
            opacity: 0.6;
            margin-bottom: 4px;
        }

        .value-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .value {
            font-size: 0.95rem;
            font-weight: 600;
            word-break: break-all;
            color: #ffffff;
        }

        /* Copy button */
        .copy-btn {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0.65;
            transition: opacity 0.2s ease;
            flex-shrink: 0;
        }

        .copy-btn:hover {
            opacity: 1;
        }

        .copy-btn svg {
            width: 18px;
            height: 18px;
            fill: #fff;
        }

        /* Tooltip */
        .copy-btn .tooltip {
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: #fff;
            padding: 4px 6px;
            border-radius: 4px;
            font-size: 10px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .copy-btn.show-tooltip .tooltip {
            opacity: 1;
            transform: translateX(-50%) translateY(-4px);
        }

        /* Heart background */
        .heart-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        }

        .heart-bg::before,
        .heart-bg::after {
            content: '💜';
            position: absolute;
            font-size: 28px;
            color: rgba(216, 141, 230, 0.25);
            animation: floatHearts 7s infinite linear;
        }

        .heart-bg::before { left: 20%; animation-delay: 0s; }
        .heart-bg::after { left: 75%; animation-delay: 3.5s; }

        @keyframes floatHearts {
            0% { transform: translateY(120%) rotate(0); opacity: 0; }
            50% { opacity: 0.7; }
            100% { transform: translateY(-120%) rotate(360deg); opacity: 0; }
        }

        .footer-social {
            display: flex;
            justify-content: center;
            margin-top: 3rem;
            margin-bottom: 1rem;
        }

        .telegram-btn {
            background: linear-gradient(135deg, #229ED9, #1d4ed8);
            color: #fff;
            padding: 10px 16px;
            border-radius: 999px;
            font-weight: 700;
            text-decoration: none;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .telegram-btn:hover { color: #fff; }

        .pulse { animation: pulse 1.8s ease-in-out infinite; }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
        }

        .close-cross {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 1.5rem;
            font-weight: bold;
            color: #eb3656;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .close-cross:hover { transform: scale(1.2); }
    </style>
</head>
<body>
<div class="glass">
  <div class="heart-bg"></div>
  <!-- Top-right close cross -->
  <div class="close-cross">&times;</div>
  <div class="lock-icon logo-pulse">
    <img src="https://i.ibb.co/xqXhx24Z/MS.png" alt="Logo" />
  </div>
  <div style="font-size:2rem;font-weight:900;color:#fff; text-shadow:0 5px 25px rgba(0,0,0,0.35);letter-spacing:1px;margin-bottom:10px;margin-top: 1rem;">
    MAGIC SCRIPTS
  </div>
  <div style="font-size:1rem;color:#DC8DE6; margin:1rem 0;letter-spacing:1px;">
    (🔒 LOCKED 🔒)
  </div>

  <!-- KEY (Dynamic ID inside Div row) -->
  <div class="info">
    <div class="label">ID</div>
    <div class="value-row">
      <div class="value" id="vid">${uid}</div>
      <button class="copy-btn" onclick="copyText('${uid}', this)">
        <svg viewBox="0 0 24 24">
          <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v16h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
        </svg>
        <span class="tooltip">Copied ✓</span>
      </button>
    </div>
  </div>

  <div class="footer-social">
    <a href="https://t.me/Magic_Scripts" target="_blank" class="telegram-btn pulse">
      🚀 Telegram @Magic_Scripts
    </a>
  </div>
</div>

<script>
  function copyText(text, btn) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.remove('show-tooltip');
      void btn.offsetWidth; // force reflow
      btn.classList.add('show-tooltip');
      setTimeout(() => btn.classList.remove('show-tooltip'), 1200);
    });
  }

  document.querySelector(".close-cross").addEventListener("click", function () {
    document.querySelectorAll("dialog").forEach(d => { 
      d.close();
      d.remove();
    });
  });
</script>
</body>
</html>`;
          }


// ─── ERROR POPUP DESIGN (Classic Center Style + Auto Animation) ────────────────
function getErrorPopupHTML() {
    return `
    <div id="ahmadErrorPopup">⚠️ APPLY ON CORRECT URL ⚠️</div>
    
    <style>
        #ahmadErrorPopup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.92);
            color: white;
            padding: 18px 28px;
            border-radius: 10px;
            font-size: 16px;
            font-family: sans-serif;
            z-index: 2147483647; /* Sabse upar dikhne ke liye */
            width: 300px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
            pointer-events: none; /* Iske peeche screen par click ho sakega, freeze nahi hoga */
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            
            /* Smooth smooth entry animation */
            animation: ahmadPopupFadeIn 0.25s ease-out;
        }

        @keyframes ahmadPopupFadeIn {
            from { transform: translate(-50%, -45%); opacity: 0; }
            to { transform: translate(-50%, -50%); opacity: 1; }
        }
    </style>
    `;
}
