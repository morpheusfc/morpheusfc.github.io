/* Dados vindos do Pro Clubs Tracker (clube 37568). Última atualização: 14/10/2026. */
const club = {w:68,d:16,l:61,gf:346,ga:317,games:145,sr:1655};
/* psn: ID do jogador no PlayStation. Vazio = ainda não informado. p vazio = sem posição (nunca jogou).
   img: nome do arquivo da foto dentro de assets/players/ (ex.: img:"habutre.jpg"). Sem img = silhueta padrão. Ideal: retrato vertical, ~400x480. */
const players = [
  {n:"Leo",p:"ST",o:73,j:123,g:27,a:22,m:1,psn:""},
  {n:"Habutre",p:"ST",o:83,j:113,g:72,a:50,m:12,psn:"",img:"Habutre.jpeg"},
  {n:"Bll4ck",p:"ST",o:83,j:106,g:107,a:48,m:14,psn:""},
  {n:"Vibox Beats",p:"CM",o:81,j:95,g:5,a:11,m:17,psn:""},
  {n:"dtb",p:"ST",o:83,j:71,g:39,a:21,m:5,psn:""},
  {n:"LZ",p:"CB",o:85,j:68,g:4,a:2,m:6,psn:""},
  {n:"TIAO",p:"CB",o:78,j:67,g:5,a:7,m:2,psn:""},
  {n:"Pastor",p:"CB",o:82,j:52,g:3,a:5,m:4,psn:""},
  {n:"Saul",p:"CM",o:83,j:49,g:18,a:42,m:2,psn:"alice_farias09",img:"saul.jpeg"},
  {n:"Kakashi",p:"ST",o:74,j:48,g:10,a:27,m:4,psn:""},
  {n:"G. Arrascaeta",p:"CB",o:78,j:27,g:8,a:21,m:6,psn:""},
  /*{n:"Pedrim",p:"ST",o:82,j:14,g:11,a:9,m:3,psn:""},*/
  {n:"Floren",p:"CM",o:78,j:10,g:0,a:0,m:0,psn:""},
  {n:"E. Caveira",p:"ST",o:80,j:9,g:1,a:3,m:0,psn:""},
  {n:"C. Liduenha",p:"ST",o:82,j:8,g:4,a:3,m:1,psn:""},
  {n:"Z. Love",p:"ST",o:83,j:7,g:5,a:1,m:1,psn:""},
  {n:"Ryan",p:"CB",o:84,j:7,g:2,a:0,m:0,psn:""},
  {n:"Messi",p:"CB",o:78,j:6,g:0,a:0,m:2,psn:""},
  {n:"B. Reis",p:"CM",o:76,j:5,g:0,a:2,m:1,psn:""},
  {n:"V. Conceição",p:"CB",o:80,j:4,g:1,a:0,m:0,psn:""},
  {n:"z. zAlemao16",p:"CB",o:83,j:3,g:0,a:1,m:0,psn:""},
  {n:"Habib",p:"CB",o:75,j:2,g:0,a:0,m:0,psn:""},
  {n:"S. Kennedy sfd",p:"GK",o:87,j:1,g:0,a:0,m:0,psn:""},
  {n:"RyanFelix055",p:"",o:0,j:0,g:0,a:0,m:0,psn:"RyanFelix055"},
  {n:"ERL7ON",p:"",o:0,j:0,g:0,a:0,m:0,psn:"ERL7ON"},
  {n:"TeTex-_-",p:"",o:0,j:0,g:0,a:0,m:0,psn:"TeTex-_-"},
  {n:"Daviluisvc",p:"",o:0,j:0,g:0,a:0,m:0,psn:"Daviluisvc"}
];

/* Configuração do clube. discord: cole aqui o convite (ex.: "https://discord.gg/xxxx"). Vazio = botões de Discord ficam escondidos. */
const config = { discord: "", tracker: "https://proclubstracker.com/club/37568?platform=common-gen5&div=5" };

/* Fotos de fundo opcionais (arquivos dentro de assets/bg/). Vazio = só as cenas desenhadas em código.
   Chaves: hero, jogos, elenco, cta, partidas, videos, amistosos, recrutamento. Ex.: config.photos.hero = "torcida.jpg" */
config.photos = { hero:"hero.png", jogos:"jogos.png", elenco:"elenco.png", cta:"", partidas:"jogos.png", videos:"videos.png", amistosos:"", recrutamento:"" };

/* Página de Amistosos.
   horarios: texto mostrado no topo da página (quando o clube costuma jogar). Edite à vontade.
   cooldownSegundos: tempo mínimo entre dois pedidos enviados do mesmo aparelho.
   imagem: foto do topo do bloco "Próximos amistosos" (arquivo dentro de assets/bg/, ex.: "amistosos.jpg").
           Tamanho ideal: 1200 x 600 px (formato 2:1), JPG ou WebP, até 300 KB. Vazio = arte padrão do clube. */
config.amistosos = {
  horarios: "Costumamos jogar à noite, a partir das 21h (horário de Brasília). Sugira o dia e o horário que ficarem melhores para o seu clube.",
  cooldownSegundos: 60,
  imagem: "amistoso.png"
};
