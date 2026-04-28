(() => {
  const STORAGE_KEY = "pgate.followed.v1";
  const DATA = window.PGATE_DATA || [];

  const grid = document.getElementById("grid");
  const modal = document.getElementById("modal");
  const counterNum = document.getElementById("counterNum");
  const counterTotal = document.getElementById("counterTotal");
  const resetBtn = document.getElementById("resetBtn");

  const state = loadState();

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function gateKey(p, g) {
    return `${p.id}::${g.svc}::${g.handle}`;
  }
  function isFollowed(p, g) {
    return !!state[gateKey(p, g)];
  }
  function setFollowed(p, g, v) {
    if (v) state[gateKey(p, g)] = Date.now();
    else delete state[gateKey(p, g)];
    saveState();
  }
  function isUnlocked(p) {
    return p.gates.every((g) => isFollowed(p, g));
  }
  function followedCount(p) {
    return p.gates.filter((g) => isFollowed(p, g)).length;
  }

  function svgUse(id, cls = "") {
    return `<svg class="${cls}"><use href="#${id}"/></svg>`;
  }

  function kindGlyph(kind) {
    return ({ music: "i-music", art: "i-art", video: "i-video", data: "i-data" })[kind] || "i-data";
  }

  function renderGrid() {
    grid.innerHTML = "";
    DATA.forEach((p) => grid.appendChild(renderCard(p)));
    const unlocked = DATA.filter(isUnlocked).length;
    counterNum.textContent = unlocked;
    counterTotal.textContent = DATA.length;
  }

  function renderCard(p) {
    const unlocked = isUnlocked(p);
    const done = followedCount(p);
    const total = p.gates.length;

    const el = document.createElement("button");
    el.className = `card ${unlocked ? "unlocked" : "locked"}`;
    el.style.setProperty("--c1", p.c1);
    el.style.setProperty("--c2", p.c2);
    el.setAttribute("aria-label", p.id);

    el.innerHTML = `
      <div class="card-cover">
        ${svgUse(kindGlyph(p.kind), "glyph")}
      </div>
      <div class="card-overlay">
        <div class="lock-badge">
          ${svgUse(unlocked ? "i-unlock" : "i-lock")}
        </div>
        <div class="gate-row">
          ${p.gates
            .map(
              (g) =>
                `<span class="gate-chip ${isFollowed(p, g) ? "done" : ""}" data-svc="${g.svc}">
                   ${svgUse("i-" + g.svc)}
                 </span>`
            )
            .join("")}
        </div>
      </div>
      <div class="progress"><i style="width:${(done / total) * 100}%"></i></div>
    `;

    el.addEventListener("click", () => openModal(p));
    return el;
  }

  /* ===== Modal ===== */
  let activeProduct = null;

  function openModal(p) {
    activeProduct = p;
    paintModal();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.hidden = true;
    activeProduct = null;
    document.body.style.overflow = "";
    renderGrid();
  }

  function paintModal() {
    const p = activeProduct;
    if (!p) return;
    const unlocked = isUnlocked(p);
    modal.classList.toggle("unlocked", unlocked);
    modal.classList.toggle("locked", !unlocked);

    const cover = document.getElementById("mCover");
    cover.className = "cover";
    cover.style.setProperty("--c1", p.c1);
    cover.style.setProperty("--c2", p.c2);
    cover.innerHTML = svgUse(kindGlyph(p.kind), "glyph");

    const stateEl = document.getElementById("mState");
    stateEl.innerHTML = svgUse(unlocked ? "i-unlock" : "i-lock", "lock-icon");

    const gates = document.getElementById("mGates");
    gates.innerHTML = p.gates.map((g, i) => renderGate(p, g, i)).join("");

    gates.querySelectorAll(".gate").forEach((row, i) => {
      const g = p.gates[i];
      row.addEventListener("click", () => onGateClick(p, g, row));
    });

    const reward = document.getElementById("mReward");
    const link = document.getElementById("mRewardLink");
    if (unlocked) {
      reward.hidden = false;
      link.href = p.reward;
    } else {
      reward.hidden = true;
      link.removeAttribute("href");
    }
  }

  function renderGate(p, g, i) {
    const followed = isFollowed(p, g);
    const initials = (g.handle || "?").replace(/[@_.]/g, "").slice(0, 2).toUpperCase();
    return `
      <div class="gate ${followed ? "done" : "pending"}"
           style="--ac1:${g.ac1 || "#444"};--ac2:${g.ac2 || "#222"}"
           data-i="${i}">
        <div class="svc" data-svc="${g.svc}">${svgUse("i-" + g.svc)}</div>
        <div class="handle">
          <div class="avatar" style="background:linear-gradient(135deg,${g.ac1 || "#444"},${g.ac2 || "#222"})">${initials}</div>
          <div class="name">${escapeHtml(g.handle)}</div>
        </div>
        <div class="go">${svgUse(followed ? "i-check" : "i-arrow")}</div>
      </div>
    `;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  /* Click flow:
     - First click on a pending gate: open the social profile in a new tab,
       and arm the gate. When the user comes back to this tab, mark followed.
     - Click on a followed gate: toggle off (un-follow) for testing/reset. */
  const armed = new WeakMap();

  function onGateClick(p, g, row) {
    if (isFollowed(p, g)) {
      setFollowed(p, g, false);
      paintModal();
      return;
    }
    window.open(g.url, "_blank", "noopener");
    armed.set(row, { p, g });
    row.classList.add("armed");
  }

  // When window regains focus after the user visited the social site,
  // confirm any armed gates as followed.
  function confirmArmed() {
    if (!activeProduct) return;
    const rows = document.querySelectorAll(".gate");
    let changed = false;
    rows.forEach((row) => {
      const a = armed.get(row);
      if (a) {
        setFollowed(a.p, a.g, true);
        armed.delete(row);
        changed = true;
      }
    });
    if (changed) paintModal();
  }
  window.addEventListener("focus", confirmArmed);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) confirmArmed();
  });

  /* Modal close handlers */
  modal.addEventListener("click", (e) => {
    if (e.target.dataset && "close" in e.target.dataset) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  /* Reset everything */
  resetBtn.addEventListener("click", () => {
    Object.keys(state).forEach((k) => delete state[k]);
    saveState();
    renderGrid();
    if (!modal.hidden) paintModal();
  });

  renderGrid();
})();
