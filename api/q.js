// api/qx-auth.js (Nayi Specialized API for Full Data Fetch & Save)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID required" });

    const dbURL = "https://reactions-maker-site-default-rtdb.firebaseio.com/users.json";

    // ─── HANDLING DATA SAVE (POST REQUEST) ───
    if (req.method === 'POST') {
        try {
            // Parser backup overlay check for raw text streams
            let payload = req.body;
            if (typeof payload === 'string') {
                payload = JSON.parse(payload);
            }

            // Pehle saara database fetch karenge taake existing user ki entry/key pata chal sake
            const fbRes = await fetch(dbURL);
            const fbData = await fbRes.json();
            
            let userFirebaseKey = null;
            if (fbData) {
                userFirebaseKey = Object.keys(fbData).find(key => fbData[key] && fbData[key].id === id);
            }

            let targetEndpoint;
            let methodType;

            if (userFirebaseKey) {
                // Agar user pehle se exist karta hai toh use direct select karke update (PATCH) karenge
                targetEndpoint = `https://reactions-maker-site-default-rtdb.firebaseio.com/users/${userFirebaseKey}.json`;
                methodType = "PATCH";
            } else {
                // Naya user hai toh seedha list mein insert (POST) karenge
                targetEndpoint = dbURL;
                methodType = "POST";
            }

            const saveRes = await fetch(targetEndpoint, {
                method: methodType,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!saveRes.ok) throw new Error("Firebase rejection");

            return res.status(200).json({ success: true, message: "Data synchronized successfully" });
        } catch (saveError) {
            console.error("Save processing failed:", saveError);
            return res.status(500).json({ error: "Internal Save Failure", details: saveError.message });
        }
    }

    // ─── HANDLING DATA FETCH (GET REQUEST) ───
    try {
        const fbRes = await fetch(dbURL);
        const fbData = await fbRes.json();

        if (!fbData) return res.status(404).json({ authorized: false });

        const userFound = Object.values(fbData).find(u => u.id === id);

        if (!userFound || userFound.status !== "active") {
            return res.status(200).json({ authorized: false });
        }

        return res.status(200).json({
            authorized: true,
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
            flag: userFound.flag || "pk",
            date: userFound.date || "",
            admin_note: userFound.admin_note || "",
            trader_id: userFound.trader_id || "",
            status: userFound.status,
            permissions: userFound.permissions || {}
        });

    } catch (error) {
        return res.status(500).json({ error: "Database Connection Failed" });
    }
}
