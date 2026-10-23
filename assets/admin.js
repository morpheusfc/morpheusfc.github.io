/* Painel do Morpheus FC: login do administrador, notícias e vídeos (Supabase). */
(function(){
  const root = document.getElementById("root");
  const cfg = window.SUPABASE || {};
  const q = s => root.querySelector(s);
  const qa = s => [...root.querySelectorAll(s)];

  if (!cfg.url || !cfg.key) {
    root.innerHTML = `<div class="panel"><h3>Painel ainda não configurado</h3>
      <p class="sec-sub" style="margin:0">Falta ligar o site ao Supabase. Abra <b>assets/config.js</b> e preencha <b>url</b> e <b>key</b> (Supabase &gt; Project Settings &gt; API).</p></div>`;
    return;
  }
  if (!window.supabase) {
    root.innerHTML = `<div class="panel"><h3>Não foi possível carregar o painel</h3><p class="sec-sub" style="margin:0">Verifique sua conexão com a internet e recarregue a página.</p></div>`;
    return;
  }
  const sb = window.supabase.createClient(cfg.url, cfg.key);

  /* ---------- utilitários ---------- */
  const slug = t => (t || "post").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) + "-" + Math.random().toString(36).slice(2, 6);
  const today = () => { const d = new Date(), p = n => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; };
  const ytId = s => {
    s = (s || "").trim();
    const m = s.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/);
    if (m) return m[1];
    return /^[\w-]{11}$/.test(s) ? s : null;
  };
  const MAX_IMG = 8 * 1024 * 1024, MAX_VID = 50 * 1024 * 1024;

  /* Arquivo local (assets/news, assets/videos) ou endereço da nuvem */
  const mu = (kind, f) => /^https?:\/\//.test(f) ? f : `assets/${kind}/${f}`;
  /* Blocos do jornal -> texto do painel (e o inverso está em cms.js: parseBody) */
  const blocksToText = body => (body || []).map(b => typeof b === "string" ? b : b.h ? "## " + b.h : `![${b.caption || ""}](${b.img})`).join("\n\n");
  /* Aviso para trazer ao painel o que hoje só está nos arquivos do site, para poder editar e excluir */
  const importBanner = (what, n) => n ? `<div class="panel adm-import"><div><b>${n} ${what} do site ainda não pode${n > 1 ? "m" : ""} ser editad${what === "matérias" ? "a" : "o"}${n > 1 ? "s" : ""} aqui.</b>
      <small>Elas estão nos arquivos do site. Importe para o painel e passe a editar, trocar fotos e excluir por aqui.</small></div>
      <button class="btn btn-gold btn-sm" id="importBtn" type="button">Importar para o painel</button></div>` : "";

  /* Apagar do armazenamento da nuvem os arquivos que deixaram de ser usados (só os enviados pelo painel) */
  const storagePath = url => { const m = String(url || "").match(/\/storage\/v1\/object\/public\/media\/(.+)$/); return m ? decodeURIComponent(m[1]) : null; };
  async function dropFiles(urls){
    const paths = [...new Set(urls.map(storagePath).filter(Boolean))];
    if (paths.length) { try { await sb.storage.from("media").remove(paths); } catch (e) { console.warn("Não foi possível apagar arquivos:", e); } }
  }
  const bodyImages = text => [...String(text || "").matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(m => m[1]);

  async function upload(file, folder, max){
    if (file.size > max) throw new Error(`Arquivo grande demais (máximo ${Math.round(max/1048576)} MB). Para vídeos maiores, use YouTube.`);
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const { error } = await sb.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
    if (error) throw error;
    return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
  }
  const say = (msg, ok = true) => {
    const el = q("#msg"); if (!el) return;
    el.textContent = msg; el.style.color = ok ? "var(--win)" : "var(--loss)"; el.hidden = false;
  };
  const errText = e => (e && (e.message || e.error_description)) || String(e);

  /* ---------- login ---------- */
  function loginView(){
    root.innerHTML = `<form class="panel adm-login" id="login">
      <h3>Painel do clube</h3>
      <label>E-mail<input type="email" name="email" required autocomplete="username"></label>
      <label>Senha<input type="password" name="pass" required autocomplete="current-password"></label>
      <button class="btn btn-gold" type="submit">Entrar</button>
      <div id="msg" hidden></div>
    </form>`;
    q("#login").onsubmit = async e => {
      e.preventDefault();
      const f = new FormData(e.target), btn = q("button");
      btn.disabled = true; btn.textContent = "Entrando…";
      const { error } = await sb.auth.signInWithPassword({ email: f.get("email").trim(), password: f.get("pass") });
      if (error) { btn.disabled = false; btn.textContent = "Entrar"; say("E-mail ou senha incorretos.", false); }
    };
  }

  /* ---------- campeonato (assets/admin-campeonato.js) ---------- */
  let campTela;
  const campView = () => {
    if (!window.admCampeonato) { q("#view").innerHTML = `<div class="empty-state">Não foi possível carregar a aba do campeonato. Recarregue a página.</div>`; return; }
    campTela = campTela || window.admCampeonato({ sb, q, qa, esc, say, errText });
    return campTela();
  };

  /* ---------- estrutura do painel ---------- */
  let tab = "news";
  function shell(userEmail){
    root.innerHTML = `
      <div class="adm-top">
        <div class="adm-tabs">
          <button class="fbtn" data-tab="news">Notícias</button>
          <button class="fbtn" data-tab="videos">Vídeos</button>
          <button class="fbtn" data-tab="friendlies">Amistosos <span class="adm-count" id="newCount" hidden></span></button>
          <button class="fbtn" data-tab="recruit">Recrutamento <span class="adm-count" id="recCount" hidden></span></button>
          <button class="fbtn" data-tab="campeonato">Campeonato</button>
        </div>
        <div class="adm-user"><span>${esc(userEmail || "")}</span><button class="fbtn" id="logout">Sair</button></div>
      </div>
      <div id="view"></div>`;
    qa("[data-tab]").forEach(b => b.onclick = () => { tab = b.dataset.tab; shell(userEmail); });
    qa("[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
    q("#logout").onclick = () => sb.auth.signOut();
    ({ news: newsView, videos: videosView, friendlies: friendliesView, recruit: recruitView, campeonato: campView }[tab] || newsView)();
    refreshNewCount();
  }

  /* ---------- notícias ---------- */
  async function newsView(editRow){
    const view = q("#view");
    view.innerHTML = `<div class="empty-state">Carregando…</div>`;
    const { data: rows, error } = await sb.from("news").select("*").order("date", { ascending: false }).order("created_at", { ascending: false });
    if (error) { view.innerHTML = `<div class="empty-state">Erro ao carregar: ${esc(errText(error))}</div>`; return; }
    const r = editRow || { id: "", kicker: "Resultado", title: "", summary: "", author: "Redação Morpheus", date: today(), cover: "", body: "" };
    const kickers = ["Resultado", "Rodada", "Análise", "Clube", "Bastidores", "Entrevista"];
    const pending = (typeof noticias !== "undefined" ? noticias : []).filter(a => !rows.some(x => x.id === a.id));
    /* Mesma ordem da capa do site: data mais recente primeiro; no mesmo dia, a publicada/destacada por último */
    const ranked = [...rows, ...pending].sort((a, b) => b.date.localeCompare(a.date));
    const rankOf = id => ranked.findIndex(x => x.id === id);
    /* número da matéria: 1 = a mais antiga por data (empate: pelo nome). Não muda ao editar ou destacar. Só existe no painel, para facilitar a referência */
    const byAge = [...rows].sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.id).localeCompare(String(b.id)));
    const newsNum = n => byAge.findIndex(x => x.id === n.id) + 1;
    const badge = id => { const i = rankOf(id); return i === 0 ? `<span class="adm-badge top">★ Manchete (em destaque)</span>` : i > 0 && i <= 2 ? `<span class="adm-badge">Lateral da capa</span>` : ""; };
    view.innerHTML = (editRow ? "" : importBanner("matérias", pending.length)) + `
      <div class="adm-grid">
        <form class="panel" id="form">
          <h3>${editRow ? `Editar matéria #${newsNum(editRow)}` : "Nova matéria"}</h3>
          <label>Manchete<input name="title" required value="${esc(r.title)}"></label>
          <div class="row2">
            <label>Categoria<input name="kicker" list="kickers" required value="${esc(r.kicker)}"><datalist id="kickers">${kickers.map(k => `<option value="${k}">`).join("")}</datalist></label>
            <label>Data<input type="date" name="date" required value="${esc(r.date)}"></label>
          </div>
          <label>Linha fina (aparece na capa)<input name="summary" value="${esc(r.summary)}"></label>
          <label>Autor<input name="author" value="${esc(r.author)}"></label>
          <div class="adm-cover">
            <label>Foto de capa (matéria destaque)<input type="file" id="coverFile" accept="image/*"></label>
            <div class="adm-help">Tamanho ideal: <b>1600 × 900 px</b> (formato 16:9, horizontal), em JPG ou WebP, com até 300 KB. É a mesma foto da matéria destaque, dos cartões e do topo da matéria. O site corta nas bordas, então deixe o assunto no centro.</div>
            <input type="hidden" name="cover" value="${esc(r.cover)}">
            <div id="coverPrev">${r.cover ? `<img src="${esc(mu("news", r.cover))}" alt="Capa atual">` : ""}</div>
            <div><button type="button" class="fbtn danger" id="coverDel"${r.cover ? "" : " hidden"}>Remover foto</button></div>
          </div>
          <label>Texto
            <div class="adm-bar">
              <button type="button" class="fbtn" data-fmt="b" title="Negrito"><b>B</b></button>
              <button type="button" class="fbtn" data-fmt="i" title="Itálico"><i>I</i></button>
              <button type="button" class="fbtn" data-fmt="u" title="Sublinhado"><u>S</u></button>
              <span class="adm-sep"></span>
              <button type="button" class="fbtn sw ouro" data-fmt="ouro" title="Texto dourado">A</button>
              <button type="button" class="fbtn sw verde" data-fmt="verde" title="Texto verde">A</button>
              <button type="button" class="fbtn sw vermelho" data-fmt="vermelho" title="Texto vermelho">A</button>
              <button type="button" class="fbtn sw violeta" data-fmt="violeta" title="Texto violeta">A</button>
              <span class="adm-sep"></span>
              <button type="button" class="fbtn" data-fmt="link" title="Link">Link</button>
              <button type="button" class="fbtn" id="btnH">Subtítulo</button>
              <button type="button" class="fbtn" id="btnImg">Inserir foto</button>
              <button type="button" class="fbtn" id="btnPrev" aria-pressed="false">Pré-visualizar</button>
              <input type="file" id="imgFile" accept="image/*" hidden>
            </div>
            <textarea name="body" id="body" rows="14" placeholder="Escreva aqui. Deixe uma linha em branco entre os parágrafos.">${esc(r.body)}</textarea>
          </label>
          <div class="adm-prev art-body" id="prev" hidden></div>
          <div class="adm-help">
            <b>Como formatar:</b> selecione o trecho e clique nos botões, ou digite a marcação:
            <code>**negrito**</code> <code>*itálico*</code> <code>++sublinhado++</code>
            <code>{ouro|texto}</code> (cores: ouro, verde, vermelho, violeta) <code>[texto](https://link)</code>.<br>
            Linha em branco separa parágrafos. Uma linha começando com <code>## </code> vira subtítulo. Fotos entram pelo botão "Inserir foto".
          </div>
          <div class="adm-actions">
            <button class="btn btn-gold" type="submit">${editRow ? "Salvar alterações" : "Publicar"}</button>
            ${editRow ? `<button class="btn btn-ghost" type="button" id="cancel">Cancelar edição</button>` : ""}
          </div>
          <div id="msg" hidden></div>
        </form>
        <div class="panel">
          <h3>Matérias publicadas pelo painel</h3>
          ${rows.length ? `<div class="adm-help" style="margin-bottom:6px">A manchete da capa é a matéria de data mais recente. Entre matérias do mesmo dia, use <b>Destacar</b> para subir uma delas.</div>` : ""}
          ${rows.length ? rows.map(n => `<div class="adm-row${rankOf(n.id) === 0 ? " is-top" : ""}">
              <div>${badge(n.id)}<span class="adm-badge vid-num" title="Número da matéria (só aparece aqui no painel): ordem por data">#${newsNum(n)}</span> <b>${esc(n.title)}</b><small>${esc(n.kicker)} · ${esc(n.date)}</small></div>
              <div class="adm-btns"><a class="fbtn" href="noticias.html#/${encodeURIComponent(n.id)}" target="_blank" rel="noopener">Ver</a>
                ${rankOf(n.id) === 0 ? "" : `<button class="fbtn" data-top="${esc(n.id)}" title="Coloca no topo entre as matérias da mesma data">Destacar</button>`}<button class="fbtn" data-edit="${esc(n.id)}">Editar</button><button class="fbtn danger" data-del="${esc(n.id)}">Excluir</button></div>
            </div>`).join("") : `<p class="sec-sub" style="margin:0">Nenhuma matéria publicada pelo painel ainda.</p>`}
        </div>
      </div>`;

    const form = q("#form");
    const toDelete = [];   /* arquivos da nuvem a apagar quando a matéria for salva */
    q("#coverFile").onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      say("Enviando foto…");
      try {
        const url = await upload(f, "news", MAX_IMG);
        if (form.cover.value) toDelete.push(form.cover.value);
        form.cover.value = url; q("#coverPrev").innerHTML = `<img src="${esc(url)}" alt="Capa">`; q("#coverDel").hidden = false;
        say("Foto de capa enviada.");
      } catch (err) { say(errText(err), false); }
      e.target.value = "";
    };
    q("#coverDel").onclick = () => {
      if (!form.cover.value) return;
      toDelete.push(form.cover.value);
      form.cover.value = ""; q("#coverPrev").innerHTML = ""; q("#coverDel").hidden = true;
      say("Foto removida. Clique em salvar para aplicar.");
    };
    q("#btnH").onclick = () => insertAtCursor(q("#body"), "\n\n## Subtítulo\n\n");
    const WRAPS = { b: ["**", "**", "negrito"], i: ["*", "*", "itálico"], u: ["++", "++", "sublinhado"],
      ouro: ["{ouro|", "}", "texto"], verde: ["{verde|", "}", "texto"], vermelho: ["{vermelho|", "}", "texto"], violeta: ["{violeta|", "}", "texto"],
      link: ["[", "](https://)", "texto do link"] };
    qa("[data-fmt]").forEach(b => b.onclick = () => wrapSelection(q("#body"), ...WRAPS[b.dataset.fmt], b.dataset.fmt === "link"));
    /* Pré-visualização do texto, com a mesma formatação do site */
    const renderPrev = () => {
      const html = q("#body").value.split(/\n\s*\n/).map(c => c.trim()).filter(Boolean).map(c => {
        const im = c.match(/^!\[(.*?)\]\((.+?)\)$/s);
        if (im) return `<figure><img src="${esc(mu("news", im[2]))}" alt="" onload="this.parentNode.classList.toggle('tall',this.naturalHeight>this.naturalWidth)">${im[1] ? `<figcaption>${esc(im[1])}</figcaption>` : ""}</figure>`;
        if (c.startsWith("## ")) return `<h3>${esc(c.slice(3))}</h3>`;
        return `<p>${fmt(c.replace(/\n/g, " "))}</p>`;
      }).join("");
      q("#prev").innerHTML = html || `<p class="adm-help">Nada para mostrar ainda.</p>`;
    };
    q("#btnPrev").onclick = () => {
      const on = q("#prev").hidden;
      q("#prev").hidden = !on; q("#btnPrev").setAttribute("aria-pressed", String(on)); q("#btnPrev").classList.toggle("on", on);
      if (on) renderPrev();
    };
    q("#body").addEventListener("input", () => { if (!q("#prev").hidden) renderPrev(); });
    q("#btnImg").onclick = () => q("#imgFile").click();
    q("#imgFile").onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      say("Enviando foto…");
      try {
        const url = await upload(f, "news", MAX_IMG);
        const cap = prompt("Legenda da foto (pode deixar em branco):", "") || "";
        insertAtCursor(q("#body"), `\n\n![${cap.replace(/[\[\]]/g, "")}](${url})\n\n`);
        say("Foto inserida no texto.");
      } catch (err) { say(errText(err), false); }
      e.target.value = "";
    };
    form.onsubmit = async e => {
      e.preventDefault();
      const f = new FormData(form), btn = form.querySelector("[type=submit]");
      const row = { id: editRow ? editRow.id : slug(f.get("title")), kicker: f.get("kicker").trim(), title: f.get("title").trim(),
        summary: f.get("summary").trim(), author: (f.get("author") || "Redação Morpheus").trim(), date: f.get("date"), cover: f.get("cover") || "", body: f.get("body") };
      btn.disabled = true;
      const { error } = await sb.from("news").upsert(row);
      btn.disabled = false;
      if (error) return say(errText(error), false);
      await dropFiles(toDelete);
      newsView();
      setTimeout(() => say(editRow ? "Matéria atualizada." : "Matéria publicada. Já está no site."), 50);
    };
    const impN = q("#importBtn");
    if (impN) impN.onclick = async () => {
      impN.disabled = true; impN.textContent = "Importando…";
      const list = pending.map(a => ({ id: a.id, kicker: a.kicker || "Clube", title: a.title, summary: a.summary || "", author: a.author || "Redação Morpheus",
        date: a.date, cover: a.cover || "", body: blocksToText(a.body) }));
      const { error } = await sb.from("news").upsert(list);
      if (error) { impN.disabled = false; impN.textContent = "Importar para o painel"; return say(errText(error), false); }
      newsView();
    };
    if (editRow) q("#cancel").onclick = () => newsView();
    qa("[data-top]").forEach(b => b.onclick = async () => {
      const row = rows.find(x => x.id === b.dataset.top);
      const { error } = await sb.from("news").upsert({ ...row, created_at: new Date().toISOString() });
      if (error) return say(errText(error), false);
      newsView();
    });
    qa("[data-edit]").forEach(b => b.onclick = () => { newsView(rows.find(x => x.id === b.dataset.edit)); window.scrollTo({ top: 0, behavior: "smooth" }); });
    qa("[data-del]").forEach(b => b.onclick = async () => {
      const n = rows.find(x => x.id === b.dataset.del);
      if (!confirm(`Excluir a matéria "${n.title}"? Isso não pode ser desfeito. (Se ela também estiver no arquivo do site, volta a aparecer até ser removida de lá.)`)) return;
      const { error } = await sb.from("news").delete().eq("id", n.id);
      if (error) return say(errText(error), false);
      await dropFiles([n.cover, ...bodyImages(n.body)]);
      newsView();
    });
  }
  /* Envolve o trecho selecionado (ou um texto de exemplo) com a marcação de formatação */
  function wrapSelection(ta, before, after, placeholder, isLink){
    const s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || placeholder;
    ta.value = ta.value.slice(0, s) + before + sel + after + ta.value.slice(e);
    ta.focus();
    if (isLink) { ta.selectionStart = s + before.length + sel.length + 2; ta.selectionEnd = ta.selectionStart + 8; }   /* seleciona o "https://" para colar o endereço */
    else { ta.selectionStart = s + before.length; ta.selectionEnd = s + before.length + sel.length; }
    ta.dispatchEvent(new Event("input"));
  }
  function insertAtCursor(ta, text){
    const s = ta.selectionStart, e = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
    ta.focus(); ta.selectionStart = ta.selectionEnd = s + text.length;
  }

  /* ---------- vídeos ---------- */
  async function videosView(editRow){
    const view = q("#view");
    view.innerHTML = `<div class="empty-state">Carregando…</div>`;
    const { data: rows, error } = await sb.from("videos").select("*").order("date", { ascending: false });
    if (error) { view.innerHTML = `<div class="empty-state">Erro ao carregar: ${esc(errText(error))}</div>`; return; }
    const r = editRow || { id: "", title: "", type: "lance", date: today(), src: "", thumb: "", descr: "", match: "" };
    const kind = r.src.startsWith("youtube:") ? "yt" : r.src.startsWith("file:") ? "file" : r.src.startsWith("link:") ? "link" : "yt";
    const val = r.src.includes(":") ? r.src.slice(r.src.indexOf(":") + 1) : "";
    const mdate = m => { const d = new Date(m.date); return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`; };
    /* número do vídeo: 1 = o mais antigo por data (empate: pelo nome). Não muda ao editar ou destacar. Só existe no painel, para facilitar a referência */
    const byAge = [...rows].sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.id).localeCompare(String(b.id)));
    const vidNum = v => byAge.findIndex(x => x.id === v.id) + 1;
    const pending = (typeof videos !== "undefined" ? videos : []).filter(v => !rows.some(x => x.id === v.id));
    view.innerHTML = (editRow ? "" : importBanner("vídeos", pending.length)) + `
      <div class="adm-grid">
        <form class="panel" id="form">
          <h3>${editRow ? `Editar vídeo #${vidNum(editRow)}` : "Novo vídeo"}</h3>
          <label>Título<input name="title" required value="${esc(r.title)}"></label>
          <div class="row2">
            <label>Tipo<select name="type"><option value="lance"${r.type==="lance"?" selected":""}>Lance</option><option value="partida"${r.type==="partida"?" selected":""}>Partida completa</option></select></label>
            <label>Data<input type="date" name="date" required value="${esc(r.date)}"></label>
          </div>
          <label>De onde vem o vídeo
            <select name="kind" id="kind">
              <option value="yt"${kind==="yt"?" selected":""}>YouTube (link)</option>
              <option value="file"${kind==="file"?" selected":""}>Enviar arquivo MP4 (até 50 MB)</option>
              <option value="link"${kind==="link"?" selected":""}>Link externo (Twitch, Medal...)</option>
            </select>
          </label>
          <label id="srcText">Link<input name="srcval" value="${esc(kind==="file"?"":val)}" placeholder="https://www.youtube.com/watch?v=..."></label>
          <label id="srcFile" hidden>Arquivo de vídeo<input type="file" id="vidFile" accept="video/mp4,video/webm"></label>
          <input type="hidden" name="fileurl" value="${esc(kind==="file"?val:"")}">
          <div class="adm-help" id="fileInfo">${kind==="file"&&val?"Arquivo atual enviado. Escolha outro para trocar.":""}</div>
          <label>Descrição (opcional)<input name="descr" value="${esc(r.descr)}"></label>
          <label>Jogo relacionado (opcional)
            <select name="match"><option value="">Nenhum</option>${matches.map(m => `<option value="${m.id}"${r.match===m.id?" selected":""}>${mdate(m)} · Morpheus ${m.g[0]}–${m.g[1]} ${esc(m.opp)}</option>`).join("")}</select>
          </label>
          <div class="adm-cover">
            <label>Capa (opcional; o YouTube já tem)<input type="file" id="thumbFile" accept="image/*"></label>
            <div class="adm-help">Tamanho ideal: <b>1280 × 720 px</b> (formato 16:9, horizontal), em JPG, com até 200 KB. Um quadro do momento do lance funciona bem.</div>
            <input type="hidden" name="thumb" value="${esc(r.thumb)}">
            <div id="coverPrev">${r.thumb ? `<img src="${esc(mu("videos", r.thumb))}" alt="Capa atual">` : ""}</div>
            <div><button type="button" class="fbtn danger" id="thumbDel"${r.thumb ? "" : " hidden"}>Remover capa</button></div>
          </div>
          <div class="adm-actions">
            <button class="btn btn-gold" type="submit">${editRow ? "Salvar alterações" : "Publicar vídeo"}</button>
            ${editRow ? `<button class="btn btn-ghost" type="button" id="cancel">Cancelar edição</button>` : ""}
          </div>
          <div id="msg" hidden></div>
        </form>
        <div class="panel">
          <h3>Vídeos publicados pelo painel</h3>
          ${rows.length ? rows.map(v => `<div class="adm-row">
              <div><span class="adm-badge vid-num" title="Número do vídeo (só aparece aqui no painel): ordem por data">#${vidNum(v)}</span> <b>${esc(v.title)}</b><small>${v.type === "partida" ? "Partida" : "Lance"} · ${esc(v.date)}</small></div>
              <div class="adm-btns"><button class="fbtn" data-top="${esc(v.id)}" title="Coloca no topo entre os vídeos da mesma data">Destacar</button><button class="fbtn" data-edit="${esc(v.id)}">Editar</button><button class="fbtn danger" data-del="${esc(v.id)}">Excluir</button></div>
            </div>`).join("") : `<p class="sec-sub" style="margin:0">Nenhum vídeo publicado pelo painel ainda.</p>`}
        </div>
      </div>`;

    const form = q("#form");
    const toDelete = [];   /* arquivos da nuvem a apagar quando o vídeo for salvo */
    const toggle = () => {
      const k = form.kind.value;
      q("#srcText").hidden = k === "file"; q("#srcFile").hidden = k !== "file";
      form.srcval.placeholder = k === "yt" ? "https://www.youtube.com/watch?v=..." : "https://...";
    };
    form.kind.onchange = toggle; toggle();
    q("#vidFile").onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      say("Enviando vídeo… pode levar um tempo.");
      try { const url = await upload(f, "videos", MAX_VID); form.fileurl.value = url; q("#fileInfo").textContent = "Vídeo enviado: " + f.name; say("Vídeo enviado. Agora clique em publicar."); }
      catch (err) { say(errText(err), false); }
    };
    q("#thumbFile").onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try {
        const url = await upload(f, "videos", MAX_IMG);
        if (form.thumb.value) toDelete.push(form.thumb.value);
        form.thumb.value = url; q("#coverPrev").innerHTML = `<img src="${esc(url)}" alt="Capa">`; q("#thumbDel").hidden = false;
        say("Capa enviada.");
      } catch (err) { say(errText(err), false); }
      e.target.value = "";
    };
    q("#thumbDel").onclick = () => {
      if (!form.thumb.value) return;
      toDelete.push(form.thumb.value);
      form.thumb.value = ""; q("#coverPrev").innerHTML = ""; q("#thumbDel").hidden = true;
      say("Capa removida. Clique em salvar para aplicar.");
    };
    form.onsubmit = async e => {
      e.preventDefault();
      const f = new FormData(form), k = f.get("kind");
      let src;
      if (k === "yt") { const id = ytId(f.get("srcval")); if (!id) return say("Link do YouTube inválido.", false); src = "youtube:" + id; }
      else if (k === "file") { if (!f.get("fileurl")) return say("Escolha o arquivo de vídeo primeiro.", false); src = "file:" + f.get("fileurl"); }
      else { const u = (f.get("srcval") || "").trim(); if (!/^https?:\/\//.test(u)) return say("Cole o endereço completo, começando com https://", false); src = "link:" + u; }
      const row = { id: editRow ? editRow.id : slug(f.get("title")), title: f.get("title").trim(), type: f.get("type"), date: f.get("date"),
        src, thumb: f.get("thumb") || "", descr: (f.get("descr") || "").trim(), match: f.get("match") || "" };
      const btn = form.querySelector("[type=submit]"); btn.disabled = true;
      const { error } = await sb.from("videos").upsert(row);
      btn.disabled = false;
      if (error) return say(errText(error), false);
      await dropFiles(toDelete);
      videosView();
      setTimeout(() => say(editRow ? "Vídeo atualizado." : "Vídeo publicado. Já está no site."), 50);
    };
    const impV = q("#importBtn");
    if (impV) impV.onclick = async () => {
      impV.disabled = true; impV.textContent = "Importando…";
      const list = pending.map(v => ({ id: v.id, title: v.title, type: v.type, date: v.date, src: v.src, thumb: v.thumb || "", descr: v.desc || "", match: v.match || "" }));
      const { error } = await sb.from("videos").upsert(list);
      if (error) { impV.disabled = false; impV.textContent = "Importar para o painel"; return say(errText(error), false); }
      videosView();
    };
    if (editRow) q("#cancel").onclick = () => videosView();
    qa("[data-top]").forEach(b => b.onclick = async () => {
      const row = rows.find(x => x.id === b.dataset.top);
      const { error } = await sb.from("videos").upsert({ ...row, created_at: new Date().toISOString() });
      if (error) return say(errText(error), false);
      videosView();
    });
    qa("[data-edit]").forEach(b => b.onclick = () => { videosView(rows.find(x => x.id === b.dataset.edit)); window.scrollTo({ top: 0, behavior: "smooth" }); });
    qa("[data-del]").forEach(b => b.onclick = async () => {
      const v = rows.find(x => x.id === b.dataset.del);
      if (!confirm(`Excluir o vídeo "${v.title}"? Isso não pode ser desfeito. (Se ele também estiver no arquivo do site, volta a aparecer até ser removido de lá.)`)) return;
      const { error } = await sb.from("videos").delete().eq("id", v.id);
      if (error) return say(errText(error), false);
      await dropFiles([v.thumb, v.src.startsWith("file:") ? v.src.slice(5) : ""]);
      videosView();
    });
  }

  /* ---------- amistosos ---------- */
  const STATUS = { novo: "Novo", confirmado: "Confirmado", recusado: "Recusado", realizado: "Realizado" };
  let amFilter = "";
  async function refreshNewCount(){
    for (const [sel, table] of [["#newCount", "amistosos"], ["#recCount", "candidaturas"]]) {
      const el = q(sel); if (!el) continue;
      const { count, error } = await sb.from(table).select("id", { count: "exact", head: true }).eq("status", "novo");
      if (error || !count) { el.hidden = true; continue; }
      el.textContent = count; el.hidden = false;
    }
  }
  const hhmm = t => String(t || "").slice(0, 5);
  const when = (date, time) => { const d = dateOf(date); return `${shortDate(date).slice(0, 5)} (${SEMANA[d.getDay()]}) às ${hhmm(time)}`; };
  const msgConfirm = a => `Olá, capitão ${a.captain}! Aqui é do Morpheus FC. Confirmamos o amistoso contra o ${a.team} em ${shortDate(a.play_date).slice(0, 5)} às ${hhmm(a.play_time)}. Se precisar mudar o horário, é só avisar por aqui. Bom jogo!`;
  const msgDecline = a => `Olá, capitão ${a.captain}! Aqui é do Morpheus FC. Obrigado pelo convite para o amistoso contra o ${a.team}, mas não conseguiremos jogar em ${shortDate(a.play_date).slice(0, 5)} às ${hhmm(a.play_time)}. Podemos tentar outro dia? Diga quais horários ficam bons para vocês.`;
  const copy = async text => { try { await navigator.clipboard.writeText(text); return true; } catch (e) { return false; } };

  async function friendliesView(){
    const view = q("#view");
    view.innerHTML = `<div class="empty-state">Carregando…</div>`;
    const { data: rows, error } = await sb.from("amistosos").select("*").order("play_date", { ascending: true }).order("play_time", { ascending: true });
    if (error) {
      view.innerHTML = `<div class="panel"><h3>Amistosos ainda não configurados</h3><p class="sec-sub" style="margin:0">A tabela de pedidos ainda não existe no Supabase. Abra o arquivo <b>supabase-amistosos.sql</b>, copie tudo e rode em <b>SQL Editor &gt; New query &gt; Run</b>. Depois recarregue esta página.<br><small>${esc(errText(error))}</small></p></div>`;
      return;
    }
    const todayStr = today();
    const isPast = a => a.play_date < todayStr;
    const groups = {
      novo: rows.filter(a => a.status === "novo"),
      confirmado: rows.filter(a => a.status === "confirmado"),
      historico: rows.filter(a => a.status === "recusado" || a.status === "realizado"),
      todos: rows
    };
    if (!amFilter) amFilter = groups.novo.length ? "novo" : "confirmado";
    const list = groups[amFilter] || [];
    const chip = (k, label) => `<button class="fbtn${amFilter === k ? " on" : ""}" data-amf="${k}">${label} (${groups[k].length})</button>`;
    const dayTag = a => { const diff = Math.round((dateOf(a.play_date) - dateOf(todayStr)) / 864e5); return diff === 0 ? `<span class="adm-badge top">Hoje</span>` : diff === 1 ? `<span class="adm-badge">Amanhã</span>` : diff < 0 && (a.status === "novo" || a.status === "confirmado") ? `<span class="adm-badge">Data passada</span>` : ""; };
    const info = (label, val) => val ? `<div><span>${label}</span><b>${val}</b></div>` : "";
    view.innerHTML = `
      <div class="toolbar">${chip("novo", "Novos")}${chip("confirmado", "Confirmados")}${chip("historico", "Histórico")}${chip("todos", "Todos")}</div>
      ${list.length ? list.map(a => `
        <article class="panel am-card st-${esc(a.status)}" data-id="${esc(a.id)}">
          <div class="am-top"><div><b class="am-team">${esc(a.team)}</b> ${dayTag(a)}</div><span class="am-pill ${esc(a.status)}">${STATUS[a.status] || esc(a.status)}</span></div>
          <div class="am-grid">
            ${info("Dia e horário", esc(when(a.play_date, a.play_time)))}
            ${a.alt_date ? info("Outra opção", esc(when(a.alt_date, a.alt_time))) : ""}
            ${info("Capitão", `${esc(a.captain)} · ${esc(a.platform)}`)}
            <div><span>Contato</span><b>${esc(a.contact)}</b> <button class="fbtn" data-copy="${esc(a.contact)}" type="button">Copiar</button></div>
            ${info("Divisão", esc(a.division))}${info("Jogadores", a.players ? esc(a.players) : "")}
          </div>
          ${a.notes ? `<p class="am-notes">“${esc(a.notes)}”</p>` : ""}
          ${a.status === "confirmado" || a.status === "realizado" ? `<div class="am-score">Placar: Morpheus <input type="number" min="0" max="99" data-sc="us" value="${a.score_us ?? ""}" aria-label="Gols do Morpheus"> x <input type="number" min="0" max="99" data-sc="them" value="${a.score_them ?? ""}" aria-label="Gols do adversário"> ${esc(a.team)}</div>` : ""}
          <label class="am-adm">Anotação interna (só você vê)<input data-note value="${esc(a.admin_note)}" maxlength="500" placeholder="Ex.: falei no Discord, aguardando resposta"></label>
          <div class="adm-btns am-actions">
            ${a.status === "novo" ? `<button class="btn btn-gold btn-sm" data-st="confirmado">Confirmar</button><button class="fbtn" data-st="recusado">Recusar</button>` : ""}
            ${a.status === "confirmado" ? `<button class="btn btn-gold btn-sm" data-st="realizado">Marcar como realizado</button><button class="fbtn" data-st="recusado">Cancelar</button>` : ""}
            ${a.status === "recusado" || a.status === "realizado" ? `<button class="fbtn" data-st="novo">Reabrir</button>` : ""}
            <button class="fbtn" data-msg="confirm" type="button">Msg de confirmação</button>
            <button class="fbtn" data-msg="decline" type="button">Msg de recusa</button>
            <button class="fbtn danger" data-delf type="button">Excluir</button>
          </div>
        </article>`).join("") : `<div class="empty-state">${amFilter === "novo" ? "Nenhum pedido novo no momento." : "Nada por aqui ainda."}</div>`}
      <div id="msg" hidden></div>`;

    qa("[data-amf]").forEach(b => b.onclick = () => { amFilter = b.dataset.amf; friendliesView(); });
    const find = el => rows.find(x => x.id === el.closest(".am-card").dataset.id);
    qa("[data-copy]").forEach(b => b.onclick = async () => { const ok = await copy(b.dataset.copy); b.textContent = ok ? "Copiado!" : "Falhou"; setTimeout(() => { b.textContent = "Copiar"; }, 1500); });
    qa("[data-msg]").forEach(b => b.onclick = async () => {
      const a = find(b), ok = await copy(b.dataset.msg === "confirm" ? msgConfirm(a) : msgDecline(a));
      const old = b.textContent; b.textContent = ok ? "Copiada!" : "Falhou"; setTimeout(() => { b.textContent = old; }, 1500);
    });
    qa("[data-st]").forEach(b => b.onclick = async () => {
      const a = find(b);
      const upd = { status: b.dataset.st };
      if (b.dataset.st === "realizado") Object.assign(upd, scoreOf(b));
      const { error: e } = await sb.from("amistosos").update(upd).eq("id", a.id);
      if (e) return say(errText(e) + (/score_/.test(errText(e)) ? " (rode o supabase-amistosos.sql atualizado no Supabase)" : ""), false);
      if (b.dataset.st === "confirmado") amFilter = "confirmado"; else if (b.dataset.st === "novo") amFilter = "novo";
      friendliesView(); refreshNewCount();
    });
    /* placar: campos vazios = sem placar (null); só entra no update quando os dois estão preenchidos */
    const scoreOf = el => {
      const card = el.closest(".am-card"), us = card.querySelector('[data-sc="us"]'), them = card.querySelector('[data-sc="them"]');
      if (!us || !them || us.value === "" || them.value === "") return {};
      return { score_us: Math.max(0, Math.min(99, parseInt(us.value, 10) || 0)), score_them: Math.max(0, Math.min(99, parseInt(them.value, 10) || 0)) };
    };
    qa("[data-sc]").forEach(i => i.onchange = async () => {
      const a = find(i), card = i.closest(".am-card");
      const u = card.querySelector('[data-sc="us"]').value, t = card.querySelector('[data-sc="them"]').value;
      const upd = u === "" && t === "" ? { score_us: null, score_them: null } : scoreOf(i);
      if (!Object.keys(upd).length) return;
      const { error: e } = await sb.from("amistosos").update(upd).eq("id", a.id);
      if (e) return say(errText(e) + " (rode o supabase-amistosos.sql atualizado no Supabase)", false);
      Object.assign(a, upd); say("Placar salvo.");
    });
    qa("[data-note]").forEach(i => i.onchange = async () => {
      const a = find(i);
      const { error: e } = await sb.from("amistosos").update({ admin_note: i.value.trim() }).eq("id", a.id);
      if (e) return say(errText(e), false);
      a.admin_note = i.value.trim(); say("Anotação salva.");
    });
    qa("[data-delf]").forEach(b => b.onclick = async () => {
      const a = find(b);
      if (!confirm(`Excluir o pedido do ${a.team}? Isso não pode ser desfeito.`)) return;
      const { error: e } = await sb.from("amistosos").delete().eq("id", a.id);
      if (e) return say(errText(e), false);
      friendliesView(); refreshNewCount();
    });
  }

  /* ---------- recrutamento ---------- */
  const STATUS_REC = { novo: "Nova", em_teste: "Em teste", aprovado: "Aprovado", recusado: "Recusado" };
  let recFilter = "";
  const recName = a => a.nick || a.psn;
  const recMsgs = {
    invite:  a => `Olá, ${recName(a)}! Aqui é do Morpheus FC. Recebemos a sua candidatura para ${a.pos === "Qualquer" ? "o clube" : a.pos}. Queremos chamar você para um teste em campo com o time. Quais dias e horários ficam bons para você?`,
    welcome: a => `Olá, ${recName(a)}! Aqui é do Morpheus FC. Você foi aprovado, seja bem-vindo ao clube! Vamos enviar o convite para você entrar no clube no jogo e o acesso ao nosso Discord.`,
    decline: a => `Olá, ${recName(a)}! Aqui é do Morpheus FC. Obrigado pelo interesse e pelo seu tempo. Desta vez não vamos seguir com a sua entrada, mas as portas continuam abertas para uma nova tentativa. Boa sorte!`
  };
  const fmtDateTime = iso => { const d = new Date(iso); if (isNaN(d)) return ""; const p = n => String(n).padStart(2, "0"); return `${p(d.getDate())}/${p(d.getMonth() + 1)} às ${p(d.getHours())}:${p(d.getMinutes())}`; };

  async function recruitView(){
    const view = q("#view");
    view.innerHTML = `<div class="empty-state">Carregando…</div>`;
    const { data: rows, error } = await sb.from("candidaturas").select("*").order("created_at", { ascending: false });
    if (error) {
      view.innerHTML = `<div class="panel"><h3>Recrutamento ainda não configurado</h3><p class="sec-sub" style="margin:0">A tabela de candidaturas ainda não existe no Supabase. Abra o arquivo <b>supabase-recrutamento.sql</b>, copie tudo e rode em <b>SQL Editor &gt; New query &gt; Run</b>. Depois recarregue esta página.<br><small>${esc(errText(error))}</small></p></div>`;
      return;
    }
    const groups = {
      novo: rows.filter(a => a.status === "novo"), em_teste: rows.filter(a => a.status === "em_teste"),
      aprovado: rows.filter(a => a.status === "aprovado"), recusado: rows.filter(a => a.status === "recusado"), todos: rows
    };
    if (!recFilter) recFilter = groups.novo.length ? "novo" : groups.em_teste.length ? "em_teste" : "todos";
    const list = groups[recFilter] || [];
    const chip = (k, label) => `<button class="fbtn${recFilter === k ? " on" : ""}" data-rf="${k}">${label} (${groups[k].length})</button>`;
    const info = (label, val) => val ? `<div><span>${label}</span><b>${val}</b></div>` : "";
    const safeLink = u => /^https?:\/\/\S+$/i.test(u) ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(u.length > 46 ? u.slice(0, 46) + "…" : u)}</a>` : esc(u);
    view.innerHTML = `
      <div class="toolbar">${chip("novo", "Novas")}${chip("em_teste", "Em teste")}${chip("aprovado", "Aprovados")}${chip("recusado", "Recusados")}${chip("todos", "Todas")}</div>
      ${list.length ? list.map(a => `
        <article class="panel am-card st-${esc(a.status)}" data-id="${esc(a.id)}">
          <div class="am-top"><div><b class="am-team">${esc(a.psn)}</b>${a.nick ? ` <span class="am-nick">(${esc(a.nick)})</span>` : ""}</div><span class="am-pill ${esc(a.status === "em_teste" ? "novo" : a.status === "aprovado" ? "confirmado" : a.status)}">${STATUS_REC[a.status] || esc(a.status)}</span></div>
          <div class="am-grid">
            ${info("Plataforma", esc(a.platform))}
            ${info("Posição", esc(a.pos === "Qualquer" ? "Qualquer posição" : a.pos) + (a.pos_alt ? ` · 2ª: ${esc(a.pos_alt)}` : ""))}
            <div><span>Contato</span><b>${esc(a.contact)}</b> <button class="fbtn" data-copy="${esc(a.contact)}" type="button">Copiar</button></div>
            ${info("Horários", esc(a.availability))}${info("Experiência", esc(a.experience))}${info("Último clube", esc(a.previous_club))}
            ${a.clips ? info("Lances", safeLink(a.clips)) : ""}
            ${info("Recebida", esc(fmtDateTime(a.created_at)))}
          </div>
          ${a.message ? `<p class="am-notes">“${esc(a.message)}”</p>` : ""}
          <label class="am-adm">Anotação interna (só você vê)<input data-note value="${esc(a.admin_note)}" maxlength="500" placeholder="Ex.: teste marcado para sexta, 21h"></label>
          <div class="adm-btns am-actions">
            ${a.status === "novo" ? `<button class="btn btn-gold btn-sm" data-st="em_teste">Chamar para teste</button><button class="fbtn" data-st="recusado">Recusar</button>` : ""}
            ${a.status === "em_teste" ? `<button class="btn btn-gold btn-sm" data-st="aprovado">Aprovar</button><button class="fbtn" data-st="recusado">Recusar</button>` : ""}
            ${a.status === "aprovado" || a.status === "recusado" ? `<button class="fbtn" data-st="novo">Reabrir</button>` : ""}
            <button class="fbtn" data-msg="invite" type="button">Msg de convite</button>
            <button class="fbtn" data-msg="welcome" type="button">Msg de boas-vindas</button>
            <button class="fbtn" data-msg="decline" type="button">Msg de recusa</button>
            <button class="fbtn danger" data-delr type="button">Excluir</button>
          </div>
        </article>`).join("") : `<div class="empty-state">${recFilter === "novo" ? "Nenhuma candidatura nova no momento." : "Nada por aqui ainda."}</div>`}
      <div id="msg" hidden></div>`;

    qa("[data-rf]").forEach(b => b.onclick = () => { recFilter = b.dataset.rf; recruitView(); });
    const find = el => rows.find(x => x.id === el.closest(".am-card").dataset.id);
    qa("[data-copy]").forEach(b => b.onclick = async () => { const ok = await copy(b.dataset.copy); b.textContent = ok ? "Copiado!" : "Falhou"; setTimeout(() => { b.textContent = "Copiar"; }, 1500); });
    qa("[data-msg]").forEach(b => b.onclick = async () => {
      const ok = await copy(recMsgs[b.dataset.msg](find(b)));
      const old = b.textContent; b.textContent = ok ? "Copiada!" : "Falhou"; setTimeout(() => { b.textContent = old; }, 1500);
    });
    qa("[data-st]").forEach(b => b.onclick = async () => {
      const a = find(b), st = b.dataset.st;
      const { error: e } = await sb.from("candidaturas").update({ status: st }).eq("id", a.id);
      if (e) return say(/duplicate|unique|23505/i.test(errText(e)) ? "Já existe outra candidatura em análise com esse ID. Resolva aquela primeiro." : errText(e), false);
      recFilter = st === "recusado" ? recFilter : st;
      recruitView(); refreshNewCount();
      if (st === "aprovado") setTimeout(() => say("Aprovado! Lembre de convidar o jogador no clube dentro do jogo e de incluí-lo no elenco do site."), 50);
    });
    qa("[data-note]").forEach(i => i.onchange = async () => {
      const a = find(i);
      const { error: e } = await sb.from("candidaturas").update({ admin_note: i.value.trim() }).eq("id", a.id);
      if (e) return say(errText(e), false);
      a.admin_note = i.value.trim(); say("Anotação salva.");
    });
    qa("[data-delr]").forEach(b => b.onclick = async () => {
      const a = find(b);
      if (!confirm(`Excluir a candidatura de ${a.psn}? Isso não pode ser desfeito.`)) return;
      const { error: e } = await sb.from("candidaturas").delete().eq("id", a.id);
      if (e) return say(errText(e), false);
      recruitView(); refreshNewCount();
    });
  }

  /* ---------- sessão ---------- */
  let shownFor;
  const show = session => {
    const who = session ? session.user.email : null;
    if (who === shownFor) return;
    shownFor = who;
    who ? shell(who) : loginView();
  };
  sb.auth.onAuthStateChange((_evt, session) => show(session));
  sb.auth.getSession().then(({ data }) => show(data.session));
})();
