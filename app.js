/* The Copper Pot Eatery, demo PWA. All state lives on the device. */

(function () {
  "use strict";

  // ---------- persistence ----------
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
    del(key) { localStorage.removeItem(key); }
  };

  const state = {
    lang: store.get("cp_lang", "en"),
    screen: "home",
    activeCat: "breakfast",
    cart: store.get("cp_cart", []),          // [{itemId, qty, extras:[extraKey], notes}]
    member: store.get("cp_member", null),    // {name, phone, points, stamps, since}
    pastOrders: store.get("cp_orders", []),  // [{id, when, lines, total}]
    kitchen: store.get("cp_kitchen", null),  // [{id, customer, phone, placedAt, status, lines}]
    eightySix: store.get("cp_86", []),       // [itemId]
    photos: store.get("cp_photos", {}),      // {itemId: dataUrl} owner-uploaded photo overrides
    staffAuthed: false,
    editIndex: null                          // cart line being edited in the sheet
  };

  // Seed demo kitchen orders on first run.
  if (!state.kitchen) {
    const now = Date.now();
    state.kitchen = DEMO_ORDERS.map(o => ({
      id: o.id,
      customer: o.customer,
      phone: o.phone,
      placedAt: now - o.placedMinAgo * 60000,
      status: o.status,
      lines: o.lines
    }));
    store.set("cp_kitchen", state.kitchen);
  }

  // ---------- helpers ----------
  const t = key => (STRINGS[key] ? STRINGS[key][state.lang] : key);
  const tx = obj => (obj ? obj[state.lang] : "");
  const rand = n => "R" + (Number.isInteger(n) ? n : n.toFixed(2));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const item = id => MENU.find(m => m.id === id);
  const imgSrc = it => state.photos[it.id] || it.img;
  const pad2 = n => String(n).padStart(2, "0");
  const minToHHMM = m => pad2(Math.floor(m / 60)) + ":" + pad2(m % 60);

  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._tm);
    el._tm = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function openStatus() {
    const now = new Date();
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const h = RESTAURANT.hours[day];
    if (mins >= h.open && mins < h.close) {
      if (mins < h.kitchenClose) {
        return { open: true, label: `${t("open")} · ${t("kitchenCloses")} ${minToHHMM(h.kitchenClose)}` };
      }
      return { open: true, label: `${t("open")} · ${t("kitchenClosed")}` };
    }
    // find next opening
    for (let i = 0; i < 7; i++) {
      const d = (day + i) % 7;
      const hh = RESTAURANT.hours[d];
      if (i === 0 && mins < hh.open) {
        return { open: false, label: `${t("closed")} · ${t("opensAt")} ${minToHHMM(hh.open)}` };
      }
      if (i > 0) {
        const dayNames = {
          en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          af: ["Sondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrydag", "Saterdag"]
        };
        return { open: false, label: `${t("closed")} · ${t("opensAt")} ${dayNames[state.lang][d]} ${minToHHMM(hh.open)}` };
      }
    }
    return { open: false, label: t("closed") };
  }

  function linePrice(line) {
    const it = item(line.itemId);
    const extrasSum = line.extras.reduce((s, k) => s + EXTRAS[k].price, 0);
    return (it.price + extrasSum) * line.qty;
  }
  const cartTotal = () => state.cart.reduce((s, l) => s + linePrice(l), 0);
  const cartCount = () => state.cart.reduce((s, l) => s + l.qty, 0);

  function saveCart() { store.set("cp_cart", state.cart); }

  function addPoints(spendRand, withStamp) {
    if (!state.member) return;
    state.member.points += Math.floor(spendRand * LOYALTY.pointsPerRand);
    if (withStamp) {
      state.member.stamps = (state.member.stamps + 1) % (LOYALTY.stampsForReward + 1);
      if (state.member.stamps === 0) state.member.stamps = LOYALTY.stampsForReward;
    }
    store.set("cp_member", state.member);
  }

  function tierFor(points) {
    let cur = LOYALTY.tiers[0];
    for (const tr of LOYALTY.tiers) if (points >= tr.min) cur = tr;
    const next = LOYALTY.tiers.find(tr => tr.min > points);
    return { cur, next };
  }

  const waIcon = `<svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.89-.12-.44-.14-1-.32-1.71-.63-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.63-1.23-3.11 0-1.48.78-2.21 1.05-2.51.28-.3.6-.38.8-.38l.58.01c.18.01.43-.07.68.52.25.6.85 2.08.93 2.23.08.15.13.33.02.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.53-.15.15-.31.31-.13.61.18.3.79 1.31 1.7 2.12 1.17 1.04 2.16 1.37 2.46 1.52.3.15.48.13.65-.08.18-.2.75-.88.95-1.18.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.07.13.07.75-.18 1.48z"/></svg>`;

  // ---------- WhatsApp builders ----------
  function orderMessage() {
    const L = [];
    L.push(state.lang === "af"
      ? `Hallo ${RESTAURANT.shortName}, ek wil graag bestel vir afhaal:`
      : `Hello ${RESTAURANT.shortName}, I would like to order for collection:`);
    L.push("");
    for (const line of state.cart) {
      const it = item(line.itemId);
      let s = `${line.qty} x ${tx(it.name)}`;
      if (line.extras.length) s += " (" + line.extras.map(k => tx(EXTRAS[k].name)).join(", ") + ")";
      s += " = " + rand(linePrice(line));
      L.push(s);
      if (line.notes) L.push((state.lang === "af" ? "  Nota: " : "  Note: ") + line.notes);
    }
    L.push("");
    L.push((state.lang === "af" ? "Totaal: " : "Total: ") + rand(cartTotal()));
    if (state.member) L.push((state.lang === "af" ? "Naam: " : "Name: ") + state.member.name + " (" + state.member.phone + ")");
    L.push(state.lang === "af"
      ? "Ek betaal in die winkel met afhaal."
      : "I will pay in store on collection.");
    return L.join("\n");
  }

  function bookingMessage(f) {
    const L = [];
    L.push(state.lang === "af"
      ? `Hallo ${RESTAURANT.shortName}, ek wil graag 'n tafel bespreek:`
      : `Hello ${RESTAURANT.shortName}, I would like to book a table:`);
    L.push((state.lang === "af" ? "Datum: " : "Date: ") + f.date);
    L.push((state.lang === "af" ? "Tyd: " : "Time: ") + f.time);
    L.push((state.lang === "af" ? "Mense: " : "People: ") + f.covers);
    if (f.dogs) L.push(state.lang === "af" ? "Ons bring 'n hond saam." : "We are bringing a dog.");
    if (f.notes) L.push((state.lang === "af" ? "Notas: " : "Notes: ") + f.notes);
    if (state.member) L.push((state.lang === "af" ? "Naam: " : "Name: ") + state.member.name);
    return L.join("\n");
  }

  const waLink = msg => `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(msg)}`;

  // ---------- shell ----------
  function renderShell() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="demo-ribbon">${t("demoBadge")}</div>
      <header class="topbar">
        <div class="brand">
          <img src="images/logo.png" alt="" />
          <span>${esc(RESTAURANT.shortName)}</span>
        </div>
        <div class="spacer"></div>
        <div class="lang-toggle" role="group" aria-label="Language">
          <button data-lang="af" class="${state.lang === "af" ? "active" : ""}">AFR</button>
          <button data-lang="en" class="${state.lang === "en" ? "active" : ""}">ENG</button>
        </div>
        <button class="cart-btn" id="btn-cart" aria-label="${t("whatsappCart")}">
          ${waIcon}<span>${t("whatsappCart")}</span>
          ${cartCount() ? `<span class="badge">${cartCount()}</span>` : ""}
        </button>
      </header>
      <main id="main"></main>
      <nav class="bottom-nav" id="bottom-nav">
        <button data-screen="home"><span class="ico">&#127968;</span>${t("navHome")}</button>
        <button data-screen="menu"><span class="ico">&#127860;</span>${t("navMenu")}</button>
        <button data-screen="club"><span class="ico">&#11088;</span>${t("navClub")}</button>
        <button data-screen="book"><span class="ico">&#128197;</span>${t("navBook")}</button>
        <button data-screen="more"><span class="ico">&#9776;</span>${t("navMore")}</button>
      </nav>
    `;
    app.querySelectorAll(".lang-toggle button").forEach(b =>
      b.addEventListener("click", () => {
        state.lang = b.dataset.lang;
        store.set("cp_lang", state.lang);
        render();
      })
    );
    document.getElementById("btn-cart").addEventListener("click", () => go("cart"));
    app.querySelectorAll("#bottom-nav button").forEach(b =>
      b.addEventListener("click", () => go(b.dataset.screen))
    );
  }

  function go(screen) {
    state.screen = screen;
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    if (state.screen === "staff") { renderStaff(); return; }
    renderShell();
    const main = document.getElementById("main");
    const nav = document.getElementById("bottom-nav");
    nav.querySelectorAll("button").forEach(b =>
      b.classList.toggle("active", b.dataset.screen === state.screen)
    );
    const views = {
      home: viewHome, menu: viewMenu, cart: viewCart, club: viewClub,
      book: viewBook, events: viewEvents, account: viewAccount,
      contact: viewContact, more: viewMore
    };
    (views[state.screen] || viewHome)(main);
  }

  // ---------- guest views ----------
  function viewHome(main) {
    const st = openStatus();
    main.innerHTML = `
      <div class="hero-wrap">
        <img class="hero" src="images/hero-venue.png" alt="${esc(RESTAURANT.name)}" />
      </div>
      <img class="hero-logo" src="images/logo.png" alt="" />
      <div class="home-head">
        <h1>${esc(RESTAURANT.name)}</h1>
        <div class="tagline">${esc(tx(RESTAURANT.tagline))} · ${esc(RESTAURANT.town)}</div>
        <div class="status-badge ${st.open ? "" : "closed"}"><span class="dot"></span>${st.label}</div>
      </div>
      <div class="cta-grid">
        <button class="cta primary" data-go="menu"><span class="ico">&#128230;</span>${t("ctaOrder")}</button>
        <button class="cta secondary" data-go="menu"><span class="ico">&#128214;</span>${t("ctaMenu")}</button>
        <button class="cta plain" data-go="book"><span class="ico">&#128197;</span>${t("ctaBook")}</button>
        <a class="cta plain" href="${RESTAURANT.mapsUrl}" target="_blank" rel="noopener" style="text-decoration:none"><span class="ico">&#128205;</span>${t("ctaDirections")}</a>
      </div>
      <div class="pad">
        <h2>${t("todayAtCopperPot")}</h2>
        <div class="card event-card">
          <div class="when">${esc(tx(EVENTS[0].when))}</div>
          <h3>${esc(tx(EVENTS[0].title))}</h3>
          <p>${esc(tx(EVENTS[0].desc))}</p>
        </div>
        <button class="btn ghost" data-go="events">${t("seeAllEvents")}</button>
        <h2>${t("goodToKnow")}</h2>
        <div class="notice-list">
          ${NOTICES.map(n => `<div class="card"><span class="ico">&#8505;&#65039;</span><span>${esc(tx(n.text))}</span></div>`).join("")}
        </div>
        <p class="sub" style="margin-top:14px">${t("installHint")}</p>
      </div>
    `;
    wireGo(main);
  }

  function wireGo(root) {
    root.querySelectorAll("[data-go]").forEach(el =>
      el.addEventListener("click", () => go(el.dataset.go))
    );
  }

  function viewMenu(main) {
    const cat = CATEGORIES.find(c => c.id === state.activeCat) || CATEGORIES[0];
    const items = MENU.filter(m => m.cat === cat.id);
    main.innerHTML = `
      <div class="cat-tabs">
        ${CATEGORIES.map(c => `<button class="cat-tab ${c.id === cat.id ? "active" : ""}" data-cat="${c.id}">${esc(tx(c.name))}</button>`).join("")}
      </div>
      ${tx(cat.note) ? `<div class="cat-note">${esc(tx(cat.note))}</div>` : ""}
      <div class="menu-list">
        ${items.map(m => {
          const out = state.eightySix.includes(m.id);
          return `
          <button class="menu-item ${out ? "soldout" : ""}" data-item="${m.id}" ${out ? "disabled" : ""}>
            <img src="${imgSrc(m)}" alt="${esc(tx(m.name))}" loading="lazy" />
            <div class="info">
              <div class="name">${esc(tx(m.name))}</div>
              <div class="desc">${esc(tx(m.desc))}</div>
              <div class="row">
                <span class="price">${rand(m.price)}</span>
                ${out ? `<span class="tag86">${t("soldOut")}</span>` : ""}
              </div>
            </div>
          </button>`;
        }).join("")}
      </div>
    `;
    main.querySelectorAll(".cat-tab").forEach(b =>
      b.addEventListener("click", () => { state.activeCat = b.dataset.cat; render(); })
    );
    main.querySelectorAll(".menu-item:not([disabled])").forEach(b =>
      b.addEventListener("click", () => openSheet(b.dataset.item))
    );
  }

  // Item bottom sheet, also used to edit a cart line.
  function openSheet(itemId, editIndex) {
    const it = item(itemId);
    const existing = editIndex != null ? state.cart[editIndex] : null;
    state.editIndex = editIndex != null ? editIndex : null;
    let qty = existing ? existing.qty : 1;
    const chosen = new Set(existing ? existing.extras : []);

    const sheet = document.getElementById("sheet");
    const backdrop = document.getElementById("sheet-backdrop");

    function draw() {
      const extrasSum = [...chosen].reduce((s, k) => s + EXTRAS[k].price, 0);
      const totalNow = (it.price + extrasSum) * qty;
      sheet.innerHTML = `
        <button class="close" id="sheet-close" aria-label="Close">&#10005;</button>
        <img class="dish" src="${imgSrc(it)}" alt="${esc(tx(it.name))}" />
        <div class="body">
          <div class="head">
            <h1>${esc(tx(it.name))}</h1>
            <span class="price">${rand(it.price)}</span>
          </div>
          <p class="sub">${esc(tx(it.desc))}</p>
          ${it.photoAi && !state.photos[it.id] ? `<span class="ai-tag">${t("aiPhotoTag")}</span>` : ""}
          ${it.extras.length ? `<h2>${t("extras")}</h2>
            <div>
              ${it.extras.map(k => `
                <label class="extra-row">
                  <input type="checkbox" data-extra="${k}" ${chosen.has(k) ? "checked" : ""} />
                  <span class="nm">${esc(tx(EXTRAS[k].name))}</span>
                  <span class="pr">+ ${rand(EXTRAS[k].price)}</span>
                </label>`).join("")}
            </div>` : ""}
          <label class="fld" for="sheet-notes">${t("notes")}</label>
          <textarea id="sheet-notes" placeholder="${t("notesPlaceholder")}">${existing ? esc(existing.notes) : ""}</textarea>
          <label class="fld">${t("quantity")}</label>
          <div class="qty-row">
            <button id="qty-minus" aria-label="Less">&#8722;</button>
            <span class="q">${qty}</span>
            <button id="qty-plus" aria-label="More">+</button>
          </div>
          <button class="btn wa" id="sheet-add">${waIcon}${t("addToCart")} · ${rand(totalNow)}</button>
        </div>
      `;
      sheet.querySelectorAll("[data-extra]").forEach(cb =>
        cb.addEventListener("change", () => {
          const notes = document.getElementById("sheet-notes").value;
          cb.checked ? chosen.add(cb.dataset.extra) : chosen.delete(cb.dataset.extra);
          draw();
          document.getElementById("sheet-notes").value = notes;
        })
      );
      document.getElementById("qty-minus").addEventListener("click", () => {
        if (qty > 1) {
          const notes = document.getElementById("sheet-notes").value;
          qty--; draw();
          document.getElementById("sheet-notes").value = notes;
        }
      });
      document.getElementById("qty-plus").addEventListener("click", () => {
        const notes = document.getElementById("sheet-notes").value;
        qty++; draw();
        document.getElementById("sheet-notes").value = notes;
      });
      document.getElementById("sheet-close").addEventListener("click", closeSheet);
      document.getElementById("sheet-add").addEventListener("click", () => {
        const line = {
          itemId: it.id,
          qty,
          extras: [...chosen],
          notes: document.getElementById("sheet-notes").value.trim()
        };
        if (state.editIndex != null) state.cart[state.editIndex] = line;
        else state.cart.push(line);
        saveCart();
        closeSheet();
        toast(state.lang === "af" ? `${tx(it.name)} is in jou mandjie` : `${tx(it.name)} is in your basket`);
        render();
      });
    }

    draw();
    sheet.classList.add("open");
    backdrop.classList.add("open");
    backdrop.onclick = closeSheet;
  }

  function closeSheet() {
    document.getElementById("sheet").classList.remove("open");
    document.getElementById("sheet-backdrop").classList.remove("open");
    state.editIndex = null;
  }

  function viewCart(main) {
    if (!state.cart.length) {
      main.innerHTML = `
        <div class="empty-state">
          <div class="ico">&#129382;</div>
          <h2>${t("cartEmptyTitle")}</h2>
          <p>${t("cartEmptyBody")}</p>
          <button class="btn copper" data-go="menu">${t("browseMenu")}</button>
        </div>`;
      wireGo(main);
      return;
    }
    main.innerHTML = `
      <div class="pad">
        <h1>${t("whatsappCart")}</h1>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px">
          ${state.cart.map((l, i) => {
            const it = item(l.itemId);
            const meta = [
              l.extras.map(k => tx(EXTRAS[k].name)).join(", "),
              l.notes
            ].filter(Boolean).join(" · ");
            return `
            <div class="cart-line">
              <img src="${imgSrc(it)}" alt="" />
              <div class="mid">
                <div class="nm">${l.qty} x ${esc(tx(it.name))}</div>
                ${meta ? `<div class="meta">${esc(meta)}</div>` : ""}
                <div class="acts">
                  <button data-edit="${i}">${t("edit")}</button>
                  <button class="del" data-del="${i}">${t("remove")}</button>
                </div>
              </div>
              <div class="pr">${rand(linePrice(l))}</div>
            </div>`;
          }).join("")}
        </div>
        <button class="btn ghost" data-go="menu">+ ${t("addMore")}</button>
        <div class="total-row"><span>${t("total")}</span><span>${rand(cartTotal())}</span></div>
        <button class="btn wa" id="send-order">${waIcon}${t("sendOrder")}</button>
        <p class="sub" style="margin-top:10px">${t("collectionNote")}</p>
      </div>
    `;
    wireGo(main);
    main.querySelectorAll("[data-edit]").forEach(b =>
      b.addEventListener("click", () => {
        const i = Number(b.dataset.edit);
        openSheet(state.cart[i].itemId, i);
      })
    );
    main.querySelectorAll("[data-del]").forEach(b =>
      b.addEventListener("click", () => {
        state.cart.splice(Number(b.dataset.del), 1);
        saveCart();
        render();
      })
    );
    document.getElementById("send-order").addEventListener("click", sendOrder);
  }

  function sendOrder() {
    const msg = orderMessage();
    const total = cartTotal();
    const orderId = "CP-" + (1043 + state.pastOrders.length);

    // guest history
    state.pastOrders.unshift({
      id: orderId,
      when: new Date().toISOString(),
      total,
      lines: state.cart
    });
    store.set("cp_orders", state.pastOrders);

    // demo: the order also lands on the kitchen board
    state.kitchen.unshift({
      id: orderId,
      customer: state.member ? state.member.name : (state.lang === "af" ? "Gas" : "Guest"),
      phone: state.member ? state.member.phone : "",
      placedAt: Date.now(),
      status: "new",
      lines: state.cart
    });
    store.set("cp_kitchen", state.kitchen);

    // loyalty: 1 point per R10 plus a stamp
    if (state.member) addPoints(total, true);

    state.cart = [];
    saveCart();
    window.open(waLink(msg), "_blank");
    toast(t("orderSent"));
    go("account");
  }

  function viewClub(main) {
    if (!state.member) {
      main.innerHTML = `
        <div class="pad">
          <h1>${t("clubTitle")}</h1>
          <p class="sub">${t("clubPitch")}</p>
          <div class="card" style="margin-top:14px">
            <h2 style="margin-top:0">${t("joinClub")}</h2>
            <label class="fld" for="club-name">${t("yourName")}</label>
            <input type="text" id="club-name" autocomplete="name" />
            <label class="fld" for="club-phone">${t("yourPhone")}</label>
            <input type="tel" id="club-phone" placeholder="082 555 0100" autocomplete="tel" />
            <label class="consent-row">
              <input type="checkbox" id="club-consent" />
              <span>${t("popiaConsent")}</span>
            </label>
            <button class="btn copper" id="club-join">${t("join")}</button>
          </div>
          <h2>${t("rewards")}</h2>
          <div class="card">
            ${LOYALTY.rewards.map(r => `
              <div class="reward-row">
                <span class="pts">${r.points} ${t("points")}</span>
                <span>${esc(tx(r.name))}</span>
              </div>`).join("")}
          </div>
        </div>
      `;
      document.getElementById("club-join").addEventListener("click", () => {
        const name = document.getElementById("club-name").value.trim();
        const phone = document.getElementById("club-phone").value.trim();
        const ok = document.getElementById("club-consent").checked;
        if (!name || !phone) {
          toast(state.lang === "af" ? "Vul asseblief jou naam en nommer in" : "Please fill in your name and number");
          return;
        }
        if (!ok) {
          toast(state.lang === "af" ? "Merk asseblief die toestemmingsblokkie" : "Please tick the consent box");
          return;
        }
        state.member = { name, phone, points: 120, stamps: 3, since: new Date().toISOString() };
        store.set("cp_member", state.member);
        toast(state.lang === "af" ? `Welkom by die Copper Klub, ${name}` : `Welcome to the Copper Club, ${name}`);
        render();
      });
      return;
    }

    const m = state.member;
    const { cur, next } = tierFor(m.points);
    main.innerHTML = `
      <div class="pad">
        <h1>${t("clubTitle")}</h1>
        <p class="sub">${t("welcomeBack")}, ${esc(m.name)}</p>
        <div class="tier-banner" style="margin-top:12px">
          <div class="pts">${m.points} ${t("points")}</div>
          <div class="tiername">${t("tier")}: ${esc(tx(cur.name))}</div>
          ${next ? `<div class="next">${next.min - m.points} ${t("points")} ${t("nextTier")} ${esc(tx(next.name))}</div>` : ""}
        </div>
        <h2>${t("stampCard")}</h2>
        <div class="card">
          <div class="stamps">
            ${Array.from({ length: LOYALTY.stampsForReward }, (_, i) =>
              `<div class="stamp ${i < m.stamps ? "filled" : ""}">${i < m.stamps ? "&#10003;" : ""}</div>`
            ).join("")}
          </div>
          <p class="sub" style="margin-top:10px">${t("stampCardNote")}</p>
        </div>
        <h2>${t("rewards")}</h2>
        <div class="card">
          ${LOYALTY.rewards.map(r => `
            <div class="reward-row ${m.points >= r.points ? "" : "locked"}">
              <span class="pts">${r.points} ${t("points")}</span>
              <span>${esc(tx(r.name))}</span>
            </div>`).join("")}
        </div>
        <p class="sub" style="margin-top:12px">${t("memberSince")} ${new Date(m.since).toLocaleDateString()}</p>
      </div>
    `;
  }

  function viewBook(main) {
    const today = new Date().toISOString().slice(0, 10);
    main.innerHTML = `
      <div class="pad">
        <h1>${t("bookTitle")}</h1>
        <p class="sub">${t("bookIntro")}</p>
        <div class="card" style="margin-top:14px">
          <label class="fld" for="bk-date">${t("date")}</label>
          <input type="date" id="bk-date" min="${today}" value="${today}" />
          <label class="fld" for="bk-time">${t("time")}</label>
          <input type="time" id="bk-time" value="18:30" />
          <label class="fld" for="bk-covers">${t("covers")}</label>
          <select id="bk-covers">
            ${[1,2,3,4,5,6,7,8].map(n => `<option ${n === 2 ? "selected" : ""}>${n}</option>`).join("")}
          </select>
          <label class="consent-row">
            <input type="checkbox" id="bk-dogs" />
            <span>${t("dogs")}</span>
          </label>
          <label class="fld" for="bk-notes">${t("bookNotes")}</label>
          <textarea id="bk-notes" placeholder="${t("bookNotesPlaceholder")}"></textarea>
          <button class="btn wa" id="bk-send">${waIcon}${t("sendBooking")}</button>
        </div>
      </div>
    `;
    document.getElementById("bk-send").addEventListener("click", () => {
      const f = {
        date: document.getElementById("bk-date").value,
        time: document.getElementById("bk-time").value,
        covers: document.getElementById("bk-covers").value,
        dogs: document.getElementById("bk-dogs").checked,
        notes: document.getElementById("bk-notes").value.trim()
      };
      window.open(waLink(bookingMessage(f)), "_blank");
    });
  }

  function viewEvents(main) {
    main.innerHTML = `
      <div class="pad">
        <h1>${t("eventsTitle")}</h1>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">
          ${EVENTS.map(e => `
            <div class="card event-card">
              <div class="when">${esc(tx(e.when))}</div>
              <h3>${esc(tx(e.title))}</h3>
              <p>${esc(tx(e.desc))}</p>
            </div>`).join("")}
        </div>
      </div>
    `;
  }

  function viewAccount(main) {
    main.innerHTML = `
      <div class="pad">
        <h1>${t("accountTitle")}</h1>
        ${state.member ? `<p class="sub">${esc(state.member.name)} · ${esc(state.member.phone)}</p>` : ""}
        <h2>${t("pastOrders")}</h2>
        ${state.pastOrders.length ? state.pastOrders.map(o => `
          <div class="card">
            <div style="display:flex;justify-content:space-between;font-weight:700">
              <span>${esc(o.id)}</span><span>${rand(o.total)}</span>
            </div>
            <div class="sub" style="font-size:13.5px">${new Date(o.when).toLocaleString()}</div>
            <div class="sub" style="font-size:14px;margin-top:4px">
              ${o.lines.map(l => `${l.qty} x ${esc(tx(item(l.itemId).name))}`).join(", ")}
            </div>
          </div>`).join("") : `<div class="card"><p class="sub">${t("noOrders")}</p></div>`}
        <h2>${t("language")}</h2>
        <div class="card">
          <div class="lang-toggle" style="width:max-content">
            <button data-lang="af" class="${state.lang === "af" ? "active" : ""}">AFR</button>
            <button data-lang="en" class="${state.lang === "en" ? "active" : ""}">ENG</button>
          </div>
        </div>
        <h2>${t("privacy")}</h2>
        <div class="card"><p class="sub">${t("privacyBody")}</p></div>
        <button class="btn danger" id="del-data">${t("deleteData")}</button>
      </div>
    `;
    main.querySelectorAll(".lang-toggle button").forEach(b =>
      b.addEventListener("click", () => {
        state.lang = b.dataset.lang;
        store.set("cp_lang", state.lang);
        render();
      })
    );
    document.getElementById("del-data").addEventListener("click", () => {
      if (!confirm(t("deleteConfirm"))) return;
      ["cp_cart", "cp_member", "cp_orders"].forEach(store.del);
      state.cart = [];
      state.member = null;
      state.pastOrders = [];
      toast(t("dataDeleted"));
      render();
    });
  }

  function viewContact(main) {
    main.innerHTML = `
      <div class="pad">
        <h1>${t("contactTitle")}</h1>
        <div class="map-block" style="margin-top:12px">
          <div class="addr">${esc(RESTAURANT.name)}</div>
          <div style="margin-top:4px">${esc(RESTAURANT.address)}</div>
          <a class="btn ghost" style="margin-top:14px;text-decoration:none" href="${RESTAURANT.mapsUrl}" target="_blank" rel="noopener">&#128205; ${t("openInMaps")}</a>
        </div>
        <h2>${t("hoursTitle")}</h2>
        <div class="card">
          <table class="hours-table">
            ${RESTAURANT.hoursLabel[state.lang].map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}
          </table>
        </div>
        <div class="contact-grid">
          <a class="btn wa" style="text-decoration:none;margin-top:0" href="https://wa.me/${RESTAURANT.whatsapp}" target="_blank" rel="noopener">${waIcon}${t("whatsappUs")}</a>
          <a class="btn green" style="text-decoration:none;margin-top:0" href="tel:${RESTAURANT.phone.replace(/\s/g, "")}">&#128222; ${t("phoneUs")}</a>
        </div>
        <a class="btn ghost" style="text-decoration:none" href="mailto:${RESTAURANT.email}">&#9993;&#65039; ${t("emailUs")} · ${RESTAURANT.email}</a>
      </div>
    `;
  }

  function viewMore(main) {
    main.innerHTML = `
      <div class="pad">
        <h1>${t("moreTitle")}</h1>
        <div class="more-list" style="margin-top:12px">
          <button data-go="events"><span class="ico">&#127925;</span>${t("eventsTitle")}</button>
          <button data-go="account"><span class="ico">&#128100;</span>${t("accountTitle")}</button>
          <button data-go="contact"><span class="ico">&#128205;</span>${t("contactTitle")}</button>
          <button id="go-staff"><span class="ico">&#128104;&#8205;&#127859;</span>${t("staffMode")}</button>
        </div>
        <h2>${t("privacy")}</h2>
        <div class="card"><p class="sub">${t("privacyBody")}</p></div>
      </div>
    `;
    wireGo(main);
    document.getElementById("go-staff").addEventListener("click", () => {
      state.screen = "staff";
      render();
    });
  }

  // ---------- staff / kitchen ----------
  function renderStaff() {
    const app = document.getElementById("app");
    if (!state.staffAuthed) {
      app.innerHTML = `
        <div class="staff-bar">
          <button class="back" id="staff-back">&#8592; ${t("backToApp")}</button>
          <h1>${t("staffTitle")}</h1>
        </div>
        <div class="pin-pad">
          <label class="fld" for="pin">${t("enterPin")}</label>
          <input type="tel" id="pin" maxlength="4" inputmode="numeric" autocomplete="off" />
          <div class="pin-error" id="pin-err" hidden>${t("wrongPin")}</div>
          <button class="btn green" id="pin-go">OK</button>
          <p class="demo-pin">${t("demoPinHint")}</p>
        </div>
      `;
      document.getElementById("staff-back").addEventListener("click", () => go("more"));
      const tryPin = () => {
        if (document.getElementById("pin").value === RESTAURANT.staffPin) {
          state.staffAuthed = true;
          renderStaff();
        } else {
          document.getElementById("pin-err").hidden = false;
        }
      };
      document.getElementById("pin-go").addEventListener("click", tryPin);
      document.getElementById("pin").addEventListener("keydown", e => { if (e.key === "Enter") tryPin(); });
      document.getElementById("pin").focus();
      return;
    }

    const live = state.kitchen.filter(o => o.status !== "collected");
    const statusLabel = { new: t("statusNew"), preparing: t("statusPreparing"), ready: t("statusReady") };
    app.innerHTML = `
      <div class="staff-bar">
        <button class="back" id="staff-back">&#8592; ${t("backToApp")}</button>
        <h1>${t("staffTitle")} · ${esc(RESTAURANT.shortName)}</h1>
      </div>
      <main style="padding-bottom:30px">
        <div class="pad">
          <h2 style="margin-top:4px">${t("liveOrders")}</h2>
          ${live.length ? live.map(o => {
            const mins = Math.max(0, Math.round((Date.now() - o.placedAt) / 60000));
            return `
            <div class="card order-card ${o.status}">
              <div class="oc-head">
                <span class="oc-id">${esc(o.id)} · ${esc(o.customer)}</span>
                <span class="oc-status">${statusLabel[o.status]}</span>
              </div>
              <div class="oc-meta">${mins} min ${state.lang === "af" ? "gelede" : "ago"}${o.phone ? " · " + esc(o.phone) : ""}</div>
              <ul>
                ${o.lines.map(l => {
                  const it = item(l.itemId);
                  let s = `${l.qty} x ${esc(tx(it.name))}`;
                  if (l.extras.length) s += " (" + l.extras.map(k => esc(tx(EXTRAS[k].name))).join(", ") + ")";
                  if (l.notes) s += ` <span class="oc-note">${esc(l.notes)}</span>`;
                  return `<li>${s}</li>`;
                }).join("")}
              </ul>
              ${o.status === "new" ? `<button class="btn copper" data-adv="${o.id}">${t("markPreparing")}</button>` : ""}
              ${o.status === "preparing" ? `<button class="btn green" data-adv="${o.id}">${t("markReady")}</button>` : ""}
              ${o.status === "ready" ? `<button class="btn ghost" data-adv="${o.id}">${t("markCollected")} &#10003;</button>` : ""}
            </div>`;
          }).join("") : `<div class="card"><p class="sub">${t("noLiveOrders")}</p></div>`}

          <h2>${t("eightySix")}</h2>
          <div class="card">
            ${MENU.map(m => {
              const out = state.eightySix.includes(m.id);
              return `
              <div class="eight6-row">
                <span class="nm">${esc(tx(m.name))}</span>
                <button class="switch ${out ? "off" : "on"}" data-86="${m.id}">${out ? t("soldOut") : t("available")}</button>
              </div>`;
            }).join("")}
          </div>

          <h2>${t("photoManager")}</h2>
          <div class="card">
            <p class="sub" style="margin-bottom:6px">${t("photoManagerNote")}</p>
            ${MENU.map(m => `
              <div class="photo-row">
                <img src="${imgSrc(m)}" alt="" />
                <div class="mid">
                  <div class="nm">${esc(tx(m.name))}</div>
                  <span class="src-tag ${state.photos[m.id] ? "own" : ""}">${state.photos[m.id] ? t("yourPhotoLabel") : t("aiLabel")}</span>
                </div>
                <div class="pbtns">
                  <button class="pbtn" data-photo="${m.id}">${t("replacePhoto")}</button>
                  ${state.photos[m.id] ? `<button class="pbtn plain" data-photo-reset="${m.id}">${t("resetPhoto")}</button>` : ""}
                </div>
              </div>`).join("")}
            <input type="file" id="photo-file" accept="image/*" hidden />
          </div>

          <h2>${t("dineInSpend")}</h2>
          <div class="card">
            <label class="fld" for="di-phone">${t("memberPhone")}</label>
            <input type="tel" id="di-phone" placeholder="082 555 0100" />
            <label class="fld" for="di-amount">${t("amountSpent")}</label>
            <input type="number" id="di-amount" min="1" placeholder="250" />
            <button class="btn copper" id="di-add">${t("addPoints")}</button>
          </div>
        </div>
      </main>
    `;
    document.getElementById("staff-back").addEventListener("click", () => {
      state.staffAuthed = false;
      go("home");
    });
    app.querySelectorAll("[data-adv]").forEach(b =>
      b.addEventListener("click", () => {
        const o = state.kitchen.find(k => k.id === b.dataset.adv);
        const nextStatus = { new: "preparing", preparing: "ready", ready: "collected" };
        o.status = nextStatus[o.status];
        store.set("cp_kitchen", state.kitchen);
        renderStaff();
      })
    );
    // Photo manager: replace or reset a dish photo.
    const fileInput = document.getElementById("photo-file");
    let pendingPhotoItem = null;
    app.querySelectorAll("[data-photo]").forEach(b =>
      b.addEventListener("click", () => {
        pendingPhotoItem = b.dataset.photo;
        fileInput.click();
      })
    );
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file || !pendingPhotoItem) return;
      const targetId = pendingPhotoItem;
      pendingPhotoItem = null;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        // Downscale so it fits comfortably in this demo's local storage.
        const max = 900;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        try {
          state.photos[targetId] = c.toDataURL("image/jpeg", 0.82);
          store.set("cp_photos", state.photos);
          toast(t("photoUpdated"));
        } catch (e) {
          toast(state.lang === "af" ? "Die foto is te groot vir die demo" : "That photo is too big for the demo");
        }
        renderStaff();
      };
      img.onerror = () => { URL.revokeObjectURL(url); };
      img.src = url;
      fileInput.value = "";
    });
    app.querySelectorAll("[data-photo-reset]").forEach(b =>
      b.addEventListener("click", () => {
        delete state.photos[b.dataset.photoReset];
        store.set("cp_photos", state.photos);
        toast(t("photoReset"));
        renderStaff();
      })
    );
    app.querySelectorAll("[data-86]").forEach(b =>
      b.addEventListener("click", () => {
        const id = b.dataset["86"] || b.getAttribute("data-86");
        const i = state.eightySix.indexOf(id);
        i >= 0 ? state.eightySix.splice(i, 1) : state.eightySix.push(id);
        store.set("cp_86", state.eightySix);
        renderStaff();
      })
    );
    document.getElementById("di-add").addEventListener("click", () => {
      const phone = document.getElementById("di-phone").value.trim();
      const amount = Number(document.getElementById("di-amount").value);
      if (!phone || !amount || amount <= 0) {
        toast(state.lang === "af" ? "Vul nommer en bedrag in" : "Fill in number and amount");
        return;
      }
      const clean = s => s.replace(/\D/g, "");
      if (state.member && clean(state.member.phone).endsWith(clean(phone).slice(-9))) {
        addPoints(amount, false);
        toast((state.lang === "af" ? "Punte bygevoeg vir " : "Points added for ") + state.member.name);
      } else {
        toast(state.lang === "af"
          ? "Geen lid met daardie nommer op hierdie toestel nie, demo voeg net punte by vir die lid op hierdie foon"
          : "No member with that number on this device, the demo only adds points for the member on this phone");
      }
      renderStaff();
    });
  }

  // ---------- boot ----------
  function boot() {
    document.getElementById("splash-tagline").textContent = tx(RESTAURANT.tagline);
    render();
    setTimeout(() => document.getElementById("splash").classList.add("hide"), 1100);
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  boot();
})();
