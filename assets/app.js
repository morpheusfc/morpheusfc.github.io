/* Morpheus FC: layout compartilhado e renderizadores. Dados ficam em data.js. */
const $ = s => document.querySelector(s);
const page = document.body.dataset.page;
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* Formatação do texto das matérias (escapa o HTML primeiro, depois aplica a marcação):
   **negrito**  *itálico*  ++sublinhado++  {ouro|texto} {verde|texto} {vermelho|texto} {violeta|texto}  [texto](https://link) */
const fmt = s => esc(s)
  .replace(/\{(ouro|verde|vermelho|violeta)\|([^{}]+?)\}/g, '<span class="c-$1">$2</span>')
  .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/(^|[^*])\*([^*\s](?:[^*]*[^*\s])?)\*(?!\*)/g, "$1<em>$2</em>")
  .replace(/\+\+(.+?)\+\+/g, "<u>$1</u>")
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
/* Foto ou vídeo: nome de arquivo (pasta assets/<tipo>/) ou endereço completo (nuvem). */
/* ASSET_V: mude o numero quando trocar uma imagem/video mantendo o mesmo nome de arquivo (forca o navegador a baixar de novo) */
const ASSET_V = "4";
const media = (kind, f) => /^https?:\/\//.test(f) ? f : `assets/${kind}/${f}?v=${ASSET_V}`;
const ready = window.CMS_READY || Promise.resolve();
/* PSN antiga -> PSN atual (config.apelidos em data.js): mostra o nome atual também nas partidas já guardadas. */
const curPsn = n => (typeof config !== "undefined" && config.apelidos && config.apelidos[n]) || n;
/* Busca de jogador: nome do Pro, PSN ou qualquer nome antigo (aka). */
const matchName = (p, q) => [p.n, p.psn, ...(p.aka || [])].some(s => String(s || "").toLowerCase().includes(q));

/* ---------- Nav e rodapé ---------- */
const PAGES = [["index.html","inicio","Início"],["elenco.html","elenco","Elenco"],["partidas.html","partidas","Partidas"],["amistosos.html","amistosos","Amistosos"],["videos.html","videos","Vídeos"],["noticias.html","noticias","News"],["recrutamento.html","recrutamento","Recrutamento"]];
$("#nav").innerHTML = `
  <div class="wrap">
    <a href="index.html" class="brand"><img src="assets/escudo.jpg" alt="Escudo do Morpheus FC">Morpheus FC</a>
    <div class="links">${PAGES.map(([h,k,l])=>`<a href="${h}"${k===page?' class="active" aria-current="page"':""}>${l}</a>`).join("")}</div>
    <a href="recrutamento.html" class="btn btn-gold btn-sm">Entrar no clube</a>
  </div>`;
$("#footer").innerHTML = `
  <div class="wrap">
    <span>© 2026 Morpheus FC · Feito por jogadores, para jogadores.</span>
  </div>`;
document.querySelectorAll("[data-discord]").forEach(a => {
  if (config.discord) { a.href = config.discord; a.target = "_blank"; a.rel = "noopener"; } else a.hidden = true;
});

/* ---------- Componentes ---------- */
const RES = {V:"Vitória",E:"Empate",D:"Derrota"};
const POS_LABEL = {ST:"Atacantes",CM:"Meio-campo",CB:"Defensores"};

function statsStrip(el){
  const pct = Math.round(club.w/club.games*100);
  const bar = `<div class="bar"><i style="flex:${club.w};background:var(--win)"></i><i style="flex:${club.d};background:var(--draw)"></i><i style="flex:${club.l};background:var(--loss)"></i></div>`;
  el.innerHTML = [[club.games,"Jogos"],[pct+"%","Aproveitamento de vitórias"+bar],[club.gf,"Gols marcados"],["+"+(club.gf-club.ga),"Saldo de gols"],[club.sr,"SR do clube"]]
    .map(([v,l])=>`<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
}
function formChips(el, list){
  el.innerHTML = list.slice(0,10).map(m=>`<span class="chip ${m.r}" title="${esc(m.opp)}: ${RES[m.r]}">${m.r}</span>`).join("");
}
/* Data exata do tracker + rótulo relativo calculado a partir de hoje (nunca fixo). */
function fmtDate(iso){
  const d = new Date(iso), now = new Date();
  const day = x => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diff = Math.round((day(now) - day(d)) / 864e5);
  const rel = diff<=0 ? "Hoje" : diff===1 ? "Ontem" : `Há ${diff} dias`;
  const p = n => String(n).padStart(2,"0");
  return `${rel} · ${p(d.getDate())}/${p(d.getMonth()+1)} às ${p(d.getHours())}:${p(d.getMinutes())}`;
}
const listNames = (rows, k) => rows.filter(p=>p[k]).map(p=>curPsn(p.n)+(p[k]>1?` (${p[k]})`:"")).join(", ");

function statBars(m){
  return STAT_LABELS.map((l,i)=>{
    const [h,a] = m.st[i];
    const tot = h + a, hp = tot ? h/tot*100 : 50;
    const lead = h>a ? "us" : a>h ? "them" : "";
    return `<div class="sbar"><b class="${lead==="us"?"lead":""}">${h}</b>
      <div><span>${l}</span><div class="track"><i style="width:${hp}%"></i></div></div>
      <b class="${lead==="them"?"lead":""}">${a}</b></div>`;
  }).join("");
}
function playerTable(name, rows){
  const sorted = rows.slice().sort((a,b)=>b.r-a.r);
  return `<h4>${esc(name)}</h4><div class="tscroll"><table class="ptable">
    <thead><tr><th>Jogador</th><th>Pos</th><th>Nota</th><th>G</th><th>A</th><th>Chutes</th><th>Passes</th><th>Des.</th></tr></thead><tbody>
    ${sorted.map(p=>`<tr class="${p.motm?"motm":""}"><td>${p.motm?"⭐ ":""}${esc(curPsn(p.n))}</td><td>${POS_NAME[p.pos]||p.pos}</td><td>${p.r.toFixed(1)}</td><td>${p.g||"-"}</td><td>${p.a||"-"}</td><td>${p.s||"-"}</td><td>${p.p||"-"}</td><td>${p.t||"-"}</td></tr>`).join("")}
    </tbody></table></div>`;
}
function matchDetail(m){
  const all = [...m.us.map(p=>({...p,team:"Morpheus FC"})), ...m.them.map(p=>({...p,team:m.opp}))];
  const mv = all.find(p=>p.motm);
  const goals = `${listNames(m.us,"g")||"-"}`, assists = `${listNames(m.us,"a")||"-"}`;
  const oppGoals = listNames(m.them,"g");
  return `<div class="mdetail">
    <div class="hl">
      <div><span>⚽ Gols do Morpheus</span><b>${esc(goals)}</b></div>
      <div><span>🅰️ Assistências</span><b>${esc(assists)}</b></div>
      <div><span>⭐ MVP da partida</span><b>${mv?esc(curPsn(mv.n))+" · "+mv.r.toFixed(1)+" ("+esc(mv.team)+")":"-"}</b></div>
      ${oppGoals?`<div><span>Gols do ${esc(m.opp)}</span><b>${esc(oppGoals)}</b></div>`:""}
    </div>
    <div class="dtabs" role="tablist">
      <button class="dtab on" data-t="s" role="tab">Estatísticas</button>
      <button class="dtab" data-t="p" role="tab">Jogadores</button>
    </div>
    <div class="dpane" data-p="s">
      <div class="sbar head"><b>Morpheus FC</b><div></div><b>${esc(m.opp)}</b></div>
      ${statBars(m)}
    </div>
    <div class="dpane" data-p="p" hidden>${playerTable("Morpheus FC",m.us)}${playerTable(m.opp,m.them)}</div>
    <div class="mid">Partida #${m.id}</div>
  </div>`;
}
function matchRows(el, list){
  el.innerHTML = list.length ? list.map(m=>`
    <div class="mrow" data-id="${m.id}">
      <div class="match" role="button" tabindex="0" aria-expanded="false">
        <span class="chip ${m.r}" title="${RES[m.r]}">${m.r}</span>
        <div class="vs">Morpheus FC x ${esc(m.opp)}<small>${fmtDate(m.date)}</small></div>
        <div class="score">${m.g[0]}–${m.g[1]}</div>
        <span class="chev" aria-hidden="true">›</span>
      </div>
    </div>`).join("") : `<div class="empty-state">Nenhum jogo com esse filtro.</div>`;
  el.onclick = el.onkeydown = e => {
    if (e.type==="keydown" && e.key!=="Enter" && e.key!==" ") return;
    const tab = e.target.closest(".dtab");
    if (tab) {
      const box = tab.closest(".mdetail");
      box.querySelectorAll(".dtab").forEach(b=>b.classList.toggle("on", b===tab));
      box.querySelectorAll(".dpane").forEach(p=>p.hidden = p.dataset.p!==tab.dataset.t);
      return;
    }
    const head = e.target.closest(".match"); if (!head) return;
    e.preventDefault();
    const rowEl = head.parentElement, open = head.getAttribute("aria-expanded")==="true";
    const existing = rowEl.querySelector(".mdetail");
    if (open) { existing && existing.remove(); head.setAttribute("aria-expanded","false"); rowEl.classList.remove("open"); }
    else { rowEl.insertAdjacentHTML("beforeend", matchDetail(matches.find(m=>m.id===rowEl.dataset.id))); head.setAttribute("aria-expanded","true"); rowEl.classList.add("open"); }
  };
}
function leaders(el){
  const best = k => players.reduce((a,b)=>b[k]>a[k]?b:a);
  el.innerHTML = [["Artilheiro","g"],["Garçom","a"],["Mais vezes MVP","m"],["Mais jogos","j"]].map(([l,k])=>{
    const t = best(k);
    return `<div class="row"><div><div class="lab">${l}</div><div class="who">${esc(t.n)}</div></div><div class="num">${t[k]}</div></div>`;
  }).join("");
}
function playerCard(p){
  return `
  <article class="card${p.j?"":" inactive"}">
    <div class="top">
      <div class="lft"><div class="ovr">${p.o||"–"}<small>OVR</small></div>${p.p?`<span class="pos">${p.p}</span>`:""}</div>
      <div class="photo${p.img?"":" blank"}">${p.img
        ? `<img src="assets/players/${esc(p.img)}" alt="Foto de ${esc(p.n)}" loading="lazy">`
        : `<svg viewBox="0 0 64 72" aria-hidden="true"><circle cx="32" cy="26" r="13" fill="currentColor"/><path d="M6 72c0-17 12-28 26-28s26 11 26 28z" fill="currentColor"/></svg>`}</div>
    </div>
    <h3>${esc(p.n)}</h3>
    <div class="psn${p.psn?"":" empty"}"><span class="tag">PSN</span>${esc(p.psn||"a informar")}</div>
    <div class="mini">
      <div><b>${p.j}</b><span>Jogos</span></div>
      <div><b>${p.g}</b><span>Gols</span></div>
      <div><b>${p.a}</b><span>Assis.</span></div>
      <div title="Vezes eleito MVP da partida"><b>${p.m}</b><span>MVP</span></div>
    </div>
  </article>`;
}

/* ---------- Páginas ---------- */
if (page === "inicio") {
  statsStrip($("#stats"));
  formChips($("#form"), matches);
  matchRows($("#matches"), matches.slice(0,5));
  leaders($("#leaders"));
  $("#cards").innerHTML = players.slice(0,6).map(playerCard).join("");
}

if (page === "partidas") {
  const c = r => matches.filter(m=>m.r===r).length;
  const gf = matches.reduce((s,m)=>s+m.g[0],0), ga = matches.reduce((s,m)=>s+m.g[1],0);
  $("#resbar").innerHTML = [[c("V"),"Vitórias",""],[c("E"),"Empates",""],[c("D"),"Derrotas",""],[gf+" x "+ga,"Gols pró x contra",""]]
    .map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join("");
  formChips($("#form"), matches);
  let f = "T";
  const draw = () => {
    const list = f==="T" ? matches : matches.filter(m=>m.r===f);
    matchRows($("#matches"), list);
    $("#count").textContent = list.length + " jogo" + (list.length===1?"":"s");
    document.querySelectorAll(".fbtn").forEach(b=>b.classList.toggle("on", b.dataset.f===f));
  };
  document.querySelectorAll(".fbtn").forEach(b=>b.onclick=()=>{f=b.dataset.f;draw()});
  draw();
}

if (page === "elenco") {
  let pos = "T", q = "", sort = "j", showInactive = false;
  const draw = () => {
    let list = players.filter(p => (showInactive || p.j>0) && (pos==="T" || p.p===pos) && matchName(p, q) );
    list = list.slice().sort((a,b)=>b[sort]-a[sort]);
    $("#cards").innerHTML = list.length ? list.map(playerCard).join("") : "";
    $("#none").hidden = list.length>0;
    $("#count").textContent = list.length + " jogador" + (list.length===1?"":"es");
    document.querySelectorAll(".fbtn[data-pos]").forEach(b=>b.classList.toggle("on", b.dataset.pos===pos));
    $("#inact").classList.toggle("on", showInactive);
  };
  document.querySelectorAll(".fbtn[data-pos]").forEach(b=>b.onclick=()=>{pos=b.dataset.pos;draw()});
  $("#q").oninput = e => { q = e.target.value.trim().toLowerCase(); draw(); };
  $("#sort").onchange = e => { sort = e.target.value; draw(); };
  $("#inact").onclick = () => { showInactive = !showInactive; draw(); };
  draw();
}

if (page === "recrutamento") {
  const S = window.SUPABASE || {}, on = !!(S.url && S.key);
  const headers = extra => Object.assign({ apikey: S.key }, S.key && S.key.startsWith("eyJ") ? { Authorization: "Bearer " + S.key } : {}, extra);
  const R = config.recrutamento || {};
  const f = $("#recForm"), msg = $("#recMsg"), btn = $("#recSend");
  $("#posLine").textContent = "Posições procuradas: " + (R.posicoes || "todas");
  const show = (t, ok) => { msg.hidden = false; msg.textContent = t; msg.className = "am-msg " + (ok ? "ok" : "err"); };
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

  const summary = p => `Candidatura para o Morpheus FC\nID: ${p.psn} (${p.platform})` + (p.nick ? `\nNome: ${p.nick}` : "")
    + `\nPosição: ${p.pos}` + (p.pos_alt ? ` / ${p.pos_alt}` : "") + `\nContato: ${p.contact}`
    + (p.availability ? `\nHorários: ${p.availability}` : "") + (p.experience ? `\nExperiência: ${p.experience}` : "")
    + (p.previous_club ? `\nÚltimo clube: ${p.previous_club}` : "") + (p.clips ? `\nLances: ${p.clips}` : "") + (p.message ? `\nSobre: ${p.message}` : "");

  const done = p => {
    $("#recBox").innerHTML = `<div class="panel am-done">
      <div class="am-check" aria-hidden="true">✓</div>
      <h3>Candidatura enviada!</h3>
      <p class="sec-sub" style="margin:0 0 16px">Obrigado, <b>${esc(p.nick || p.psn)}</b>! A diretoria vai analisar e falar com você pelo contato informado para combinar o teste.</p>
      <ul class="am-sum"><li><span>ID</span><b>${esc(p.psn)}</b></li><li><span>Posição</span><b>${esc(p.pos)}${p.pos_alt ? " / " + esc(p.pos_alt) : ""}</b></li><li><span>Contato</span><b>${esc(p.contact)}</b></li></ul>
      <button class="btn btn-ghost" type="button" onclick="location.reload()">Enviar outra candidatura</button></div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  f.addEventListener("submit", async e => {
    e.preventDefault(); msg.hidden = true;
    const v = Object.fromEntries(new FormData(f));
    if (v.website) { done({ psn: "", pos: "", contact: "" }); return; }   /* campo-armadilha para robôs */
    const p = { psn: (v.psn||"").trim(), nick: (v.nick||"").trim(), platform: v.platform || "PlayStation", pos: v.pos || "", pos_alt: v.pos_alt || "",
      contact: (v.contact||"").trim(), availability: (v.availability||"").trim(), experience: v.experience || "", previous_club: (v.previous_club||"").trim(),
      clips: (v.clips||"").trim(), message: (v.message||"").trim() };
    if (p.psn.length < 2) return show("Informe o seu ID (PSN ou gamertag).");
    if (!p.pos) return show("Escolha a posição em que você quer jogar.");
    if (p.contact.length < 3) return show("Informe um contato para falarmos com você (Discord, WhatsApp ou Instagram).");
    if (p.clips && !/^https?:\/\/\S+$/i.test(p.clips)) return show("O link dos lances precisa começar com https://");
    if (p.pos_alt && p.pos_alt === p.pos) p.pos_alt = "";
    const wait = (R.cooldownSegundos || 60) * 1000 - (Date.now() - Number(store.get("rec_last") || 0));
    if (wait > 0) return show(`Você acabou de enviar uma candidatura. Aguarde ${Math.ceil(wait/1000)} segundos para enviar outra.`);

    const fallback = why => {
      show(why + " Copie a candidatura abaixo e envie para nós pelo Discord.");
      const t = summary(p);
      msg.insertAdjacentHTML("beforeend", `<br><button class="btn btn-ghost btn-sm" type="button" id="recCopy">Copiar candidatura</button>`);
      $("#recCopy").onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { $("#recCopy").textContent = "Copiado!"; }, () => { $("#recCopy").textContent = "Não foi possível copiar"; }); };
    };
    if (!on) return fallback("O envio automático ainda não está disponível.");
    btn.disabled = true; btn.textContent = "Enviando…";
    try {
      const r = await fetch(`${S.url}/rest/v1/candidaturas`, { method: "POST", headers: headers({ "Content-Type": "application/json", Prefer: "return=minimal" }), body: JSON.stringify(p) });
      if (r.ok) { store.set("rec_last", String(Date.now())); done(p); return; }
      btn.disabled = false; btn.textContent = "Enviar candidatura";
      if (r.status === 409) return show("Já recebemos uma candidatura em análise para esse ID. Aguarde o nosso contato.");
      if (r.status === 400) return show("Alguma informação não foi aceita. Confira os campos e tente de novo.");
      fallback("Não foi possível enviar agora.");
    } catch (err) {
      btn.disabled = false; btn.textContent = "Enviar candidatura";
      fallback("Sem conexão com o servidor.");
    }
  });
}

/* ---------- Datas e utilitários de conteúdo ---------- */
const MESES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const SEMANA = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
const dateOf = s => { const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d); };
const longDate = s => { const d = dateOf(s); return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`; };
const shortDate = s => { const d = dateOf(s); return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`; };

/* ---------- Vídeos ---------- */
if (page === "videos") ready.then(() => {
  const parse = v => {
    const i = v.src.indexOf(":"), kind = v.src.slice(0,i), val = v.src.slice(i+1);
    if (kind === "youtube") return {kind, embed:`https://www.youtube-nocookie.com/embed/${encodeURIComponent(val)}?autoplay=1&rel=0`, thumb: v.thumb ? media("videos", v.thumb) : `https://i.ytimg.com/vi/${encodeURIComponent(val)}/hqdefault.jpg`};
    if (kind === "file")    return {kind, file:media("videos", val), thumb: v.thumb ? media("videos", v.thumb) : ""};
    return {kind:"link", url:val, thumb: v.thumb ? media("videos", v.thumb) : ""};
  };
  const modal = $("#vmodal"), stage = $("#vstage");
  const sorted = videos.slice().sort((a,b)=> b.date.localeCompare(a.date));
  let f = "T";
  const typeName = t => t==="partida" ? "Partida" : "Lance";
  const draw = () => {
    const list = f==="T" ? sorted : sorted.filter(v=>v.type===f);
    $("#vgrid").innerHTML = list.map(v=>{
      const p = parse(v);
      return `<button class="vcard" data-id="${esc(v.id)}">
        <div class="vthumb">${p.thumb?`<img src="${esc(p.thumb)}" alt="" loading="lazy">`:`<img class="vlogo" src="assets/escudo.jpg" alt="">`}<span class="vplay" aria-hidden="true">▶</span><span class="vbadge ${esc(v.type)}">${typeName(v.type)}</span></div>
        <div class="vmeta"><h3>${esc(v.title)}</h3><span>${shortDate(v.date)}${v.desc?" · "+esc(v.desc):""}</span></div>
      </button>`;
    }).join("");
    $("#vnone").hidden = sorted.length>0;
    $("#count").textContent = sorted.length ? list.length + " vídeo" + (list.length===1?"":"s") : "";
    document.querySelectorAll("[data-vf]").forEach(b=>b.classList.toggle("on", b.dataset.vf===f));
  };
  document.querySelectorAll("[data-vf]").forEach(b=>b.onclick=()=>{f=b.dataset.vf;draw()});
  const close = () => { stage.innerHTML = ""; if (modal.open) modal.close(); };
  $("#vclose").onclick = close;
  modal.addEventListener("click", e => { if (e.target === modal) close(); });
  modal.addEventListener("close", () => { stage.innerHTML = ""; });
  $("#vgrid").onclick = e => {
    const c = e.target.closest(".vcard"); if (!c) return;
    const v = videos.find(x=>x.id===c.dataset.id), p = parse(v);
    if (p.kind === "link") { window.open(p.url, "_blank", "noopener"); return; }
    stage.innerHTML = p.kind==="youtube"
      ? `<iframe src="${p.embed}" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
      : `<video src="${esc(p.file)}" controls autoplay playsinline></video>`;
    const m = v.match && matches.find(x=>x.id===v.match);
    $("#vinfo").innerHTML = `<h3>${esc(v.title)}</h3><p>${typeName(v.type)} · ${longDate(v.date)}${m?` · Morpheus FC ${m.g[0]}–${m.g[1]} ${esc(m.opp)}`:""}</p>${v.desc?`<p>${esc(v.desc)}</p>`:""}`;
    modal.showModal();
  };
  draw();
});

/* ---------- Morpheus News ---------- */
if (page === "noticias") ready.then(() => {
  const arts = noticias.slice().sort((a,b)=> b.date.localeCompare(a.date));
  const paper = $("#paper");
  const cover = (a, cls="") => a.cover
    ? `<div class="pimg ${cls}"><img src="${esc(media("news", a.cover))}" alt="" loading="lazy"></div>`
    : `<div class="pimg blank ${cls}"><img src="assets/escudo.jpg" alt=""></div>`;
  const masthead = () => {
    const d = new Date(), edition = arts.length ? arts[0].date : null;
    return `<header class="mast">
      <div class="mast-top"><span>Edição de ${SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}</span><span>Pro Clubs · EA FC 27</span></div>
      <a class="mast-title" href="noticias.html"><img src="assets/escudo.jpg" alt=""><span>Morpheus <em>News</em></span></a>
      <div class="mast-sub">Resultados, bastidores e histórias do clube</div>
    </header>`;
  };
  const card = (a, size) => `<a class="story ${size}" href="#/${esc(a.id)}">
      ${cover(a)}
      <div class="kick">${esc(a.kicker)}</div>
      <h2>${esc(a.title)}</h2>
      <p>${esc(a.summary)}</p>
      <div class="by">${esc(a.author)} · ${longDate(a.date)}</div>
    </a>`;
  const front = () => {
    if (!arts.length) return masthead() + `<div class="empty-state">A primeira edição está sendo preparada.</div>`;
    const [lead, ...rest] = arts, side = rest.slice(0,2), more = rest.slice(2);
    return masthead() + `
      <section class="front">
        ${card(lead,"lead")}
        <aside class="side">${side.map(a=>card(a,"sm")).join("")}</aside>
      </section>
      ${more.length ? `<div class="rule-title"><span>Mais notícias</span></div><section class="more-grid">${more.map(a=>card(a,"md")).join("")}</section>` : ""}`;
  };
  const blocks = a => a.body.map(b => typeof b === "string" ? `<p>${fmt(b)}</p>`
    : b.h ? `<h3>${esc(b.h)}</h3>`
    : `<figure><img src="${esc(media("news", b.img))}" alt="${esc(b.caption||"")}" loading="lazy" onload="this.parentNode.classList.toggle('tall',this.naturalHeight>this.naturalWidth)">${b.caption?`<figcaption>${esc(b.caption)}</figcaption>`:""}</figure>`).join("");
  const article = a => masthead() + `
    <article class="art">
      <a class="back" href="#/">‹ Voltar ao Morpheus News</a>
      <div class="kick">${esc(a.kicker)}</div>
      <h1>${esc(a.title)}</h1>
      <p class="deck">${esc(a.summary)}</p>
      <div class="by">Por ${esc(a.author)} · ${longDate(a.date)}</div>
      ${a.cover ? `<figure class="hero-fig"><img src="${esc(media("news", a.cover))}" alt=""></figure>` : ""}
      <div class="art-body">${blocks(a)}</div>
    </article>`;
  const route = () => {
    const id = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const a = id && arts.find(x=>x.id===id);
    paper.innerHTML = a ? article(a) : front();
    document.title = (a ? a.title + " | " : "") + "Morpheus News | Morpheus FC";
    window.scrollTo({top:0, behavior:"instant"});
  };
  window.addEventListener("hashchange", route);
  route();
});

/* ---------- Amistosos ---------- */
if (page === "amistosos") {
  const S = window.SUPABASE || {}, on = !!(S.url && S.key);
  const headers = extra => Object.assign({ apikey: S.key }, S.key && S.key.startsWith("eyJ") ? { Authorization: "Bearer " + S.key } : {}, extra);
  const pad = n => String(n).padStart(2, "0");
  const A = config.amistosos || {};
  const f = $("#amForm"), msg = $("#amMsg"), btn = $("#amSend");
  $("#hours").textContent = A.horarios || "";
  /* Imagem do bloco "Próximos amistosos": a do config, ou a arte padrão do clube se não houver ou falhar */
  const banner = $("#amBanner"), bimg = $("#amBannerImg");
  if (A.imagem) { bimg.alt = "Amistosos do Morpheus FC"; bimg.onerror = () => { bimg.hidden = true; banner.classList.add("default"); }; bimg.src = media("bg", A.imagem); bimg.hidden = false; }
  else banner.classList.add("default");
  const d0 = new Date(), todayISO = `${d0.getFullYear()}-${pad(d0.getMonth()+1)}-${pad(d0.getDate())}`;
  f.play_date.min = todayISO; f.alt_date.min = todayISO;
  const show = (t, ok) => { msg.hidden = false; msg.textContent = t; msg.className = "am-msg " + (ok ? "ok" : "err"); };
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* Agenda pública: só amistosos confirmados (a view não traz contato nem observações) */
  (async () => {
    const box = $("#agenda");
    if (!on) { box.innerHTML = `<p class="sec-sub" style="margin:0">A agenda aparece aqui assim que os amistosos forem confirmados.</p>`; return; }
    try {
      const r = await fetch(`${S.url}/rest/v1/amistosos_publico?select=*&order=play_date.asc,play_time.asc`, { headers: headers() });
      if (!r.ok) throw new Error(r.status);
      const all = await r.json();
      /* próximos: confirmados de hoje em diante; realizados: ficam na lista com o selo "✓ Realizado", do mais recente para o mais antigo */
      const open = all.filter(x => x.status !== "realizado");
      const next = open.filter(x => x.play_date >= todayISO);
      /* confirmados cuja data já passou e ainda não foram marcados como realizados: aguardam o resultado */
      const wait = open.filter(x => x.play_date < todayISO).sort((a, b) => (b.play_date + b.play_time).localeCompare(a.play_date + a.play_time));
      const done = all.filter(x => x.status === "realizado").sort((a, b) => (b.play_date + b.play_time).localeCompare(a.play_date + a.play_time));
      const row = (x, kind) => {
        const d = dateOf(x.play_date), ok = kind === "done";
        const hasScore = ok && x.score_us != null && x.score_them != null;
        const res = hasScore ? (x.score_us > x.score_them ? "w" : x.score_us < x.score_them ? "l" : "d") : "";
        return `<div class="ag-row${ok ? " done" : kind === "wait" ? " wait" : ""}"><div class="ag-date"><b>${pad(d.getDate())}/${pad(d.getMonth()+1)}</b><span>${SEMANA[d.getDay()].slice(0,3)}</span></div>
          <div class="ag-info"><b>Morpheus FC x ${esc(x.team)}</b><small>${esc(x.play_time.slice(0,5))} · ${esc(x.platform)}</small></div>
          ${hasScore ? `<span class="ag-score ${res}" title="Placar">${x.score_us} x ${x.score_them}</span>` : ""}
          ${ok ? `<span class="ag-badge" title="Amistoso realizado"><i aria-hidden="true">✓</i> Realizado</span>` : kind === "wait" ? `<span class="ag-badge wait" title="Jogo já passou; aguardando o resultado">Aguardando resultado</span>` : ""}</div>`;
      };
      const vazio = t => `<p class="sec-sub" style="margin:0">${t}</p>`;
      const sep = t => `<div class="ag-sep"><span>${t}</span></div>`;
      box.innerHTML = !next.length && !wait.length && !done.length ? vazio("Nenhum amistoso confirmado ainda. Que tal ser o primeiro?")
        : (next.length ? next.map(x => row(x, "next")).join("") : vazio("Nenhum amistoso agendado no momento. Que tal marcar um?"))
          + (wait.length ? sep("Aguardando resultado") + wait.map(x => row(x, "wait")).join("") : "")
          + (done.length ? sep("Já realizados") + done.map(x => row(x, "done")).join("") : "");
    } catch (e) {
      box.innerHTML = `<p class="sec-sub" style="margin:0">A agenda aparece aqui assim que os amistosos forem confirmados.</p>`;
    }
  })();

  const summary = p => `Pedido de amistoso para o Morpheus FC\nTime: ${p.team}\nCapitão: ${p.captain} (${p.platform})\nContato: ${p.contact}\nDia e horário: ${shortDate(p.play_date)} às ${p.play_time}`
    + (p.alt_date ? `\nOutra opção: ${shortDate(p.alt_date)} às ${p.alt_time}` : "")
    + (p.division ? `\nDivisão: ${p.division}` : "") + (p.players ? `\nJogadores: ${p.players}` : "") + (p.notes ? `\nObservações: ${p.notes}` : "");

  const done = p => {
    $("#formBox").innerHTML = `<div class="panel am-done">
      <div class="am-check" aria-hidden="true">✓</div>
      <h3>Pedido enviado!</h3>
      <p class="sec-sub" style="margin:0 0 16px">Recebemos o pedido do <b>${esc(p.team)}</b>. Vamos falar com o capitão <b>${esc(p.captain)}</b> pelo contato informado para confirmar.</p>
      <ul class="am-sum"><li><span>Dia e horário</span><b>${shortDate(p.play_date)} às ${esc(p.play_time)}</b></li>
        ${p.alt_date ? `<li><span>Outra opção</span><b>${shortDate(p.alt_date)} às ${esc(p.alt_time)}</b></li>` : ""}
        <li><span>Contato</span><b>${esc(p.contact)}</b></li></ul>
      <button class="btn btn-ghost" type="button" onclick="location.reload()">Enviar outro pedido</button></div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  f.addEventListener("submit", async e => {
    e.preventDefault(); msg.hidden = true;
    const v = Object.fromEntries(new FormData(f));
    if (v.website) { done({ team: "seu clube", captain: "", contact: "", play_date: todayISO, play_time: "" }); return; }   /* campo-armadilha para robôs */
    const p = { team: (v.team||"").trim(), captain: (v.captain||"").trim(), contact: (v.contact||"").trim(), platform: v.platform || "PlayStation",
      play_date: v.play_date, play_time: v.play_time, alt_date: v.alt_date || null, alt_time: v.alt_time || null,
      division: v.division || "", players: v.players ? parseInt(v.players, 10) : null, notes: (v.notes||"").trim() };
    if (p.team.length < 2) return show("Informe o nome do time.");
    if (p.captain.length < 2) return show("Informe o capitão (PSN ou gamertag).");
    if (p.contact.length < 3) return show("Informe um contato para respondermos (Discord, WhatsApp ou Instagram).");
    if (!p.play_date || !p.play_time) return show("Escolha o dia e o horário do amistoso.");
    if (new Date(`${p.play_date}T${p.play_time}`) < new Date()) return show("Escolha um dia e horário que ainda não passaram.");
    if (!!p.alt_date !== !!p.alt_time) return show("Na outra opção, preencha o dia e o horário, ou deixe os dois em branco.");
    if (p.alt_date && new Date(`${p.alt_date}T${p.alt_time}`) < new Date()) return show("A outra opção precisa ser no futuro.");
    if (p.players !== null && !(p.players >= 1 && p.players <= 11)) return show("Quantidade de jogadores deve ser de 1 a 11.");
    const wait = (A.cooldownSegundos || 60) * 1000 - (Date.now() - Number(store.get("am_last") || 0));
    if (wait > 0) return show(`Você acabou de enviar um pedido. Aguarde ${Math.ceil(wait/1000)} segundos para enviar outro.`);

    const fallback = why => {
      show(why + " Copie o pedido abaixo e envie para nós pelo Discord.");
      const t = summary(p);
      msg.insertAdjacentHTML("beforeend", `<br><button class="btn btn-ghost btn-sm" type="button" id="amCopy">Copiar pedido</button>`);
      $("#amCopy").onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { $("#amCopy").textContent = "Copiado!"; }, () => { $("#amCopy").textContent = "Não foi possível copiar"; }); };
    };
    if (!on) return fallback("O envio automático ainda não está disponível.");
    btn.disabled = true; btn.textContent = "Enviando…";
    try {
      const r = await fetch(`${S.url}/rest/v1/amistosos`, { method: "POST", headers: headers({ "Content-Type": "application/json", Prefer: "return=minimal" }), body: JSON.stringify(p) });
      if (r.ok) { store.set("am_last", String(Date.now())); done(p); return; }
      btn.disabled = false; btn.textContent = "Enviar pedido";
      if (r.status === 400) return show("Alguma informação não foi aceita. Confira os campos e tente de novo.");
      fallback("Não foi possível enviar agora.");
    } catch (err) {
      btn.disabled = false; btn.textContent = "Enviar pedido";
      fallback("Sem conexão com o servidor.");
    }
  });
}
