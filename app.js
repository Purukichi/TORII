(() => {
  const STORAGE_KEY = "pgate.followed.v2";
  const DATA = window.PGATE_DATA || [];

  const $ = (id) => document.getElementById(id);
  const grid = $("grid");
  const modal = $("modal");

  const state = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  const gateKey = (p, g) => `${p.id}::${g.svc}::${g.handle}`;
  const isFollowed = (p, g) => !!state[gateKey(p, g)];
  const setFollowed = (p, g, v) => { v ? state[gateKey(p, g)] = Date.now() : delete state[gateKey(p, g)]; save(); };
  const clearedCount = (p) => p.gates.filter((g) => isFollowed(p, g)).length;
  const isUnlocked = (p) => clearedCount(p) === p.gates.length;

  const pad2 = (n) => String(n).padStart(2, "0");
  const use = (id, cls = "") => `<svg class="${cls}"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

  /* ---------- grid ---------- */
  function renderGrid() {
    grid.innerHTML = "";
    DATA.forEach((p, i) => grid.appendChild(card(p, i)));
    const unlocked = DATA.filter(isUnlocked).length;
    $("counterNum").textContent = pad2(unlocked);
    $("counterTotal").textContent = pad2(DATA.length);
    $("indexCount").textContent = pad2(DATA.length);
  }

  function card(p, i) {
    const unlocked = isUnlocked(p);
    const done = clearedCount(p);
    const total = p.gates.length;
    const el = document.createElement("button");
    el.className = `card ${unlocked ? "unlocked" : "locked"}`;
    el.setAttribute("aria-label", p.title);
    el.innerHTML = `
      <div class="card-img">
        <img src="${esc(p.cover)}" alt="" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling && (this.nextElementSibling.style.display='grid')">
        <div class="pl" style="display:none">${esc(p.cover)}</div>
        <div class="ribbon">№ ${pad2(i + 1)}</div>
        <div class="lockmark">${use(unlocked ? "i-unlock" : "i-lock")}</div>
      </div>
      <div class="card-meta">
        <div class="card-title">
          <span class="t">${esc(p.title)}</span>
          <span class="n">${pad2(done)}/${pad2(total)}</span>
        </div>
        <div class="card-svcs">
          ${p.gates.map(g => `<span class="svc-pip ${isFollowed(p, g) ? "done" : ""}">${use("i-" + g.svc)}</span>`).join("")}
        </div>
        <div class="card-bar"><i style="width:${(done / total) * 100}%"></i></div>
      </div>
    `;
    el.addEventListener("click", () => openModal(p, i));
    return el;
  }

  /* ---------- modal ---------- */
  let active = null;
  let activeIdx = 0;

  function openModal(p, i) {
    active = p; activeIdx = i;
    paint();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.hidden = true;
    active = null;
    document.body.style.overflow = "";
    renderGrid();
  }

  function paint() {
    const p = active;
    if (!p) return;
    const unlocked = isUnlocked(p);
    modal.classList.toggle("unlocked", unlocked);
    modal.classList.toggle("locked", !unlocked);

    $("mIndex").textContent = `№ ${pad2(activeIdx + 1)}`;
    $("mTitle").textContent = p.title;

    const cov = $("mCover");
    cov.innerHTML = `
      <img src="${esc(p.cover)}" alt="">
      <div class="stamp">${use(unlocked ? "i-unlock" : "i-lock")}<span>${unlocked ? "UNLOCKED" : "LOCKED"}</span></div>
    `;

    const done = clearedCount(p), total = p.gates.length;
    $("mDone").textContent = pad2(done);
    $("mTotal").textContent = pad2(total);

    const list = $("mGates");
    list.innerHTML = p.gates.map((g, gi) => `
      <li class="gate ${isFollowed(p, g) ? "done" : "pending"}" data-i="${gi}">
        <div class="gate-svc">${use("i-" + g.svc)}</div>
        <div class="gate-info">
          <div class="h">${esc(g.handle)}</div>
          <div class="s">${g.svc === "x" ? "X" : "YOUTUBE"}</div>
        </div>
        <div class="gate-act">${use(isFollowed(p, g) ? "i-check" : "i-arrow")}</div>
      </li>
    `).join("");
    list.querySelectorAll(".gate").forEach((row) => {
      row.addEventListener("click", () => {
        const g = p.gates[+row.dataset.i];
        onGateClick(p, g, row);
      });
    });

    $("mDlState").textContent = unlocked ? "UNLOCKED" : "LOCKED";
    const dl = $("mDownloads");
    const fname = (src) => src.split("/").pop();
    dl.innerHTML = p.files.map((f) => `
      <li>
        <a class="dl" ${unlocked ? `href="${esc(f.src)}" download` : `aria-disabled="true"`}>
          <div class="dl-thumb"><img src="${esc(f.src)}" alt="" loading="lazy"></div>
          <div class="dl-info">
            <div class="h">${esc(f.label)}</div>
            <div class="s">${esc(f.size)} &middot; ${esc(fname(f.src))}</div>
          </div>
          <div class="dl-act">${use(unlocked ? "i-dl" : "i-lock")}</div>
        </a>
      </li>
    `).join("");
  }

  /* gate click flow */
  const armed = new WeakMap();
  function onGateClick(p, g, row) {
    if (isFollowed(p, g)) {
      setFollowed(p, g, false);
      paint();
      return;
    }
    window.open(g.url, "_blank", "noopener");
    armed.set(row, { p, g });
  }
  function confirmArmed() {
    if (!active) return;
    let changed = false;
    document.querySelectorAll(".gate").forEach((row) => {
      const a = armed.get(row);
      if (a) { setFollowed(a.p, a.g, true); armed.delete(row); changed = true; }
    });
    if (changed) paint();
  }
  window.addEventListener("focus", confirmArmed);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) confirmArmed(); });

  /* close handlers */
  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && "close" in t.dataset) closeModal();
    if (t && t.closest && t.closest("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  /* reset */
  $("resetBtn").addEventListener("click", () => {
    Object.keys(state).forEach((k) => delete state[k]);
    save();
    renderGrid();
    if (!modal.hidden) paint();
  });

  renderGrid();
})();
