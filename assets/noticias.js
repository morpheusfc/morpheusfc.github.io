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
