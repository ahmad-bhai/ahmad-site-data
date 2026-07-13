// api/qx-auth.js (Nayi Specialized API for Full Data Fetch)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID required" });

    // Aapka asli Firebase Realtime Database URL
    const dbURL = "https://reactions-maker-site-default-rtdb.firebaseio.com/users.json";

    try {
        const fbRes = await fetch(dbURL);
        const fbData = await fbRes.json();

        if (!fbData) return res.status(404).json({ authorized: false });

        // Poore data mein se sirf us user ka record dhoondna jiski ID match ho rahi hai
        const userFound = Object.values(fbData).find(u => u.id === id);

        if (!userFound || userFound.status !== "active") {
            return res.status(200).json({ authorized: false });
        }

        // 🔥 Full JSON Response - Saare fields ke sath (Flag, Date, Admin Note, Permissions, etc.)
        return res.status(200).json({
            authorized: true,
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
            flag: userFound.flag || "",         // Firebase se "pk", "in", etc. uthayega
            date: userFound.date || "",         // System validation register date
            admin_note: userFound.admin_note || "", // "Ahmad Bhai" ya koi bhi custom note
            trader_id: userFound.trader_id || "", // Trader target application validation ID
            status: userFound.status,           // user status like "active"
            permissions: userFound.permissions || {
                "ana": false,
                "android": false,
                "lb": false,
                "p": false,
                "pc": false,
                "t": false,
                "win": false
            }
        });

    } catch (error) {
        console.error("Auth Engine Error:", error);
        return res.status(500).json({ error: "Database Connection Failed" });
    }
}
