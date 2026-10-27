/* Comparar clubes: busca qualquer clube (função "clube" do Supabase, que consulta o Pro Clubs Tracker) e compara dois lados.
   Ver supabase-clube-function.ts. Usa matches (matches.js) para mostrar o histórico do Morpheus contra o rival. */
(function () {
  if (document.body.dataset.page !== "clubes") return;
  const MORPHEUS = "37568";
  const PLATS = [["common-gen5", "PS5 / Xbox Series / PC"], ["nx", "Switch"]];
  const cfg = window.SUPABASE || {};
  const url = cfg.url ? cfg.url + "/functions/v1/clube" : null;
  const box = document.getElementById("clb");
  const cache = new Map();

  async function api(params) {
    if (!url) throw new Error("A busca de clubes não está configurada.");
    const k = JSON.stringify(params);
    if (cache.has(k)) return cache.get(k);
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 12000);
    try {
      const r = await fetch(url + "?" + new URLSearchParams(params), { headers: cfg.key && cfg.key.startsWith("eyJ") ? { apikey: cfg.key, Authorization: "Bearer " + cfg.key } : { apikey: cfg.key }, signal: ctl.signal });
      const j = await r.json().catch(() => null);
      if (!r.ok) { const e = new Error(r.status === 404 ? "A busca de clubes ainda não foi ativada neste site." : (j && j.erro) || "Erro " + r.status); e.status = r.status; throw e; }
      cache.set(k, j);
      return j;
    } finally { clearTimeout(t); }
  }

  /* ---------- números derivados ---------- */
  const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  const f1 = v => v.toFixed(1).replace(".", ","), f2 = v => v.toFixed(2).replace(".", ","), int = v => String(Math.round(v));
  const pct = c => c.jogos ? c.v / c.jogos * 100 : null;
  const gpj = c => c.jogos ? c.gp / c.jogos : null;
  const gcj = c => c.jogos ? c.gc / c.jogos : null;
  const notaElenco = c => {
    const l = c.jogadores.filter(p => p.nota > 0 && p.jogos > 0), jg = l.reduce((s, p) => s + p.jogos, 0);
    return jg ? l.reduce((s, p) => s + p.nota * p.jogos, 0) / jg : null;
  };
  /* [rótulo, valor, formatação, menos é melhor, neutro (não conta ponto)] */
  const METRICAS = [
    ["Skill rating (SR)", c => c.sr, int],
    ["Aproveitamento (vitórias)", pct, v => int(v) + "%"],
    ["Vitórias", c => c.v, int],
    ["Derrotas", c => c.d, int, true],
    ["Empates", c => c.e, int, false, true],
    ["Jogos disputados", c => c.jogos, int, false, true],
    ["Gols marcados", c => c.gp, int],
    ["Gols sofridos", c => c.gc, int, true],
    ["Saldo de gols", c => c.gp - c.gc, v => (v > 0 ? "+" : "") + int(v)],
    ["Gols por jogo", gpj, f2],
    ["Gols sofridos por jogo", gcj, f2, true],
    ["Maior sequência de vitórias", c => c.seqV, int],
    ["Maior sequência sem perder", c => c.seqInvicta, int],
    ["Promoções", c => c.promocoes, int],
    ["Nota média do elenco", notaElenco, f2]
  ];

  /* estimativa de resultado: SR + saldo de gols por jogo (com peso menor para amostras pequenas) */
  const forca = c => c.sr + (c.jogos / (c.jogos + 30)) * 150 * ((c.gp - c.gc) / Math.max(c.jogos, 1));
  function chances(a, b) {
    const pa = 1 / (1 + Math.pow(10, -(forca(a) - forca(b)) / 450));
    const emp = Math.min(.2, Math.max(.08, ((a.jogos ? a.e / a.jogos : .12) + (b.jogos ? b.e / b.jogos : .12)) / 2));
    return { a: pa * (1 - emp), e: emp, b: (1 - pa) * (1 - emp) };
  }

  /* ---------- estado ---------- */
  const q = new URLSearchParams(location.search);
  const plat = p => PLATS.some(x => x[0] === p) ? p : "common-gen5";
  const slots = [
    { el: document.getElementById("slotA"), id: q.get("a") || MORPHEUS, plat: plat(q.get("pa")), club: null, rotulo: "Clube 1" },
    { el: document.getElementById("slotB"), id: q.get("b") || "", plat: plat(q.get("pb")), club: null, rotulo: "Clube 2" }
  ];

  slots.forEach((s, i) => {
    s.el.innerHTML = `<label>${s.rotulo}</label>
      <div class="clb-box">
        <input type="search" maxlength="40" placeholder="Digite o nome do clube" autocomplete="off" aria-label="Nome do ${s.rotulo.toLowerCase()}">
        <select aria-label="Plataforma do ${s.rotulo.toLowerCase()}">${PLATS.map(p => `<option value="${p[0]}">${p[1]}</option>`).join("")}</select>
        <ul class="clb-res" hidden></ul>
      </div>
      <div class="clb-status" aria-live="polite"></div>`;
    s.input = s.el.querySelector("input"); s.sel = s.el.querySelector("select");
    s.res = s.el.querySelector(".clb-res"); s.st = s.el.querySelector(".clb-status");
    s.sel.value = s.plat;
    let t = null;
    const busca = async () => {
      const nome = s.input.value.trim();
      if (nome.length < 2) { s.res.hidden = true; return; }
      s.st.textContent = "Buscando…";
      try {
        const lista = await api({ acao: "buscar", nome, plataforma: s.sel.value });
        s.st.textContent = lista.length ? "" : "Nenhum clube encontrado com esse nome.";
        s.res.innerHTML = lista.map(c => `<li><button type="button" data-id="${esc(c.id)}"><b>${esc(c.nome)}</b><small>${c.jogos} jogos · ${c.v}V ${c.e}E ${c.d}D · ID ${esc(c.id)}</small></button></li>`).join("");
        s.res.hidden = !lista.length;
      } catch (e) { s.st.textContent = e.message; s.res.hidden = true; }
    };
    s.input.oninput = () => { clearTimeout(t); if (s.input.value.trim().length >= 3) t = setTimeout(busca, 450); else s.res.hidden = true; };
    s.input.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); clearTimeout(t); busca(); } else if (e.key === "Escape") s.res.hidden = true; };
    s.sel.onchange = () => { s.plat = s.sel.value; if (s.input.value.trim().length >= 2) busca(); };
    s.res.onclick = e => {
      const b = e.target.closest("button[data-id]"); if (!b) return;
      s.id = b.dataset.id; s.plat = s.sel.value; s.res.hidden = true; carrega(s);
    };
  });
  document.addEventListener("click", e => slots.forEach(s => { if (!s.el.contains(e.target)) s.res.hidden = true; }));

  async function carrega(s) {
    if (!s.id) { s.club = null; desenha(); return; }
    s.st.textContent = "Carregando clube…";
    try {
      s.club = await api({ acao: "clube", id: s.id, plataforma: s.plat });
      s.input.value = s.club.nome; s.st.textContent = "";
    } catch (e) { s.club = null; s.st.textContent = e.message; }
    desenha();
  }

  /* ---------- desenho ---------- */
  const platNome = p => (PLATS.find(x => x[0] === p) || [, p])[1];
  const formaChips = c => !c.recentes.length ? "" : `<div class="cmp-forma clb-forma"><span>Últimos jogos</span>${c.recentes.slice().reverse().map(m => {
    const r = m.gp > m.gc ? "v" : m.gp < m.gc ? "d" : "e";
    return `<i class="r-${r}" title="${esc(m.adv)} ${m.gp} x ${m.gc}">${r.toUpperCase()}</i>`; }).join("")}</div>`;
  const cartao = c => `<div class="panel clb-card">
      <h2>${esc(c.nome)}</h2><div class="clb-sub">${esc(platNome(c.plataforma))} · ID ${esc(c.id)}</div>
      <div class="clb-nums"><div><b>${c.sr || "–"}</b><span>SR</span></div><div><b>${c.jogos}</b><span>Jogos</span></div><div><b>${c.v}-${c.e}-${c.d}</b><span>V-E-D</span></div></div>
      ${formaChips(c)}</div>`;

  function destaques(a, b) {
    const top = (c, f, min) => { const l = c.jogadores.filter(p => !min || p.jogos >= min); const pool = l.length ? l : c.jogadores; return pool.slice().sort((x, y) => f(y) - f(x))[0] || null; };
    const lin = (nome, f, un, min) => {
      const x = top(a, f, min), y = top(b, f, min);
      const cel = p => p ? `<div class="clb-pl"><b>${esc(p.nome)}</b><small>${esc(p.psn)}</small></div><em>${un(p)}</em>` : `<div class="clb-pl"><b>–</b></div>`;
      return `<div class="clb-dest"><div class="clb-d-a">${cel(x)}</div><span>${nome}</span><div class="clb-d-b">${cel(y)}</div></div>`;
    };
    return `<div class="panel clb-destaques"><h3>Destaques de cada elenco</h3>
      ${lin("Artilheiro", p => p.gols, p => p.gols + " gols")}
      ${lin("Mais assistências", p => p.assist, p => p.assist + " assist.")}
      ${lin("Mais MVP", p => p.mvp, p => p.mvp + " MVP")}
      ${lin("Melhor nota (mín. 5 jogos)", p => p.nota, p => f1(p.nota), 5)}
    </div>`;
  }

  function confronto(a, b) {
    const eu = [a, b].find(c => c.id === MORPHEUS), outro = [a, b].find(c => c !== eu);
    if (!eu || !outro || typeof matches === "undefined") return "";
    const n = norm(outro.nome), l = matches.filter(m => norm(m.opp) === n);
    if (!l.length) return `<div class="panel clb-conf"><h3>Nossos confrontos</h3><p class="sec-sub" style="margin:0">Ainda não enfrentamos ${esc(outro.nome)} nas partidas guardadas no site.</p></div>`;
    const v = l.filter(m => m.r === "V").length, e = l.filter(m => m.r === "E").length, d = l.filter(m => m.r === "D").length;
    const gf = l.reduce((s, m) => s + m.g[0], 0), ga = l.reduce((s, m) => s + m.g[1], 0);
    return `<div class="panel clb-conf"><h3>Nossos confrontos contra ${esc(outro.nome)}</h3>
      <div class="clb-nums"><div><b>${v}-${e}-${d}</b><span>V-E-D</span></div><div><b>${gf} x ${ga}</b><span>Gols</span></div><div><b>${l.length}</b><span>Jogos</span></div></div>
      <ul class="clb-list">${l.slice(0, 6).map(m => `<li class="r-${m.r.toLowerCase()}"><i>${m.r}</i><span>Morpheus ${m.g[0]} x ${m.g[1]} ${esc(m.opp)}</span><small>${new Date(m.date).toLocaleDateString("pt-BR")}</small></li>`).join("")}</ul></div>`;
  }

  function desenha() {
    const [sa, sb] = slots, a = sa.club, b = sb.club;
    try {
      const p = new URLSearchParams();
      if (a) { p.set("a", a.id); p.set("pa", a.plataforma); }
      if (b) { p.set("b", b.id); p.set("pb", b.plataforma); }
      history.replaceState(null, "", p.toString() ? "?" + p.toString() : location.pathname);
    } catch (e) {}
    if (!a || !b) { box.innerHTML = `<div class="empty-state">${a || b ? "Agora escolha o outro clube para comparar." : "Escolha os dois clubes para comparar."}</div>`; return; }

    let pa = 0, pb = 0;
    const linhas = METRICAS.map(([nome, fn, fmt, menos, neutro]) => {
      const x = fn(a), y = fn(b), ok = x !== null && y !== null;
      const lead = ok && !neutro && x !== y ? ((x > y) !== !!menos ? "a" : "b") : "";
      if (lead === "a") pa++; else if (lead === "b") pb++;
      const tot = ok ? Math.abs(x) + Math.abs(y) : 0;
      let w = ok && tot ? Math.abs(x) / tot * 100 : 50;
      if (menos && ok && tot) w = 100 - w;
      const v = z => z === null ? "–" : fmt(z);
      return `<div class="sbar"><b class="${lead === "a" ? "lead" : ""}">${v(x)}</b>
        <div><span>${nome}</span><div class="track"><i style="width:${w}%"></i></div></div>
        <b class="${lead === "b" ? "lead" : ""}">${v(y)}</b></div>`;
    }).join("");

    const ch = chances(a, b), P = x => Math.round(x * 100);
    const dif = ch.a - ch.b;
    const veredito = Math.abs(dif) < .06 ? "Confronto equilibrado" : `${esc(dif > 0 ? a.nome : b.nome)} é favorito`;
    const placar = pa === pb ? "Empate nos números" : `${esc(pa > pb ? a.nome : b.nome)} vence em ${Math.max(pa, pb)} categorias`;
    const nomeCurto = s => esc(s.length > 18 ? s.slice(0, 17) + "…" : s);

    box.innerHTML = `
      <div class="cmp-grid clb-grid">
        <div class="cmp-side">${cartao(a)}</div>
        <div class="cmp-vs"><span>VS</span><b>${pa}<i>x</i>${pb}</b><small>categorias vencidas</small></div>
        <div class="cmp-side">${cartao(b)}</div>
      </div>
      <div class="panel clb-prob"><h3>Chance de vitória <small>(estimativa)</small></h3>
        <div class="clb-prob-bar" role="img" aria-label="${nomeCurto(a.nome)} ${P(ch.a)}%, empate ${P(ch.e)}%, ${nomeCurto(b.nome)} ${P(ch.b)}%">
          <i class="pa" style="width:${ch.a * 100}%"></i><i class="pe" style="width:${ch.e * 100}%"></i><i class="pb" style="width:${ch.b * 100}%"></i></div>
        <div class="clb-prob-leg"><span><b>${P(ch.a)}%</b> ${nomeCurto(a.nome)}</span><span><b>${P(ch.e)}%</b> Empate</span><span><b>${P(ch.b)}%</b> ${nomeCurto(b.nome)}</span></div>
        <div class="clb-verdict">${veredito}</div></div>
      <div class="panel cmp-table"><div class="cmp-win">${placar}</div>${linhas}</div>
      ${destaques(a, b)}
      ${confronto(a, b)}
      <div class="clb-actions"><button class="btn btn-gold btn-sm" type="button" id="clbLink">Copiar link</button><button class="fbtn" type="button" id="clbTxt">Copiar resumo</button><span class="clb-ok" id="clbOk" aria-live="polite"></span></div>`;

    const copia = async (txt, msg) => {
      try { await navigator.clipboard.writeText(txt); } catch (e) { const t = document.createElement("textarea"); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (e2) {} t.remove(); }
      const ok = document.getElementById("clbOk"); ok.textContent = msg; setTimeout(() => { ok.textContent = ""; }, 2500);
    };
    document.getElementById("clbLink").onclick = () => copia(location.href, "Link copiado!");
    document.getElementById("clbTxt").onclick = () => copia(
      `${a.nome} x ${b.nome}\nSR: ${a.sr} x ${b.sr}\nCampanha: ${a.v}V ${a.e}E ${a.d}D x ${b.v}V ${b.e}E ${b.d}D\nChance de vitória: ${P(ch.a)}% / ${P(ch.e)}% empate / ${P(ch.b)}%\n${placar}\n${location.href}`, "Resumo copiado!");
  }

  document.getElementById("clbSwap").onclick = () => {
    const [x, y] = slots;
    [x.id, y.id] = [y.id, x.id]; [x.plat, y.plat] = [y.plat, x.plat]; [x.club, y.club] = [y.club, x.club];
    slots.forEach(s => { s.sel.value = s.plat; s.input.value = s.club ? s.club.nome : ""; });
    desenha();
  };

  slots.forEach(s => { s.sel.value = s.plat; });
  desenha();
  slots.forEach(s => { if (s.id) carrega(s); });
})();
