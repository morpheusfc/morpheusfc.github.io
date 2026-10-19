/* Carrega notícias e vídeos postados no painel (Supabase) e junta com os que estão nos arquivos.
   Sem configuração, ou se a nuvem falhar, o site continua mostrando só o que está nos arquivos. */
(function(){
  const cfg = window.SUPABASE || {};
  const on = !!(cfg.url && cfg.key);

  /* Texto do painel -> blocos do Morpheus News.
     Parágrafos separados por linha em branco; "## Título" é subtítulo; "![legenda](url)" é foto. */
  window.parseBody = function(text){
    return String(text || "").split(/\n\s*\n/).map(s => s.trim()).filter(Boolean).map(chunk => {
      const img = chunk.match(/^!\[(.*?)\]\((.+?)\)$/s);
      if (img) return {img: img[2], caption: img[1]};
      if (chunk.startsWith("## ")) return {h: chunk.slice(3).trim()};
      return chunk.replace(/\n/g, " ");
    });
  };

  async function get(table, order){
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 7000);
    try {
      const r = await fetch(`${cfg.url}/rest/v1/${table}?select=*&order=${order}`, {
        headers: cfg.key.startsWith("eyJ") ? {apikey: cfg.key, Authorization: "Bearer " + cfg.key} : {apikey: cfg.key}, signal: ctl.signal
      });
      if (!r.ok) throw new Error(table + ": " + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }

  const merge = (target, rows) => {
    const ids = new Set(rows.map(r => r.id));
    const keep = target.filter(x => !ids.has(x.id));
    target.length = 0;
    target.push(...rows, ...keep);
  };

  window.CMS_READY = !on ? Promise.resolve() : (async () => {
    if (typeof noticias !== "undefined") {
      try {
        const rows = await get("news", "date.desc,created_at.desc");
        merge(noticias, rows.map(r => ({id:r.id, kicker:r.kicker, title:r.title, summary:r.summary, author:r.author, date:r.date, cover:r.cover || ((typeof config !== "undefined" && config.capas && config.capas[r.id]) || ""), body:window.parseBody(r.body)})));
      } catch (e) { console.warn("Notícias da nuvem indisponíveis:", e.message); }
    }
    if (typeof videos !== "undefined") {
      try {
        const rows = await get("videos", "date.desc,created_at.desc");
        merge(videos, rows.map(r => ({id:r.id, title:r.title, type:r.type, date:r.date, src:r.src, thumb:r.thumb, desc:r.descr, match:r.match})));
      } catch (e) { console.warn("Vídeos da nuvem indisponíveis:", e.message); }
    }
  })();
})();
