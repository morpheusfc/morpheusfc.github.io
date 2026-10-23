/* Aba "Campeonato" do painel (admin.html). O admin.js chama window.admCampeonato(ctx) e usa a função devolvida como a tela da aba.
   Tabelas no Supabase: campeonatos, campeonato_times, campeonato_jogos (ver supabase-campeonato.sql). */
window.admCampeonato = function (ctx) {
  const { sb, q, qa, esc, say, errText } = ctx;
  const FASES = { grupos: "Fase de grupos", quartas: "Quartas de final", semis: "Semifinais", final: "Final" };
  const NUMS = [8, 12, 16, 20, 24];
  const FOTOS = [["hero", "Capa"], ["grupos", "Grupos"], ["jogos", "Jogos"], ["matamata", "Mata-mata"], ["stats", "Estatísticas"], ["premiacao", "Premiação"], ["regras", "Regulamento"], ["card", "Card do campeão"]];
  const PREMIOS = `🏆 | Campeão | Troféu virtual e card de campeão com o escudo do clube em destaque no site
🥈 | Vice-campeão | Medalha virtual e menção no Morpheus News
⚽ | Artilheiro | Quem fizer mais gols na competição
🎯 | Garçom | Líder de assistências
⭐ | Craque do campeonato | Mais vezes eleito melhor em campo
🧤 | Melhor goleiro | Maior Índice de Eficiência do Goleiro (IEG): defesas ÷ (defesas + gols sofridos) × 100
🛡️ | Defesa menos vazada | Clube que sofrer menos gols`;
  const REGRAS = `Formato | Fase de grupos (todos contra todos dentro do grupo), depois mata-mata em jogo único.
Os jogos | Todos os jogos são amistosos entre os clubes, nos horários definidos pela organização.
Plataformas | Aberto a todas as plataformas.
Pontuação | Vitória vale 3 pontos, empate 1 e derrota 0.
Desempate | Pontos, saldo de gols, gols marcados e número de vitórias.
Melhor goleiro | O prêmio de Melhor Goleiro será concedido ao atleta que apresentar o maior Índice de Eficiência do Goleiro (IEG) durante o campeonato. IEG = Defesas ÷ (Defesas + Gols Sofridos) × 100. O índice representa o percentual de defesas em relação ao total de defesas realizadas e gols sofridos.`;

  let selId = null, criando = false;
  const pad = n => String(n).padStart(2, "0");
  const paraCampo = iso => { if (!iso) return ""; const d = new Date(iso); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const doCampo = v => v ? new Date(v).toISOString() : null;
  const grupos = n => n <= 8 ? 2 : 4;                  /* 8 times = 2 grupos (semifinais); 12 a 24 = 4 grupos (quartas) */
  const formato = n => { const g = grupos(n); return `${n} times: ${g} grupos de ${n / g}, ${g * 2} classificados (${g === 2 ? "semifinais" : "quartas de final"})`; };
  const letras = n => "ABCD".slice(0, grupos(n)).split("");
  const linhas = t => String(t || "").split("\n").map(s => s.trim()).filter(Boolean);
  const paraPremios = t => linhas(t).map(l => { const p = l.split("|").map(s => s.trim()); return [p[0] || "", p[1] || "", p.slice(2).join(" | ")]; }).filter(p => p[1]);
  const paraRegras = t => linhas(t).map(l => { const p = l.split("|").map(s => s.trim()); return [p[0] || "", p.slice(1).join(" | ")]; }).filter(p => p[0]);
  const deArr = (a, n) => (a || []).map(x => x.slice(0, n).join(" | ")).join("\n");
  const embaralha = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* jogos todos contra todos de um grupo (método do círculo): devolve [[a,b,rodada], ...] */
  function todosContraTodos(ts) {
    const l = ts.slice(); if (l.length % 2) l.push(null);
    const n = l.length, out = [];
    for (let r = 0; r < n - 1; r++) {
      for (let i = 0; i < n / 2; i++) { const a = l[i], b = l[n - 1 - i]; if (a && b) out.push([a, b, r + 1]); }
      l.splice(1, 0, l.pop());
    }
    return out;
  }
  /* mata-mata: vagas fixas a partir da classificação dos grupos */
  function chaveamento(g) {
    const sem = g === 2 ? [["1A", "2B"], ["1B", "2A"]] : [["V1", "V2"], ["V3", "V4"]];
    const qua = g === 2 ? [] : [["1A", "2B"], ["1C", "2D"], ["1B", "2A"], ["1D", "2C"]];
    return [...qua.map(p => ["quartas", p]), ...sem.map(p => ["semis", p]), ["final", ["V1", "V2"]]];
  }
  const vagaTxt = v => { const m = /^([12])([A-Z])$/.exec(v || ""); if (m) return `${m[1]}º do Grupo ${m[2]}`; const w = /^V(\d)$/.exec(v || ""); return w ? `Vencedor do jogo ${w[1]}` : (v || "?"); };

  async function tela() {
    const view = q("#view");
    view.innerHTML = `<div class="empty-state">Carregando…</div>`;
    const { data: camps, error } = await sb.from("campeonatos").select("*").order("created_at", { ascending: false });
    if (error) {
      view.innerHTML = `<div class="panel"><h3>Campeonato ainda não configurado</h3><p class="sec-sub" style="margin:0">As tabelas do campeonato ainda não existem no Supabase. Abra o arquivo <b>supabase-campeonato.sql</b>, copie tudo e rode em <b>SQL Editor &gt; New query &gt; Run</b>. Depois recarregue esta página.<br><small>${esc(errText(error))}</small></p></div>`;
      return;
    }
    if (!camps.length) criando = true;
    if (!criando && (!selId || !camps.find(c => c.id === selId))) selId = camps[0].id;
    const cur = criando ? null : camps.find(c => c.id === selId);
    let times = [], jogos = [];
    if (cur) {
      const [t, j] = await Promise.all([
        sb.from("campeonato_times").select("*").eq("campeonato_id", cur.id).order("created_at", { ascending: true }),
        sb.from("campeonato_jogos").select("*").eq("campeonato_id", cur.id).order("ordem", { ascending: true })]);
      times = t.data || []; jogos = j.data || [];
    }
    const nomeDe = id => (times.find(t => t.id === id) || {}).nome;

    /* classificação dos grupos (para mostrar quem joga no mata-mata) */
    const tabelas = {};
    if (cur) letras(cur.num_times).forEach(g => {
      const r = Object.fromEntries(times.filter(t => t.grupo === g).map(t => [t.id, { id: t.id, j: 0, pts: 0, sg: 0, gp: 0, v: 0 }]));
      const gj = jogos.filter(x => x.fase === "grupos" && x.grupo === g);
      gj.filter(x => x.gols_casa !== null && x.gols_fora !== null && r[x.casa] && r[x.fora]).forEach(x => {
        const a = r[x.casa], b = r[x.fora];
        a.j++; b.j++; a.gp += x.gols_casa; b.gp += x.gols_fora; a.sg += x.gols_casa - x.gols_fora; b.sg += x.gols_fora - x.gols_casa;
        if (x.gols_casa > x.gols_fora) { a.pts += 3; a.v++; } else if (x.gols_casa < x.gols_fora) { b.pts += 3; b.v++; } else { a.pts++; b.pts++; }
      });
      tabelas[g] = { fechado: gj.length > 0 && gj.every(x => x.gols_casa !== null && x.gols_fora !== null),
        ordem: Object.values(r).sort((x, y) => y.pts - x.pts || y.sg - x.sg || y.gp - x.gp || y.v - x.v) };
    });
    const vencedorDe = (j) => { if (!j || j.gols_casa === null || j.gols_fora === null || j.gols_casa === j.gols_fora) return null; return j.gols_casa > j.gols_fora ? ladoNome(j, "casa") : ladoNome(j, "fora"); };
    function ladoNome(j, lado) {
      const id = j[lado], vaga = j[lado + "_vaga"];
      if (id) return nomeDe(id) || "?";
      const m = /^([12])([A-Z])$/.exec(vaga || "");
      if (m) { const t = tabelas[m[2]]; return t && t.fechado ? nomeDe(t.ordem[+m[1] - 1].id) : vagaTxt(vaga); }
      const w = /^V(\d)$/.exec(vaga || "");
      if (w) { const ant = j.fase === "semis" ? "quartas" : "semis"; return vencedorDe(jogos.filter(x => x.fase === ant)[+w[1] - 1]) || vagaTxt(vaga); }
      return vagaTxt(vaga);
    }

    const chips = camps.map(c => `<button class="fbtn${!criando && c.id === selId ? " on" : ""}" data-c="${esc(c.id)}">${esc(c.nome)}${c.edicao ? " · " + esc(c.edicao) : ""}${c.publico ? "" : " (oculto)"}</button>`).join("");
    const c = cur || { nome: "Copa Morpheus", edicao: "1ª Edição", slogan: "16 clubes. Um troféu. Só um campeão.", status: "inscricoes", num_times: 16, inicio: null, plataformas: "PlayStation, Xbox e PC", publico: false, fotos: {}, premios: null, regras: null };
    const form = `
      <form class="panel" id="cform"><h3>${cur ? "Dados do campeonato" : "Novo campeonato"}</h3>
        <div class="row2"><label>Nome<input name="nome" required maxlength="60" value="${esc(c.nome)}"></label><label>Edição<input name="edicao" maxlength="40" value="${esc(c.edicao)}"></label></div>
        <label>Frase de chamada<input name="slogan" maxlength="120" value="${esc(c.slogan)}"></label>
        <div class="row2">
          <label>Quantidade de times<select name="num_times">${NUMS.map(n => `<option value="${n}"${n === c.num_times ? " selected" : ""}>${n} times</option>`).join("")}</select></label>
          <label>Situação<select name="status">${[["inscricoes", "Inscrições abertas"], ["andamento", "Em andamento"], ["encerrado", "Encerrado"]].map(([k, l]) => `<option value="${k}"${k === c.status ? " selected" : ""}>${l}</option>`).join("")}</select></label>
        </div>
        <div class="adm-help" id="fmt">${esc(formato(c.num_times))}</div>
        <div class="row2"><label>Início (contagem regressiva)<input type="datetime-local" name="inicio" value="${esc(paraCampo(c.inicio))}"></label><label>Plataformas<input name="plataformas" maxlength="80" value="${esc(c.plataformas)}"></label></div>
        <label>Prêmios (uma linha por prêmio: ícone | título | descrição)<textarea name="premios" rows="6">${esc(cur ? deArr(c.premios, 3) : PREMIOS)}</textarea></label>
        <label>Regulamento (uma linha por regra: título | texto)<textarea name="regras" rows="6">${esc(cur ? deArr(c.regras, 2) : REGRAS)}</textarea></label>
        <details class="adm-det"><summary>Fotos de fundo de cada parte (opcional)</summary>
          <div class="adm-help">Nome do arquivo dentro de <code>assets/bg/</code> (1920 × 900 px, JPG, até 250 KB). Vazio = visual padrão. <b>Card do campeão</b>: imagem vertical de 1080 × 1350 px (4:5), PNG ou JPG, até 400 KB; aparece no lugar do card de exemplo na Premiação.</div>
          <div class="cmpa-fotos">${FOTOS.map(([k, l]) => `<label>${l}<input name="foto_${k}" value="${esc((c.fotos || {})[k] || "")}" placeholder="camp-${k}.jpg"></label>`).join("")}</div>
        </details>
        <label class="adm-check"><input type="checkbox" name="publico"${c.publico ? " checked" : ""}> Mostrar este campeonato no site</label>
        <div class="adm-actions"><button class="btn btn-gold" type="submit">${cur ? "Salvar alterações" : "Criar campeonato"}</button>
          ${cur ? `<button class="btn btn-ghost" type="button" id="cdel">Excluir campeonato</button>` : (camps.length ? `<button class="btn btn-ghost" type="button" id="ccancel">Cancelar</button>` : "")}</div>
      </form>`;

    let corpo = "";
    if (cur) {
      const vagas = cur.num_times - times.length;
      const gs = letras(cur.num_times);
      const temGrupos = times.some(t => t.grupo);
      const jg = jogos.filter(x => x.fase === "grupos"), jm = jogos.filter(x => x.fase !== "grupos");
      const ordTimes = times.slice().sort((a, b) => (a.grupo || "Z").localeCompare(b.grupo || "Z") || a.nome.localeCompare(b.nome));
      corpo += `
      <div class="panel cmpa-sec"><h3>Times inscritos (${times.length} de ${cur.num_times})</h3>
        ${vagas > 0 ? `<form class="cmpa-add" id="tform">
          <label>Nome do clube<input name="nome" required maxlength="60"></label>
          <label>ID do clube<input name="club_id" inputmode="numeric" maxlength="20" placeholder="ex.: 37568"></label>
          <label>Plataforma<select name="plataforma">${["PlayStation", "Xbox", "PC"].map(p => `<option>${p}</option>`).join("")}</select></label>
          <button class="btn btn-gold btn-sm" type="submit">Inscrever</button></form>` : `<p class="adm-help" style="color:var(--win)">Todas as ${cur.num_times} vagas foram preenchidas.</p>`}
        ${times.length ? `<div class="cmpa-teams">${ordTimes.map(t => `<div class="adm-row" data-t="${esc(t.id)}">
          <div><b>${esc(t.nome)}</b><small>ID ${esc(t.club_id || "—")} · ${esc(t.plataforma)}</small></div>
          <div class="adm-btns"><select data-grp aria-label="Grupo">${["", ...gs].map(g => `<option value="${g}"${(t.grupo || "") === g ? " selected" : ""}>${g ? "Grupo " + g : "Sem grupo"}</option>`).join("")}</select>
            <button class="fbtn danger" data-tdel>Excluir</button></div></div>`).join("")}</div>` : `<p class="sec-sub" style="margin:10px 0 0">Nenhum time inscrito ainda.</p>`}
        <div class="adm-actions" style="margin-top:14px"><button class="btn btn-gold btn-sm" id="sorteio" type="button"${times.length < 2 ? " disabled" : ""}>🎲 Sortear grupos</button>
          <span class="adm-help">${esc(formato(cur.num_times))}. O sorteio distribui os times igualmente; você ainda pode mudar o grupo de cada um.</span></div>
      </div>

      <div class="panel cmpa-sec"><h3>Jogos</h3>
        <div class="adm-actions">
          ${jg.length ? "" : `<button class="btn btn-gold btn-sm" id="gerarG" type="button"${temGrupos ? "" : " disabled"}>Gerar jogos da fase de grupos</button>`}
          ${jm.length || !jg.length ? "" : `<button class="btn btn-gold btn-sm" id="gerarM" type="button">Gerar mata-mata</button>`}
          ${jogos.length ? `<button class="fbtn danger" id="apagarJ" type="button">Apagar todos os jogos</button>` : ""}
        </div>
        ${temGrupos || jogos.length ? "" : `<p class="adm-help" style="margin-top:10px">Inscreva os times e sorteie os grupos para gerar os jogos.</p>`}
        ${["grupos", "quartas", "semis", "final"].map(f => { const l = jogos.filter(x => x.fase === f); if (!l.length) return "";
          return `<h4 class="cmpa-fase">${FASES[f]}</h4>${l.map(x => `
          <div class="cmpa-jogo" data-j="${esc(x.id)}">
            <div class="cmpa-quem"><small>${x.fase === "grupos" ? `Grupo ${esc(x.grupo)} · ${x.rodada}ª rodada` : esc(FASES[x.fase])}</small>
              <b>${esc(ladoNome(x, "casa"))}</b><span>x</span><b>${esc(ladoNome(x, "fora"))}</b></div>
            <div class="cmpa-placar"><input type="number" min="0" max="99" data-gc value="${x.gols_casa ?? ""}" aria-label="Gols da casa"><span>x</span><input type="number" min="0" max="99" data-gf value="${x.gols_fora ?? ""}" aria-label="Gols do visitante"></div>
            <input type="datetime-local" data-dt value="${esc(paraCampo(x.data))}" aria-label="Data e horário">
            <div class="adm-btns"><button class="fbtn" data-stats type="button">Estatísticas</button><button class="btn btn-gold btn-sm" data-sj type="button">Salvar</button></div>
            <div class="cmpa-stats" hidden><textarea rows="7" spellcheck="false" placeholder='{"casa":[{"psn":"Jogador1","g":2,"a":1,"m":1,"pos":"F"}],"fora":[{"psn":"Goleiro2","pos":"G","def":6,"gs":1}]}'>${esc(x.stats ? JSON.stringify(x.stats, null, 1) : "")}</textarea>
              <div class="adm-help">Por jogador: <code>psn</code>, <code>g</code> gols, <code>a</code> assistências, <code>m</code> 1 se foi o melhor em campo, <code>pos</code> (F, M, D ou G) e, para goleiros, <code>def</code> defesas e <code>gs</code> gols sofridos. Cole aqui o que eu preparar a partir dos dados do jogo.</div></div>
          </div>`).join("")}`; }).join("")}
      </div>`;
    }

    view.innerHTML = `<div class="adm-bar" style="margin-bottom:16px">${chips}<button class="fbtn${criando ? " on" : ""}" id="cnew" type="button">＋ Novo campeonato</button></div>
      ${form}${corpo}<div id="msg" hidden></div>`;

    /* ---------- ações ---------- */
    qa("[data-c]").forEach(b => b.onclick = () => { selId = b.dataset.c; criando = false; tela(); });
    q("#cnew").onclick = () => { criando = true; tela(); };
    const cancel = q("#ccancel"); if (cancel) cancel.onclick = () => { criando = false; tela(); };
    const sel = q('#cform [name="num_times"]');
    sel.onchange = () => { q("#fmt").textContent = formato(+sel.value); };

    q("#cform").onsubmit = async e => {
      e.preventDefault();
      const f = new FormData(e.target), fotos = {};
      FOTOS.forEach(([k]) => { const v = (f.get("foto_" + k) || "").trim(); if (v) fotos[k] = v; });
      const row = { nome: f.get("nome").trim(), edicao: f.get("edicao").trim(), slogan: f.get("slogan").trim(), num_times: +f.get("num_times"), status: f.get("status"),
        inicio: doCampo(f.get("inicio")), plataformas: f.get("plataformas").trim() || "PlayStation, Xbox e PC", premios: paraPremios(f.get("premios")), regras: paraRegras(f.get("regras")),
        fotos, publico: f.get("publico") === "on" };
      if (cur && row.num_times < times.length) return say(`Já há ${times.length} times inscritos; a quantidade não pode ser menor.`, false);
      const r = cur ? await sb.from("campeonatos").update(row).eq("id", cur.id) : await sb.from("campeonatos").insert(row).select();
      if (r.error) return say(errText(r.error), false);
      if (!cur && r.data && r.data[0]) { selId = r.data[0].id; criando = false; }
      tela();
    };
    const del = q("#cdel");
    if (del) del.onclick = async () => {
      if (!confirm(`Excluir o campeonato "${cur.nome}", com todos os times e jogos? Isso não pode ser desfeito.`)) return;
      const { error: e } = await sb.from("campeonatos").delete().eq("id", cur.id);
      if (e) return say(errText(e), false);
      selId = null; tela();
    };
    if (!cur) return;

    const tform = q("#tform");
    if (tform) tform.onsubmit = async e => {
      e.preventDefault();
      const f = new FormData(e.target);
      const { error: er } = await sb.from("campeonato_times").insert({ campeonato_id: cur.id, nome: f.get("nome").trim(), club_id: (f.get("club_id") || "").trim(), plataforma: f.get("plataforma") });
      if (er) return say(/duplicate|unique/i.test(errText(er)) ? "Já existe um time com esse nome." : errText(er), false);
      tela();
    };
    qa("[data-t] [data-grp]").forEach(s => s.onchange = async () => {
      const id = s.closest("[data-t]").dataset.t;
      const { error: er } = await sb.from("campeonato_times").update({ grupo: s.value || null }).eq("id", id);
      if (er) return say(errText(er), false);
      say("Grupo salvo.");
    });
    qa("[data-t] [data-tdel]").forEach(b => b.onclick = async () => {
      const id = b.closest("[data-t]").dataset.t, t = times.find(x => x.id === id);
      if (!confirm(`Excluir o time ${t.nome}? Os jogos dele ficam sem esse time.`)) return;
      const { error: er } = await sb.from("campeonato_times").delete().eq("id", id);
      if (er) return say(errText(er), false);
      tela();
    });
    q("#sorteio").onclick = async () => {
      if (jogos.some(x => x.fase === "grupos") && !confirm("Já existem jogos da fase de grupos. Sortear de novo troca os grupos e você terá que gerar os jogos outra vez. Continuar?")) return;
      if (times.length !== cur.num_times && !confirm(`Há ${times.length} de ${cur.num_times} times inscritos. Sortear assim mesmo?`)) return;
      const gs = letras(cur.num_times), ordem = embaralha(times);
      const rs = await Promise.all(ordem.map((t, i) => sb.from("campeonato_times").update({ grupo: gs[i % gs.length] }).eq("id", t.id)));
      const er = rs.find(r => r.error); if (er) return say(errText(er.error), false);
      if (jogos.some(x => x.fase === "grupos")) await sb.from("campeonato_jogos").delete().eq("campeonato_id", cur.id);
      tela();
    };
    const gG = q("#gerarG");
    if (gG) gG.onclick = async () => {
      const rows = []; let ordem = 0;
      letras(cur.num_times).forEach(g => todosContraTodos(times.filter(t => t.grupo === g)).forEach(([a, b, r]) =>
        rows.push({ campeonato_id: cur.id, fase: "grupos", grupo: g, rodada: r, ordem: ordem++, casa: a.id, fora: b.id })));
      if (!rows.length) return say("Sorteie os grupos antes: cada grupo precisa de pelo menos 2 times.", false);
      rows.sort((x, y) => x.rodada - y.rodada || x.grupo.localeCompare(y.grupo)).forEach((r, i) => { r.ordem = i; });
      const { error: er } = await sb.from("campeonato_jogos").insert(rows);
      if (er) return say(errText(er), false);
      tela();
    };
    const gM = q("#gerarM");
    if (gM) gM.onclick = async () => {
      const rows = chaveamento(grupos(cur.num_times)).map(([fase, [a, b]], i) => ({ campeonato_id: cur.id, fase, ordem: 1000 + i, casa_vaga: a, fora_vaga: b }));
      const { error: er } = await sb.from("campeonato_jogos").insert(rows);
      if (er) return say(errText(er), false);
      tela();
    };
    const apagar = q("#apagarJ");
    if (apagar) apagar.onclick = async () => {
      if (!confirm("Apagar TODOS os jogos deste campeonato (placares e estatísticas também)? Isso não pode ser desfeito.")) return;
      const { error: er } = await sb.from("campeonato_jogos").delete().eq("campeonato_id", cur.id);
      if (er) return say(errText(er), false);
      tela();
    };
    qa("[data-j]").forEach(box => {
      box.querySelector("[data-stats]").onclick = () => { const p = box.querySelector(".cmpa-stats"); p.hidden = !p.hidden; };
      box.querySelector("[data-sj]").onclick = async () => {
        const gc = box.querySelector("[data-gc]").value, gf = box.querySelector("[data-gf]").value;
        if ((gc === "") !== (gf === "")) return say("Preencha os gols dos dois lados (ou deixe os dois vazios).", false);
        let stats = null; const txt = box.querySelector(".cmpa-stats textarea").value.trim();
        if (txt) { try { stats = JSON.parse(txt); if (!stats || typeof stats !== "object" || (!Array.isArray(stats.casa) && !Array.isArray(stats.fora))) throw new Error(); }
          catch (e) { return say("As estatísticas não estão no formato certo (JSON com \"casa\" e \"fora\").", false); } }
        const upd = { gols_casa: gc === "" ? null : +gc, gols_fora: gf === "" ? null : +gf, data: doCampo(box.querySelector("[data-dt]").value), stats };
        const { error: er } = await sb.from("campeonato_jogos").update(upd).eq("id", box.dataset.j);
        if (er) return say(errText(er), false);
        await tela(); say("Jogo salvo.");
      };
    });
  }
  return tela;
};
