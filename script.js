// ============================
// Spring Fest Freestyle Tourney 2026
// Edit these values and you're done.
// ============================

const REGISTER_URL = "PASTE_YOUR_GOOGLE_FORM_LINK_HERE";

// Demo players (edit these to your real participants)
const PLAYERS = [
  { name: "Player 1", region: "NA", style: "Resets", fun: "Collects Hot Wheels. Hits clean doubles.", socials: { twitch: "", youtube: "", tiktok: "" } },
  { name: "Player 2", region: "EU", style: "Creative", fun: "Sleeper pick. Loves weird angles.", socials: { twitch: "", youtube: "", tiktok: "" } },
  { name: "Player 3", region: "NA", style: "Musty", fun: "Musty merchant. Still classy with it.", socials: { twitch: "", youtube: "", tiktok: "" } },
  { name: "Player 4", region: "OCE", style: "Ground", fun: "Ground god. Reads are insane.", socials: { twitch: "", youtube: "", tiktok: "" } },
  { name: "Player 5", region: "SAM", style: "Ceiling", fun: "Ceiling setups all day.", socials: { twitch: "", youtube: "", tiktok: "" } },
  { name: "Player 6", region: "EU", style: "Pinch", fun: "Pinch enjoyer. Absolute menace.", socials: { twitch: "", youtube: "", tiktok: "" } },
  { name: "Player 7", region: "ME", style: "Resets", fun: "Fast setups, clean finishes.", socials: { twitch: "", youtube: "", tiktok: "" } },
  { name: "Player 8", region: "NA", style: "Creative", fun: "Clip scientist. Always cooking.", socials: { twitch: "", youtube: "", tiktok: "" } },
];

// ---- helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function safeOpen(url){
  if(!url || url.includes("PASTE_YOUR_GOOGLE_FORM_LINK_HERE")) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function setRegisterLinks(){
  const links = ["#registerTopBtn", "#registerHeroBtn", "#registerFooterBtn", "#registerPlayersBtn"]
    .map(id => $(id))
    .filter(Boolean);

  links.forEach(a => {
    a.setAttribute("href", REGISTER_URL);
    a.addEventListener("click", (e) => {
      if(!REGISTER_URL || REGISTER_URL.includes("PASTE_YOUR_GOOGLE_FORM_LINK_HERE")){
        e.preventDefault();
        alert("Paste your Google Form link in script.js (REGISTER_URL) first.");
      }
    });
  });
}

function setYear(){
  const y = new Date().getFullYear();
  const el = $("#yearNow");
  if(el) el.textContent = y;
}

// ---- reveal on scroll
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

// ============================
// Bracket interactions
// ============================

function fillBracketFromPlayers(){
  const bracketEl = $("#bracketEl");
  if(!bracketEl) return;

  const round1Matches = ["r1m1","r1m2","r1m3","r1m4"];
  const slots = [];

  round1Matches.forEach((mKey, i) => {
    const match = bracketEl.querySelector(`[data-match="${mKey}"]`);
    if(!match) return;
    const a = match.querySelector(`.slot[data-slot="a"] .name`);
    const b = match.querySelector(`.slot[data-slot="b"] .name`);
    slots.push({ el: a, idx: i*2 });
    slots.push({ el: b, idx: i*2+1 });
  });

  slots.forEach(s => {
    const p = PLAYERS[s.idx];
    if(p && s.el) s.el.textContent = p.name;
  });
}

function initWinners(){
  const bracketEl = $("#bracketEl");
  if(!bracketEl) return;

  // click a slot to mark winner for that match
  $$(".match", bracketEl).forEach(match => {
    const slotBtns = $$(".slot", match);
    slotBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        slotBtns.forEach(b => b.classList.remove("winner"));
        btn.classList.add("winner");
        propagateWinners();
        drawBracketLines();
      });
    });
  });
}

function getWinnerName(matchEl){
  const w = matchEl.querySelector(".slot.winner .name");
  return w ? w.textContent.trim() : "";
}

function propagateWinners(){
  const bracketEl = $("#bracketEl");
  if(!bracketEl) return;

  const r1m1 = bracketEl.querySelector(`[data-match="r1m1"]`);
  const r1m2 = bracketEl.querySelector(`[data-match="r1m2"]`);
  const r1m3 = bracketEl.querySelector(`[data-match="r1m3"]`);
  const r1m4 = bracketEl.querySelector(`[data-match="r1m4"]`);

  const r2m1 = bracketEl.querySelector(`[data-match="r2m1"]`);
  const r2m2 = bracketEl.querySelector(`[data-match="r2m2"]`);

  const r3m1 = bracketEl.querySelector(`[data-match="r3m1"]`);

  // Semis placeholders
  if(r2m1){
    const a = r2m1.querySelector(`.slot[data-slot="a"] .name`);
    const b = r2m1.querySelector(`.slot[data-slot="b"] .name`);
    if(a) a.textContent = getWinnerName(r1m1) || "Winner R1M1";
    if(b) b.textContent = getWinnerName(r1m2) || "Winner R1M2";
    // reset semi winner if no longer valid
    if(!getWinnerName(r1m1) && !getWinnerName(r1m2)){
      $$(".slot", r2m1).forEach(s => s.classList.remove("winner"));
    }
  }

  if(r2m2){
    const a = r2m2.querySelector(`.slot[data-slot="a"] .name`);
    const b = r2m2.querySelector(`.slot[data-slot="b"] .name`);
    if(a) a.textContent = getWinnerName(r1m3) || "Winner R1M3";
    if(b) b.textContent = getWinnerName(r1m4) || "Winner R1M4";
    if(!getWinnerName(r1m3) && !getWinnerName(r1m4)){
      $$(".slot", r2m2).forEach(s => s.classList.remove("winner"));
    }
  }

  // Finals placeholders
  if(r3m1){
    const a = r3m1.querySelector(`.slot[data-slot="a"] .name`);
    const b = r3m1.querySelector(`.slot[data-slot="b"] .name`);
    if(a) a.textContent = getWinnerName(r2m1) || "Winner Semi 1";
    if(b) b.textContent = getWinnerName(r2m2) || "Winner Semi 2";
  }

  // Champion box
  const champ = $("#championName");
  const champName = r3m1 ? getWinnerName(r3m1) : "";
  if(champ) champ.textContent = champName || "TBD";
}

function resetDemoBracket(){
  const bracketEl = $("#bracketEl");
  if(!bracketEl) return;

  // reset winners
  $$(".slot", bracketEl).forEach(s => s.classList.remove("winner"));

  // reset placeholders then refill
  fillBracketFromPlayers();
  propagateWinners();
  drawBracketLines();
}

function toggleWinners(){
  const bracketEl = $("#bracketEl");
  if(!bracketEl) return;

  const winners = $$(".slot.winner", bracketEl);
  if(winners.length){
    winners.forEach(w => w.classList.remove("winner"));
    propagateWinners();
    drawBracketLines();
    return;
  }

  // set random winners for demo
  $$(".match", bracketEl).forEach(match => {
    const slots = $$(".slot", match);
    if(slots.length === 2){
      const pick = Math.random() < 0.5 ? slots[0] : slots[1];
      pick.classList.add("winner");
    }
  });
  propagateWinners();
  drawBracketLines();
}

// ============================
// Bracket connecting lines (canvas)
// ============================

function drawBracketLines(){
  const bracket = $("#bracketEl");
  const canvas = $("#bracketLines");
  if(!bracket || !canvas) return;

  const rect = bracket.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0,0,rect.width,rect.height);

  // no custom colors per instruction? (this is CSS canvas, not matplotlib, so safe)
  // We'll keep it subtle using current text color with low opacity.
  ctx.strokeStyle = "rgba(31,36,48,0.18)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  // draw connection from R1 winners to Semis, Semis winners to Finals
  const pairs = [
    // r1 -> r2
    { fromMatch:"r1m1", toMatch:"r2m1", toSlot:"a" },
    { fromMatch:"r1m2", toMatch:"r2m1", toSlot:"b" },
    { fromMatch:"r1m3", toMatch:"r2m2", toSlot:"a" },
    { fromMatch:"r1m4", toMatch:"r2m2", toSlot:"b" },
    // r2 -> r3
    { fromMatch:"r2m1", toMatch:"r3m1", toSlot:"a" },
    { fromMatch:"r2m2", toMatch:"r3m1", toSlot:"b" },
  ];

  for(const p of pairs){
    const from = bracket.querySelector(`[data-match="${p.fromMatch}"] .slot.winner`);
    const to = bracket.querySelector(`[data-match="${p.toMatch}"] .slot[data-slot="${p.toSlot}"]`);
    if(!from || !to) continue;

    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();

    const ax = (a.right - rect.left);
    const ay = (a.top + a.height/2 - rect.top);

    const bx = (b.left - rect.left);
    const by = (b.top + b.height/2 - rect.top);

    const mid = (ax + bx) / 2;

    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.bezierCurveTo(mid, ay, mid, by, bx, by);
    ctx.stroke();
  }
}

function initBracketButtons(){
  const resetBtn = $("#resetBracketBtn");
  if(resetBtn) resetBtn.addEventListener("click", resetDemoBracket);

  const toggleBtn = $("#toggleWinnersBtn");
  if(toggleBtn) toggleBtn.addEventListener("click", toggleWinners);

  window.addEventListener("resize", () => drawBracketLines());
}

// ============================
// Players page
// ============================

function renderPlayers(){
  const grid = $("#playersGrid");
  if(!grid) return;

  grid.innerHTML = "";
  const list = [...PLAYERS];

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "player-card reveal";
    card.dataset.region = p.region;
    card.dataset.style = p.style;
    card.dataset.search = `${p.name} ${p.region} ${p.style} ${p.fun}`.toLowerCase();

    const links = [];
    if(p.socials?.twitch) links.push(`<a href="${p.socials.twitch}" target="_blank" rel="noreferrer">Twitch</a>`);
    if(p.socials?.youtube) links.push(`<a href="${p.socials.youtube}" target="_blank" rel="noreferrer">YouTube</a>`);
    if(p.socials?.tiktok) links.push(`<a href="${p.socials.tiktok}" target="_blank" rel="noreferrer">TikTok</a>`);
    const linksHtml = links.length ? links.join(" • ") : `<span class="muted">No socials linked yet</span>`;

    card.innerHTML = `
      <div class="player-top">
        <div>
          <h3 class="player-name">${p.name}</h3>
          <div class="badges">
            <span class="badge-chip">🌍 ${p.region}</span>
            <span class="badge-chip">✨ ${p.style}</span>
          </div>
        </div>
        <div class="badge-chip">🌸 2026</div>
      </div>
      <div class="player-fun"><b>Fun fact:</b> ${p.fun}</div>
      <div class="player-links">${linksHtml}</div>
    `;

    grid.appendChild(card);
  });

  const cnt = $("#playerCount");
  if(cnt) cnt.textContent = String(PLAYERS.length);

  // re-run reveal on newly injected nodes
  initReveal();
}

function applyPlayerFilters(){
  const grid = $("#playersGrid");
  if(!grid) return;

  const q = ($("#playerSearch")?.value || "").trim().toLowerCase();
  const region = $("#regionFilter")?.value || "all";
  const style = $("#styleFilter")?.value || "all";

  $$(".player-card", grid).forEach(card => {
    const matchesQ = !q || card.dataset.search.includes(q);
    const matchesR = (region === "all") || (card.dataset.region === region);
    const matchesS = (style === "all") || (card.dataset.style === style);
    card.style.display = (matchesQ && matchesR && matchesS) ? "" : "none";
  });
}

function initPlayersControls(){
  const search = $("#playerSearch");
  if(search) search.addEventListener("input", applyPlayerFilters);

  const rf = $("#regionFilter");
  if(rf) rf.addEventListener("change", applyPlayerFilters);

  const sf = $("#styleFilter");
  if(sf) sf.addEventListener("change", applyPlayerFilters);

  const shuffleBtn = $("#shufflePlayersBtn");
  if(shuffleBtn){
    shuffleBtn.addEventListener("click", () => {
      // fisher-yates
      for(let i=PLAYERS.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [PLAYERS[i], PLAYERS[j]] = [PLAYERS[j], PLAYERS[i]];
      }
      renderPlayers();
      applyPlayerFilters();
    });
  }

  const compactBtn = $("#toggleCompactBtn");
  if(compactBtn){
    compactBtn.addEventListener("click", () => {
      const grid = $("#playersGrid");
      if(grid) grid.classList.toggle("compact");
    });
  }
}

// ============================
// Copy buttons
// ============================

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch(e){
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
      if(!REGISTER_URL || REGISTER_URL.includes("PASTE_YOUR_GOOGLE_FORM_LINK_HERE")){
        alert("Paste your Google Form link in script.js (REGISTER_URL) first.");
        return;
      }
      const ok = await copyText(REGISTER_URL);
      copyForm.textContent = ok ? "Copied!" : "Copy failed";
      setTimeout(() => copyForm.textContent = "Copy Form Link", 1200);
    });
  }

  const copyQuestionsBtn = $("#copyQuestionsBtn");
  const copyQuestionsStatus = $("#copyQuestionsStatus");
  if(copyQuestionsBtn){
    copyQuestionsBtn.addEventListener("click", async () => {
      const questions = $$(".q").map(q => q.textContent.trim()).join("\n");
      const ok = await copyText(questions);
      if(copyQuestionsStatus) copyQuestionsStatus.textContent = ok ? "Copied questions ✅" : "Copy failed ❌";
      setTimeout(() => { if(copyQuestionsStatus) copyQuestionsStatus.textContent = ""; }, 1500);
    });
  }
}

// ============================
// Boot
// ============================

function boot(){
  setYear();
  setRegisterLinks();
  initReveal();
  initCopyButtons();

  // Home page only
  if($("#bracketEl")){
    fillBracketFromPlayers();
    initWinners();
    propagateWinners();
    initBracketButtons();
    // draw after layout settles
    setTimeout(drawBracketLines, 50);
  }

  // Players page only
  if($("#playersGrid")){
    renderPlayers();
    initPlayersControls();
    applyPlayerFilters();
  }
}

document.addEventListener("DOMContentLoaded", boot);
