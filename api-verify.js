const axios = require('axios');
const crypto = require('crypto');

export default async function handler(req, res) {
    const { txid, uid } = req.query;

    // Vercel Settings > Environment Variables mein ye keys save karein
    const API_KEY = process.env.YCUh4RRX4TSUluybJUjqDaGiNgrUtBh5uIhyIL7yac3IOurswNEt0AewnIUXxv4J;
    const API_SECRET = process.env.VUbL3HrAld0t2t4M7O3v1Xpmg4L0k8CM9dhcGnhFYx02uyKexznBpGLDN9od8I8A;

    if (!txid || !uid) return res.status(400).json({ success: false });

    // Binance Pay History Check karne ka waqt aur signature
    const endpoint = 'https://api.binance.com/sapi/v1/pay/transactions';
    const timestamp = Date.now();
    const query = `timestamp=${timestamp}`;
    const signature = crypto.createHmac('sha256', API_SECRET).update(query).digest('hex');

    try {
        const response = await axios.get(`${endpoint}?${query}&signature=${signature}`, {
            headers: { 'X-MBX-APIKEY': API_KEY }
        });

        const txs = response.data.data;
        // Check: Kya TxID match hai aur status SUCCESS hai?
        const isPaid = txs.find(t => (t.transactionId === txid) && t.status === 'SUCCESS');

        if (isPaid) {
            res.status(200).json({ success: true });
        } else {
            res.status(200).json({ success: false, msg: "Not found on Binance" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "API Error" });
    }
}
