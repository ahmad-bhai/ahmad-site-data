// api/qx.js (Vercel Serverless Node.js Function)

export default async function handler(req, res) {
    const { vid, url, dash, win } = req.query;

    // 1. Check ID (vid) status
    if (!vid) {
        return res.status(400).send("vid required");
    }

    const dbURL = "https://reactions-maker-site-default-rtdb.firebaseio.com/users.json";
    const baseURL = "https://ahmad-bhai-scripts.vercel.app/";

    try {
        // Firebase se users verify karein
        const fbRes = await fetch(dbURL);
        const fbData = await fbRes.json();
        const userData = fbData ? Object.values(fbData).find(u => u.id === vid) : null;

        // Agar user register nahi hai to direct Lock Screen return karein (No code injection)
        if (!userData) {
            return res.status(200).send(getLockScreenHTML(vid));
        }

        // 2. Server-side Routing Logic (Exact Luv Scripts System)
        let targetFile = null;
        let routeKey = null;

        const targetUrl = url ? url.toLowerCase() : "";

        if (dash === 'true') {
            targetFile = "BLS.html";
            routeKey = "lb";
        } 
        else if (win === 'true') {
            targetFile = "winis.html";
            routeKey = "win";
        } 
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
        else if (targetUrl.includes("demo-trade") || targetUrl.includes("/trade")) {
            // User-Agent Header se check karein ki device mobile hai ya desktop
            const userAgent = req.headers['user-agent'] || "";
            const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            
            targetFile = isMobile ? "androidis.html" : "pcis.html";
            routeKey = isMobile ? "android" : "pc";
        }

        // Agar permission false hai tab bhi lock dikhao
        if (userData.permissions && userData.permissions[routeKey] === false) {
            return res.status(200).send(getLockScreenHTML(vid));
        }

        // Agar koi page ya element match nahi hua
        if (!targetFile) {
            return res.status(400).send("⚠️ APPLY ON CORRECT URL ⚠️");
        }

        // 3. File Fetch and Output (Directly server se response)
        const fileRes = await fetch(baseURL + targetFile);
        if (!fileRes.ok) throw new Error("File not found on backend source");
        
        const htmlContent = await fileRes.text();
        
        // Response format set karein aur raw HTML return kar dein
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(htmlContent);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

// Lock Screen Helper Function (Aapka pure custom design)
function getLockScreenHTML(uid) {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Locked</title>
        <style>
            body { background: #0c0a1c; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin:0; }
            .box { text-align: center; padding: 30px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; width: 320px; }
            .btn { display: inline-block; background: #229ed9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold;}
            .id-box { background: rgba(255,255,255,0.08); padding: 10px; border-radius: 6px; margin: 15px 0; word-break: break-all; }
        </style>
    </head>
    <body>
        <div class="box">
            <h2>MAGIC SCRIPTS</h2>
            <div style="color: #DC8DE6;">🔒 LOCKED 🔒</div>
            <p>ID:</p>
            <div class="id-box">${uid}</div>
            <a href="https://t.me/Magic_Scripts" target="_blank" class="btn">🚀 Telegram @Magic_Scripts</a>
        </div>
    </body>
    </html>`;
          }
