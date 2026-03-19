const REGISTER_URL = "https://forms.gle/DRBHYJRWQcVkqXD66";

const players = [
  {
    name: "aethr",
    links: [
      "https://www.tiktok.com/@aethr.rl"
    ],
    funFact: "I crashed into a pole snowboarding at 40 miles an hour",
    note: "MEOW"
  },
  {
    name: "Mouche",
    links: [
      "https://vm.tiktok.com/ZNR9rgXrv/"
    ],
    funFact: "I'm the best resetter",
    note: "i dont mind playing on the other persons servers so just use theirs :)"
  },
  {
    name: "GGM1 Shay Fanboy",
    links: [
      "@elyas_rl"
    ],
    funFact: "I've created my own mechanic: Horsedash reset ^^",
    note: "so you hate me"
  },
  {
    name: "Aeroh",
    links: [
      "https://www.twitch.tv/Aeroh",
      "https://youtube.com/@aerohrl",
      "https://www.tiktok.com/t/ZP8Xq2gdS/"
    ],
    funFact: "I made pule blythe",
    note: "my name is pronounced Arrow"
  },
  {
    name: "Txco",
    links: [
      "https://www.tiktok.com/@txcorl",
      "https://www.youtube.com/@TxcoRL"
    ],
    funFact: "I'm a left handed ginger",
    note: "i've changed settings so i might be a bit rusty, i'm KBM and play for Nixus"
  },
  {
    name: "Nevee",
    links: [
      "https://www.twitch.tv/astronevee",
      "https://youtube.com/@neveer",
      "https://www.tiktok.com/@nevee.rl"
    ],
    funFact: "I learned all of the country flags in the world and love geography",
    note: "Pronounced NEV-E (E like the alphabet)"
  },
  {
    name: "Nomad",
    links: [
      "https://www.youtube.com/@Nomadicalisticallycool"
    ],
    funFact: "I own the best unlimited boost freestyle team called Tide",
    note: "I play for Nixus and SwiFT"
  }
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setRegisterLinks(){
const links = ["#registerTopBtn","#registerHeroBtn","#registerFooterBtn","#registerPlayersBtn"]
.map(id => $(id))
.filter(Boolean);

links.forEach(a => a.setAttribute("href", REGISTER_URL));
}

function setYear(){
const y = new Date().getFullYear();
const els = $$("#yearNow");
els.forEach(el => el.textContent = y);
}

function initReveal(){
const io = new IntersectionObserver((entries) => {
entries.forEach(en => {
if(en.isIntersecting){
en.target.classList.add("show");
io.unobserve(en.target);
}
});
}, { threshold: 0.12 });

$$(".reveal").forEach(el => io.observe(el));
}

async function copyText(text){
try{
await navigator.clipboard.writeText(text);
return true;
}catch{
return false;
}
}

function initCopyButtons(){
const copySite = $("#copySiteLinkBtn");
if(copySite){
copySite.addEventListener("click", async () => {
const ok = await copyText(location.href);
copySite.textContent = ok ? "Copied!" : "Copy failed";
setTimeout(() => copySite.textContent = "Copy Site Link", 1200);
});
}

const copyForm = $("#copyFormLinkBtn");
if(copyForm){
copyForm.addEventListener("click", async () => {
const ok = await copyText(REGISTER_URL);
copyForm.textContent = ok ? "Copied!" : "Copy failed";
setTimeout(() => copyForm.textContent = "Copy Form Link", 1200);
});
}
}

function renderPlayers(){
const grid = $("#playersGrid");
if(!grid) return;

grid.innerHTML = "";

PLAYERS.forEach(p => {

const card = document.createElement("article");
card.className = "player-card reveal";

const links = [];

if(p.socials?.twitch) links.push(`<a href="${p.socials.twitch}" target="_blank">Twitch</a>`);
if(p.socials?.youtube) links.push(`<a href="${p.socials.youtube}" target="_blank">YouTube</a>`);
if(p.socials?.tiktok) links.push(`<a href="${p.socials.tiktok}" target="_blank">TikTok</a>`);

const linksHtml = links.length ? links.join(" • ") : `<span class="muted">No socials linked</span>`;

const noteHtml = p.note ? `<div class="player-note"><b>Note:</b> ${p.note}</div>` : "";

card.innerHTML = `

<div class="player-top">
<div>
<h3 class="player-name">${p.name}</h3>

<div class="badges">
<span class="badge-chip">🌍 ${p.region}</span>
<span class="badge-chip">✨ ${p.style}</span>
<span class="badge-chip">🖥️ ${p.platform}</span>
</div>

</div>

<div class="badge-chip">🌸 2026</div>
</div>

<div class="player-fun">
<b>Fun fact:</b> ${p.fun}
</div>

${noteHtml}

<div class="player-links">
${linksHtml}
</div>

`;

grid.appendChild(card);

});

const cnt = $("#playerCount");
if(cnt) cnt.textContent = PLAYERS.length;

initReveal();
}

function initBracketNoOp(){

const btn = $("#toggleWinnersBtn");

if(btn){

btn.addEventListener("click", (e) => {
e.preventDefault();
alert("Winners will be enabled once matches are played.");
});

}

}

function initCountdown(){

const daysEl = $("#days");
const hoursEl = $("#hours");
const minutesEl = $("#minutes");
const secondsEl = $("#seconds");

if(!daysEl) return;

const targetDate = new Date(2026,2,21,0,0,0);

function update(){

const now = new Date();

const diff = targetDate.getTime() - now.getTime();

if(diff <= 0){
daysEl.textContent = "00";
hoursEl.textContent = "00";
minutesEl.textContent = "00";
secondsEl.textContent = "00";
return;
}

const days = Math.floor(diff / (1000*60*60*24));
const hours = Math.floor((diff/(1000*60*60))%24);
const minutes = Math.floor((diff/(1000*60))%60);
const seconds = Math.floor((diff/1000)%60);

daysEl.textContent = String(days).padStart(2,"0");
hoursEl.textContent = String(hours).padStart(2,"0");
minutesEl.textContent = String(minutes).padStart(2,"0");
secondsEl.textContent = String(seconds).padStart(2,"0");

}

update();
setInterval(update,1000);

}

function boot(){

setYear();
setRegisterLinks();
initReveal();
initCopyButtons();
initCountdown();

if($("#playersGrid")){
renderPlayers();
}

if($("#toggleWinnersBtn")){
initBracketNoOp();
}

}

document.addEventListener("DOMContentLoaded", boot);
