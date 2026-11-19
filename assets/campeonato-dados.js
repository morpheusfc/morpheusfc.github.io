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
  {fase:"grupos", casa:"Matrix FC", fora:"Nossa Jogatina", gc:6, gf:0, hora:"2026-11-16T23:11",
   stats:{
    casa:[{psn:"BILBAU97",g:0,a:1,m:0,pos:"M"},{psn:"rodrigobqueiroz",g:0,a:0,m:0,pos:"M"},{psn:"bombasportmix",g:0,a:0,m:0,pos:"D"},{psn:"Pedrim_el_mago",g:2,a:0,m:0,pos:"F"},{psn:"KALLEN_COUTINHO",g:4,a:1,m:1,pos:"F"},{psn:"The_White-DDD011",g:0,a:1,m:0,pos:"M"},{psn:"King_Arthur_atbs",g:0,a:1,m:0,pos:"M"},{psn:"dtb_mvp",g:0,a:0,m:0,pos:"D"},{psn:"z Alemao 16",g:0,a:1,m:0,pos:"M"},{psn:"pipovini",g:0,a:0,m:0,pos:"D"}],
    fora:[{psn:"JhonMaxsuell",g:0,a:0,m:0,pos:"F"},{psn:"Rezendex__",g:0,a:0,m:0,pos:"M"},{psn:"imbernardo7",g:0,a:0,m:0,pos:"F"},{psn:"TheCalistin",g:0,a:0,m:0,pos:"M"}]}},
  {fase:"grupos", casa:"Morpheus FC", fora:"TSIIX ESPORTS", gc:2, gf:3, hora:"2026-11-17T21:47",
   stats:{
    casa:[{psn:"Beica97",g:2,a:0,m:0,pos:"F"},{psn:"Habutrers",g:0,a:1,m:0,pos:"F"},{psn:"C9_phlipe7",g:0,a:1,m:0,pos:"D"},{psn:"alice_farias09",g:0,a:0,m:0,pos:"M"},{psn:"Landao_da_massa",g:0,a:0,m:0,pos:"M"},{psn:"Trclokko_01",g:0,a:0,m:0,pos:"D"}],
    fora:[{psn:"Buenexgg",g:0,a:2,m:0,pos:"F"},{psn:"bruninho_lepol",g:1,a:1,m:0,pos:"F"},{psn:"Danevill",g:0,a:0,m:0,pos:"G",def:0,gs:2},{psn:"lczinn009",g:2,a:0,m:0,pos:"M"},{psn:"xXCLT_GUSTAXx",g:0,a:0,m:0,pos:"M"},{psn:"FaelSNTS",g:0,a:0,m:0,pos:"M"},{psn:"Yan_Rueda",g:0,a:0,m:1,pos:"M"},{psn:"LRS_Leleo",g:0,a:0,m:0,pos:"D"},{psn:"DinizTREM",g:0,a:0,m:0,pos:"M"},{psn:"heldinhooof3",g:0,a:0,m:0,pos:"D"},{psn:"Gut0_25",g:0,a:0,m:0,pos:"D"}]}},
  {fase:"grupos", casa:"ASCENCION FC", fora:"DESPORTIVO EC", gc:3, gf:0, hora:"2026-11-18T21:44",
   stats:{
    casa:[{psn:"Rock_Callboaa",g:1,a:2,m:1,pos:"M"},{psn:"iTz_iRaFFaTx",g:0,a:0,m:0,pos:"M"},{psn:"BR_BRANQUINHO77",g:0,a:0,m:0,pos:"D"},{psn:"Legend130200",g:0,a:0,m:0,pos:"G",def:3,gs:0},{psn:"MagoSeven",g:1,a:0,m:0,pos:"F"},{psn:"AraujoRei11",g:1,a:0,m:0,pos:"F"},{psn:"Failli89",g:0,a:0,m:0,pos:"M"},{psn:"lupe22745",g:0,a:0,m:0,pos:"F"},{psn:"gb21_ffc",g:0,a:0,m:0,pos:"D"}],
    fora:[{psn:"Ikaro_H",g:0,a:0,m:0,pos:"M"},{psn:"Zero_porcento0",g:0,a:0,m:0,pos:"M"},{psn:"Vinicius_P23",g:0,a:0,m:0,pos:"G",def:0,gs:3},{psn:"wPerciani7",g:0,a:0,m:0,pos:"F"},{psn:"yzGabrielyz",g:0,a:0,m:0,pos:"F"},{psn:"EOODON",g:0,a:0,m:0,pos:"D"},{psn:"djails0n_1994",g:0,a:0,m:0,pos:"D"},{psn:"zAlvess7",g:0,a:0,m:0,pos:"M"},{psn:"Leo3vieira",g:0,a:0,m:0,pos:"D"}]}},
  {fase:"grupos", casa:"Club União", fora:"FerroVelho", gc:0, gf:2, hora:"2026-11-18T21:57",
   stats:{
    casa:[{psn:"yC3s4R_zZ",g:0,a:0,m:0,pos:"G",def:5,gs:2},{psn:"van-_-wilker",g:0,a:0,m:0,pos:"M"},{psn:"Jv_silvaNh",g:0,a:0,m:0,pos:"F"},{psn:"JandsonDias",g:0,a:0,m:0,pos:"M"},{psn:"Renildo_santos",g:0,a:0,m:0,pos:"M"},{psn:"Wallasmorais94",g:0,a:0,m:0,pos:"D"},{psn:"seven_five88",g:0,a:0,m:0,pos:"D"},{psn:"Ale_M0raiss",g:0,a:0,m:0,pos:"D"}],
    fora:[{psn:"Maquiaveli_94",g:0,a:0,m:0,pos:"F"},{psn:"BARAKA-_-ITU-SP",g:0,a:0,m:0,pos:"M"},{psn:"pedrobarreto21",g:0,a:0,m:0,pos:"G",def:2,gs:0},{psn:"ELIAS-FILIPE55",g:0,a:1,m:0,pos:"F"},{psn:"LEOZAOJR07",g:0,a:0,m:0,pos:"D"},{psn:"Kauazinn_pai",g:1,a:0,m:0,pos:"M"},{psn:"vader6663143",g:0,a:0,m:0,pos:"M"},{psn:"Jean_PowerS2",g:1,a:0,m:1,pos:"M"},{psn:"Eafc27matador",g:0,a:0,m:0,pos:"M"},{psn:"fernandobob153M",g:0,a:0,m:0,pos:"D"}]}},
  {fase:"grupos", casa:"FURIACG", fora:"DESPORTIVO EC", gc:5, gf:1, hora:"2026-11-18T22:06",
   stats:{
    casa:[{psn:"CRSNEVES",g:0,a:0,m:0,pos:"M"},{psn:"PEGUEISUATIA_OFF",g:1,a:1,m:0,pos:"M"},{psn:"Mito_L2_sola",g:3,a:0,m:1,pos:"F"},{psn:"lgbzitol",g:0,a:0,m:0,pos:"M"},{psn:"manjubiinha17",g:0,a:0,m:0,pos:"D"},{psn:"knsrj",g:1,a:1,m:0,pos:"M"},{psn:"InashzitoI",g:0,a:0,m:0,pos:"D"},{psn:"bielzzin7x3164",g:0,a:1,m:0,pos:"F"},{psn:"Marzinroth12",g:0,a:0,m:0,pos:"D"},{psn:"yKevinn10",g:0,a:0,m:0,pos:"M"},{psn:"ticozin7",g:0,a:0,m:0,pos:"G",def:2,gs:1}],
    fora:[{psn:"Ikaro_H",g:0,a:0,m:0,pos:"M"},{psn:"Zero_porcento0",g:0,a:0,m:0,pos:"M"},{psn:"Vinicius_P23",g:0,a:0,m:0,pos:"G",def:3,gs:5},{psn:"wPerciani7",g:0,a:0,m:0,pos:"F"},{psn:"djails0n_1994",g:0,a:0,m:0,pos:"D"},{psn:"zAlvess7",g:0,a:0,m:0,pos:"M"},{psn:"Leo3vieira",g:0,a:1,m:0,pos:"D"}]}},
];

/* Fotos de fundo padrão do campeonato (arquivos em assets/bg/). Valem para qualquer campeonato; o que você preencher no painel (aba Campeonato > Fotos de fundo) tem prioridade. */
const campeonatoFotos = { hero: "camp-hero.jpg", grupos: "camp-grupos.jpg", matamata: "camp-matamata.jpg" };
