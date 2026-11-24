/* ===== Hall da Fama =====
   Dados em assets/hall-dados.js (const hallDaFama). Prévia com dados fictícios: hall-da-fama.html?demo=1 */
(function () {
  if (document.body.dataset.page !== "hall") return;
  const root = document.getElementById("hf");
  const demo = new URLSearchParams(location.search).has("demo");

  const DEMO = [
    { id: "demo-copa", tipo: "copa", nome: "Copa Exemplo", edicao: "1ª Edição", status: "encerrado", fundo: "", trofeu: "", link: "",
      campeao: { nome: "Falcões FC" },
      premios: {
        artilheiro: { psn: "Matador27", time: "Falcões FC", stats: { g: 14, a: 5, j: 7 } },
        garcom: { psn: "Maestro10", time: "Dragões do Norte", stats: { a: 11, g: 4, j: 7 } },
        mvp: { psn: "CraqueBR", time: "Falcões FC", stats: { m: 5, g: 9, a: 6, j: 7 } },
        goleiro: { psn: "Paredao1", time: "Lobos da Vila", stats: { def: 48, gs: 9, j: 6 } } } },
    { id: "demo-br", tipo: "brasileirao", nome: "Brasileirão Exemplo", edicao: "2ª Edição", status: "andamento", fundo: "", trofeu: "", link: "",
      campeao: null,
      premios: {
        artilheiro: { psn: "Foguete33", time: "Tubarões United", parcial: true, stats: { g: 8, a: 2, j: 4 } },
        garcom: { psn: "Mago99", time: "Fênix SC", parcial: true, stats: { a: 6, g: 1, j: 4 } },
        mvp: null,
        goleiro: { psn: "Luvas7", time: "Real Várzea", parcial: true, stats: { def: 21, gs: 4, j: 4 } } } }
  ];
  const lista = (demo ? DEMO : (typeof hallDaFama !== "undefined" ? hallDaFama : [])).slice();

  const cor = n => { let h = 0; for (const c of String(n)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const sigla = n => String(n).split(/\s+/).filter(w => w.length > 2 || /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join("").toUpperCase() || String(n).slice(0, 2).toUpperCase();
  const escudo = (nome, cls = "") => `<span class="hf-shield ${cls}" style="--h:${cor(nome)}">${esc(sigla(nome))}</span>`;
  const num = v => (v === undefined || v === null || v === "") ? "–" : String(v);
  const imgSrc = f => /^https?:\/\//.test(f) ? f : /^players\//.test(f) ? `assets/${f}?v=${ASSET_V}` : media("hall", f);

  /* Índice de eficiência do goleiro: defesas ÷ (defesas + gols sofridos) × 100 */
  const ieg = s => s && (s.def || 0) + (s.gs || 0) ? (s.def / (s.def + s.gs) * 100).toFixed(1).replace(".", ",") : null;

  const CATS = [
    { k: "artilheiro", ico: "⚽", nome: "Artilheiro", big: s => [num(s.g), "gols"], mini: [["a", "assist."], ["j", "jogos"]] },
    { k: "garcom", ico: "🎯", nome: "Garçom", big: s => [num(s.a), "assistências"], mini: [["g", "gols"], ["j", "jogos"]] },
    { k: "mvp", ico: "⭐", nome: "MVP", big: s => [num(s.m), "vezes melhor em campo"], mini: [["g", "gols"], ["a", "assist."], ["j", "jogos"]] },
    { k: "goleiro", ico: "🧤", nome: "Melhor goleiro", big: s => [ieg(s) ? ieg(s) + "%" : "–", "de eficiência (IEG)"], mini: [["def", "defesas"], ["gs", "sofridos"], ["j", "jogos"]] }
  ];

  const TROFEU = id => `<svg class="hf-taca" viewBox="0 0 120 140" role="img" aria-label="Taça">
    <defs><linearGradient id="hg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe7a6"/><stop offset=".5" stop-color="#e9b949"/><stop offset="1" stop-color="#a97a16"/></linearGradient></defs>
    <path d="M30 14h60v34c0 22-13 38-30 42-17-4-30-20-30-42z" fill="url(#hg${id})"/>
    <path d="M30 22H12c0 22 8 36 24 40M90 22h18c0 22-8 36-24 40" fill="none" stroke="url(#hg${id})" stroke-width="7" stroke-linecap="round"/>
    <rect x="54" y="88" width="12" height="24" fill="url(#hg${id})"/><path d="M34 112h52l8 20H26z" fill="url(#hg${id})"/>
    <path d="M60 30l5 10 11 1.5-8 7.5 2 11-10-5.500-10 5.500 2-11-8-7.500 11-1.500z" fill="#17120a" opacity=".28"/></svg>`;

  const SILHUETA = `<svg viewBox="0 0 120 160" aria-hidden="true"><circle cx="60" cy="52" r="26"/><path d="M8 160c2-44 24-66 52-66s50 22 52 66z"/></svg>`;

  const fotoHtml = (p, cat) => p && p.foto
    ? `<img src="${esc(imgSrc(p.foto))}" alt="${esc(p.psn)}" loading="lazy" onerror="this.remove()">${`<div class="hf-sil">${SILHUETA}</div>`}`
    : `<div class="hf-sil">${SILHUETA}</div>`;

  const cardHtml = (cat, p) => {
    if (!p || !p.psn) return `<article class="hf-card vazio"><div class="hf-ribbon"><i>${cat.ico}</i>${cat.nome}</div>
      <div class="hf-foto">${`<div class="hf-sil">${SILHUETA}</div>`}</div>
      <div class="hf-info"><h4>A definir</h4><span class="hf-clube">Ainda sem vencedor</span></div></article>`;
    const s = p.stats || {}, [bv, bl] = cat.big(s);
    return `<article class="hf-card${p.parcial ? " parcial" : ""}"><div class="hf-ribbon"><i>${cat.ico}</i>${cat.nome}</div>
      <div class="hf-foto">${fotoHtml(p, cat)}${p.parcial ? `<span class="hf-lider">Líder atual</span>` : ""}</div>
      <div class="hf-info"><h4>${esc(p.psn)}</h4>${p.time ? `<span class="hf-clube">${escudo(p.time, "sm")}${esc(p.time)}</span>` : ""}</div>
      <div class="hf-big"><b>${esc(bv)}</b><span>${esc(bl)}</span></div>
      <div class="hf-mini">${cat.mini.map(([k, l]) => `<div><b>${esc(num(s[k]))}</b><span>${l}</span></div>`).join("")}</div></article>`;
  };

  const salaHtml = (c, i) => {
    const fim = c.status === "encerrado";
    const fundo = c.fundo ? `<div class="hf-fundo" style="background-image:url('${esc(media("hall", c.fundo))}')" aria-hidden="true"></div>` : `<div class="hf-fundo padrao" aria-hidden="true"></div>`;
    const taca = c.fundo ? `<div class="hf-vao" aria-hidden="true"></div>` : c.trofeu ? `<img class="hf-taca img" src="${esc(media("hall", c.trofeu))}" alt="Taça da ${esc(c.nome)}">` : TROFEU(i);
    const campeao = c.campeao && c.campeao.nome
      ? `<div class="hf-placa"><span>Campeão</span><b>${esc(c.campeao.nome)}</b></div>`
      : `<div class="hf-placa vazio"><span>${fim ? "Campeão" : "Em disputa"}</span><b>${fim ? "A definir" : "Quem levanta a taça?"}</b></div>`;
    const tipo = c.tipo === "brasileirao" ? "Brasileirão" : "Copa";
    return `<section class="hf-sala" id="${esc(c.id)}">${fundo}
      <div class="wrap">
        <header class="hf-head"><div><span class="hf-tag ${c.tipo}">${tipo}</span><h2>${esc(c.nome)}</h2>${c.edicao ? `<p>${esc(c.edicao)}</p>` : ""}</div>
          <div class="hf-head-r"><span class="hf-status ${fim ? "fim" : "live"}"><i></i>${fim ? "Encerrado" : "Em andamento"}</span>${c.link ? `<a class="btn btn-ghost btn-sm" href="${esc(c.link)}">Ver campeonato</a>` : ""}</div></header>
        <div class="hf-palco">${taca}${campeao}</div>
        <div class="hf-cards">${CATS.map(cat => cardHtml(cat, (c.premios || {})[cat.k])).join("")}</div>
      </div></section>`;
  };

  const fechados = lista.filter(c => c.status === "encerrado").length;
  const hero = `<header class="hf-hero"><div class="wrap">
    <div class="eyebrow">Morpheus FC</div><h1>Hall da Fama</h1>
    <p>Aqui ficam os campeões e os melhores de cada campeonato: artilheiro, garçom, MVP e melhor goleiro.</p>
    ${demo ? `<div class="hf-demo">Prévia com dados fictícios. A página real mostra só os campeonatos do site.</div>` : ""}
    <div class="hf-nums"><div><b>${lista.length}</b><span>campeonatos</span></div><div><b>${fechados}</b><span>encerrados</span></div><div><b>${fechados * 4}</b><span>prêmios entregues</span></div></div>
  </div></header>`;

  const subnav = lista.length > 1 ? `<div class="hf-subnav"><div class="wrap">${lista.map(c => `<a href="#${esc(c.id)}">${esc(c.nome)}</a>`).join("")}</div></div>` : "";
  root.innerHTML = hero + subnav + (lista.length ? lista.map(salaHtml).join("") : `<section class="hf-sala"><div class="hf-fundo padrao"></div><div class="wrap"><p class="sec-sub">Os campeonatos aparecem aqui assim que começarem.</p></div></section>`);

  /* destaca no menu de seções a sala que está na tela */
  const links = [...document.querySelectorAll(".hf-subnav a")];
  const espia = () => { let atual = ""; links.forEach(a => { const el = document.getElementById(a.getAttribute("href").slice(1)); if (el && el.getBoundingClientRect().top <= 180) atual = a.getAttribute("href"); }); links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === atual)); };
  if (links.length) { addEventListener("scroll", () => { clearTimeout(espia.t); espia.t = setTimeout(espia, 60); }, { passive: true }); espia(); }
})();
