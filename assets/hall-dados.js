/* Hall da Fama: um item por campeonato. Fica aqui o que eu (Claude) preencho: líderes parciais a cada atualização do campeonato
   e os vencedores quando ele termina (ou quando você pedir "atualizar Hall da Fama"). Não precisa mexer à mão.

   Campos do campeonato:
     id, tipo ("copa" | "brasileirao"), nome, edicao, status ("andamento" | "encerrado"),
     ate     : data dos números parciais (ex.: "26/11"). Some quando o campeonato é encerrado.
     fundo   : imagem da sala de troféus daquele campeonato (arquivo em assets/hall/), com a taça em destaque. Vazio = sala padrão.
     trofeu  : imagem só da taça (PNG sem fundo, em assets/hall/). Vazio = taça desenhada. Só aparece se não houver "fundo".
     link    : página do campeonato (campeonato.html?c=<id>)
     campeao : { nome, foto } (foto = escudo/card do campeão, em assets/hall/; opcional)
     premios : { artilheiro, garcom, mvp, goleiro }, cada um { psn, time, foto, parcial, stats }
       foto    : card/imagem do jogador (arquivo em assets/hall/ ou em assets/players/ com "players/nome.jpg"). Ideal 3:4 (ex.: 600x800).
       parcial : true = ainda é o líder atual, não o vencedor final (mostra "Líder atual")
       empate  : [{ psn, time }] no lugar de psn/time quando há mais de um líder
       stats   : artilheiro {g, a, j} · garcom {a, g, j} · mvp {m, g, a, j} · goleiro {def, gs, j}  (g gols, a assistências, m vezes melhor em campo, j jogos, def defesas, gs gols sofridos)
   Prêmio sem jogador ainda = "A definir". */
const hallDaFama = [
  { id: "copa-begin", tipo: "copa", nome: "Copa Begin", edicao: "1ª Edição", status: "andamento", ate: "26/11",
    fundo: "", trofeu: "", link: "campeonato.html?c=3bb38a82-21b3-4439-aa3e-e9ef4ed0413c", campeao: null,
    premios: {
      artilheiro: { psn: "Habutrers", time: "Morpheus FC", foto: "players/Habutre.jpeg", parcial: true, stats: { g: 5, a: 1, j: 2 } },
      garcom: { psn: "Beica97", time: "Morpheus FC", foto: "players/will.jpg", parcial: true, stats: { a: 5, g: 2, j: 2 } },
      mvp: { parcial: true, stats: { m: 1 }, empate: [
        { psn: "Beica97", time: "Morpheus FC" }, { psn: "DY198802", time: "Toca e passa 26" }, { psn: "KALLEN_COUTINHO", time: "Matrix FC" }] },
      goleiro: { psn: "Castro_CRF_", time: "Toca e passa 26", parcial: true, stats: { def: 2, gs: 0, j: 1 } } } },
  { id: "brasileirao-fc27", tipo: "brasileirao", nome: "Brasileirão FC27", edicao: "", status: "andamento", ate: "26/11",
    fundo: "", trofeu: "", link: "campeonato.html?c=87d28a13-90ab-4113-b43a-3ba8eb0235f6", campeao: null,
    premios: {
      artilheiro: { psn: "Mito_L2_sola", time: "FURIACG", parcial: true, stats: { g: 4, a: 2, j: 3 } },
      garcom: { psn: "zAlvess7", time: "DESPORTIVO EC", parcial: true, stats: { a: 3, g: 0, j: 2 } },
      mvp: { parcial: true, stats: { m: 1 }, empate: [
        { psn: "deivyd_dvd", time: "FURIACG" }, { psn: "Diegomengo0313", time: "Morpheus FC" }, { psn: "Godoyy41", time: "Giuseppe Camole" },
        { psn: "Jean_PowerS2", time: "FerroVelho" }, { psn: "Lula_Garcia90", time: "Manja Chester" }, { psn: "Mito_L2_sola", time: "FURIACG" },
        { psn: "Rock_Callboaa", time: "ASCENCION FC" }, { psn: "vader6663143", time: "FerroVelho" }, { psn: "Yan_Rueda", time: "TSIIX ESPORTS" }] },
      goleiro: { psn: "xandyborges2014", time: "FURIACG", parcial: true, stats: { def: 3, gs: 0, j: 2 } } } }
];
