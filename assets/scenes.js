/* Fundos do site: linhas de campo discretas e, por cima/baixo delas, fotos próprias.
   Fotos entram por config.photos (data.js): salve o arquivo em assets/bg/ e coloque o nome lá. */
(function(){
  function add(el, layers, photoKey){
    if (!el) return;
    const file = config.photos && config.photos[photoKey];
    const photo = file ? `<div class="ph" style="background-image:url('assets/bg/${file}')"></div>` : "";
    const html = layers.map(l => `<div class="pitch ${l.split(":")[1] || ""}"></div>`).join("");
    el.classList.add("has-scene");
    el.insertAdjacentHTML("afterbegin", `<div class="scene" aria-hidden="true">${photo}${html}</div>`);
  }

  const pg = document.body.dataset.page;
  const secs = document.querySelectorAll("body > section");
  if (pg === "inicio") {
    add(document.querySelector(".hero"), ["pitch"], "hero");
    add(secs[0], ["pitch:flat"], "jogos");
    add(secs[1], [], "elenco");
    add(secs[2], [], "cta");
  } else {
    const head = document.querySelector(".page-head");
    if (pg === "elenco")       add(head, [], "elenco");
    if (pg === "partidas")     add(head, ["pitch:flat"], "partidas");
    if (pg === "amistosos")    add(head, [], "amistosos");
    if (pg === "videos")       add(head, [], "videos");
    if (pg === "recrutamento") add(head, [], "recrutamento");
  }
})();
