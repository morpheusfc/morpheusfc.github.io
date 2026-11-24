/* Hall da Fama: um item por campeonato. Fica aqui o que eu (Claude) preencho quando um campeonato termina
   (ou quando você pedir "atualizar Hall da Fama"). Não precisa mexer à mão.

   Campos do campeonato:
     id, tipo ("copa" | "brasileirao"), nome, edicao, status ("andamento" | "encerrado"),
     fundo   : imagem da sala de troféus daquele campeonato (arquivo em assets/hall/), com a taça em destaque. Vazio = sala padrão.
     trofeu  : imagem só da taça (PNG sem fundo, em assets/hall/). Vazio = taça desenhada. Só aparece se não houver "fundo".
     link    : página do campeonato (campeonato.html?c=<id>)
     campeao : { nome, foto } (foto = escudo/card do campeão, em assets/hall/; opcional)
     premios : { artilheiro, garcom, mvp, goleiro }, cada um { psn, time, foto, parcial, stats }
       foto    : card/imagem do jogador (arquivo em assets/hall/ ou em assets/players/ com "players/nome.jpg"). Ideal 3:4 (ex.: 600x800).
       parcial : true = ainda é o líder atual, não o vencedor final (mostra "Líder atual")
       stats   : artilheiro {g, a, j} · garcom {a, g, j} · mvp {m, g, a, j} · goleiro {def, gs, j}  (g gols, a assistências, m vezes melhor em campo, j jogos, def defesas, gs gols sofridos)
   Prêmio sem jogador ainda = "A definir". */
const hallDaFama = [
  { id: "copa-begin", tipo: "copa", nome: "Copa Begin", edicao: "1ª Edição", status: "andamento",
    fundo: "", trofeu: "", link: "campeonato.html?c=3bb38a82-21b3-4439-aa3e-e9ef4ed0413c", campeao: null, premios: {} },
  { id: "brasileirao-fc27", tipo: "brasileirao", nome: "Brasileirão FC27", edicao: "", status: "andamento",
    fundo: "", trofeu: "", link: "campeonato.html?c=87d28a13-90ab-4113-b43a-3ba8eb0235f6", campeao: null, premios: {} }
];
