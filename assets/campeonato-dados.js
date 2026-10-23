/* Resultados e estatísticas do campeonato, vindos dos amistosos de cada clube.
   Este arquivo é preenchido pelo Claude quando você pede "atualizar campeonato". Não precisa mexer à mão.
   Cada item identifica o jogo pelos nomes dos dois clubes (sem diferenciar maiúsculas/acentos) e pela fase.
   O painel tem prioridade: o que você já lançou lá não é substituído.
   Exemplo:
     {fase:"grupos", casa:"Falcões FC", fora:"Dragões", gc:2, gf:1, hora:"2026-12-01T20:03",
      stats:{casa:[{psn:"Craque1", g:2, a:1, m:1, pos:"F"}], fora:[{psn:"Goleiro2", pos:"G", def:6, gs:2}]}}
   Campos de stats: psn, g (gols), a (assistências), m (1 = melhor em campo), pos (F, M, D ou G), def (defesas) e gs (gols sofridos) para goleiros. */
const campeonatoDados = [
];

/* Fotos de fundo padrão do campeonato (arquivos em assets/bg/). Valem para qualquer campeonato; o que você preencher no painel (aba Campeonato > Fotos de fundo) tem prioridade. */
const campeonatoFotos = { hero: "camp-hero.jpg", grupos: "camp-grupos.jpg" };
