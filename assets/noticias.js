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
