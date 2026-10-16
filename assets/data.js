/* Dados vindos do Pro Clubs Tracker (clube 37568). Última atualização: 16/10/2026. */
const club = {w:72,d:16,l:64,gf:359,ga:328,games:152,sr:1665};
/* psn: ID do jogador no PlayStation. Vazio = ainda não informado. p vazio = sem posição (nunca jogou).
   img: nome do arquivo da foto dentro de assets/players/ (ex.: img:"habutre.jpg"). Sem img = silhueta padrão. Ideal: retrato vertical, ~400x480.
   aka: nomes ANTIGOS do jogador (ex.: aka:["Kakashi"]). Quando alguém troca de nome no jogo, o nome novo vira o "n" e o antigo vai para cá:
        assim a atualização com o tracker junta tudo no mesmo card (foto, PSN, histórico) e a busca do Elenco acha pelos dois nomes. */
const players = [
  {n:"Leo",p:"ST",o:80,j:130,g:30,a:22,m:1,psn:"LEOzin117",aka:[]},
  {n:"Habutre",p:"ST",o:83,j:120,g:75,a:53,m:12,psn:"Habutrers",img:"Habutre.jpeg",aka:[]},
  {n:"Beiça",p:"ST",o:83,j:111,g:112,a:48,m:14,psn:"Beica97",img:"will.jpg",aka:["Bll4ck"]},
  {n:"Vibox Beats",p:"CM",o:81,j:95,g:5,a:11,m:17,psn:"",aka:[]},
  {n:"dtb",p:"ST",o:83,j:71,g:39,a:21,m:5,psn:"",aka:[]},
  {n:"TIAO",p:"CB",o:79,j:71,g:5,a:7,m:2,psn:"",aka:[]},
  {n:"LZ",p:"CB",o:85,j:68,g:4,a:2,m:6,psn:"",aka:[]},
  {n:"Saul",p:"CM",o:83,j:56,g:20,a:46,m:2,psn:"alice_farias09",img:"saul.jpeg",aka:[]},
  {n:"Pastor",p:"CB",o:82,j:53,g:3,a:5,m:4,psn:"Maneel444",img:"pastor.jpeg",aka:[]},
  {n:"Kakashi",p:"ST",o:74,j:48,g:10,a:27,m:4,psn:"",aka:[]},
  {n:"G. Arrascaeta",p:"CB",o:78,j:27,g:8,a:21,m:6,psn:"",aka:[]},
  /*{n:"Pedrim",p:"ST",o:82,j:14,g:11,a:9,m:3,psn:""},*/
  {n:"Floren",p:"CM",o:78,j:10,g:0,a:0,m:0,psn:"",aka:[]},
  {n:"E. Caveira",p:"ST",o:80,j:9,g:1,a:3,m:0,psn:"",aka:[]},
  {n:"B. Reis",p:"CM",o:77,j:9,g:0,a:3,m:2,psn:"",aka:[]},
  {n:"C. Liduenha",p:"ST",o:82,j:8,g:4,a:3,m:1,psn:"",aka:[]},
  {n:"S. Kennedy sfd",p:"GK",o:87,j:8,g:0,a:0,m:1,psn:"",aka:[]},
  {n:"Z. Love",p:"ST",o:83,j:7,g:5,a:1,m:1,psn:"",aka:[]},
  {n:"Ryan",p:"CB",o:84,j:7,g:2,a:0,m:0,psn:"",aka:[]},
  {n:"Messi",p:"CB",o:78,j:6,g:0,a:0,m:2,psn:"",aka:[]},
  {n:"N. Martins",p:"CB",o:80,j:5,g:0,a:0,m:1,psn:"",aka:[]},
  {n:"V. Conceição",p:"CB",o:80,j:4,g:1,a:0,m:0,psn:"",aka:[]},
  {n:"z. zAlemao16",p:"CB",o:83,j:3,g:0,a:1,m:0,psn:"",aka:[]},
  {n:"Habib",p:"CB",o:75,j:2,g:0,a:0,m:0,psn:"",aka:[]},
  {n:"lebers",p:"CM",o:72,j:2,g:0,a:0,m:0,psn:"",aka:[]},
  {n:"RyanFelix055",p:"",o:0,j:0,g:0,a:0,m:0,psn:"RyanFelix055",aka:[]},
  {n:"ERL7ON",p:"",o:0,j:0,g:0,a:0,m:0,psn:"ERL7ON",aka:[]},
  {n:"TeTex-_-",p:"",o:0,j:0,g:0,a:0,m:0,psn:"TeTex-_-",aka:[]},
  {n:"Daviluisvc",p:"",o:0,j:0,g:0,a:0,m:0,psn:"Daviluisvc",aka:[]}
];

/* Configuração do clube. discord: cole aqui o convite (ex.: "https://discord.gg/xxxx"). Vazio = botões de Discord ficam escondidos. */
const config = { discord: "", tracker: "https://proclubstracker.com/club/37568?platform=common-gen5&div=5" };

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
