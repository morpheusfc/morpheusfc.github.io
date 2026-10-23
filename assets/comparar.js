/* Comparar jogadores do Morpheus FC: dois jogadores lado a lado. Usa players (data.js) e matches (matches.js). */
(function () {
  if (document.body.dataset.page !== "comparar") return;
  const ativos = players.filter(p => p.j > 0).slice().sort((a, b) => b.j - a.j);
  const por = n => ativos.find(p => p.n === n);
  const q = new URLSearchParams(location.search);
  let A = por(q.get("a")) || por("Beiça") || ativos[0];
  let B = por(q.get("b")) || por("Habutre") || ativos.find(p => p !== A);
  const selA = document.getElementById("cmpA"), selB = document.getElementById("cmpB"), box = document.getElementById("cmp");
  const opcoes = sel => { sel.innerHTML = ativos.map(p => `<option value="${esc(p.n)}">${esc(p.n)}${p.psn ? " · " + esc(p.psn) : ""}</option>`).join(""); };
  opcoes(selA); opcoes(selB);

  /* notas nas partidas guardadas (ignora jogos em que o jogador caiu: nota 3 sem nenhum passe) */
  const notasDe = p => {
    if (!p.psn) return [];
    const l = [];
    matches.forEach(m => { const r = m.us.find(x => x.n === p.psn || curPsn(x.n) === p.psn); if (r && !(r.r <= 3 && r.p === 0)) l.push(r.r); });
    return l;   /* mais recente primeiro */
  };
  const media = l => l.length ? l.reduce((s, x) => s + x, 0) / l.length : null;
  const f1 = v => v.toFixed(1).replace(".", ","), f2 = v => v.toFixed(2).replace(".", ",");
  const razao = (p, f) => p.j ? f(p) / p.j : null;

  const METRICAS = [
    ["Jogos", p => p.j, v => v],
    ["Gols", p => p.g, v => v],
    ["Assistências", p => p.a, v => v],
    ["MVP", p => p.m, v => v],
    ["Gols por jogo", p => razao(p, x => x.g), f2],
    ["Assistências por jogo", p => razao(p, x => x.a), f2],
    ["Gols + assistências por jogo", p => razao(p, x => x.g + x.a), f2],
    ["MVP a cada 10 jogos", p => razao(p, x => x.m * 10), f1],
    ["Nota média nas partidas guardadas", p => media(notasDe(p)), f1]
  ];

  const formaHtml = p => { const l = notasDe(p).slice(0, 5);
    return l.length ? `<div class="cmp-forma"><span>Últimas notas</span>${l.map(n => `<i class="${n >= 7.5 ? "alta" : n < 6 ? "baixa" : "media"}">${f1(n)}</i>`).join("")}</div>` : `<div class="cmp-forma"><span>Sem partidas guardadas</span></div>`; };

  function desenha() {
    let ga = 0, gb = 0;
    const linhas = METRICAS.map(([nome, fn, fmt]) => {
      const a = fn(A), b = fn(B);
      const ok = a !== null && b !== null;
      const lead = ok && a !== b ? (a > b ? "a" : "b") : "";
      if (lead === "a") ga++; else if (lead === "b") gb++;
      const tot = ok ? a + b : 0, pa = ok && tot ? a / tot * 100 : 50;
      const v = x => x === null ? "–" : fmt(x);
      return `<div class="sbar"><b class="${lead === "a" ? "lead" : ""}">${v(a)}</b>
        <div><span>${nome}</span><div class="track"><i style="width:${pa}%"></i></div></div>
        <b class="${lead === "b" ? "lead" : ""}">${v(b)}</b></div>`;
    }).join("");
    const resumo = ga === gb ? "Empate técnico" : `${esc((ga > gb ? A : B).n)} leva a melhor`;
    box.innerHTML = `
      <div class="cmp-grid">
        <div class="cmp-side">${playerCard(A)}${formaHtml(A)}</div>
        <div class="cmp-vs"><span>VS</span><b>${ga}<i>x</i>${gb}</b><small>itens vencidos</small></div>
        <div class="cmp-side">${playerCard(B)}${formaHtml(B)}</div>
      </div>
      <div class="panel cmp-table"><div class="cmp-win">${resumo}</div>${linhas}</div>`;
    selA.value = A.n; selB.value = B.n;
    const p = new URLSearchParams({ a: A.n, b: B.n });
    try { history.replaceState(null, "", "?" + p.toString()); } catch (e) {}
  }

  selA.onchange = () => { A = por(selA.value); desenha(); };
  selB.onchange = () => { B = por(selB.value); desenha(); };
  document.getElementById("cmpSwap").onclick = () => { [A, B] = [B, A]; desenha(); };
  desenha();
})();
