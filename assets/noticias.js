/* Matérias do Morpheus News.
   As matérias agora ficam no Supabase e são criadas, editadas e excluídas pelo painel (admin.html).
   Esta lista só serve para matérias que você queira manter dentro do próprio site, fora do painel.
   Se a nuvem estiver fora do ar, o Morpheus News mostra apenas o que estiver aqui.
   Formato de cada item:
     {id:"nome-curto", kicker:"Resultado", title:"Manchete", date:"2026-10-14", author:"Redação Morpheus",
      summary:"Linha fina", cover:"foto.jpg", body:["Parágrafo.", {h:"Subtítulo"}, {img:"foto.jpg", caption:"Legenda"}]}
   Fotos ficam na pasta assets/news/. */
const noticias = [
  {
    id:"pastor-zaga-blindada", rascunho:true, cover:"pastor-blindado.jpg", kicker:"Destaque", title:"Pastor, o muro do Morpheus: a zaga está blindada",
    date:"2026-11-11", author:"Redação Morpheus",
    summary:"Zagueiro de 87 de overall e 1,96 m, Pastor desarma, passa, assiste e ainda aparece na área para marcar. Atacante nenhum quer encarar.",
    body:[
      {video:"pastor-blindado.mp4", caption:"Pastor, a muralha do Morpheus"},
      "Tem zagueiro que defende. E tem **Pastor**. Camisa de 87 de overall e **1,96 m de altura**, o defensor do Morpheus (PSN Maneel444) virou, partida após partida, o rosto da zaga que nenhum atacante adversário quer encontrar pela frente.",
      {h:"Números de quem manda na área"},
      "Em **112 jogos** com a camisa do clube, Pastor soma **nota média 7,3**, **139 desarmes**, **84% de passes certos** (1.391 passes) e **10 jogos sem sofrer gol como zagueiro**. Foi eleito **melhor em campo 8 vezes**, um número raro para quem joga lá atrás.",
      "E tem mais: ele não só protege a área, como **decide**. São **5 gols e 14 assistências** na carreira. Só em outubro, Pastor balançou a rede contra o Malas e Aulas FC, o PALCO FC e o Wynd FC.",
      {h:"Nas noites mais difíceis, ele aparece"},
      "Na noite de ontem, contra o real la bestia, o Morpheus perdeu por 0 a 3, mas Pastor foi o melhor do time: **nota 8,3, 3 desarmes e o título de melhor em campo**. Na vitória por 5 a 0 sobre o SO DOENTE, ele fez duas assistências e nota 8,1. Na de 2 a 1 sobre o DePenys PraFora, nota 7,8.",
      {h:"Zaga blindada"},
      "Marcação forte, saída de bola limpa e presença no ataque quando o time precisa: Pastor reúne tudo que se espera de um líder de defesa. Com ele em campo, a certeza é uma só: **a zaga do Morpheus está blindada**, e quem insistir em passar por aqui vai ter que pedir licença.",
    ]
  },
  {
    id:"magrao-contratado", rascunho:true, cover:"magrao-contratado.jpg", kicker:"Contratação", title:"Bem-vindo, Magrão! Morpheus anuncia o meio-campista MagraoJojelito84",
    date:"2026-11-07", author:"Redação Morpheus",
    summary:"Reforço de peso para o meio-campo: já são 3 jogos, 2 vitórias, 1 gol, 1 assistência e nota média 7,6.",
    body:[
      {video:"magrao-contratado.mp4", caption:"Magrão (MagraoJojelito84) chega para reforçar o Morpheus"},
      "O Morpheus FC tem um novo camisa no elenco: **Magrão**, PSN **MagraoJojelito84**, meio-campista de 83 de overall, é o mais novo reforço do clube. A contratação foi confirmada pela diretoria e já rendeu frutos dentro de campo.",
      {h:"Estreia de gala"},
      "Magrão entrou em campo na noite de 06/11 e, em três jogos, fez **2 vitórias e 1 derrota**, com **1 gol, 1 assistência, 5 desarmes** e **nota média 7,6**, a segunda melhor da noite entre quem jogou todas as partidas.",
      "Na estreia, contra o ClimaPro Gaming, ele já deu assistência e levou nota 7,7 na vitória por 2 a 1. Depois fez o gol da vitória sobre o INSD FC (2 a 1), na melhor nota da noite dele: **8,0**, com 3 desarmes. Mesmo na goleada sofrida diante do Jackz Fc (0 a 5), manteve a regularidade, com nota 7,1.",
      {h:"O que esperar"},
      "Marcação, passe e presença na área quando o jogo pede: o perfil de Magrão é o de um meio-campista de equilíbrio, que ajuda a defender e chega para decidir. Ainda é uma amostra pequena, mas o início não poderia ter sido melhor.",
      "Seja bem-vindo, Magrão. **A Nação Morpheus já te abraçou!**",
    ]
  },
  {
    id:"amistoso-barba-ovo", cover:"amistoso01.jpg", kicker:"Amistoso", title:"Abertura da temporada de amistosos: Morpheus e BARBA OVO FC fazem quatro jogos!",
    date:"2026-10-27", author:"Redação Morpheus",
    summary:"Primeiros amistosos da temporada teve quatro partidas contra o BARBA OVO FC, duas vitórias. O M-News explica por que ninguém saiu perdendo.",
    body:[
      "Segunda-feira, 26 de outubro de 2026. Se o objetivo era abrir a temporada de amistosos com o pé direito (e o esquerdo, e um pouco de cada), missão cumprida. O Morpheus FC enfrentou o **BARBA OVO FC** em quatro partidas seguidas.",
      {h:"O placar, na ordem em que aconteceu"},
      "**1º jogo:** Morpheus 2 x 3 BARBA OVO. **2º jogo:** Morpheus 3 x 4 BARBA OVO. **3º jogo:** Morpheus 4 x 2 BARBA OVO. **4º jogo:** Morpheus 4 x 2 BARBA OVO. Saldo da noite: duas derrotas, duas vitórias, 13 gols marcados e 11 sofridos. Ou seja, o Morpheus perdeu os dois primeiros por um gol e venceu os dois últimos por dois. Os especialistas do News (a redação inteira, de novo) chamam isso de aquecimento com carga progressiva.",
      {h:"A virada que começou no vestiário"},
      "Depois de duas derrotas apertadas, o time resolveu que o amistoso era amigável, mas não tanto. No terceiro jogo,  **Beiça** e **Leo** marcam, levando o time ao triunfo. No quarto, foi a vez do **Habutre**: hat-trick. Para fechar a conta, o Beiça ainda marcou mais um.",
      {h:"Os números da noite"},
      "**Beiça:** 7 gols.\n**Habutre:** 3 gols e 4 assistências.\n**Leo:** 3 gols e 2 assistências.\n**Saul:** 4 assistências, uma por jogo, um relógio suíço de passe.\n\nCom isso, o trio de ataque respondeu por todos os 13 gols do Morpheus.",
      "O **JoaoPlay610** também teve a sua noite. Escalado no gol em três jogos, fez 15 defesas.",
      "Na bola parada de números, o Morpheus teve 388 passes certos contra 342 do adversário, e 33 finalizações contra 35. Equilíbrio tão grande que nem a bola sabia para qual lado torcer.",
      {h:"Do outro lado"},
      "O BARBA OVO FC fez jus à fama de adversário respeitável. **Danxx6197** e **SAYMON-THE** apareceram bem, o **x-baladegoma89br** foi o melhor da casa no primeiro jogo, e o time inteiro encarou quatro partidas sem pedir intervalo. Para amistosos de abertura, não tem o que reclamar.",
      {h:"E agora?"},
      "Temporada de amistosos aberta, o Morpheus já tem um adversário amigo para reencontrar quando der e uma lição aprendida: começar perdendo não é problema, desde que o ataque esteja com a noite de gala. O M-News segue no acompanhamento e promete atualizar a tabela assim que o próximo convite chegar. Até lá, bola pra frente. E controle carregado.",
    ]
  },
  {
    id:"volta-a-rotina", kicker:"Bastidores", title:"Fim do recesso: Morpheus volta à rotina e garante que ninguém esqueceu como se joga",
    date:"2026-10-19", author:"Redação Morpheus",
    summary:"Depois de um fim de semana sem jogos e sem treino, o clube retorna hoje à rotina. O News fez o balanço do descanso: zero jogos, zero gols sofridos e muito controle na gaveta.",
    body:[
      "Segunda-feira, 19 de outubro de 2026. Acabou o descanso. Depois de um fim de semana inteiro sem jogos e sem treino, o Morpheus FC retorna hoje à rotina. E, em respeito à tradição do jornalismo esportivo, o Morpheus News traz o balanço oficial do recesso.",
      {h:"O balanço do fim de semana"},
      "**Jogos disputados:** 0. **Gols sofridos:** 0. **Cartões vermelhos:** 0. Em números absolutos, foi o melhor desempenho defensivo do clube na temporada: um fim de semana inteiro sem tomar gol de ninguém. O ataque, por outro lado, também ficou em branco, mas ninguém é perfeito.",
      "O Beiça, líder de gols do clube com 119, passou dois dias sem aumentar a conta, o que, para os padrões dele, já conta como um jejum histórico. Os especialistas ouvidos pelo News (a redação inteira) acreditam que o ritmo volta rápido.",
      {h:"A volta"},
      "A última vez que o time entrou em campo foi na madrugada de sábado, com um empate em 1 a 1 contra o Tanquerai FC. Desde então, os controles descansaram, os dedões também, e a diretoria seguiu de olho no teste do goleiro, que continua firme.",
      "O clube mantém os mesmos 75 jogos ganhos, 17 empatados e 65 perdidos de sexta-feira, e a vontade de aumentar a primeira coluna é grande. Quem estiver com o controle empoeirado, é só soprar, ajustar o fone e entrar na sala. A rotina voltou, e o Morpheus News garante: o descanso foi ótimo, mas a gente já estava com saudade de narrar gol.",
    ]
  },
  {
    id:"joaoplay610-teste-goleiro", kicker:"Análise", title:"JoaoPlay610 segue firme no teste: 16 defesas na noite de ontem",
    date:"2026-10-17", author:"Redação Morpheus", cover:"joao-defesa.jpg",
    summary:"Em teste no gol do Morpheus, JoaoPlay610 jogou três jogos na noite de ontem, fez 16 defesas e ficou na linha da própria média. A diretoria está satisfeita.",
    body:[
      "Sábado, 17 de outubro de 2026. Em período de testes, o goleiro **JoaoPlay610** (overall 88, o mais alto do elenco) jogou três dos cinco jogos do Morpheus na noite de ontem: derrota por 0 a 3 para o E O Birsho FE (9 defesas), vitória por 4 a 0 sobre o Margalla (uma defesa, sem sofrer gol) e empate em 1 a 1 com o Tanquerai FC (6 defesas).",
      {img:"joao-entrevista.jpg", caption:"JoaoPlay610 em entrevista após a noite de jogos"},
      "No total, foram **16 defesas e 4 gols sofridos**, 80% de aproveitamento, e nota média 6,2. A média dele nos 11 jogos do teste é de 4,9 defesas por jogo, 1,55 gol sofrido e nota 6,4. Ou seja, a noite ficou na linha, com um pouco mais de defesas e menos gols sofridos.",
      "A diretoria está satisfeita, e nada foi anunciado oficialmente. Com 54 defesas e três jogos sem sofrer gol no teste, o Morpheus News aposta: **o contrato tem tudo para sair**.",
    ]
  },
];
