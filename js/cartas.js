// js/cartas.js

// 📊 POOL INICIAL: Cartas que já começam no seu deck base[cite: 4]
const POOL_INICIAL = [
    { nome: "Biel", meme: "Faz overclock até na mãe", foto: "assets/fotos/biel.jpg", chips: 11, colecao: "cria" },
    { nome: "Saches", meme: "O marido que tem dois empregos", foto: "assets/fotos/sanches.jpg", chips: 20, colecao: "cria" },
    { nome: "Roger", meme: "Fez tanta dívida que deve até pontos", foto: "assets/fotos/roger.jpg", chips: -25, colecao: "cria" },
    { nome: "Thiago", meme: "Trabalha preto, preto trabalha", foto: "assets/fotos/thiago.jpg", chips: 15, colecao: "cria" },
    { nome: "Victor", meme: "Famoso comedor de casadas", foto: "assets/fotos/victor.jpg", chips: 8, colecao: "cria" },
    { nome: "Anderson", meme: "Amendoinzinho", foto: "assets/fotos/anderson.jpg", chips: 2, colecao: "cria" },
    { nome: "Valter", meme: "Um dia vai ser ruim no lol, por enquanto é péssimo", foto: "assets/fotos/valter.jpg", chips: -5, colecao: "cria" },
    { nome: "Panda", meme: "Gordo, mas um gordo gente boa", foto: "assets/fotos/panda.jpg", chips: 30, colecao: "cria" },
    { nome: "Rivotril", meme: "Calvo, e se chamar ele pra alguma coisa, ele não vai", foto: "assets/fotos/calvo.jpg", chips: 30, colecao: "cria" },
    
    // Memes Iniciais (Comuns)[cite: 4]
    { nome: "Luva de Pedreiro", meme: "RECEEEBA", foto: "assets/fotos/luva.jpg", chips: 11, colecao: "meme_base" },
    { nome: "Dava Jones", meme: "Eu quero TODAS AS CARTAS", foto: "assets/fotos/dava.jpg", chips: 6, colecao: "meme_base" },
    { nome: "Antedeguemon", meme: "Antedeguemon", foto: "assets/fotos/antedeguemon.jpg", chips: 7, colecao: "meme_base" },
    { nome: "Cachorro Caramelo", meme: "Símbolo nacional", foto: "assets/fotos/caramelo.jpg", chips: 13, colecao: "meme_base" },
    { nome: "Nego Bam", meme: "Ahhh Lelek lek lek", foto: "assets/fotos/negobam.jpg", chips: 5, colecao: "meme_base" }
];

const POOL_CRIA_PRIME = [
    { 
        id: "biel_prime",
        nome: "Biel (Modo Turbo)", 
        meme: "Overclock Quântico sem Pasta Térmica", 
        foto: "assets/fotos/biel_prime.jpg", 
        chips: 65, 
        chipsBonus: 0,
        multBonus: 5, 
        colecao: "cria_prime" 
    },
    { 
        id: "saches_prime",
        nome: "Saches (CEO da Call)", 
        meme: "Acumula 4 empregos e clona o próprio PIX", 
        foto: "assets/fotos/saches_prime.jpg", 
        chips: 80, 
        chipsBonus: 0,
        multBonus: 6,
        colecao: "cria_prime" 
    },
    { 
        id: "roger_prime",
        nome: "Roger (Faria Lima Bets)", 
        meme: "Limpou o nome no Serasa e comprou fiado na Riot", 
        foto: "assets/fotos/roger_prime.jpg", 
        chips: 40, 
        chipsBonus: 0,
        multBonus: 4,
        colecao: "cria_prime" 
    },
    { 
        id: "thiago_prime",
        nome: "Thiago (O Trabalhador Lendário)", 
        meme: "Operando 7 máquinas ao mesmo tempo às 3h da manhã", 
        foto: "assets/fotos/thiago_prime.jpg", 
        chips: 75, 
        chipsBonus: 0,
        multBonus: 5,
        colecao: "cria_prime" 
    },
    { 
        id: "victor_prime",
        nome: "Victor (O Implacável)", 
        meme: "Aprovado em todos os Cartórios de Casamento", 
        foto: "assets/fotos/victor_prime.jpg", 
        chips: 55, 
        chipsBonus: 0,
        multBonus: 4,
        colecao: "cria_prime" 
    },
    { 
        id: "anderson_prime",
        nome: "Anderson (Amendoim Atômico)", 
        meme: "Pequeno no tamanho, destruidor no combo", 
        foto: "assets/fotos/anderson_prime.jpg", 
        chips: 50, 
        chipsBonus: 0,
        multBonus: 4,
        colecao: "cria_prime" 
    },
    { 
        id: "valter_prime",
        nome: "Valter (Challenger de Coração)", 
        meme: "Erra o Smite mas acerta o coração da galera", 
        foto: "assets/fotos/valter_prime.jpg", 
        chips: 35, 
        chipsBonus: 0,
        multBonus: 3,
        colecao: "cria_prime" 
    },
    { 
        id: "panda_prime",
        nome: "Panda (Lord Tryhard)", 
        meme: "100% de Winrate de Rengar após 8 energéticos", 
        foto: "assets/fotos/panda_prime.jpg", 
        chips: 100, 
        chipsBonus: 0,
        multBonus: 8,
        colecao: "cria_prime" 
    },
    { 
        id: "rivotril_prime",
        nome: "Rivotril (O Invocado)", 
        meme: "Apareceu na call depois de 3 anos de convite", 
        foto: "assets/fotos/rivotril_prime.jpg", 
        chips: 90, 
        chipsBonus: 0,
        multBonus: 7,
        colecao: "cria_prime" 
    }
];

const POOL_PACK_CRIA_PRIME = POOL_CRIA_PRIME;

const POOL_PACK_LOL = [
    { nome: "Yasuo", meme: "Power spike de 0/10", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Yasuo.png", chips: -4, colecao: "lol" },
    { nome: "Teemo", meme: "Satanás em formato de texugo", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Teemo.png", chips: 13, colecao: "lol" },
    { nome: "Shaco", meme: "O palhaço do estresse", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Shaco.png", chips: 14, colecao: "lol" },
    { nome: "Master Yi", meme: "Só aperta Q", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/MasterYi.png", chips: 18, colecao: "lol" },
    { nome: "Urgot", meme: "Crossover entre o Panda e uma geladeira", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Urgot.png", chips: 26, colecao: "lol" },
    { nome: "Taric", meme: "Gemas são escandalosas", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Taric.png", chips: 11, colecao: "lol" },
    { nome: "Vayne", meme: "Sola qualquer casada", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Vayne.png", chips: 15, colecao: "lol" },
    { nome: "Blitzcrank", meme: "Erra o puxão e SPC", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Blitzcrank.png", chips: 12, colecao: "lol" },
    { nome: "Garen", meme: "Demacia!", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Garen.png", chips: 16, colecao: "lol" },
    { nome: "Lee Sin", meme: "Cego igual o agiota", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/LeeSin.png", chips: 12, colecao: "lol" },
    { nome: "Jhin", meme: "O psicopata do número 4", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Jhin.png", chips: 4, colecao: "lol" },
    { nome: "Rammus", meme: "OK.", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Rammus.png", chips: 13, colecao: "lol" },
    { nome: "Lux", meme: "Risada irritante", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Lux.png", chips: 7, colecao: "lol" },
    { nome: "Malphite", meme: "Literalmente uma pedra", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Malphite.png", chips: 15, colecao: "lol" },
    { nome: "Draven", meme: "Deus do machado", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Draven.png", chips: 20, colecao: "lol" },
    { nome: "Chogath", meme: "Banquete de pontos", foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Chogath.png", chips: 10, colecao: "lol" }
];

const POOL_PACK_STREAMERS = [
    { nome: "Alanzoka", meme: "O susto mais sincero da net", foto: "assets/fotos/alanzoka.jpg", chips: 18, colecao: "streamer" },
    { nome: "Cellbit", meme: "O enigma definitivo", foto: "assets/fotos/cellbit.jpg", chips: 14, colecao: "streamer" },
    { nome: "Gaules", meme: "A Tribo cuida da Tribo", foto: "assets/fotos/gaules.jpg", chips: 15, colecao: "streamer" },
    { nome: "Smzinho", meme: "O ódio puro em formato de live", foto: "assets/fotos/smzinho.jpg", chips: -10, colecao: "streamer" },
    { nome: "Baiano", meme: "Ilha das Sombras!", foto: "assets/fotos/baiano.jpg", chips: 12, colecao: "streamer" },
    { nome: "Casimiro", meme: "Meteu essa?", foto: "assets/fotos/caze.jpg", chips: 15, colecao: "streamer" },
    { nome: "Nobru", meme: "Apelão! Só dá capa vermelho", foto: "assets/fotos/nobru.jpg", chips: 17, colecao: "streamer" },
    { nome: "Coringa", meme: "O dono da Loud, risada escandalosa", foto: "assets/fotos/coringa.jpg", chips: 13, colecao: "streamer" },
    { nome: "Defante", meme: "Repórter doidô, foca no caos", foto: "assets/fotos/defante.jpg", chips: 9, colecao: "streamer" }
];

const POOL_PACK_MEMES_LENDARIOS = [
    { nome: "Maniaco do Parque", meme: "Vem aqui no parque", foto: "assets/fotos/maniaco.jpg", chips: 18, colecao: "meme_raro" },
    { nome: "Goleiro Bruno", meme: "Melhor em quebra-cabeça", foto: "assets/fotos/bruno.jpg", chips: -12, colecao: "meme_raro" },
    { nome: "Nego Di", meme: "O rei do estelionato virtual", foto: "assets/fotos/negodi.jpg", chips: 0, colecao: "meme_raro" },
    { nome: "Kid Bengala", meme: "Compensa o tamanho do Anderson", foto: "assets/fotos/kid.jpg", chips: 35, colecao: "meme_raro" },
    { nome: "Bluezao", meme: "Inimigo jurado do banho", foto: "assets/fotos/bluezao.jpg", chips: -8, colecao: "meme_raro" },
    { nome: "Jailson Mendes", meme: "Ai, que delícia, cara!", foto: "assets/fotos/jailson.jpg", chips: 22, colecao: "meme_raro" },
    { nome: "Ednaldo Pereira", meme: "Você não vale nada, você vale tudo!", foto: "assets/fotos/ednaldo.jpg", chips: 50, colecao: "meme_raro" },
    { nome: "Bora Bill", meme: "Fi do Bill, muié do Bill!", foto: "assets/fotos/borabill.jpg", chips: 10, colecao: "meme_raro" },
    { nome: "Ronaldinho Dibreador", meme: "Fez o drible perfeito", foto: "assets/fotos/ronaldinho.jpg", chips: 25, colecao: "meme_raro" },
    { nome: "Nego Ney", meme: "O verdadeiro vilão do universo", foto: "assets/fotos/negoney.jpg", chips: -15, colecao: "meme_raro" }
];

// 🃏 JOKERS EXPANDIDOS
const LISTA_JOKERS = [
    { id: "j_clutch", titulo: "Clutch Absurdo", desc: "Se jogar uma mão com apenas 1 carta, ganha +8 Mult.", preco: 5 },
    { id: "j_tilt", titulo: "Meme do FPS", desc: "Se houver o Biel na mão jogada, ganha x2.5 Mult final.", preco: 8 },
    { id: "j_olha_ele", titulo: "Olha Eleee", desc: "Se jogar uma mão contendo 3 ou mais cartas, ganha +12 Mult.", preco: 6 },
    { id: "j_bluepen", titulo: "Caneta Azul", desc: "Muda o multiplicador de TODAS as cartas jogadas para fixo x2.", preco: 5 },
    { id: "j_sigma", titulo: "Meme do Sigma", desc: "Se você vencer o round sem usar nenhum descarte, ganha x2.2 Mult.", preco: 9 },
    { id: "j_receba", titulo: "RECEBA!", desc: "Se jogar a carta do Luva de Pedreiro, os pontos de Chips (Azul) totais viram x2.5.", preco: 8 },
    { id: "j_crying_cat", titulo: "Gato Chorando", desc: "Ganha +75 Chips fixos, mas você perde 1 descarte por round.", preco: 4 },
    { id: "j_stonks", titulo: "STONKS 📈", desc: "Ganha 🪙 +2 moedas se vencer o round com folga (1.5x a meta).", preco: 6 },
    { id: "j_0_10", titulo: "Spike de 0/10", desc: "Se você jogar o Yasuo na mesa, ganha +150 Chips extras.", preco: 7 },
    { id: "j_md5", titulo: "Melhor de 5", desc: "Rounds com cartas do Valter dão +50 Chips.", preco: 6 },
    { id: "j_tf", titulo: "Twisted Fate", desc: "Cada carta de campeão do LoL jogada na mesa te dá 🪙 +1 moeda de bônus.", preco: 9 },
    { id: "j_outplay", titulo: "Fui Solado", desc: "Cartas do Shaco e do Teemo ganham +6 Mult fixo.", preco: 6 },
    { id: "j_4_perfeito", titulo: "O Quatro Perfeito", desc: "Se a mão contiver exatamente o Jhin e mais 3 cartas, ganha +50 Mult.", preco: 7 },
    { id: "j_mono_champion", titulo: "Mono Champion", desc: "Se jogar uma mão com 3 ou mais cartas do mesmo campeão do LoL, ganha x2.5 Mult final.", preco: 10 },
    { id: "j_chat_restrito", titulo: "Chat Restrito 🤬", desc: "O Valter é mutado! Cartas do Valter dão +80 Chips fixos.", preco: 5 },
    { id: "j_gank_cria", titulo: "Gank dos Cria", desc: "Se jogar um campeão do LoL junto com qualquer membro do grupo original, ganha +8 Mult.", preco: 6 },

    // 🔥 NOVOS JOKERS
    { id: "j_cavendish", titulo: "Banana de Pijama", desc: "Ganha +15 Mult fixo constante em todas as jogadas.", preco: 5 },
    { id: "j_card_sharp", titulo: "Mente de Tubarão", desc: "Ganha x3.0 Mult se você jogar o mesmo tipo de mão que já jogou na rodada anterior.", preco: 9 },
    { id: "j_driblador", titulo: "Dibre do Bruxo", desc: "Se descartar exatamente 3 cartas de uma vez, ganha +30 Chips na rodada.", preco: 6 },
    { id: "j_agiota", titulo: "Empréstimo do Roger", desc: "Ganha 🪙 +4 moedas por round, mas -10 Chips por mão jogada.", preco: 7 },
    { id: "j_hologram", titulo: "Holograma de Memes", desc: "Ganha x0.25 Mult extra permanente para cada carta nova adicionada ao baralho nesta partida.", preco: 8 },
    { id: "j_overdose_cafe", titulo: "Café das 4 da Manhã", desc: "Ganha +1 Mão extra por round, mas perde 1 Descarte.", preco: 6 }
];

const GRUPO_CANCELADOS = ["Goleiro Bruno", "Nego Di", "Maniaco do Parque"];
const GRUPO_WEB_FAMOSOS = ["Luva de Pedreiro", "Dava Jones", "Bluezao", "Nego Bam", "Antedeguemon", "Cachorro Caramelo"];
const GRUPO_ADCS = ["Vayne", "Lee Sin", "Jhin", "Draven"];
const GRUPO_TANKS = ["Urgot", "Blitzcrank", "Garen", "Rammus", "Malphite", "Chogath"];
const GRUPO_MAGOS = ["Teemo", "Shaco", "Taric", "Lux", "Yasuo"];

// 🔧 KITS DE UPGRADE EXPANDIDOS (Com Clonagem e Edições Estilizadas)
const DADOS_UPGRADES = [
    { id: "u_chips", nome: "Reforço de Chips", desc: "Escolha uma carta do baralho e adicione +25 Chips fixos nela.", preco: 5, tipo: "chips", valor: 25 },
    { id: "u_mult", nome: "Injeção de Mult", desc: "Escolha uma carta do baralho e adicione +4 Mult fixo nela.", preco: 7, tipo: "mult", valor: 4 },
    { id: "u_clone", nome: "Clonagem Quântica", desc: "Escolha uma carta do seu baralho para duplicar permanentemente.", preco: 8, tipo: "clone", valor: 1 },
    { id: "u_foil", nome: "Acabamento Foil", desc: "Aplica tratamento Foil em uma carta (+50 Chips fixos).", preco: 6, tipo: "edicao", edicao: "foil", chipsBonus: 50 },
    { id: "u_holo", nome: "Acabamento Holográfico", desc: "Aplica tratamento Holográfico em uma carta (+10 Mult fixo).", preco: 8, tipo: "edicao", edicao: "holo", multBonus: 10 },
    { id: "u_polychrome", nome: "Acabamento Policromático", desc: "Aplica Policromático em uma carta (Garante x1.5 Mult quando jogada).", preco: 12, tipo: "edicao", edicao: "polychrome", multBonus: 15 }
];

// 🪐 CARTAS PLANETA (Cobrindo todas as mãos do jogo)
const CARTAS_PLANETA = [
    { id: "planeta_carta_alta", nome: "Planeta do Solitário", desc: "Aumenta 'Carta Alta' em +10 Chips e +1 Mult.", preco: 3, alvoMao: "Carta Alta", bonus: { chips: 10, mult: 1 } },
    { id: "planeta_par", nome: "Planeta dos Gêmeos", desc: "Aumenta 'Par de Amigos' em +15 Chips e +1 Mult.", preco: 4, alvoMao: "Par de Amigos", bonus: { chips: 15, mult: 1 } },
    { id: "planeta_dois_pares", nome: "Planeta Duplo", desc: "Aumenta 'Dois Pares' em +20 Chips e +1 Mult.", preco: 4, alvoMao: "Dois Pares", bonus: { chips: 20, mult: 1 } },
    { id: "planeta_trinca", nome: "Planeta da Revoada", desc: "Aumenta 'Trinca de Memes' em +25 Chips e +2 Mult.", preco: 5, alvoMao: "Trinca de Memes", bonus: { chips: 25, mult: 2 } },
    { id: "planeta_full_house", nome: "Planeta da Casa Cheia", desc: "Aumenta 'Full House de Call' em +30 Chips e +2 Mult.", preco: 6, alvoMao: "Full House de Call", bonus: { chips: 30, mult: 2 } },
    { id: "planeta_quadra", nome: "Planeta da Monocultura", desc: "Aumenta 'Quadra Suprema' em +40 Chips e +3 Mult.", preco: 7, alvoMao: "Quadra Suprema", bonus: { chips: 40, mult: 3 } },
    { id: "planeta_panelinha_trio", nome: "Planeta da Call Pequena", desc: "Aumenta 'Panelinha da Call (Trio)' em +25 Chips e +2 Mult.", preco: 6, alvoMao: "Panelinha da Call (Trio)", bonus: { chips: 25, mult: 2 } },
    { id: "planeta_panelinha_quadra", nome: "Planeta da Call Cheia", desc: "Aumenta 'Panelinha da Call (Quadra)' em +35 Chips e +3 Mult.", preco: 8, alvoMao: "Panelinha da Call (Quadra)", bonus: { chips: 35, mult: 3 } },
    { id: "planeta_panelinha_gank", nome: "Planeta do Gank Máximo", desc: "Aumenta 'Panelinha da Call (Gank Máximo)' em +50 Chips e +4 Mult.", preco: 10, alvoMao: "Panelinha da Call (Gank Máximo)", bonus: { chips: 50, mult: 4 } },
    { id: "planeta_lol", nome: "Planeta do PBE", desc: "Aumenta 'Fila Solo Q Solo' em +25 Chips e +2 Mult.", preco: 6, alvoMao: "Fila Solo Q Solo", bonus: { chips: 25, mult: 2 } },
    { id: "planeta_streamer", nome: "Planeta do Host", desc: "Aumenta 'Sindicato dos Streamers' em +25 Chips e +2 Mult.", preco: 6, alvoMao: "Sindicato dos Streamers", bonus: { chips: 25, mult: 2 } },
    { id: "planeta_viral", nome: "Planeta do Algoritmo", desc: "Aumenta 'Combo do Clipe Viral' em +30 Chips e +2 Mult.", preco: 7, alvoMao: "Combo do Clipe Viral", bonus: { chips: 30, mult: 2 } },
    { id: "planeta_tanks", nome: "Planeta da Geladeira", desc: "Aumenta 'Mão da Geladeira Brastemp' em +30 Chips e +2 Mult.", preco: 6, alvoMao: "Mão da Geladeira Brastemp", bonus: { chips: 30, mult: 2 } },
    { id: "planeta_magos", nome: "Planeta do Circo", desc: "Aumenta 'Circo de Esquizofrenia' em +25 Chips e +2 Mult.", preco: 6, alvoMao: "Circo de Esquizofrenia", bonus: { chips: 25, mult: 2 } },
    { id: "planeta_adcs", nome: "Planeta do Toque", desc: "Aumenta 'Inimigos do Toque' em +25 Chips e +2 Mult.", preco: 6, alvoMao: "Inimigos do Toque", bonus: { chips: 25, mult: 2 } },
    { id: "planeta_cancelados", nome: "Planeta do Exposed", desc: "Aumenta 'Mão dos Cancelados' em +30 Chips e +2 Mult.", preco: 6, alvoMao: "Mão dos Cancelados", bonus: { chips: 30, mult: 2 } },
    { id: "planeta_famosos", nome: "Planeta dos Ícones", desc: "Aumenta 'Banda de Web-Famosos' em +25 Chips e +2 Mult.", preco: 6, alvoMao: "Banda de Web-Famosos", bonus: { chips: 25, mult: 2 } },
    { id: "planeta_overclock", nome: "Planeta do Cooler", desc: "Aumenta 'Noite de Overclock' em +25 Chips e +2 Mult.", preco: 6, alvoMao: "Noite de Overclock", bonus: { chips: 25, mult: 2 } },
    { id: "planeta_casadas", nome: "Planeta da Aliança", desc: "Aumenta 'Combo das Casadas' em +20 Chips e +2 Mult.", preco: 5, alvoMao: "Combo das Casadas", bonus: { chips: 20, mult: 2 } }
];

// 🏷️ NOMES DOS NÍVEIS
const NOMES_ANTE_FIXOS = {
    1: "Call Começando",
    2: "Aquecendo os Ânimos",
    3: "Microfone Aberto",
    4: "Discord Lotado",
    5: "Ping Instável",
    6: "Rage Quit Iminente",
    7: "Madrugada da Call",
    8: "Boss Final da Call"
};

const NOMES_ANTE_ENDLESS = [
    "Overtime da Call", "Call Infinita", "Buffer Eterno", "Loop de Memes",
    "Discord Pegando Fogo", "Servidor Lotando", "Ping de Outro Mundo",
    "A Call Nunca Acaba", "Zoeira Sem Fim", "Modo Sigma Absoluto"
];

function nomeDoAnte(round) {
    if (round <= 8) return NOMES_ANTE_FIXOS[round] || `Ante ${round}`;
    const posicao = round - 9;
    const volta = Math.floor(posicao / NOMES_ANTE_ENDLESS.length) + 1;
    const tema = NOMES_ANTE_ENDLESS[posicao % NOMES_ANTE_ENDLESS.length];
    return volta > 1 ? `${tema} ${volta}x` : tema;
}

// CSS de Edições Especiais e Fusão injetado automaticamente
(function injetarEstilosCartas() {
    if (typeof document === "undefined") return;
    if (document.getElementById("css-edicoes-memeatro")) return;
    const style = document.createElement("style");
    style.id = "css-edicoes-memeatro";
    style.textContent = `
        /* 🔀 FUSÃO LADO A LADO */
        .carta-fusao .fusao-avatar {
            display: flex !important;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 6px;
        }
        .carta-fusao .fusao-img {
            width: 50%;
            height: 100%;
            object-fit: cover;
            object-position: center top;
        }
        .carta-fusao .fusao-img.esquerda {
            border-right: 2px solid rgba(255, 215, 0, 0.6);
        }
        .carta-fusao .badge-fusao {
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            color: #000;
            font-weight: bold;
            padding: 1px 5px;
            border-radius: 4px;
            font-size: 11px;
        }
        .carta-fusao {
            box-shadow: 0 0 14px rgba(255, 215, 0, 0.5) !important;
            border-color: #f59e0b !important;
        }

        /* ✨ EDIÇÃO FOIL (Prateada Metálica / Balatro Style) */
        .edicao-foil {
            position: relative;
            border-color: #38bdf8 !important;
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.55), inset 0 0 12px rgba(255, 255, 255, 0.3) !important;
            background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%) !important;
            overflow: hidden;
        }
        .edicao-foil::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                115deg,
                transparent 30%,
                rgba(255, 255, 255, 0.4) 45%,
                rgba(56, 189, 248, 0.6) 50%,
                rgba(255, 255, 255, 0.4) 55%,
                transparent 70%
            );
            transform: rotate(-25deg);
            animation: foilShine 3.5s infinite linear;
            pointer-events: none;
            mix-blend-mode: overlay;
        }

        /* 🌈 EDIÇÃO HOLO (Holográfica Cósmica / Pokémon TCG Style) */
        .edicao-holo {
            position: relative;
            border-color: #e879f9 !important;
            box-shadow: 0 0 18px rgba(232, 121, 249, 0.6), inset 0 0 10px rgba(192, 132, 252, 0.4) !important;
            overflow: hidden;
        }
        .edicao-holo::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
                125deg,
                rgba(255, 0, 0, 0.15) 0%,
                rgba(255, 154, 0, 0.15) 10%,
                rgba(208, 222, 33, 0.15) 20%,
                rgba(79, 220, 74, 0.15) 30%,
                rgba(63, 218, 216, 0.15) 40%,
                rgba(47, 201, 226, 0.15) 50%,
                rgba(28, 127, 238, 0.15) 60%,
                rgba(95, 21, 242, 0.15) 70%,
                rgba(186, 12, 248, 0.15) 80%,
                rgba(251, 7, 217, 0.15) 90%,
                rgba(255, 0, 0, 0.15) 100%
            );
            background-size: 300% 300%;
            animation: holoShift 4s ease infinite;
            pointer-events: none;
            mix-blend-mode: color-dodge;
        }

        /* 💎 EDIÇÃO POLYCHROME (Prismática / Arco-Íris Balatro) */
        .edicao-polychrome {
            position: relative;
            border-color: #facc15 !important;
            box-shadow: 0 0 20px rgba(250, 204, 21, 0.7), inset 0 0 12px rgba(255, 255, 255, 0.4) !important;
            animation: polychromeBorda 3s infinite linear;
            overflow: hidden;
        }
        .edicao-polychrome::before {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(
                circle at 50% 50%,
                rgba(255, 255, 255, 0.3) 0%,
                rgba(234, 179, 8, 0.2) 40%,
                transparent 80%
            );
            mix-blend-mode: screen;
            pointer-events: none;
        }
        .edicao-polychrome .card-avatar img {
            filter: contrast(1.15) saturate(1.25);
        }

        /* 🎬 KEYFRAMES DE ANIMAÇÃO */
        @keyframes foilShine {
            0% { transform: translateY(-100%) rotate(-25deg); }
            100% { transform: translateY(100%) rotate(-25deg); }
        }

        @keyframes holoShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes polychromeBorda {
            0% { border-color: #ef4444; box-shadow: 0 0 18px rgba(239, 68, 68, 0.7); }
            20% { border-color: #f59e0b; box-shadow: 0 0 18px rgba(245, 158, 11, 0.7); }
            40% { border-color: #10b981; box-shadow: 0 0 18px rgba(16, 185, 129, 0.7); }
            60% { border-color: #06b6d4; box-shadow: 0 0 18px rgba(6, 182, 212, 0.7); }
            80% { border-color: #8b5cf6; box-shadow: 0 0 18px rgba(139, 92, 246, 0.7); }
            100% { border-color: #ef4444; box-shadow: 0 0 18px rgba(239, 68, 68, 0.7); }
        }
    `;
    if (document.head) document.head.appendChild(style);
    else document.addEventListener("DOMContentLoaded", () => document.head.appendChild(style));
})();

// 🃏 Cria o elemento visual de uma carta
function criarElementoCarta(card, opcoes = {}) {
    const totalChips = (Number(card.chips) || 0) + (Number(card.chipsBonus) || 0);
    const foiUpgradada = (card.chipsBonus || 0) > 0 || (card.multBonus || 0) > 0 || !!card.edicao;
    const ehPrime = card.colecao === "cria_prime" || (card.nome && card.nome.includes("Prime"));
    const ehFusao = !!card.fotoA && !!card.fotoB;

    const el = document.createElement("div");
    
    el.className = `card ${opcoes.classeExtra || ""} ${foiUpgradada ? "card-upgraded" : ""} ${ehPrime ? "cria-prime" : ""} ${ehFusao ? "carta-fusao" : ""} ${card.edicao ? "edicao-" + card.edicao : ""}`.trim();
    
    if (card.colecao) {
        el.setAttribute("data-colecao", card.colecao);
    }

    let avatarHTML = "";
    if (ehFusao) {
        avatarHTML = `
            <div class="card-avatar fusao-avatar">
                <img src="${card.fotoA}" class="fusao-img esquerda" onerror="this.style.display='none'">
                <img src="${card.fotoB}" class="fusao-img direita" onerror="this.style.display='none'">
            </div>
        `;
    } else {
        const srcFoto = card.fotoFusao || card.foto || "";
        avatarHTML = `
            <div class="card-avatar">
                <img src="${srcFoto}" onerror="this.onerror=null; this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(card.nome || "card")}';">
            </div>
        `;
    }

    el.innerHTML = `
        <div class="card-badge">
            <span class="badge-chips">${totalChips}</span>
            ${card.multBonus ? `<span class="badge-mult">+${card.multBonus}</span>` : ""}
            ${card.edicao === "foil" ? `<span class="badge-edicao" title="Foil">✨</span>` : ""}
            ${card.edicao === "holo" ? `<span class="badge-edicao" title="Holo">🌈</span>` : ""}
            ${card.edicao === "polychrome" ? `<span class="badge-edicao" title="Polychrome">💎</span>` : ""}
            ${ehFusao ? `<span class="badge-fusao">🔀</span>` : ""}
        </div>
        <div class="card-name">${card.nome || "Carta"}</div>
        ${avatarHTML}
        <div class="card-meme">${card.meme || ""}</div>
    `;

    if (opcoes.onClick) el.onclick = () => opcoes.onClick(card, el);
    return el;
}

// 🔀 Cria uma carta fundida
function criarCartaFundida(cartaA, cartaB) {
    let chipsBase = Math.floor(((Number(cartaA.chips) || 0) + (Number(cartaB.chips) || 0)) * 0.75) + 35;
    let multBonus = Math.floor(((Number(cartaA.multBonus) || 0) + (Number(cartaB.multBonus) || 0)) / 1.5) + 6;
    let chipsBonus = Math.floor(((Number(cartaA.chipsBonus) || 0) + (Number(cartaB.chipsBonus) || 0)) / 1.5) + 20;

    const mesmaColecao = cartaA.colecao && cartaB.colecao && cartaA.colecao === cartaB.colecao;
    const grupos = [
        typeof GRUPO_CANCELADOS !== "undefined" ? GRUPO_CANCELADOS : [],
        typeof GRUPO_WEB_FAMOSOS !== "undefined" ? GRUPO_WEB_FAMOSOS : [],
        typeof GRUPO_ADCS !== "undefined" ? GRUPO_ADCS : [],
        typeof GRUPO_TANKS !== "undefined" ? GRUPO_TANKS : [],
        typeof GRUPO_MAGOS !== "undefined" ? GRUPO_MAGOS : []
    ];
    let mesmoGrupo = mesmaColecao;
    if (!mesmoGrupo) {
        for (const g of grupos) {
            if (g.includes(cartaA.nome) && g.includes(cartaB.nome)) {
                mesmoGrupo = true;
                break;
            }
        }
        if ((cartaA.colecao === "cria" || cartaA.colecao === "cria_prime") &&
            (cartaB.colecao === "cria" || cartaB.colecao === "cria_prime")) {
            mesmoGrupo = true;
        }
    }

    if (mesmoGrupo) {
        chipsBase = Math.floor(chipsBase * 1.35) + 15;
        chipsBonus = Math.floor(chipsBonus * 1.4) + 10;
        multBonus = Math.floor(multBonus * 1.5) + 3;
    }

    const nomeA = (cartaA.nome || "A").split(" ")[0];
    const nomeB = (cartaB.nome || "B").split(" ")[0];
    const nomeFusao = mesmoGrupo ? `⚡ ${nomeA} + ${nomeB}` : `${nomeA} + ${nomeB}`;
    const memeFusao = mesmoGrupo
        ? `FUSÃO DE GRUPO LENDÁRIA: ${cartaA.meme || ""} ⚡ ${cartaB.meme || ""}`
        : `FUSÃO LENDÁRIA: ${cartaA.meme || ""} ⚡ ${cartaB.meme || ""}`;

    return {
        nome: nomeFusao,
        meme: memeFusao,
        foto: cartaA.foto,
        fotoA: cartaA.foto,
        fotoB: cartaB.foto,
        chips: chipsBase,
        chipsBonus: chipsBonus,
        multBonus: multBonus,
        colecao: "fusao",
        origemA: cartaA.nome,
        origemB: cartaB.nome,
        mesmoGrupo: !!mesmoGrupo,
        edicao: cartaA.edicao || cartaB.edicao || null
    };
}