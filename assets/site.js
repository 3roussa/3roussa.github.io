/* Portfolio Amin Driss : rendu des projets à partir de data/projects.json */

// Informations propres au site, rangées par identifiant de projet d'origine.
const META = {
  "banc-de-test-véhicules-électriques": {
    id: "banc-powertrain", year: "2026", tags: ["meca", "elec", "embarque"],
    summary: "Conception et mise en service d'un banc d'essai Back-to-Back pour mesurer le rendement d'un moteur-roue de véhicule électrique.",
    tutors: [
      { role: "Tuteur industriel", name: "Xavier Leblanc", org: "Metacar Mobility Systems",
        links: [
          { href: "https://www.kiweemobility.com/", label: "Site web" },
          { href: "https://www.linkedin.com/company/metacar-mobility-systems/about/", label: "LinkedIn" }
        ] },
      { role: "Tuteur académique", name: "Eric Bideaux", org: "INSA Lyon" }
    ]
  },
  "conception-mécanique-dactionneur": {
    id: "convoi-kiwee", year: "2025 – 2026", tags: ["meca", "elec", "embarque"],
    summary: "Maquette au 1/10 de véhicules électriques qui s'emboîtent et roulent en convoi : CAO, carte à ESP32 et commande PID.",
    tutors: [{ role: "Tuteur académique", name: "Eric Bideaux", org: "INSA Lyon" }]
  },
  "projets-copr-insa-lyon": {
    id: "copr-insa-lyon", year: "2025", tags: ["meca", "embarque"],
    summary: "Chariot de batterie pour l'écurie Formula Student de l'INSA et module de signes vitaux d'un simulateur de nouveau-né.",
    extra: [
      { link: "chirbaby.html", label: "Voir la démo interactive de l'interface ChirBaby", note: "Simulateur respiratoire et auscultation, dans votre navigateur" }
    ]
  },
  "système-dasservissement-robotisé": {
    id: "robots-club-enis", year: "2022 – 2024", tags: ["elec", "embarque"],
    summary: "Robots de combat et tout-terrain, de la mécanique à l'électronique de commande. Chef de projet en 2023 – 2024.",
    links: [{ label: "Club électrique ENIS", href: "https://www.instagram.com/club_electrique_enis/", text: "Instagram du club" }],
    extra: [
      { link: "modeles-3d.html", label: "Voir les modèles 3D interactifs", note: "Robot de combat et son électronique, à faire tourner à la souris" },
      { video: "videos/robot-cee-3d.mp4", caption: "Modèle 3D du robot de combat : rotation et levée de la pelle" }
    ]
  },
  "machine-de-lavage-de-fruits-2024": {
    id: "machine-lavage-fruits", year: "2024", tags: ["meca", "industrie"],
    summary: "Machine automatique de lavage de fruits, conçue et fabriquée en équipe de trois pour l'entreprise Jufré."
  },
  "projet-dautomatisation-dusine": {
    id: "machines-speciales-sopaltec", year: "2023 – 2024", tags: ["meca", "industrie"],
    summary: "Remise en état d'un convoyeur, outil d'insertion d'écrous inserts et assemblage de machines spéciales."
  },
  "visites-industrielles-misfat-et-caveo-–-enis-2024": {
    id: "visites-industrielles", year: "2024", tags: ["industrie"],
    summary: "Lignes de production de filtres et de ressorts à lames, postes de contrôle qualité et organisation des ateliers."
  },
  "remise-en-état-dun-laminoir-à-or-à-froid-2024": {
    id: "laminoir-or", year: "2024", tags: ["elec", "industrie"],
    summary: "Diagnostic, recâblage de la partie puissance et remise en service d'un laminoir de bijouterie, réalisé seul.",
    extra: [{ video: "videos/laminoir-3d.mp4", caption: "Modèle 3D du laminoir : colonne centrale et deux têtes de laminage" }]
  }
};

const TAGS = {
  meca: "Mécanique",
  elec: "Électrique et électronique",
  embarque: "Embarqué et logiciel",
  industrie: "Industrie et production"
};

const LINKS = {
  "interface-banc-powertrain": "interface.html",
  "modeles-3d": "modeles-3d.html"
};

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const inline = (s) => esc(s).replace(/\*\*\s*([^*]+?)\s*\*\*/g, "<strong>$1</strong>").replace(/\*\*/g, "");
const plain = (s) => String(s ?? "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();

function localLink(url) {
  const key = Object.keys(LINKS).find((k) => url.includes(k));
  return key ? LINKS[key] : url;
}

// Les photos des projets sont servies par la médiathèque du portfolio Wix,
// à la taille utile (miniature ou grande image).
function imageUrl(file, size) {
  const m = String(file).match(/^([0-9a-f]+)\.(\w+)$/i);
  if (!m) return "images/" + file;
  const id = `b056e6_${m[1]}~mv2.${m[2]}`;
  return `https://static.wixstatic.com/media/${id}/v1/fit/w_${size},h_${size},q_85/${m[1]}.jpg`;
}

// Prépare un projet : couverture, galerie, métadonnées.
function prepare(raw) {
  const meta = META[String(raw.s).normalize("NFC")] || { id: raw.s, year: "", tags: [], summary: "" };
  // un nom du type « pfe_banc_powertrain » est un nom de fichier : doublon de la couverture
  const isFileName = (n) => /^[a-z0-9]+(_[a-z0-9]+)+$/i.test(n || "");
  const items = raw.im.filter((i) => i[0] && i[0] !== "https:");
  const coverItem = items.find((i) => i[2] == null) || items[0];
  const gallery = items.filter((i) => i !== coverItem && !isFileName(i[1]));
  const pic = (i) => ({ src: imageUrl(i[0], 1600), thumb: imageUrl(i[0], 560), alt: plain(i[1]), w: i[2], h: i[3] });
  return { ...meta, raw, title: plain(raw.t), cover: coverItem ? pic(coverItem) : null, gallery: gallery.map(pic), details: raw.det.map(([k, v]) => [k, plain(v)]) };
}

async function loadProjects() {
  const res = await fetch("data/projects.json");
  if (!res.ok) throw new Error("data/projects.json introuvable");
  return (await res.json()).map(prepare);
}

/* ---------- Accueil ---------- */
async function renderHome() {
  const list = document.getElementById("project-list");
  if (!list) return;
  let projects;
  try { projects = await loadProjects(); } catch (e) { list.innerHTML = `<li class="loading">Les projets n'ont pas pu être chargés.</li>`; return; }
  list.innerHTML = projects.map((p) => `
    <li class="project-row" data-tags="${p.tags.join(" ")}">
      <a href="projet.html?p=${p.id}">
        <span class="year">${esc(p.year)}</span>
        <span class="thumb">${p.cover ? `<img src="${p.cover.thumb}" alt="" loading="lazy" width="440" height="330">` : ""}</span>
        <span class="body">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary)}</p>
          <ul class="tags">${p.tags.map((t) => `<li>${TAGS[t]}</li>`).join("")}</ul>
        </span>
      </a>
    </li>`).join("");

  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((b) => b.addEventListener("click", () => {
    buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const f = b.dataset.filter;
    let shown = 0;
    list.querySelectorAll(".project-row").forEach((row) => {
      const ok = f === "all" || row.dataset.tags.split(" ").includes(f);
      row.hidden = !ok;
      if (ok) shown++;
    });
    document.getElementById("filter-count").textContent = `${shown} projet${shown > 1 ? "s" : ""}`;
  }));
}

/* ---------- Description d'un projet ---------- */
function renderDescription(text) {
  const blocks = String(text).split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const out = [];
  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const first = lines[0];

    const url = first.match(/https?:\/\/\S+/);
    if (url && lines.length === 1) {
      const label = plain(first.replace(url[0], "").replace(/^▶/, "").replace(/:\s*$/, ""));
      const href = localLink(url[0]);
      out.push(`<a class="demo-link" href="${esc(href)}"><span><strong>${esc(label)}</strong><small>Ouvre une page interactive dans ce site</small></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>`);
      continue;
    }

    const tools = first.match(/^Outils\s*:\s*(.+)$/);
    if (tools && lines.length === 1) {
      const parts = plain(tools[1]).replace(/\.$/, "").split(/,\s*(?![^()]*\))/);
      out.push(`<h3>Outils</h3><ul class="tools-line">${parts.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`);
      continue;
    }

    let i = 0;
    let html = "";
    while (i < lines.length) {
      const l = lines[i];
      if (l.startsWith("•")) {
        const items = [];
        while (i < lines.length && lines[i].startsWith("•")) { items.push(lines[i].replace(/^•\s*/, "")); i++; }
        html += `<ul>${items.map((x) => `<li>${inline(x)}</li>`).join("")}</ul>`;
        continue;
      }
      const isHeading = (/:\s*$/.test(l) && lines[i + 1]?.startsWith("•")) || (/^\d+\.\s/.test(l) && l.length < 140);
      if (isHeading) { html += `<h3>${inline(l.replace(/\s*:\s*$/, ""))}</h3>`; i++; continue; }
      const lab = l.match(/^(Mission|Objectif|Résultat|Contexte)\s*:\s*(.+)$/);
      if (lab) { html += `<p><span class="lead-label">${lab[1]} :</span> ${inline(lab[2])}</p>`; i++; continue; }
      html += `<p>${inline(l)}</p>`;
      i++;
    }
    out.push(html);
  }
  return out.join("\n");
}

/* ---------- Page projet ---------- */
async function renderProject() {
  const root = document.getElementById("project");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("p");
  let projects;
  try { projects = await loadProjects(); } catch (e) { root.innerHTML = `<p class="loading">Ce projet n'a pas pu être chargé.</p>`; return; }
  const idx = Math.max(0, projects.findIndex((p) => p.id === id));
  const p = projects[idx];
  document.title = `${p.title} | Amin Driss`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", p.summary);

  const order = ["Rôle", "Date", "Emplacement", "Type de projet", "Compétences clés"];
  const det = [...p.details].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  const label = { Emplacement: "Lieu" };
  const cells = det.map(([k, v]) => {
    const full = k === "Rôle" || k === "Compétences clés" || v.length > 34;
    return `<div class="${full ? "full" : ""}"><dt>${esc(label[k] || k)}</dt><dd>${esc(v)}</dd></div>`;
  });
  // garder la grille à deux colonnes régulière
  const fixed = [];
  let half = [];
  cells.forEach((c) => {
    if (c.startsWith('<div class="full"')) { if (half.length) { fixed.push(half[0].replace('<div class=""', '<div class="full"')); half = []; } fixed.push(c); }
    else { half.push(c); if (half.length === 2) { fixed.push(...half); half = []; } }
  });
  if (half.length) fixed.push(half[0].replace('<div class=""', '<div class="full"'));

  (p.tutors || []).forEach((t) => {
    const links = (t.links || []).map((l) => `<a href="${l.href}" rel="noopener" target="_blank">${esc(l.label)}</a>`).join("");
    fixed.push(`<div class="full tutor"><dt>${esc(t.role)}</dt><dd><strong>${esc(t.name)}</strong>${t.org ? `<span>${esc(t.org)}</span>` : ""}${links ? `<span class="t-links">${links}</span>` : ""}</dd></div>`);
  });

  (p.links || []).forEach((l) => {
    fixed.push(`<div class="full tutor"><dt>${esc(l.label)}</dt><dd><span class="t-links"><a href="${l.href}" rel="noopener" target="_blank">${esc(l.text)}</a></span></dd></div>`);
  });

  const extras = p.extra || [];
  const linkExtras = extras.filter((x) => x.link);
  const videoExtras = extras.filter((x) => x.video);

  const media = [
    ...videoExtras.map((v) => ({ video: v.video, alt: v.caption })),
    ...p.gallery
  ];

  root.innerHTML = `
    <div class="wrap">
      <a class="back" href="index.html#projets">Tous les projets</a>
      <header class="p-head">
        <h1>${esc(p.title)}</h1>
        <p class="summary">${esc(p.summary)}</p>
      </header>
      ${p.cover ? `<figure class="p-cover"><img src="${p.cover.src}" alt="${esc(p.cover.alt)}"></figure>` : ""}
      <div class="p-body">
        <article class="prose">
          ${linkExtras.map((x) => `<a class="demo-link" href="${x.link}"><span><strong>${esc(x.label)}</strong><small>${esc(x.note)}</small></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>`).join("")}
          ${renderDescription(p.raw.d.replace(/\n*Modèles 3D interactifs[^\n]*https?:\/\/\S+/, ""))}
        </article>
        <aside class="cartouche" aria-label="Fiche du projet">
          <dl>${fixed.join("")}</dl>
          <div class="sign full"><span>Amin Driss</span><small>Projet ${idx + 1} sur ${projects.length}</small></div>
        </aside>
      </div>
      ${media.length ? `
      <section aria-labelledby="g-title">
        <div class="gallery-head"><h2 id="g-title">Images du projet</h2><span>${media.length} élément${media.length > 1 ? "s" : ""}</span></div>
        <div class="gallery">
          ${media.map((m, k) => m.video
            ? `<figure><video class="is-video" src="${m.video}" controls muted loop playsinline preload="metadata"></video><figcaption>${esc(m.alt)}</figcaption></figure>`
            : `<figure><button type="button" data-k="${k}" aria-label="Agrandir : ${esc(m.alt)}"><img src="${m.thumb}" alt="${esc(m.alt)}" loading="lazy" ${m.w ? `width="${m.w}" height="${m.h}"` : ""}></button><figcaption>${esc(m.alt)}</figcaption></figure>`).join("")}
        </div>
      </section>` : ""}
      <nav class="p-nav" aria-label="Autres projets">
        ${idx > 0 ? `<a href="projet.html?p=${projects[idx - 1].id}"><small>Projet précédent</small><strong>${esc(projects[idx - 1].title)}</strong></a>` : "<span></span>"}
        ${idx < projects.length - 1 ? `<a class="next" href="projet.html?p=${projects[idx + 1].id}"><small>Projet suivant</small><strong>${esc(projects[idx + 1].title)}</strong></a>` : "<span></span>"}
      </nav>
    </div>`;

  setupViewer(media);
}

function setupViewer(media) {
  const dlg = document.getElementById("viewer");
  if (!dlg) return;
  const pics = media.map((m, k) => ({ ...m, k })).filter((m) => !m.video);
  const img = dlg.querySelector("img");
  const cap = dlg.querySelector("p");
  let pos = 0;
  const show = (n) => {
    pos = (n + pics.length) % pics.length;
    img.src = pics[pos].src;
    img.alt = pics[pos].alt;
    cap.textContent = `${pics[pos].alt} (${pos + 1} / ${pics.length})`;
  };
  document.querySelectorAll(".gallery button[data-k]").forEach((b) => b.addEventListener("click", () => {
    show(pics.findIndex((m) => String(m.k) === b.dataset.k));
    dlg.showModal();
  }));
  dlg.querySelector(".close").addEventListener("click", () => dlg.close());
  dlg.querySelector(".prev").addEventListener("click", () => show(pos - 1));
  dlg.querySelector(".next").addEventListener("click", () => show(pos + 1));
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(pos - 1);
    if (e.key === "ArrowRight") show(pos + 1);
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.classList.contains("inner")) dlg.close(); });
}

renderHome();
renderProject();
