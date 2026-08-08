# 🃏 MEMEATRO — Balatro Meme Edition

O **Memeatro** é um fangame roguelike de cartas fortemente inspirado no aclamado *Balatro*, mas totalmente focado na zoeira interna dos guris da call, memes da internet brasileira e no universo caótico do League of Legends. 

Construa builds absurdas de Coringas (Jokers) ativos, gerencie sua economia local, abra Booster Packs e monte a mão perfeita para estourar os multiplicadores e bater metas infinitas de pontos (Antes) antes que as suas mãos acabem e o seu deck falia a call.

---

## 🚀 Principais Mecânicas

* **Fórmula de Pontuação Estrita (Estilo Balatro):** O motor de cálculo limpa e expurga cartas intrusas. Apenas as cartas que efetivamente formam a combinação pontuam, enquanto os lixos jogados viram zero.
* **Booster Packs & Sistema de Gacha:** Compre pacotes na loja para expandir e alterar o inventário do seu baralho permanentemente durante a run. Se vier carta repetida no pack, acumula no deck ("veio e já era" 💀).
* **Inventário de Baralho Persistente:** O seu baralho limpa e se reconstitui após cada Blind (partida). Se você jogar ou descartar o seu único *Panda* ou *Alanzoka*, ele não volta para a sua mão até o próximo round iniciar.
* **Economia Proporcional:** Sobreviver com recursos garante vantagens. Ao vencer, você ganha ouro bônus proporcional à quantidade de mãos e descartes que restaram no seu bolso.
* **Progressão Infinita e Dificuldade Escalonada:** Siga a risca as metas do jogo original até o Ante 8 (50.000 pontos). Se passar disso, o jogo entra no modo *Endless* aplicando multiplicadores exponenciais automáticos.
* **Guia de Mãos Lateral (Hover):** Uma aba flutuante cyberpunk fixada na lateral que se expande ao passar o mouse, mostrando o multiplicador base e um preview em tempo real de cada combo.
* **Leaderboard Local Integrado:** Um micro-servidor em Node.js salvando dados via API para criar um placar de líderes integrado no `localhost`.

---

## 🎴 Classes de Cartas e Mãos Especiais

* **Os Cria da Call:** Biel, Saches, Roger, Thiago, Victor, Anderson, Valter e Panda. Ativam a temível *Panelinha da Call* (Trio, Quadra ou Gank Máximo de 5 cartas).
* **Sindicato dos Streamers:** Alanzoka, Cellbit, Gaules, Smzinho, Baiano, Nobru, Coringa e Defante. Ativam o combo do *Sindicato dos Streamers* ou o *Combo do Clipe Viral*.
* **Campeões do LoL (Riot Games API):** De ADCs a Tanks. Forme a *Mão da Geladeira Brastemp* (só Tanks), *Circo de Esquizofrenia* (só Magos) ou jogue a sorte na *Fila Solo Q Solo*.
* **Memes Nacionais:** Ednaldo Pereira, Luva de Pedreiro, Bora Bill, Ronaldinho Dibreador, entre outros, gerando efeitos caóticos de inversão ou multiplicação de pontos.

---

## 📁 Estrutura de Arquivos

```text
memeatro/
├── assets/
│   └── fotos/        # Fotos locais (.jpg) dos Cria da Call e Memes
├── css/
│   └── style.css     # Toda a estilização estruturada e efeitos 3D
├── js/
│   ├── cartas.js     # Banco de dados de cartas, pools de packs e Jokers
│   ├── loja.js       # Logica de compra de Jokers e abertura gacha de Booster Packs
│   └── jogo.js       # Motor central, detecção de mãos, pontuação e ciclo de jogo
├── server.js         # API local para gerenciamento do Leaderboard
├── scores.json       # Banco de dados em texto gerado automaticamente para o ranking
└── index.html        # A mesa de jogo unificada