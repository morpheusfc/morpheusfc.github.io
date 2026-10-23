/* Fonte dos dados: ProClubsHead (clube 37568, FC 27, gen5). O Pro Clubs Tracker está fora do ar e ficou comentado mais abaixo (config); se ele voltar, é só trocar. Última atualização: 23/10/2026. */
const club = {w:86,d:19,l:76,gf:432,ga:387,games:181,sr:1719};
/* psn: ID do jogador no PlayStation. Vazio = ainda não informado. p vazio = sem posição (nunca jogou).
   img: nome do arquivo da foto dentro de assets/players/ (ex.: img:"habutre.jpg"). Sem img = silhueta padrão. Ideal: retrato vertical, ~400x480.
   aka: nomes ANTIGOS do jogador (ex.: aka:["Kakashi"]). Quando alguém troca de nome no jogo, o nome novo vira o "n" e o antigo vai para cá:
        assim a atualização com o tracker junta tudo no mesmo card (foto, PSN, histórico) e a busca do Elenco acha pelos dois nomes. */
/* Jogadores entre comentários (linhas começando com barra e asterisco) saíram do time ou não jogam há dias: ficam fora do site. Para voltar, tire o comentário da linha. A atualização com o tracker não os traz de volta. */
const players = [
  {n:"Leo",p:"ST",o:80,j:159,g:33,a:24,m:3,psn:"LEOzin117",img:"leo.jpeg",aka:[]},
  {n:"Habutre",p:"ST",o:83,j:150,g:95,a:66,m:15,psn:"Habutrers",img:"Habutre.jpeg",aka:[]},
  {n:"Beiça",p:"ST",o:84,j:139,g:142,a:62,m:19,psn:"Beica97",img:"will.jpg",aka:["Bll4ck"]},
  {n:"Vibox Beats",p:"CM",o:82,j:107,g:5,a:12,m:19,psn:"ViboxBeats",img:"vibox.jpeg",aka:[]},
  {n:"dtb",p:"ST",o:83,j:76,g:42,a:23,m:6,psn:"dtb_mvp",aka:[]},
  {n:"TIAO",p:"CB",o:79,j:71,g:5,a:7,m:2,psn:"Trclokko_01",aka:[]},
  {n:"LZ",p:"CB",o:85,j:68,g:4,a:2,m:6,psn:"LuizzCrazy",img:"luiz.jpeg",aka:[]},
  {n:"Saul",p:"CM",o:83,j:83,g:26,a:57,m:2,psn:"alice_farias09",img:"saul.jpeg",aka:[]},
  {n:"Pastor",p:"CB",o:84,j:70,g:4,a:7,m:7,psn:"Maneel444",img:"pastor.jpeg",aka:[]},
  /*{n:"Kakashi",p:"ST",o:74,j:48,g:10,a:27,m:4,psn:"",aka:[]},*/
  {n:"G. Arrascaeta",p:"CB",o:80,j:36,g:11,a:24,m:6,psn:"King_Arthur_atbs",aka:[]},
  /*{n:"Pedrim",p:"ST",o:82,j:14,g:11,a:9,m:3,psn:"Pedrim_el_mago"},*/
  /*{n:"Floren",p:"CM",o:78,j:10,g:0,a:0,m:0,psn:"",aka:[]},*/
  /*{n:"E. Caveira",p:"ST",o:80,j:9,g:1,a:3,m:0,psn:"Folcs_prime",aka:[]},*/
  {n:"B. Reis",p:"CM",o:78,j:23,g:0,a:5,m:4,psn:"REIS2703",aka:[]},
  /*{n:"C. Liduenha",p:"ST",o:82,j:8,g:4,a:3,m:1,psn:"",aka:[]},*/
  {n:"S. Kennedy sfd",p:"GK",o:88,j:19,g:0,a:0,m:1,psn:"JoaoPlay610",img:"joao_gk.jpeg",aka:[]},
  /*{n:"Z. Love",p:"ST",o:83,j:7,g:5,a:1,m:1,psn:"ph_g97",aka:[]},*/
  /*{n:"Ryan",p:"CB",o:84,j:7,g:2,a:0,m:0,psn:"ryanhenrybr2002",aka:[]},*/
  {n:"Messi",p:"CB",o:83,j:11,g:1,a:0,m:2,psn:"pipovini",aka:[]},
  {n:"F. Kadabra",p:"CM",o:76,j:7,g:1,a:1,m:1,psn:"FabioKadabra",aka:[]},
  {n:"N. Martins",p:"CB",o:81,j:8,g:0,a:0,m:1,psn:"Chima_Sem_Erva",img:"chima.jpeg",aka:[]},
  /*{n:"V. Conceição",p:"CB",o:80,j:4,g:1,a:0,m:0,psn:"easpbra1736",aka:[]},*/
  /*{n:"z. zAlemao16",p:"CB",o:83,j:3,g:0,a:1,m:0,psn:"z Alemao 16",aka:[]},*/
  /*{n:"Habib",p:"CB",o:75,j:2,g:0,a:0,m:0,psn:"I Didico I",aka:[]},*/
  {n:"lebers",p:"CM",o:72,j:2,g:0,a:0,m:0,psn:"calebe_075",aka:[]},
  {n:"smokefxz",p:"ST",o:78,j:4,g:1,a:0,m:0,psn:"smokefxz",aka:[]},
  {n:"U. Tamano Cross",p:"CM",o:77,j:5,g:0,a:0,m:1,psn:"BugioBaiano",aka:[]},
  {n:"Top Road",p:"CM",o:83,j:4,g:0,a:1,m:0,psn:"ArcoffH",aka:[]},
  /*{n:"RyanFelix055",p:"",o:0,j:0,g:0,a:0,m:0,psn:"RyanFelix055",aka:[]},*/
  /*{n:"ERL7ON",p:"",o:0,j:0,g:0,a:0,m:0,psn:"ERL7ON",aka:[]},*/
  /*{n:"TeTex-_-",p:"",o:0,j:0,g:0,a:0,m:0,psn:"TeTex-_-",aka:[]},*/
  /*{n:"Daviluisvc",p:"",o:0,j:0,g:0,a:0,m:0,psn:"Daviluisvc",aka:[]}*/
];

/* Configuração do clube. discord: cole aqui o convite (ex.: "https://discord.gg/xxxx"). Vazio = botões de Discord ficam escondidos. */
/* Fonte dos dados. Ativa: ProClubsHead. Se o Pro Clubs Tracker voltar a funcionar, comente a linha ativa e descomente a do tracker. */
const config = { discord: "", fonte: "https://proclubshead.com/27/club/gen5/37568/" };
/* const config = { discord: "", fonte: "https://proclubstracker.com/club/37568?platform=common-gen5&div=5" };   <- Pro Clubs Tracker (fora do ar) */

/* Fotos de fundo opcionais (arquivos dentro de assets/bg/). Vazio = só as cenas desenhadas em código.
   Chaves: hero, jogos, elenco, cta, partidas, videos, amistosos, recrutamento. Ex.: config.photos.hero = "torcida.jpg" */
config.photos = { hero:"hero.jpg", jogos:"jogos.jpg", elenco:"elenco.jpg", cta:"", partidas:"jogos.jpg", videos:"videos.jpg", amistosos:"", recrutamento:"" };

/* Página de Amistosos.
   horarios: texto mostrado no topo da página (quando o clube costuma jogar). Edite à vontade.
   cooldownSegundos: tempo mínimo entre dois pedidos enviados do mesmo aparelho.
   imagem: foto do topo do bloco "Próximos amistosos" (arquivo dentro de assets/bg/, ex.: "amistosos.jpg").
           Tamanho ideal: 1200 x 600 px (formato 2:1), JPG ou WebP, até 300 KB. Vazio = arte padrão do clube. */
config.amistosos = {
  horarios: "Costumamos jogar à noite, a partir das 21h (horário de Brasília). Sugira o dia e o horário que ficarem melhores para o seu clube.",
  cooldownSegundos: 60,
  imagem: "amistoso.jpg"
};

/* Página de Recrutamento.
   posicoes: texto da linha "Posições procuradas: ..." (ex.: "todas" ou "goleiro e meio-campo").
   cooldownSegundos: tempo mínimo entre duas candidaturas enviadas do mesmo aparelho. */
config.recrutamento = {
  posicoes: "todas",
  cooldownSegundos: 60
};

/* PSNs que mudaram de nome. Formato: "PSN antiga": "PSN atual".
   As partidas já guardadas continuam com a PSN que o jogador tinha no dia do jogo; este mapa faz as tabelas de jogadores,
   gols, assistências e MVP mostrarem o nome ATUAL. Exemplo: config.apelidos = { "Habutrers": "HabutreNovo" }; */
config.apelidos = {};

/* Capas locais por matéria: use quando uma matéria do painel estiver sem capa. Formato: "id-da-materia": "arquivo.jpg" (arquivo em assets/news/).
   Se a matéria já tiver capa no painel, a do painel é a que vale. O id aparece no link da matéria (noticias.html#/id). */
config.capas = { "goleada-5x1": "beica-goleada.jpg" };
