// js/jogo.js

// =============================================================================
// 1. ESTADO DO JOGO E VARIÁVEIS DE CONTROLE
// =============================================================================

let gameState = {
    round: 1,
    targetScore: 300,
    currentScore: 0,
    money: 10,
    hands: 4,
    discards: 3,
    startingDiscards: 3,
    rerollCost: 3,
    cartasDesbloqueadasRun: [], // 🎒 Cartas que o jogador possui atualmente na Run (Gacha)
    deck: [],
    hand: [],
    selectedCards: [],
    ownedJokers: []
};

// 🎞️ Valores exibidos na tela para a animação de contagem estilo Balatro
let valoresExibidos = { score: 0, money: 10 };

// 🎯 METAS DE PONTUAÇÃO POR ANTE
const METAS_ANTE_BASE = { 
    1: 300, 
    2: 600, 
    3: 800, 
    4: 1100, 
    5: 1500, 
    6: 1800, 
    7: 2000, 
    8: 2400,
    9: 2700,
    10: 3000
};

// Função para buscar a meta do Ante atual
function obterMetaAnte(round) {
    if (round <= 10) {
        return METAS_ANTE_BASE[round] || 300;
    }
    // A partir do Ante 11, adiciona +500 por round extra
    return METAS_ANTE_BASE[10] + (round - 10) * 500;
}

// ⚠️ GAMBIARRA DE SEGURANÇA: Evita o crash se algo procurar METAS_ANTE[round]
const METAS_ANTE = new Proxy(METAS_ANTE_BASE, {
    get: function(target, prop) {
        const round = Number(prop);
        if (!isNaN(round)) {
            return obterMetaAnte(round);
        }
        return target[prop];
    }
});

// 📈 TABELA EXPANDIDA DE MÃOS DIVERSIFICADAS
const MAOS_POKER = {
    "Carta Alta": { chips: 5, mult: 1 },
    "Par de Amigos": { chips: 10, mult: 2 },
    "Dois Pares": { chips: 20, mult: 2 },
    "Trinca de Memes": { chips: 30, mult: 3 },
    "Full House de Call": { chips: 40, mult: 4 },
    "Quadra Suprema": { chips: 60, mult: 7 },
    
    // --- ⚔️ CLASSES DO LOL ---
    "Inimigos do Toque": { chips: 25, mult: 4 },        // Só ADCs
    "Mão da Geladeira Brastemp": { chips: 40, mult: 3 }, // Só Tanks
    "Circo de Esquizofrenia": { chips: 30, mult: 4 },     // Só Magos
    "Fila Solo Q Solo": { chips: 35, mult: 3 },          // Qualquer mistura de 3+ cartas do LoL

    // --- 🎥 STREAMERS ---
    "Sindicato dos Streamers": { chips: 35, mult: 4 },   // Só Streamers
    "Combo do Clipe Viral": { chips: 45, mult: 5 },      // Streamers + Memes misturados

    // --- 🎙️ COMBOS TEMÁTICOS ---
    "Mão dos Cancelados": { chips: 35, mult: 4 },
    "Banda de Web-Famosos": { chips: 30, mult: 4 },
    "Noite de Overclock": { chips: 25, mult: 3 },
    "Combo das Casadas": { chips: 15, mult: 3 },
    "Panelinha da Call (Trio)": { chips: 30, mult: 3 },
    "Panelinha da Call (Quadra)": { chips: 50, mult: 5 },
    "Panelinha da Call (Gank Máximo)": { chips: 75, mult: 8 },
};

// Mapeamento dinâmico de imagens de exemplo para ilustrar o Guia de Mãos
const IMAGENS_PREVIEW_MAOS = {
    "Panelinha da Call (Trio)": { foto: "assets/fotos/biel.jpg", desc: "Membros da guilda" },
    "Panelinha da Call (Quadra)": { foto: "assets/fotos/panda.jpg", desc: "Os cria em peso" },
    "Panelinha da Call (Gank Máximo)": { foto: "assets/fotos/sanches.jpg", desc: "Call lotada!" },
    "Mão da Geladeira Brastemp": { foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Urgot.png", desc: "Apenas Tanks do LoL" },
    "Circo de Esquizofrenia": { foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Teemo.png", desc: "Apenas Magos/Mono" },
    "Inimigos do Toque": { foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Draven.png", desc: "Apenas ADCs" },
    "Sindicato dos Streamers": { foto: "assets/fotos/alanzoka.jpg", desc: "Elite das Streams" },
    "Combo do Clipe Viral": { foto: "assets/fotos/luva.jpg", desc: "Streamer + Meme" },
    "Fila Solo Q Solo": { foto: "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Yasuo.png", desc: "3+ Campeões mistos" },
    "Mão dos Cancelados": { foto: "assets/fotos/maniaco.jpg", desc: "Figuras perigosas" },
    "Banda de Web-Famosos": { foto: "assets/fotos/dava.jpg", desc: "Ícones da internet" },
    "Quadra Suprema": { foto: "assets/fotos/caramelo.jpg", desc: "4 Cartas idênticas" },
    "Full House de Call": { foto: "assets/fotos/antedeguemon.jpg", desc: "Trinca + Par" },
    "Trinca de Memes": { foto: "assets/fotos/negobam.jpg", desc: "3 Cartas idênticas" },
    "Noite de Overclock": { foto: "assets/fotos/thiago.jpg", desc: "Biel + Saches/Thiago" },
    "Combo das Casadas": { foto: "assets/fotos/victor.jpg", desc: "Victor na mesa" },
    "Dois Pares": { foto: "assets/fotos/biel.jpg", desc: "Dois pares de cartas" },
    "Par de Amigos": { foto: "assets/fotos/biel.jpg", desc: "Duas cartas iguais" },
    "Carta Alta": { foto: "assets/fotos/anderson.jpg", desc: "Maior pontuação unitária" }
};

// =============================================================================
// 2. FUNÇÕES DE ANIMAÇÃO E INTERFACE
// =============================================================================

function animarNumero(elemento, valorAntigo, valorNovo, duracaoMs = 600) {
    if (!elemento) return;
    const vAntigo = Number(valorAntigo) || 0;
    const vNovo = Number(valorNovo) || 0;

    if (vAntigo === vNovo) {
        elemento.innerText = Math.round(vNovo).toLocaleString();
        return;
    }
    const inicio = performance.now();
    function passo(agora) {
        const progresso = Math.min((agora - inicio) / duracaoMs, 1);
        const valorAtual = vAntigo + (vNovo - vAntigo) * progresso;
        elemento.innerText = Math.round(valorAtual).toLocaleString();
        if (progresso < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
}

function reiniciarAnimacao(elemento, classe) {
    if (!elemento) return;
    elemento.classList.remove(classe);
    void elemento.offsetWidth; // Força reflow no DOM
    elemento.classList.add(classe);
}

function alternarTela(idTela) {
    const loading = document.getElementById("tela-loading");
    const todasTelas = document.querySelectorAll('.tela');
    const frasesLoading = [
        "Biel está limpando o cooler... com um martelo.",
        "Roger está pedindo Pix de 1 real pra pagar o agiota...",
        "Victor está analisando o Facebook das casadas da região...",
        "Saches sumiu porque o chefe do segundo emprego apareceu na call...",
        "Abrindo caixas de booster falsificados na feira..."
    ];

    const msgElement = document.getElementById("loading-msg");
    if (msgElement) {
        msgElement.innerText = frasesLoading[Math.floor(Math.random() * frasesLoading.length)].toUpperCase();
    }

    if (loading) {
        loading.style.display = "flex";
        setTimeout(() => loading.style.opacity = "1", 50);
    }

    setTimeout(() => {
        todasTelas.forEach(t => {
            if (t.id !== "tela-loading") {
                t.classList.remove('ativo');
                t.style.display = "none";
            }
        });

        const proxima = document.getElementById(idTela);
        if (proxima) {
            proxima.style.display = proxima.id === "tela-partida" ? "grid" : "flex";
        }

        if (loading) {
            loading.style.opacity = "0";
            setTimeout(() => {
                loading.style.display = "none";
                if (proxima) proxima.classList.add('ativo');
            }, 400);
        }
    }, 1500);

    // 🎵 Troca de músicas
    if (typeof tocarMusica === "function") {
        if (idTela === "tela-menu") tocarMusica("menu");
        else if (idTela === "tela-partida") tocarMusica("partida");
        else if (idTela === "tela-loja") tocarMusica("loja");
    }
}

function mostrarTelaResultado(linhas, total) {
    const nomeAnteEl = document.getElementById("resultado-nome-ante");
    if (nomeAnteEl) {
        const nomeAnteStr = typeof nomeDoAnte === "function" ? nomeDoAnte(gameState.round) : `Ante ${gameState.round}`;
        nomeAnteEl.innerText = `${nomeAnteStr} — Pontuação Final: ${(Number(gameState.currentScore) || 0).toLocaleString()}`;
    }

    const linhasEl = document.getElementById("resultado-linhas");
    if (linhasEl) {
        linhasEl.innerHTML = "";
        linhas.forEach((l, idx) => {
            const div = document.createElement("div");
            div.className = "linha-resultado";
            div.style.animationDelay = (idx * 0.15 + 0.2) + "s";
            div.innerHTML = `<span>${l.label}</span><span>🪙 +${l.valor}</span>`;
            linhasEl.appendChild(div);
        });
    }

    const totalEl = document.getElementById("resultado-total-valor");
    if (totalEl) {
        const atrasoTotal = linhas.length * 0.15 + 0.4;
        totalEl.innerText = "🪙 0";
        setTimeout(() => {
            const inicio = performance.now();
            const duracao = 700;
            function passo(agora) {
                const progresso = Math.min((agora - inicio) / duracao, 1);
                totalEl.innerText = `🪙 ${Math.round(total * progresso)}`;
                if (progresso < 1) requestAnimationFrame(passo);
            }
            requestAnimationFrame(passo);
        }, atrasoTotal * 1000);
    }

    alternarTela("tela-resultado");
}

function gerarPainelColaMaos() {
    const container = document.getElementById("lista-maos-cola");
    const tooltip = document.getElementById("preview-imagem-mao");
    const tImg = document.getElementById("img-tooltip-src");
    const tLeg = document.getElementById("txt-tooltip-legenda");

    if (!container || !tooltip) return;
    container.innerHTML = "";

    Object.keys(MAOS_POKER).forEach(nomeMao => {
        const dados = MAOS_POKER[nomeMao];

        const linha = document.createElement("div");
        linha.className = "item-mao-cola";
        linha.innerHTML = `
            <span class="nome-mao-cola">${nomeMao}</span>
            <div class="stats-mao-cola">
                <span class="chips-blue-cola">${dados.chips}</span>
                <span class="mult-red-cola">x${dados.mult}</span>
            </div>
        `;

        linha.addEventListener("mouseenter", () => {
            const infoPreview = IMAGENS_PREVIEW_MAOS[nomeMao];
            if (infoPreview && tImg && tLeg) {
                tImg.src = infoPreview.foto;
                tImg.onerror = () => {
                    tImg.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nomeMao)}`;
                };
                tLeg.innerText = infoPreview.desc.toUpperCase();
                tooltip.style.display = "block";
            }
        });

        linha.addEventListener("mousemove", (e) => {
            tooltip.style.left = (e.clientX + 20) + "px";
            tooltip.style.top = (e.clientY - 60) + "px";
        });

        linha.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });

        container.appendChild(linha);
    });
}

function renderizarJokersNaPartida() {
    const area = document.getElementById("jokers-area");
    if (!area) return;
    area.innerHTML = "";
    gameState.ownedJokers.forEach(j => {
        const jEl = document.createElement("div");
        jEl.className = "joker-card";
        jEl.innerHTML = `<div class="joker-title">${j.titulo}</div><div class="joker-desc">${j.desc}</div>`;
        area.appendChild(jEl);
    });
}

function atualizarInterface() {
    const lblRound = document.getElementById("lbl-round");
    const lblRoundNome = document.getElementById("lbl-round-nome");
    const lblTarget = document.getElementById("lbl-target");
    const lblScore = document.getElementById("lbl-score");
    const lblMoney = document.getElementById("lbl-money");
    const lblHands = document.getElementById("lbl-hands");
    const lblDiscards = document.getElementById("lbl-discards");

    if (lblRound) lblRound.innerText = gameState.round;
    if (lblRoundNome && typeof nomeDoAnte === "function") lblRoundNome.innerText = nomeDoAnte(gameState.round);
    if (lblTarget) lblTarget.innerText = (Number(gameState.targetScore) || 0).toLocaleString();

    if (lblScore) animarNumero(lblScore, valoresExibidos.score, gameState.currentScore);
    if (lblMoney) animarNumero(lblMoney, valoresExibidos.money, gameState.money, 500);

    valoresExibidos.score = Number(gameState.currentScore) || 0;
    valoresExibidos.money = Number(gameState.money) || 0;

    if (lblHands) lblHands.innerText = gameState.hands;
    if (lblDiscards) lblDiscards.innerText = gameState.discards;
}

// =============================================================================
// 3. FLUXO DO BARALHO E MÃO DO JOGADOR
// =============================================================================

function montarBaralho() {
    gameState.deck = [];
    gameState.cartasDesbloqueadasRun.forEach(carta => {
        gameState.deck.push({ 
            ...carta, 
            chips: Number(carta.chips) || 0,
            chipsBonus: Number(carta.chipsBonus) || 0,
            multBonus: Number(carta.multBonus) || 0,
            uid: Math.random() 
        });
    });
    gameState.deck.sort(() => Math.random() - 0.5);
}

function comprarCartas() {
    gameState.selectedCards = [];
    while (gameState.hand.length < 5 && gameState.deck.length > 0) {
        const carta = gameState.deck.pop();
        carta._novaNaMao = true;
        gameState.hand.push(carta);
    }
    renderizarMão();
    calcularPontuacaoEmTempoReal();
}

function renderizarMão() {
    const handContainer = document.getElementById("hand-container");
    const mesaContainer = document.getElementById("mesa-jogada-container");
    if (!handContainer || !mesaContainer) return;

    handContainer.innerHTML = "";
    mesaContainer.innerHTML = "";

    gameState.hand.forEach((card, idx) => {
        const selecionada = gameState.selectedCards.includes(card);
        const cardEl = criarElementoCarta(card, { 
            classeExtra: selecionada ? "selected" : "", 
            onClick: selecionarCarta 
        });

        if (card._novaNaMao) {
            cardEl.classList.add("carta-entrando");
            cardEl.style.animationDelay = (idx * 0.08) + "s";
        }

        if (selecionada) {
            mesaContainer.appendChild(cardEl);
        } else {
            handContainer.appendChild(cardEl);
        }
    });

    gameState.hand.forEach(c => delete c._novaNaMao);
    
    const deckCountEl = document.getElementById("lbl-deck-count");
    if (deckCountEl) deckCountEl.innerText = gameState.deck.length;
}

function selecionarCarta(card) {
    const idx = gameState.selectedCards.indexOf(card);
    if (idx > -1) {
        gameState.selectedCards.splice(idx, 1);
        if (typeof pararSomPersonagem === "function") pararSomPersonagem();
        if (typeof tocarSfx === "function") tocarSfx("clique");
    } else if (gameState.selectedCards.length < 5) {
        gameState.selectedCards.push(card);
        if (typeof tocarSomPersonagem === "function") tocarSomPersonagem(card);
    }
    renderizarMão();
    calcularPontuacaoEmTempoReal();
}

// =============================================================================
// 4. SISTEMA DE DETECÇÃO DE MÃOS E CÁLCULO DE PONTUAÇÃO
// =============================================================================

function eDoGrupoCria(nome) {
    if (!nome) return false;
    if (typeof GRUPO_CRIA !== "undefined") {
        return GRUPO_CRIA.some(cria => nome.includes(cria) || cria.includes(nome));
    }
    return ["Biel", "Saches", "Roger", "Thiago", "Victor", "Anderson", "Valter", "Panda", "Rivotril"].some(cria => nome.includes(cria));
}

function detectarMelhorMaoEstatistica(nomes, colecoes) {
    const qtdGrupo = nomes.filter(n => eDoGrupoCria(n)).length;
    const qtdCancelados = typeof GRUPO_CANCELADOS !== "undefined" ? nomes.filter(n => GRUPO_CANCELADOS.includes(n)).length : 0;
    const qtdFamosos = typeof GRUPO_WEB_FAMOSOS !== "undefined" ? nomes.filter(n => GRUPO_WEB_FAMOSOS.includes(n)).length : 0;

    const qtdLolTotal = colecoes.filter(c => c === "lol").length;
    const qtdStreamerTotal = colecoes.filter(c => c === "streamer").length;
    const qtdMemeTotal = colecoes.filter(c => c === "meme_base" || c === "meme_raro").length;

    const temAdc = typeof GRUPO_ADCS !== "undefined" ? nomes.filter(n => GRUPO_ADCS.includes(n)).length : 0;
    const temTank = typeof GRUPO_TANKS !== "undefined" ? nomes.filter(n => GRUPO_TANKS.includes(n)).length : 0;
    const temMago = typeof GRUPO_MAGOS !== "undefined" ? nomes.filter(n => GRUPO_MAGOS.includes(n)).length : 0;

    const contagem = {}; 
    nomes.forEach(nome => contagem[nome] = (contagem[nome] || 0) + 1);
    const valoresRepetidos = Object.values(contagem).sort((a, b) => b - a);

    // 🥇 PRIORIDADE 1: COMBOS MÁXIMOS E MAIORES
    if (qtdGrupo >= 5) return "Panelinha da Call (Gank Máximo)";
    if (qtdGrupo === 4) return "Panelinha da Call (Quadra)";
    if (qtdGrupo === 3) return "Panelinha da Call (Trio)";
    
    // 🥈 PRIORIDADE 2: COMBOS PUROS DE CLASSE
    if (temTank >= 2 && temTank === nomes.length) return "Mão da Geladeira Brastemp";
    if (temMago >= 2 && temMago === nomes.length) return "Circo de Esquizofrenia";
    if (temAdc >= 2 && temAdc === nomes.length) return "Inimigos do Toque";
    if (qtdStreamerTotal >= 2 && qtdStreamerTotal === nomes.length) return "Sindicato dos Streamers";
    if (qtdCancelados >= 2 && qtdCancelados === nomes.length) return "Mão dos Cancelados";
    if (qtdFamosos >= 2 && qtdFamosos === nomes.length) return "Banda de Web-Famosos";

    // 🥉 PRIORIDADE 3: COMBOS DE MISTURA E POKER TRADICIONAL
    if (qtdStreamerTotal >= 1 && qtdMemeTotal >= 1) return "Combo do Clipe Viral";
    if (qtdLolTotal >= 3) return "Fila Solo Q Solo";
    
    if (valoresRepetidos[0] >= 4) return "Quadra Suprema";
    if (valoresRepetidos[0] === 3 && valoresRepetidos[1] === 2) return "Full House de Call";
    if (valoresRepetidos[0] >= 3) return "Trinca de Memes";
    
    if (nomes.some(n => n.includes("Biel")) && nomes.some(n => n.includes("Saches") || n.includes("Thiago"))) return "Noite de Overclock";
    if (nomes.some(n => n.includes("Victor")) && nomes.length > 1) return "Combo das Casadas";
    
    if (valoresRepetidos[0] === 2 && valoresRepetidos[1] === 2) return "Dois Pares";
    if (valoresRepetidos[0] === 2) return "Par de Amigos";
    
    return "Carta Alta";
}

function calcularPontuacaoEmTempoReal() {
    let baseChips = 0; 
    let baseMult = 0; 
    let multiplicadorFinalDoJoker = 1; 
    let nomeMaoDetectada = "Nenhuma";

    if (gameState.selectedCards.length > 0) {
        const nomes = gameState.selectedCards.map(c => c.nome || "");
        const colecoes = gameState.selectedCards.map(c => c.colecao || "");
        
        nomeMaoDetectada = detectarMelhorMaoEstatistica(nomes, colecoes);
        const statsMao = MAOS_POKER[nomeMaoDetectada] || { chips: 5, mult: 1 };
        
        baseChips += statsMao.chips; 
        baseMult += statsMao.mult;

        const cancelados = typeof GRUPO_CANCELADOS !== "undefined" ? GRUPO_CANCELADOS : [];
        const webFamosos = typeof GRUPO_WEB_FAMOSOS !== "undefined" ? GRUPO_WEB_FAMOSOS : [];
        const adcs = typeof GRUPO_ADCS !== "undefined" ? GRUPO_ADCS : [];
        const tanks = typeof GRUPO_TANKS !== "undefined" ? GRUPO_TANKS : [];
        const magos = typeof GRUPO_MAGOS !== "undefined" ? GRUPO_MAGOS : [];

        const contagemNomes = {}; 
        nomes.forEach(n => contagemNomes[n] = (contagemNomes[n] || 0) + 1);

        const contagemLol = {};
        gameState.selectedCards.forEach(c => { 
            if (c.colecao === "lol") contagemLol[c.nome] = (contagemLol[c.nome] || 0) + 1; 
        });
        const temTrincaMonoLol = Object.values(contagemLol).some(qtd => qtd >= 3);

        // 🔒 SISTEMA DE EXPURGO COM TRATAMENTO NUMÉRICO ANTI-NaN
        gameState.selectedCards.forEach(c => {
            let pertenceAoCombo = false;
            const cChips = Number(c.chips) || 0;
            const cChipsBonus = Number(c.chipsBonus) || 0;
            const cMultBonus = Number(c.multBonus) || 0;

            if (nomeMaoDetectada.startsWith("Panelinha da Call") && eDoGrupoCria(c.nome)) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Mão da Geladeira Brastemp" && tanks.includes(c.nome)) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Circo de Esquizofrenia" && magos.includes(c.nome)) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Inimigos do Toque" && adcs.includes(c.nome)) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Sindicato dos Streamers" && c.colecao === "streamer") pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Fila Solo Q Solo" && c.colecao === "lol") pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Combo do Clipe Viral" && (c.colecao === "streamer" || c.colecao === "meme_base" || c.colecao === "meme_raro")) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Banda de Web-Famosos" && webFamosos.includes(c.nome)) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Mão dos Cancelados" && cancelados.includes(c.nome)) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Noite de Overclock" && c.nome && ["Biel", "Saches", "Thiago"].some(x => c.nome.includes(x))) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Combo das Casadas" && c.nome && (c.nome.includes("Victor") || eDoGrupoCria(c.nome))) pertenceAoCombo = true;
            
            else if (nomeMaoDetectada === "Quadra Suprema" && contagemNomes[c.nome] >= 4) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Full House de Call" && (contagemNomes[c.nome] === 3 || contagemNomes[c.nome] === 2)) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Trinca de Memes" && contagemNomes[c.nome] >= 3) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Dois Pares" && contagemNomes[c.nome] === 2) pertenceAoCombo = true;
            else if (nomeMaoDetectada === "Par de Amigos" && contagemNomes[c.nome] === 2) pertenceAoCombo = true;
            
            else if (nomeMaoDetectada === "Carta Alta") {
                const valorTotal = (card) => (Number(card.chips) || 0) + (Number(card.chipsBonus) || 0);
                const maiorCard = gameState.selectedCards.reduce((prev, curr) => (valorTotal(prev) > valorTotal(curr)) ? prev : curr);
                if (c.uid === maiorCard.uid) pertenceAoCombo = true;
            }

            if (pertenceAoCombo) {
                baseChips += (cChips + cChipsBonus);
                baseMult += cMultBonus;
            }
        });

        // Sinergias Passivas Isoladas
        if (nomes.some(n => n.includes("Kid")) && nomes.some(n => n.includes("Anderson"))) { baseChips += 40; baseMult += 4; }
        if (nomes.some(n => n.includes("Roger")) && nomes.some(n => n.includes("Nego Di"))) { baseChips -= 15; baseMult += 6; }
        if (nomes.some(n => n.includes("Ednaldo"))) { baseMult = 0; } 
        if (nomes.some(n => n.includes("Bora Bill"))) { multiplicadorFinalDoJoker *= 1.4; }
        if (nomes.some(n => n.includes("Cellbit")) && gameState.selectedCards.length === 1) { baseMult += 6; }
        if (nomes.some(n => n.includes("Gaules"))) { baseChips += (gameState.discards * 5); }
        if (nomes.some(n => n.includes("Baiano")) && colecoes.includes("lol")) { baseMult += 6; }

        // Curingas da Loja
        gameState.ownedJokers.forEach(j => {
            if (j.id === "j_clutch" && gameState.selectedCards.length === 1) baseMult += 8;
            if (j.id === "j_tilt" && nomes.some(n => n.includes("Biel"))) multiplicadorFinalDoJoker *= 2.5;
            if (j.id === "j_olha_ele" && gameState.selectedCards.length >= 3) baseMult += 12;
            if (j.id === "j_bluepen") baseMult = 2;
            if (j.id === "j_sigma" && gameState.discards === gameState.startingDiscards) multiplicadorFinalDoJoker *= 2.2;
            if (j.id === "j_receba" && nomes.some(n => n.includes("Luva"))) baseChips *= 2.5;
            if (j.id === "j_crying_cat") baseChips += 75;
            if (j.id === "j_0_10" && nomes.some(n => n.includes("Yasuo"))) baseChips += 150;
            if (j.id === "j_md5" && nomes.some(n => n.includes("Valter"))) baseChips += 50;
            if (j.id === "j_outplay" && nomes.some(n => n.includes("Shaco") || n.includes("Teemo"))) baseMult += 6;
            if (j.id === "j_4_perfeito" && nomes.some(n => n.includes("Jhin")) && gameState.selectedCards.length === 4) baseMult += 50;
            if (j.id === "j_mono_champion" && temTrincaMonoLol) multiplicadorFinalDoJoker *= 2.5;
            if (j.id === "j_chat_restrito" && nomes.some(n => n.includes("Valter"))) baseChips += 80;
            if (j.id === "j_gank_cria" && colecoes.some(c => c.includes("cria")) && colecoes.includes("lol")) baseMult += 8;
        });
    }

    baseChips = Math.max(0, Math.floor(Number(baseChips) || 0));
    baseMult = Math.max(0, Number(baseMult) || 0) * multiplicadorFinalDoJoker;

    const elChips = document.getElementById("calc-chips");
    const elMult = document.getElementById("calc-mult");
    const elScoreBox = document.querySelector(".score-box");

    if (elChips) {
        if (elChips.innerText !== String(baseChips)) reiniciarAnimacao(elChips, "valor-pop");
        elChips.innerText = baseChips;
    }

    const multArredondado = `+${Math.round(baseMult)}`;
    if (elMult) {
        if (!elMult.innerText.startsWith(multArredondado)) reiniciarAnimacao(elMult, "valor-pop");

        elMult.classList.remove("mult-quente", "mult-fogo", "mult-lendario");
        if (elScoreBox) elScoreBox.classList.remove("score-box-fogo");

        let textoMult = multArredondado;
        if (baseMult >= 40) {
            elMult.classList.add("mult-lendario");
            if (elScoreBox) elScoreBox.classList.add("score-box-fogo");
            textoMult += " 🔥🔥";
        } else if (baseMult >= 20) {
            elMult.classList.add("mult-fogo");
            if (elScoreBox) elScoreBox.classList.add("score-box-fogo");
            textoMult += " 🔥";
        } else if (baseMult >= 8) {
            elMult.classList.add("mult-quente");
        }
        elMult.innerText = textoMult;
    }

    const lblMaoDetectada = document.getElementById("lbl-mao-detectada");
    if (lblMaoDetectada) lblMaoDetectada.innerText = nomeMaoDetectada;

    return { chips: baseChips, mult: baseMult, nomeMao: nomeMaoDetectada };
}

// =============================================================================
// 5. CICLO DE JOGO E NAVEGAÇÃO ENTRE ROUNDS
// =============================================================================

function initGame() {
    gameState.round = 1; 
    gameState.targetScore = obterMetaAnte(1); 
    gameState.currentScore = 0;
    gameState.money = 10; 
    gameState.hands = 4; 
    gameState.discards = 3; 
    gameState.startingDiscards = 3; 
    gameState.rerollCost = 3;
    gameState.ownedJokers = [];
    
    valoresExibidos = { score: 0, money: 10 };

    gameState.cartasDesbloqueadasRun = [];
    if (typeof POOL_INICIAL !== "undefined") {
        POOL_INICIAL.forEach(c => gameState.cartasDesbloqueadasRun.push({ ...c }));
    }
    
    if (typeof limparVitrineLoja === "function") limparVitrineLoja(); 
    
    montarBaralho(); 
    comprarCartas(); 
    atualizarInterface(); 
    renderizarJokersNaPartida();
    gerarPainelColaMaos();
}

function proximoRound() {
    alternarTela("tela-partida");
    gameState.round++;
    
    // Calcula dinamicamente a meta sem estourar o limite
    gameState.targetScore = obterMetaAnte(gameState.round);
    
    // 🧹 RESET DO ROUND
    gameState.currentScore = 0;
    valoresExibidos.score = 0;
    gameState.hands = 4;
    gameState.rerollCost = 3;
    gameState.hand = [];          
    gameState.selectedCards = []; 
    
    if (typeof limparVitrineLoja === "function") limparVitrineLoja();
    
    gameState.discards = gameState.ownedJokers.some(j => j.id === "j_crying_cat") ? 2 : 3;
    gameState.startingDiscards = gameState.discards;

    // Restaura botões
    const btnPlay = document.getElementById("btn-play");
    const btnDiscard = document.getElementById("btn-discard");
    if (btnPlay) btnPlay.style.display = "block";
    if (btnDiscard) btnDiscard.style.display = "block";

    // ✨ Limpeza da interface
    const lblMao = document.getElementById("lbl-mao-detectada");
    const logMsg = document.getElementById("log-msg");
    if (lblMao) lblMao.innerText = "Nenhuma";
    if (logMsg) logMsg.innerText = "Selecione as cartas para pontuar!";
    
    montarBaralho(); 
    comprarCartas(); 
    atualizarInterface();
    pararTodosEfeitos();
}

// =============================================================================
// 6. EVENT LISTENERS
// =============================================================================

document.getElementById("btn-iniciar")?.addEventListener("click", () => { 
    initGame(); 
    alternarTela("tela-partida"); 
});

document.getElementById("btn-continuar-loja")?.addEventListener("click", () => { 
    if (typeof renderizarLoja === "function") renderizarLoja(); 
    alternarTela("tela-loja"); 
});

document.getElementById("btn-proximo-round")?.addEventListener("click", () => { 
    proximoRound(); 
});

document.getElementById("btn-restart")?.addEventListener("click", () => { 
    initGame(); 
    alternarTela("tela-partida"); 
});

document.getElementById("btn-play")?.addEventListener("click", () => {
    const btnPlay = document.getElementById("btn-play");
    
    if (gameState.selectedCards.length === 0 || gameState.hands <= 0) {
        reiniciarAnimacao(btnPlay, "shake-erro");
        if (typeof tocarSfx === "function") tocarSfx("erro");
        return;
    }

    if (typeof tocarSfx === "function") tocarSfx("jogarMao");

    const cartasNaMesa = document.querySelectorAll("#mesa-jogada-container .card");
    cartasNaMesa.forEach((el, i) => {
        el.style.animationDelay = (i * 0.05) + "s";
        el.classList.add("carta-saindo");
    });

    setTimeout(() => {
        gameState.hands--;
        const pt = calcularPontuacaoEmTempoReal();
        const totalMão = Math.floor((Number(pt.chips) || 0) * (Number(pt.mult) || 0));
        gameState.currentScore += totalMão;

        const logMsg = document.getElementById("log-msg");
        if (logMsg) logMsg.innerText = `Jogou ${pt.nomeMao}! +${totalMão} pontos!`;

        if (pt.mult >= 20 && typeof tocarSfx === "function") tocarSfx("multFogo");

        // 🃏 Twisted Fate
        if (gameState.ownedJokers.some(j => j.id === "j_tf")) {
            const qtdLolJogados = gameState.selectedCards.filter(c => c.colecao === "lol").length;
            if (qtdLolJogados > 0) gameState.money += qtdLolJogados;
        }

        gameState.hand = gameState.hand.filter(c => !gameState.selectedCards.includes(c));
        gameState.selectedCards = [];

        if (gameState.currentScore >= gameState.targetScore) {
            const bonusBase = 3;
            const bonusMaos = gameState.hands;
            const bonusDescartes = gameState.discards;
            const linhas = [
                { label: "Recompensa Base", valor: bonusBase },
                { label: `✋ Mãos Poupadas (${gameState.hands})`, valor: bonusMaos },
                { label: `🃏 Descartes Poupados (${gameState.discards})`, valor: bonusDescartes }
            ];
            let total = bonusBase + bonusMaos + bonusDescartes;

            if (gameState.ownedJokers.some(j => j.id === "j_stonks") && gameState.currentScore >= gameState.targetScore * 1.5) {
                linhas.push({ label: "📈 STONKS (venceu com 1.5x a meta)", valor: 2 });
                total += 2;
            }

            gameState.money += total;
            if (logMsg) logMsg.innerText = "Selecione as cartas para pontuar!";
            if (typeof tocarSfx === "function") tocarSfx("vitoriaRodada");
            mostrarTelaResultado(linhas, total);
        } else if (gameState.hands <= 0 && gameState.currentScore < gameState.targetScore) {
            const finalScoreEl = document.getElementById("lbl-final-score");
            if (finalScoreEl) finalScoreEl.innerText = (Number(gameState.currentScore) || 0).toLocaleString();
            if (typeof tocarSfx === "function") tocarSfx("derrota");
            alternarTela("tela-gameover");
        } else {
            comprarCartas();
        }
        atualizarInterface();
    }, 400);
});

document.getElementById("btn-discard")?.addEventListener("click", () => {
    const btnDiscard = document.getElementById("btn-discard");
    if (gameState.selectedCards.length === 0 || gameState.discards <= 0) {
        reiniciarAnimacao(btnDiscard, "shake-erro");
        if (typeof tocarSfx === "function") tocarSfx("erro");
        return;
    }
    if (typeof tocarSfx === "function") tocarSfx("descartar");
    gameState.discards--;
    gameState.hand = gameState.hand.filter(c => !gameState.selectedCards.includes(c));
    gameState.selectedCards = [];
    comprarCartas();
    atualizarInterface();
});
