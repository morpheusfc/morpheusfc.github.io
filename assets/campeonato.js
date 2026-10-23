/* Campeonato do Morpheus FC.
   PROTÓTIPO: tudo abaixo (times, jogos e jogadores) é DADO DE EXEMPLO só para você ver o visual.
   Quando for valendo, os times e os IDs entram pelo painel admin e os jogos/estatísticas vêm dos amistosos de cada clube.
   Campos principais:
     numTimes / porGrupo / classificam : formato (16 times, 4 por grupo, 2 passam = quartas; 8 times, 2 grupos, 2 passam = semis)
     status : "inscricoes" | "andamento" | "encerrado"
     jogos  : fase = "grupos" | "quartas" | "semis" | "final". casa/fora = id do time, ou vaga ("1A" = 1º do grupo A, "V1" = vencedor do jogo 1 da fase anterior).
              gc / gf = gols de casa / de fora (null = ainda não jogou). */
const campeonato = (() => {
  const estado = new URLSearchParams(location.search).get("estado") === "inscricoes" ? "inscricoes" : "andamento";   /* só na prévia: ?estado=inscricoes */
  const base = new Date(); base.setHours(20, 0, 0, 0); base.setDate(base.getDate() + (estado === "inscricoes" ? 10 : -4));
  const nomes = ["Falcões FC","Dragões do Norte","Real Várzea","Lobos da Vila","Tubarões United","Fênix SC","Titãs FC","Atlético Tropeiro",
                 "Cobras de Aço","Gigantes da Serra","Pantera Negra FC","Furacão Azul","Guerreiros FC","Leões do Sul","Corsários FC","Viking Pro"];
  const plat = ["PlayStation","Xbox","PC"];
  const todosTimes = nomes.map((nome, i) => ({ id: i + 1, nome, plataforma: plat[i % 3], clubId: String(100100 + i * 37), grupo: "ABCD"[Math.floor(i / 4)] }));
  const rnd = s => { const x = Math.sin(s * 9301.7) * 10000; return x - Math.floor(x); };
  const dia = (o, h) => { const d = new Date(base); d.setDate(d.getDate() + o); d.setHours(h, 0, 0, 0); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(h).padStart(2, "0")}:00`; };
  const jogos = []; let id = 1;
  const rodadas = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]];
  rodadas.forEach((par, r) => "ABCD".split("").forEach((g, gi) => par.forEach(([a, b], k) => {
    const t = todosTimes.filter(x => x.grupo === g);
    const jogado = estado === "andamento" && r < 2;
    jogos.push({ id: id++, fase: "grupos", grupo: g, rodada: r + 1, data: dia(r * 2 + (gi > 1 ? 1 : 0), 20 + k), casa: t[a].id, fora: t[b].id,
      gc: jogado ? Math.floor(rnd(id) * 5) : null, gf: jogado ? Math.floor(rnd(id + 50) * 4) : null });
  })));
  const mata = [["quartas", ["1A", "2B"], dia(7, 20)], ["quartas", ["1C", "2D"], dia(7, 21)], ["quartas", ["1B", "2A"], dia(8, 20)], ["quartas", ["1D", "2C"], dia(8, 21)],
                ["semis", ["V1", "V2"], dia(14, 20)], ["semis", ["V3", "V4"], dia(14, 21)], ["final", ["V1", "V2"], dia(21, 20)]];
  mata.forEach(([fase, [c, f], data]) => jogos.push({ id: id++, fase, data, casa: c, fora: f, gc: null, gf: null }));
  const times = estado === "inscricoes" ? todosTimes.slice(0, 12).map(t => ({ ...t, grupo: null })) : todosTimes;
  const jogadores = [];
  if (estado === "andamento") times.forEach((t, i) => ["a", "b"].forEach((s, k) => jogadores.push({
    psn: ["Craque", "Maestro", "Matador", "Muralha", "Driblador", "Foguete", "Tanque", "Mago"][(i + k * 3) % 8] + String(10 + i * 3 + k), time: t.id,
    j: 2, g: Math.floor(rnd(i * 7 + k) * 5), a: Math.floor(rnd(i * 5 + k + 90) * 4), m: Math.floor(rnd(i * 3 + k + 40) * 2) })));
  if (estado === "andamento") times.forEach((t, i) => jogadores.push({ psn: ["Paredao", "Gato", "Muralha", "Luvas", "Trave", "Pegador"][i % 6] + String(1 + i), time: t.id, pos: "G", j: 2, g: 0, a: 0, m: 0, def: 4 + Math.floor(rnd(i * 11 + 5) * 12), gs: Math.floor(rnd(i * 13 + 8) * 6) }));
  return {
    demo: true,
    nome: "Copa Morpheus", edicao: "1ª Edição", slogan: "16 clubes. Um troféu. Só um campeão.",
    status: estado, numTimes: 16, porGrupo: 4, classificam: 2,
    inicio: dia(0, 20),
    plataformas: "PlayStation, Xbox e PC",
    /* Fotos de fundo de cada parte (arquivos dentro de assets/bg/). Vazio = só o visual padrão. Tamanho ideal: 1920 x 900 px, JPG, até 250 KB. */
    fotos: { hero: "", equipes: "", grupos: "", jogos: "", matamata: "", stats: "", premiacao: "", regras: "" },
    times, jogos: estado === "inscricoes" ? jogos.filter(j => j.fase !== "grupos") : jogos, jogadores,
    premios: [
      ["🏆", "Campeão", "Troféu virtual e card de campeão com o escudo do clube em destaque no site"],
      ["🥈", "Vice-campeão", "Medalha virtual e menção no Morpheus News"],
      ["⚽", "Artilheiro", "Quem fizer mais gols na competição"],
      ["🎯", "Garçom", "Líder de assistências"],
      ["⭐", "Craque do campeonato", "Mais vezes eleito melhor em campo"],
      ["🧤", "Melhor goleiro", "Maior Índice de Eficiência do Goleiro (IEG): defesas ÷ (defesas + gols sofridos) × 100"],
      ["🛡️", "Defesa menos vazada", "Clube que sofrer menos gols"]
    ],
    regras: [
      ["Formato", "Fase de grupos (todos contra todos dentro do grupo), depois quartas de final, semifinais e final, em jogo único."],
      ["Os jogos", "Todos os jogos são amistosos entre os clubes, nos horários definidos pela organização."],
      ["Plataformas", "Aberto a todas as plataformas."],
      ["Pontuação", "Vitória vale 3 pontos, empate 1 e derrota 0."],
      ["Desempate", "Pontos, saldo de gols, gols marcados e número de vitórias."],
      ["Melhor goleiro", "O prêmio de Melhor Goleiro será concedido ao atleta que apresentar o maior Índice de Eficiência do Goleiro (IEG) durante o campeonato. IEG = Defesas ÷ (Defesas + Gols Sofridos) × 100. O índice representa o percentual de defesas em relação ao total de defesas realizadas e gols sofridos."]
    ]
  };
})();

/* Lê o campeonato publicado (campeonatos, campeonato_times e campeonato_jogos no Supabase) e converte para o formato usado na página. */
async function carregaCampeonato() {
  const cfg = window.SUPABASE || {};
  if (!cfg.url || !cfg.key) return null;
  const h = cfg.key.startsWith("eyJ") ? { apikey: cfg.key, Authorization: "Bearer " + cfg.key } : { apikey: cfg.key };
  const get = async p => { const r = await fetch(`${cfg.url}/rest/v1/${p}`, { headers: h }); if (!r.ok) throw new Error(p + ": " + r.status); return r.json(); };
  try {
    const cs = await get("campeonatos?select=*&publico=eq.true&order=created_at.desc&limit=1");
    if (!cs.length) return null;
    const c = cs[0];
    const [ts, js] = await Promise.all([
      get(`campeonato_times?select=*&campeonato_id=eq.${c.id}&order=created_at.asc`),
      get(`campeonato_jogos?select=*&campeonato_id=eq.${c.id}&order=ordem.asc`)]);
    const num = {}; ts.forEach((t, i) => { num[t.id] = i + 1; });
    const g = c.num_times <= 8 ? 2 : 4;
    return {
      demo: false, nome: c.nome, edicao: c.edicao, slogan: c.slogan, status: c.status, numTimes: c.num_times, porGrupo: c.num_times / g, classificam: 2,
      inicio: c.inicio, plataformas: c.plataformas, fotos: c.fotos || {}, premios: c.premios || [], regras: c.regras || [],
      times: ts.map(t => ({ id: num[t.id], nome: t.nome, plataforma: t.plataforma, clubId: t.club_id, grupo: t.grupo })),
      jogos: js.map(j => ({ id: j.id, fase: j.fase, grupo: j.grupo, rodada: j.rodada, data: j.data,
        casa: j.casa ? num[j.casa] : j.casa_vaga, fora: j.fora ? num[j.fora] : j.fora_vaga, gc: j.gols_casa, gf: j.gols_fora, stats: j.stats })),
      jogadores: null
    };
  } catch (e) { console.warn("Campeonato indisponível:", e.message); return null; }
}

(async function () {
  if (document.body.dataset.page !== "campeonato") return;
  const root = document.getElementById("cp");
  const demoPedido = new URLSearchParams(location.search).has("demo") || new URLSearchParams(location.search).has("estado");
  const C = demoPedido ? campeonato : await carregaCampeonato();
  if (!C) {
    root.innerHTML = `<header class="cp-hero"><div class="wrap"><div class="cp-hero-grid"><div><span class="cp-badge open"><i></i>Em breve</span>
      <div class="eyebrow">Morpheus FC</div><h1>Campeonato</h1><p class="cp-slogan">Estamos preparando o primeiro campeonato do Morpheus. Em breve, as inscrições e a tabela aparecem aqui.</p></div>
      <div class="cp-hero-art"><svg class="cp-trophy" viewBox="0 0 120 140" aria-hidden="true"><defs><linearGradient id="cpg0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe7a6"/><stop offset=".5" stop-color="#e9b949"/><stop offset="1" stop-color="#a97a16"/></linearGradient></defs><path d="M30 14h60v34c0 22-13 38-30 42-17-4-30-20-30-42z" fill="url(#cpg0)"/><path d="M30 22H12c0 22 8 36 24 40M90 22h18c0 22-8 36-24 40" fill="none" stroke="url(#cpg0)" stroke-width="7" stroke-linecap="round"/><rect x="54" y="88" width="12" height="24" fill="url(#cpg0)"/><path d="M34 112h52l8 20H26z" fill="url(#cpg0)"/></svg></div></div></div></header>`;
    return;
  }
  const byId = Object.fromEntries(C.times.map(t => [t.id, t]));
  /* Resultados do arquivo campeonato-dados.js (preenchido quando se pede "atualizar campeonato"): só completam o que o painel ainda não tem. */
  const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  const dados = typeof campeonatoDados !== "undefined" && !C.demo ? campeonatoDados : [];
  const usados = new Set();
  const aplica = (j, nc, nf) => {
    const i = dados.findIndex((d, k) => !usados.has(k) && (d.fase || "grupos") === j.fase && ((norm(d.casa) === nc && norm(d.fora) === nf) || (norm(d.casa) === nf && norm(d.fora) === nc)));
    if (i < 0) return;
    usados.add(i);
    const d = dados[i], inv = norm(d.casa) !== nc;
    if (j.gc === null && j.gf === null && d.gc != null && d.gf != null) { j.gc = inv ? d.gf : d.gc; j.gf = inv ? d.gc : d.gf; }
    if (!j.stats && d.stats) j.stats = inv ? { casa: d.stats.fora || [], fora: d.stats.casa || [] } : d.stats;
    if (!j.data && d.hora) j.data = d.hora;
  };
  C.jogos.filter(j => j.fase === "grupos").forEach(j => { if (byId[j.casa] && byId[j.fora]) aplica(j, norm(byId[j.casa].nome), norm(byId[j.fora].nome)); });
  const grupos = [...new Set(C.times.map(t => t.grupo).filter(Boolean))].sort();
  const FASES = { grupos: "Fase de grupos", quartas: "Quartas de final", semis: "Semifinais", final: "Final" };
  const pad = n => String(n).padStart(2, "0");
  const quando = iso => { if (!iso) return "A definir"; const d = new Date(iso); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}h${d.getMinutes() ? pad(d.getMinutes()) : ""}`; };
  const jogou = j => j.gc !== null && j.gf !== null;
  const cor = n => { let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const sigla = n => n.split(/\s+/).filter(w => w.length > 2 || /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join("").toUpperCase() || n.slice(0, 2).toUpperCase();
  const escudo = (t, cls = "") => `<span class="cp-shield ${cls}" style="--h:${cor(t.nome)}">${esc(sigla(t.nome))}</span>`;

  /* classificação de cada grupo */
  function tabela(g) {
    const rows = Object.fromEntries(C.times.filter(t => t.grupo === g).map(t => [t.id, { t, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0 }]));
    C.jogos.filter(j => j.fase === "grupos" && j.grupo === g && jogou(j)).forEach(j => {
      const a = rows[j.casa], b = rows[j.fora]; if (!a || !b) return;
      a.j++; b.j++; a.gp += j.gc; a.gc += j.gf; b.gp += j.gf; b.gc += j.gc;
      if (j.gc > j.gf) { a.v++; b.d++; } else if (j.gc < j.gf) { b.v++; a.d++; } else { a.e++; b.e++; }
    });
    return Object.values(rows).map(r => ({ ...r, sg: r.gp - r.gc, pts: r.v * 3 + r.e }))
      .sort((x, y) => y.pts - x.pts || y.sg - x.sg || y.gp - x.gp || y.v - x.v || x.t.nome.localeCompare(y.t.nome));
  }
  const grupoFechado = g => { const l = C.jogos.filter(j => j.fase === "grupos" && j.grupo === g); return l.length > 0 && l.every(jogou); };
  const regT = t => t.grupo ? tabs[t.grupo].find(x => x.t.id === t.id) : { j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, pts: 0 };
  const tabs = Object.fromEntries(grupos.map(g => [g, tabela(g)]));
  const todos = Object.values(tabs).flat();

  /* vaga do mata-mata -> time (quando já definido) ou rótulo */
  const mataJogos = f => C.jogos.filter(j => j.fase === f);
  const vencedor = j => (j && jogou(j) && j.gc !== j.gf) ? slot(j.gc > j.gf ? j.casa : j.fora, j.fase) : null;
  function slot(x, fase) {
    if (typeof x === "number") return byId[x];
    const m = /^([12])([A-Z])$/.exec(x);
    if (m) { const g = m[2]; return grupoFechado(g) ? tabs[g][+m[1] - 1].t : { rotulo: `${m[1]}º do Grupo ${g}` }; }
    const v = /^V(\d)$/.exec(x);
    if (v) { const ant = fase === "semis" ? "quartas" : "semis"; const w = vencedor(mataJogos(ant)[+v[1] - 1]); return w || { rotulo: `Vencedor do jogo ${v[1]}` }; }
    return { rotulo: String(x) };
  }
  const nome = s => s.nome || s.rotulo;
  const lado = (s, cls = "") => s.nome
    ? `<span class="cp-team ${cls}">${escudo(s)}<b>${esc(s.nome)}</b></span>`
    : `<span class="cp-team tbd ${cls}"><span class="cp-shield tbd">?</span><b>${esc(s.rotulo)}</b></span>`;

  /* mata-mata: na ordem das fases, para os vencedores já estarem definidos quando a fase seguinte for resolvida */
  ["quartas", "semis", "final"].forEach(f => mataJogos(f).forEach(j => { const a = slot(j.casa, f), b = slot(j.fora, f); if (a && a.nome && b && b.nome) aplica(j, norm(a.nome), norm(b.nome)); }));
  const campeao = (() => { const f = mataJogos("final")[0]; return f && jogou(f) && f.gc !== f.gf ? slot(f.gc > f.gf ? f.casa : f.fora, "final") : null; })();
  /* jogadores do campeonato: soma das estatísticas guardadas em cada jogo (campo stats), por clube */
  if (C.jogadores === null) {
    const acc = new Map();
    C.jogos.forEach(j => { if (!j.stats) return;
      [["casa", j.casa], ["fora", j.fora]].forEach(([lado, x]) => { const t = slot(x, j.fase); if (!t || !t.id) return;
        (j.stats[lado] || []).forEach(p => { if (!p || !p.psn) return; const k = t.id + "|" + String(p.psn).toLowerCase();
          const r = acc.get(k) || { psn: String(p.psn), time: t.id, j: 0, g: 0, a: 0, m: 0, pos: "", def: 0, gs: 0 };
          r.j++; r.g += +p.g || 0; r.a += +p.a || 0; r.m += +p.m || 0; r.def += +p.def || 0; r.gs += +p.gs || 0; if (p.pos === "G") r.pos = "G"; acc.set(k, r); }); }); });
    C.jogadores = [...acc.values()];
  }
  const fases = { 8: ["quartas", "semis", "final"], 4: ["semis", "final"], 2: ["final"] }[C.classificam * (C.numTimes / C.porGrupo)] || ["quartas", "semis", "final"];
  const disputados = C.jogos.filter(jogou), golsTotal = disputados.reduce((s, j) => s + j.gc + j.gf, 0);

  const TROFEU = `<svg class="cp-trophy" viewBox="0 0 120 140" role="img" aria-label="Troféu">
    <defs><linearGradient id="cpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe7a6"/><stop offset=".5" stop-color="#e9b949"/><stop offset="1" stop-color="#a97a16"/></linearGradient></defs>
    <path d="M30 14h60v34c0 22-13 38-30 42-17-4-30-20-30-42z" fill="url(#cpg)"/>
    <path d="M30 22H12c0 22 8 36 24 40M90 22h18c0 22-8 36-24 40" fill="none" stroke="url(#cpg)" stroke-width="7" stroke-linecap="round"/>
    <rect x="54" y="88" width="12" height="24" fill="url(#cpg)"/><path d="M34 112h52l8 20H26z" fill="url(#cpg)"/>
    <path d="M60 30l5 10 11 1.5-8 7.5 2 11-10-5.500-10 5.500 2-11-8-7.500 11-1.500z" fill="#17120a" opacity=".28"/></svg>`;

  const bg = k => C.fotos && C.fotos[k] ? `<div class="cp-bg" style="background-image:url('assets/bg/${esc(C.fotos[k])}?v=${ASSET_V}')" aria-hidden="true"></div>` : "";
  const STATUS = { inscricoes: ["Inscrições abertas", "open"], andamento: ["Em andamento", "live"], encerrado: ["Encerrado", "end"] }[C.status] || ["", ""];

  /* ---------- montagem ---------- */
  const secLista = (titulo, sub) => `<div class="eyebrow">${titulo}</div><h2 class="sec-title">${sub}</h2>`;
  const hero = `
  <header class="cp-hero">${bg("hero")}<div class="wrap">
    ${C.demo ? `<div class="cp-demo">Prévia com dados de exemplo: times, jogos e números abaixo são fictícios.</div>` : ""}
    <div class="cp-hero-grid">
      <div>
        <span class="cp-badge ${STATUS[1]}"><i></i>${STATUS[0]}</span>
        <div class="eyebrow">${esc(C.edicao)} · ${esc(C.plataformas)}</div>
        <h1>${esc(C.nome)}</h1>
        <p class="cp-slogan">${esc(C.slogan)}</p>
        <div class="cp-count" id="cpCount" aria-live="off"></div>
      </div>
      <div class="cp-hero-art">${campeao ? `<div class="cp-champ-mini">${TROFEU}<span>Campeão</span>${escudo(campeao, "lg")}<b>${esc(campeao.nome)}</b></div>` : TROFEU}</div>
    </div>
    <div class="cp-numbers">
      <div><b>${C.numTimes}</b><span>clubes</span></div>
      <div><b>${disputados.length}<small>/${C.jogos.length}</small></b><span>jogos disputados</span></div>
      <div><b>${golsTotal}</b><span>gols marcados</span></div>
      <div><b>${disputados.length ? (golsTotal / disputados.length).toFixed(1).replace(".", ",") : "0"}</b><span>gols por jogo</span></div>
    </div>
  </div></header>
  <div class="cp-subnav"><div class="wrap">${[["equipes", "Equipes"], ["grupos", "Grupos"], ["jogos", "Jogos"], ["matamata", "Mata-mata"], ["stats", "Estatísticas"], ["premiacao", "Premiação"], ["regras", "Regulamento"]]
    .map(([id, l]) => `<a href="#${id}">${l}</a>`).join("")}</div></div>`;

  const equipes = `
  <section class="cp-sec" id="equipes">${bg("equipes")}<div class="wrap">${secLista("Os clubes", "Quem está na disputa")}
    <p class="sec-sub">${C.times.length} de ${C.numTimes} vagas preenchidas.</p>
    <div class="cp-vagas"><i style="width:${Math.round(C.times.length / C.numTimes * 100)}%"></i></div>
    <div class="cp-teams">${C.times.map(t => { const r = regT(t);
      return `<article class="cp-tcard">${escudo(t, "lg")}<h3>${esc(t.nome)}</h3>
        <div class="cp-meta">${t.grupo ? `<span class="cp-chip">Grupo ${t.grupo}</span>` : `<span class="cp-chip">Aguardando sorteio</span>`}<span class="cp-chip plat">${esc(t.plataforma)}</span></div>
        <div class="cp-rec"><div><b>${r.j}</b><span>J</span></div><div><b>${r.v}-${r.e}-${r.d}</b><span>V-E-D</span></div><div><b>${r.gp}:${r.gc}</b><span>Gols</span></div><div><b>${r.pts}</b><span>Pts</span></div></div>
      </article>`; }).join("")}</div>
  </div></section>`;

  const gruposHtml = `
  <section class="cp-sec alt" id="grupos">${bg("grupos")}<div class="wrap">${secLista("Fase de grupos", "Classificação")}
    <p class="sec-sub">Os ${C.classificam} primeiros de cada grupo avançam para o mata-mata.</p>
    ${grupos.length ? "" : `<div class="panel cp-wait"><b>Sorteio em breve</b><span>Quando as ${C.numTimes} vagas forem preenchidas, os clubes serão sorteados em ${C.numTimes / C.porGrupo} grupos de ${C.porGrupo}.</span></div>`}
    <div class="cp-groups">${grupos.map(g => `
      <div class="panel cp-group"><h3>Grupo ${g}</h3>
        <div class="cp-scroll"><table class="cp-table"><thead><tr><th>#</th><th>Clube</th><th>J</th><th>V</th><th>E</th><th>D</th><th>GP</th><th>GC</th><th>SG</th><th>Pts</th></tr></thead><tbody>
        ${tabs[g].map((r, i) => `<tr class="${i < C.classificam ? "q" : ""}"><td>${i + 1}</td><td>${lado(r.t)}</td><td>${r.j}</td><td>${r.v}</td><td>${r.e}</td><td>${r.d}</td><td>${r.gp}</td><td>${r.gc}</td><td>${r.sg > 0 ? "+" : ""}${r.sg}</td><td><b>${r.pts}</b></td></tr>`).join("")}
        </tbody></table></div></div>`).join("")}</div>
    <p class="cp-legend"><i></i> Classificado para o mata-mata</p>
  </div></section>`;

  const jogoRow = j => { const c = slot(j.casa, j.fase), f = slot(j.fora, j.fase), p = jogou(j);
    return `<div class="cp-match ${p ? "done" : ""}"><div class="cp-when"><b>${quando(j.data)}</b><span>${j.grupo ? `Grupo ${j.grupo} · ${j.rodada}ª rodada` : FASES[j.fase]}</span></div>
      <div class="cp-vs">${lado(c, "home")}<span class="cp-score">${p ? `${j.gc}<i>x</i>${j.gf}` : "<i>vs</i>"}</span>${lado(f, "away")}</div></div>`; };
  /* abre na fase em andamento: a primeira que ainda tem jogo por disputar (ou a final) */
  const faseAtual = ["grupos", ...fases].find(f => C.jogos.some(j => j.fase === f && !jogou(j))) || "final";
  const jogosHtml = `
  <section class="cp-sec" id="jogos">${bg("jogos")}<div class="wrap">${secLista("Calendário", "Jogos e resultados")}
    <div class="toolbar" id="cpFiltro">${[["grupos", "Fase de grupos"], ["quartas", "Quartas"], ["semis", "Semifinais"], ["final", "Final"]].filter(([k]) => k === "grupos" || fases.includes(k))
      .map(([k, l]) => `<button class="fbtn${k === faseAtual ? " on" : ""}" data-f="${k}">${l}</button>`).join("")}</div>
    <div class="panel cp-matches" id="cpJogos"></div>
  </div></section>`;

  const bracketCol = f => `<div class="cp-col"><h4>${FASES[f]}</h4><div class="cp-ties">${mataJogos(f).map(j => { const c = slot(j.casa, f), a = slot(j.fora, f), p = jogou(j);
    const win = p ? (j.gc > j.gf ? "c" : j.gc < j.gf ? "f" : "") : "";
    return `<div class="cp-tie"><div class="${win === "c" ? "w" : ""}">${lado(c)}<b>${p ? j.gc : ""}</b></div><div class="${win === "f" ? "w" : ""}">${lado(a)}<b>${p ? j.gf : ""}</b></div><small>${quando(j.data)}</small></div>`; }).join("")}</div></div>`;
  const bracket = `
  <section class="cp-sec alt" id="matamata">${bg("matamata")}<div class="wrap">${secLista("Mata-mata", "O caminho até o troféu")}
    <div class="cp-bracket cols${fases.length}">${fases.map(bracketCol).join("")}
      <div class="cp-col cp-final-trophy">${TROFEU}<b>${campeao ? esc(campeao.nome) : "Campeão"}</b><span>${campeao ? "Campeão da " + esc(C.nome) : "A definir"}</span></div>
    </div>
  </div></section>`;

  const top = (key, label) => C.jogadores.filter(p => p[key] > 0).sort((a, b) => b[key] - a[key] || a.psn.localeCompare(b.psn)).slice(0, 8);
  const lista = (key, unidade) => { const l = top(key), max = l[0] ? l[0][key] : 1;
    return l.length ? l.map((p, i) => `<div class="cp-rank"><span class="pos">${i + 1}</span>${escudo(byId[p.time], "sm")}<div class="who"><b>${esc(p.psn)}</b><small>${esc(byId[p.time].nome)}</small></div><div class="bar"><i style="width:${p[key] / max * 100}%"></i></div><strong>${p[key]}<small>${unidade}</small></strong></div>`).join("") : `<p class="sec-sub">Ainda sem dados.</p>`; };
  /* Melhor goleiro: IEG = defesas ÷ (defesas + gols sofridos) × 100 */
  const iegDe = p => p.def + p.gs ? p.def / (p.def + p.gs) * 100 : null;
  const listaIEG = () => { const l = C.jogadores.filter(p => p.pos === "G" && iegDe(p) !== null).sort((a, b) => iegDe(b) - iegDe(a) || b.def - a.def).slice(0, 8);
    return l.length ? l.map((p, i) => `<div class="cp-rank"><span class="pos">${i + 1}</span>${escudo(byId[p.time], "sm")}<div class="who"><b>${esc(p.psn)}</b><small>${p.def} defesas · ${p.gs} sofridos</small></div><div class="bar"><i style="width:${iegDe(p)}%"></i></div><strong>${iegDe(p).toFixed(1).replace(".", ",")}<small>%</small></strong></div>`).join("") : `<p class="sec-sub">Ainda sem dados.</p>`; };
  const ataque = [...todos].filter(r => r.j).sort((a, b) => b.gp - a.gp)[0], defesa = [...todos].filter(r => r.j).sort((a, b) => a.gc - b.gc || b.j - a.j)[0];
  const stats = `
  <section class="cp-sec" id="stats">${bg("stats")}<div class="wrap">${secLista("Números", "Estatísticas")}
    <div class="cp-clubstats">
      ${ataque ? `<div class="panel"><span>Melhor ataque</span>${lado(ataque.t)}<b>${ataque.gp}<small>gols</small></b></div>` : ""}
      ${defesa ? `<div class="panel"><span>Melhor defesa</span>${lado(defesa.t)}<b>${defesa.gc}<small>sofridos</small></b></div>` : ""}
      ${todos.length ? `<div class="panel"><span>Mais pontos</span>${lado([...todos].sort((a, b) => b.pts - a.pts || b.sg - a.sg)[0].t)}<b>${[...todos].sort((a, b) => b.pts - a.pts || b.sg - a.sg)[0].pts}<small>pts</small></b></div>` : ""}
    </div>
    <div class="cp-lists">
      <div class="panel"><h3>Artilharia</h3>${lista("g", " gols")}</div>
      <div class="panel"><h3>Assistências</h3>${lista("a", " assist.")}</div>
      <div class="panel"><h3>Melhor em campo</h3>${lista("m", " vezes")}</div>
      <div class="panel"><h3>Melhor goleiro</h3>${listaIEG()}<p class="cp-note">IEG = defesas ÷ (defesas + gols sofridos) × 100</p></div>
    </div>
  </div></section>`;

  const exemplo = campeao || C.times[0];
  const premiacao = `
  <section class="cp-sec alt" id="premiacao">${bg("premiacao")}<div class="wrap">${secLista("Premiação", "Glória eterna no site")}
    <p class="sec-sub">O campeão ganha o troféu virtual e um card exclusivo, que fica guardado no Hall da Fama do Morpheus FC.</p>
    <div class="cp-prize-grid">
      <div class="cp-champcard">
        <div class="cp-cc-top"><span>${esc(C.nome)} · ${esc(C.edicao)}</span><b>Campeão</b></div>
        ${TROFEU}${escudo(exemplo, "xl")}<h3>${campeao ? esc(campeao.nome) : "O seu clube aqui"}</h3>
        <p>${campeao ? "Campeão invicto da edição" : "Exemplo do card que o campeão recebe"}</p>
        <div class="cp-cc-stats"><div><b>${regT(exemplo).v}</b><span>vitórias</span></div><div><b>${regT(exemplo).gp}</b><span>gols</span></div><div><b>1º</b><span>lugar</span></div></div>
      </div>
      <div class="cp-prizes">${C.premios.map(([i, t, d]) => `<div class="cp-prize"><span>${i}</span><div><b>${esc(t)}</b><small>${esc(d)}</small></div></div>`).join("")}</div>
    </div>
  </div></section>`;

  const regras = `
  <section class="cp-sec" id="regras">${bg("regras")}<div class="wrap">${secLista("Regulamento", "Como funciona")}
    <div class="cp-rules">${C.regras.map(([t, d]) => `<details><summary>${esc(t)}</summary><p>${esc(d)}</p></details>`).join("")}</div>
  </div></section>`;

  root.innerHTML = hero + equipes + gruposHtml + jogosHtml + bracket + stats + premiacao + regras;

  /* filtro de jogos */
  const desenhaJogos = f => { document.getElementById("cpJogos").innerHTML = C.jogos.filter(j => j.fase === f).sort((a, b) => (a.data || "9").localeCompare(b.data || "9")).map(jogoRow).join(""); };
  desenhaJogos(faseAtual);
  document.querySelectorAll("#cpFiltro .fbtn").forEach(b => b.onclick = () => { document.querySelectorAll("#cpFiltro .fbtn").forEach(x => x.classList.toggle("on", x === b)); desenhaJogos(b.dataset.f); });

  /* contagem regressiva */
  const cont = document.getElementById("cpCount"), alvo = C.inicio ? new Date(C.inicio).getTime() : NaN;
  const tick = () => {
    if (isNaN(alvo)) { cont.hidden = true; return false; }
    const ms = alvo - Date.now();
    if (ms <= 0) { cont.innerHTML = `<div class="cp-live">${campeao ? "Campeonato encerrado" : "A bola já está rolando"}</div>`; return false; }
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    cont.innerHTML = [[d, "dias"], [h, "horas"], [m, "min"], [s, "seg"]].map(([v, l]) => `<div><b>${pad(v)}</b><span>${l}</span></div>`).join("");
    return true;
  };
  if (tick()) { const iv = setInterval(() => { if (!tick()) clearInterval(iv); }, 1000); }

  /* menu de seções: marca em amarelo a parte que está na tela (e a que você clicou) */
  const links = [...document.querySelectorAll(".cp-subnav a")];
  const marca = id => links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
  links.forEach(a => a.addEventListener("click", () => marca(a.getAttribute("href").slice(1))));
  const espia = () => {
    const ids = links.map(a => a.getAttribute("href").slice(1)); let atual = "";
    ids.forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= 160) atual = id; });
    marca(atual);
    const on = document.querySelector(".cp-subnav a.on"); if (on) on.scrollIntoView({ block: "nearest", inline: "center" });
  };
  addEventListener("scroll", () => { clearTimeout(espia.t); espia.t = setTimeout(espia, 60); }, { passive: true });
})();
