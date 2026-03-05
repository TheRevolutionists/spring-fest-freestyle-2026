// ============================
// Spring Fest Freestyle Tourney 2026
// ============================

const REGISTER_URL = "https://forms.gle/DRBHYJRWQcVkqXD66";

// Demo players (edit these later)
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

function setRegisterLinks(){
  const links = ["#registerTopBtn", "#registerHeroBtn", "#registerFooterBtn", "#registerPlayersBtn"]
    .map(id => $(id))
    .filter(Boolean);

  links.forEach(a => a.setAttribute("href", REGISTER_URL));
}

function setYear(){
  const y = new Date().getFullYear();
  const els = $$("#yearNow");
  els.forEach(el => el.textContent = y);
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

// ---- copy buttons
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

// ============================
// Players page rendering
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
// Bracket: Toggle winners does nothing (for now)
// ============================

function initBracketNoOp(){
  const btn = $("#toggleWinnersBtn");
  if(btn){
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // Button is disabled in HTML anyway; this is just extra protection.
      alert("Winners will be enabled once matches are played.");
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

  if($("#playersGrid")){
    renderPlayers();
    initPlayersControls();
    applyPlayerFilters();
  }

  if($("#toggleWinnersBtn")){
    initBracketNoOp();
  }
}

document.addEventListener("DOMContentLoaded", boot);
