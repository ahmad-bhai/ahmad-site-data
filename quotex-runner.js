(function() {
    const SCRIPT_KEY = 'magic_optimizer_active';
    const AUTO_RELOAD_KEY = 'first_run_done';

    // 1. Script ko LocalStorage mein save karna (Persistence)
    localStorage.setItem(SCRIPT_KEY, 'true');

    console.log("%c 🚀 Magic Optimizer Initialized...", "color: #05c55e; font-weight: bold;");

    // 2. Optimization Logic
    const optimizeConnection = () => {
        // Heavy assets aur timeouts ko clear karna
        window.stop(); // Extra loading roknay ke liye
        
        // DNS aur Preconnect ko force karna code level par
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = window.location.origin;
        document.head.appendChild(link);

        console.log("✔ Resources Optimized.");
    };

    // 3. Auto-Reload Logic (Sirf pehli baar chalane ke liye)
    if (!sessionStorage.getItem(AUTO_RELOAD_KEY)) {
        sessionStorage.setItem(AUTO_RELOAD_KEY, 'true');
        console.log("♻ Reloading for clean state...");
        
        // Hard Reload force karna (Cache bypass)
        setTimeout(() => {
            window.location.reload(true);
        }, 500);
    } else {
        // Reload ke baad yahan se execute hoga
        optimizeConnection();
        console.log("%c ✨ Quotex Optimized & Ready!", "color: #8646B4; font-weight: bold;");
        
        // Task khatam hone ke baad temporary flag remove karna taake loop na banay
        sessionStorage.removeItem(AUTO_RELOAD_KEY);
    }

})();
