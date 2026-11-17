/* Resultados e estatísticas do campeonato, vindos dos amistosos de cada clube.
   Este arquivo é preenchido pelo Claude quando você pede "atualizar campeonato". Não precisa mexer à mão.
   Cada item identifica o jogo pelos nomes dos dois clubes (sem diferenciar maiúsculas/acentos) e pela fase.
   O painel tem prioridade: o que você já lançou lá não é substituído.
   Exemplo:
     {fase:"grupos", casa:"Falcões FC", fora:"Dragões", gc:2, gf:1, hora:"2026-12-01T20:03",
      stats:{casa:[{psn:"Craque1", g:2, a:1, m:1, pos:"F"}], fora:[{psn:"Goleiro2", pos:"G", def:6, gs:2}]}}
   Campos de stats: psn, g (gols), a (assistências), m (1 = melhor em campo), pos (F, M, D ou G), def (defesas) e gs (gols sofridos) para goleiros. */
const campeonatoDados = [
  {fase:"grupos", casa:"Morpheus FC", fora:"Toca e passa 26", gc:0, gf:5, hora:"2026-11-13T21:48",
   stats:{
    casa:[{psn:"ViboxBeats",g:0,a:0,m:0,pos:"M"},{psn:"Beica97",g:0,a:0,m:0,pos:"F"},{psn:"GabrielGoulartXx",g:0,a:0,m:0,pos:"F"},{psn:"LEOzin117",g:0,a:0,m:0,pos:"M"},{psn:"Maneel444",g:0,a:0,m:0,pos:"D"},{psn:"Habutrers",g:0,a:0,m:0,pos:"M"},{psn:"alice_farias09",g:0,a:0,m:0,pos:"M"}],
    fora:[{psn:"Daanzera-",g:0,a:0,m:0,pos:"M"},{psn:"Seledsdark",g:0,a:0,m:0,pos:"D"},{psn:"Meul-Maridao",g:0,a:0,m:0,pos:"M"},{psn:"DY198802",g:2,a:2,m:1,pos:"F"},{psn:"Facadaj",g:1,a:2,m:0,pos:"M"},{psn:"Marcinhu_0802",g:0,a:0,m:0,pos:"M"},{psn:"Indra019",g:0,a:0,m:0,pos:"D"},{psn:"Lucaobruxo1992",g:2,a:1,m:0,pos:"F"},{psn:"Castro_CRF_",g:0,a:0,m:0,pos:"G",def:2,gs:0}]}},
  {fase:"grupos", casa:"Morpheus FC", fora:"Nossa Jogatina", gc:8, gf:5, hora:"2026-11-16T21:56",
   stats:{
    casa:[{psn:"Beica97",g:2,a:5,m:1,pos:"F"},{psn:"Habutrers",g:5,a:1,m:0,pos:"F"},{psn:"MagraoJojelito84",g:1,a:1,m:0,pos:"M"},{psn:"Maneel444",g:0,a:0,m:0,pos:"D"},{psn:"Landao_da_massa",g:0,a:0,m:0,pos:"M"},{psn:"alice_farias09",g:0,a:0,m:0,pos:"M"}],
    fora:[{psn:"imbernardo7",g:4,a:0,m:0,pos:"F"},{psn:"TheCalistin",g:0,a:3,m:0,pos:"M"},{psn:"Rezendex__",g:0,a:1,m:0,pos:"M"}]}},
  {fase:"grupos", casa:"Morpheus FC", fora:"Matrix FC", gc:2, gf:7, hora:"2026-11-16T22:20",
   stats:{
    casa:[{psn:"Maneel444",g:0,a:0,m:0,pos:"D"},{psn:"Habutrers",g:1,a:0,m:0,pos:"F"},{psn:"Landao_da_massa",g:0,a:0,m:0,pos:"M"},{psn:"alice_farias09",g:1,a:1,m:0,pos:"M"},{psn:"MagraoJojelito84",g:0,a:0,m:0,pos:"M"},{psn:"Beica97",g:0,a:0,m:0,pos:"F"},{psn:"GabrielGoulartXx",g:0,a:0,m:0,pos:"M"}],
    fora:[{psn:"The_White-DDD011",g:2,a:3,m:1,pos:"F"},{psn:"King_Arthur_atbs",g:2,a:0,m:0,pos:"M"},{psn:"Pedrim_el_mago",g:2,a:1,m:0,pos:"F"},{psn:"z Alemao 16",g:0,a:0,m:0,pos:"M"},{psn:"BILBAU97",g:0,a:0,m:0,pos:"M"},{psn:"dtb_mvp",g:0,a:0,m:0,pos:"D"},{psn:"rodrigobqueiroz",g:1,a:0,m:0,pos:"M"},{psn:"pipovini",g:0,a:0,m:0,pos:"D"}]}},
];

/* Fotos de fundo padrão do campeonato (arquivos em assets/bg/). Valem para qualquer campeonato; o que você preencher no painel (aba Campeonato > Fotos de fundo) tem prioridade. */
const campeonatoFotos = { hero: "camp-hero.jpg", grupos: "camp-grupos.jpg", matamata: "camp-matamata.jpg" };
