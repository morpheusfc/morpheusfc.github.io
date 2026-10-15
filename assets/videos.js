/* Vídeos do Morpheus FC. Para postar um vídeo novo, acrescente um item no TOPO da lista.
   Campos:
     id    : nome curto sem espaços (ex.: "golaco-beica")
     title : título
     type  : "lance" (lances dos jogos) ou "partida" (partida completa)
     date  : "2026-10-14" (aaaa-mm-dd)
     src   : de onde vem o vídeo, num destes formatos:
               "youtube:ID_DO_VIDEO"      (o que vem depois de v= na URL do YouTube)
               "file:nome.mp4"            (arquivo salvo em assets/videos/)
               "link:https://..."         (abre em outra aba: Twitch, Medal, Instagram etc.)
     thumb : (opcional) imagem de capa em assets/videos/ (ex.: "capa.jpg"). YouTube já usa a capa dele.
     desc  : (opcional) texto curto
     match : (opcional) id de uma partida de matches.js, para ligar o vídeo ao jogo
   Exemplo:
     {id:"golaco-beica", title:"Golaço do Beica97", type:"lance", date:"2026-10-13", src:"youtube:dQw4w9WgXcQ", desc:"Final de 5 a 1", match:"100102"}
*/
const videos = [
  {id:"maltrata-assistencia-33", title:"Ótima assistência de Habutre aos 33'", type:"lance", date:"2026-10-14",
   src:"file:maltrata-assistencia-33.mp4", thumb:"maltrata-assistencia-capa.jpg",
   desc:"Jogada na área do Maltrata FC, com o jogo empatado em 1 a 1", match:"870367"},
  {id:"maltrata-gol-17", title:"Habutre empata o jogo aos 17'", type:"lance", date:"2026-10-14",
   src:"file:maltrata-gol-17.mp4", thumb:"maltrata-gol-capa.jpg",
   desc:"Gol de empate depois de o Maltrata FC abrir o placar", match:"870367"},
];
