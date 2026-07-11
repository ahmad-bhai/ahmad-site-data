// api/save.js - Vercel Serverless Function
import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id, name, trader_id, email, flag } = req.body;

    if (!id) {
        return res.status(400).send("MISSING_ID");
    }

    const firebaseUrl = "https://reactions-maker-site-default-rtdb.firebaseio.com/users.json";

    try {
        // Step 1: Poora database read karke us unique 20-digit dynamic ID ki firebase key nikalna
        const response = await fetch(firebaseUrl);
        const allUsers = await response.json();

        let targetFirebaseKey = null;

        if (allUsers) {
            for (let firebaseKey in allUsers) {
                if (allUsers[firebaseKey].id === id) {
                    targetFirebaseKey = firebaseKey; // Jaise "-OxH0FzskQjYLtKAIs-p" mil gaya
                    break;
                }
            }
        }

        // Agar user pehle se database mein mojood hai toh target point update karenge
        if (targetFirebaseKey) {
            const updateUrl = `https://reactions-maker-site-default-rtdb.firebaseio.com/users/${targetFirebaseKey}.json`;
            
            // Structured entry jo json format aapne diya uske mutabik overwrite karegi
            const patchRes = await fetch(updateUrl, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    trader_id: trader_id,
                    email: email,
                    flag: flag,
                    date: new Date().toLocaleDateString('en-US') // 7/11/2026 update tracking
                })
            });

            if (patchRes.ok) {
                return res.status(200).send("OK");
            }
        }

        return res.status(404).send("USER_NOT_FOUND_IN_DB");

    } catch (error) {
        console.error(error);
        return res.status(500).send("SERVER_ERROR");
    }
}
