const REGISTER_URL = "https://forms.gle/DRBHYJRWQcVkqXD66";

const PLAYERS = [
  {
    name: "GGM1 Shay Fanboy",
    region: "NA",
    style: "Creative",
    fun: "I'm a left handed ginger",
    platform: "PC",
    socials: { twitch: "", youtube: "", tiktok: "" }
  },
  {
    name: "To Be Determined",
    region: "TBD",
    style: "TBD",
    fun: "Will be finalized on event day or bracket day.",
    platform: "TBD",
    socials: { twitch: "", youtube: "", tiktok: "" }
  },
  {
    name: "To Be Determined",
    region: "TBD",
    style: "TBD",
    fun: "Will be finalized on event day or bracket day.",
    platform: "TBD",
    socials: { twitch: "", youtube: "", tiktok: "" }
  },
  {
    name: "To Be Determined",
    region: "TBD",
    style: "TBD",
    fun: "Will be finalized on event day or bracket day.",
    platform: "TBD",
    socials: { twitch: "", youtube: "", tiktok: "" }
  }
];

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
  const list = [...PLAYERS];

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "player-card reveal";
    card.dataset.region = p.region;
    card.dataset.style = p.style;
    card.dataset.search = `${p.name} ${p.region} ${p.style} ${p.fun} ${p.platform}`.toLowerCase();

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
            <span class="badge-chip">🖥️ ${p.platform}</span>
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
  if(cnt) cnt.textContent = "1";

  initReveal();
}

function applyPlayerFilters(){
  const grid = $("#playersGrid");
  if(!grid) return;

  const q = ($("#playerSearch")?.value || "").trim().toLowerCase();
  const region = $("#regionFilter")?.value || "all";
  const style = $("#styleFilter")?.value || "all";

  $$(".player-card", grid).forEach(card => {
    const cardRegion = card.dataset.region;
    const cardStyle = card.dataset.style;

    const matchesQ = !q || card.dataset.search.includes(q);
    const matchesR = (region === "all") || (cardRegion === region);
    const matchesS = (style === "all") || (cardStyle === style);
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

  if(!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetDate = new Date("2026-03-21T00:00:00");

  function updateCountdown(){
    const now = new Date();
    const diff = targetDate - now;

    if(diff <= 0){
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function boot(){
  setYear();
  setRegisterLinks();
  initReveal();
  initCopyButtons();
  initCountdown();

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
