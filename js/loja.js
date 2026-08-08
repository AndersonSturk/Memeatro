// js/loja.js

// =========================================================================
// 🌐 VARIÁVEIS GLOBAIS DA LOJA
// =========================================================================
let vitrineJokers = [];
let vitrinePacks = [];
let vitrineUpgrades = [];
let cartasSorteadasTemporarias = [];
let packAtivoAberto = null;
let upgradeAtivo = null;

// =========================================================================
// 📦 CATÁLOGO DE PACKS DISPONÍVEIS NA LOJA (COM PESOS DE PROBABILIDADE)
// =========================================================================
const DADOS_PACKS = [
    { id: "p_lol", nome: "Booster Pack: League of Legends", desc: "Contém de 4 a 8 cartas aleatórias de Campeões do LoL.", preco: 5, pool: () => POOL_PACK_LOL, peso: 45 },
    { id: "p_streamer", nome: "Booster Pack: Sindicato dos Streamers", desc: "Contém de 4 a 8 cartas aleatórias da elite das Streams.", preco: 6, pool: () => POOL_PACK_STREAMERS, peso: 30 },
    { id: "p_raro", nome: "Booster Pack: Memes Lendários", desc: "Contém de 4 a 8 cartas aleatórias dos maiores caos da internet.", preco: 8, pool: () => POOL_PACK_MEMES_LENDARIOS, peso: 25 },
    { id: "p_cria_prime", nome: "Booster Pack: Gank dos Crias PRIME", desc: "Contém de 4 a 8 cartas EVOLUÍDAS e apelonas dos deuses da call!", preco: 15, pool: () => POOL_PACK_CRIA_PRIME, raro: true }
];

// =========================================================================
// 🛠️ FUNÇÕES DE GERENCIAMENTO DA VITRINE
// =========================================================================
function limparVitrineLoja() {
    vitrineJokers = [];
    vitrinePacks = [];
    vitrineUpgrades = [];
}

// 🎲 Função de sorteio ponderado para equilibrar aparição de pacotes
function sortearPackPonderado(packs) {
    const pesoTotal = packs.reduce((soma, p) => soma + (p.peso || 10), 0);
    let rand = Math.random() * pesoTotal;
    
    for (const pack of packs) {
        if (rand < (pack.peso || 10)) {
            return pack;
        }
        rand -= (pack.peso || 10);
    }
    return packs[0];
}

function gerarItensVitrine() {
    // 1. Sorteia 2 Coringas (Jokers)
    if (typeof LISTA_JOKERS !== "undefined" && LISTA_JOKERS.length > 0) {
        const copiaJokers = [...LISTA_JOKERS];
        copiaJokers.sort(() => Math.random() - 0.5);
        vitrineJokers = copiaJokers.slice(0, 2);
    } else {
        vitrineJokers = [];
    }

    // 2. Sorteia 1 Booster Pack
    const packsComuns = DADOS_PACKS.filter(p => !p.raro);
    const packPrime = DADOS_PACKS.find(p => p.raro);
    
    if (packPrime && Math.random() < 0.18) { // 🎯 Reduzido de 12% para 18%
        vitrinePacks = [{ ...packPrime }];
    } else {
        const packSorteado = sortearPackPonderado(packsComuns);
        vitrinePacks = [{ ...packSorteado }];
    }

    // 3. Sorteia 1 Kit de Upgrade
    if (typeof DADOS_UPGRADES !== "undefined" && DADOS_UPGRADES.length > 0) {
        const copiaUpgrades = [...DADOS_UPGRADES];
        copiaUpgrades.sort(() => Math.random() - 0.5);
        vitrineUpgrades = copiaUpgrades.slice(0, 1);
    } else {
        vitrineUpgrades = [];
    }
}

function renderizarLoja() {
    document.getElementById("shop-money").innerText = gameState.money;
    document.getElementById("lbl-reroll-cost").innerText = gameState.rerollCost;
    
    // Se a vitrine estiver vazia, gera novos itens
    if (vitrineJokers.length === 0 && vitrinePacks.length === 0 && vitrineUpgrades.length === 0) {
        gerarItensVitrine();
    }

    // 🃏 RENDERIZA CORINGAS EQUIPADOS E OPÇÃO DE VENDA
    renderizarJokersEquipadosLoja();

    const container = document.getElementById("shop-items-container");
    container.innerHTML = "";

    // 1. RENDERIZA OS CORINGAS DA VITRINE
    vitrineJokers.forEach((joker, index) => {
        const itemEl = document.createElement("div");
        itemEl.className = "shop-item-card";
        if (joker === null) {
            itemEl.innerHTML = `<div class="shop-item-title" style="color:#64748b;">[SOLD OUT]</div><div class="shop-item-desc">Coringa adquirido.</div>`;
        } else {
            itemEl.innerHTML = `
                <div class="shop-item-title">🃏 ${joker.titulo}</div>
                <div class="shop-item-desc">${joker.desc}</div>
                <button class="btn-buy" onclick="comprarJoker(${index})">Comprar (🪙 ${joker.preco})</button>
            `;
        }
        container.appendChild(itemEl);
    });

    // 2. RENDERIZA OS BOOSTER PACKS DE CARTAS
    vitrinePacks.forEach((pack, index) => {
        const itemEl = document.createElement("div");
        itemEl.className = "shop-item-card";
        
        if (pack && pack.raro) {
            itemEl.style.border = "2px solid #eab308";
            itemEl.style.boxShadow = "0 0 14px rgba(234, 179, 8, 0.5)";
        } else {
            itemEl.style.border = "2px solid #a855f7";
        }
        
        if (pack === null) {
            itemEl.innerHTML = `<div class="shop-item-title" style="color:#64748b;">[ABERTO]</div><div class="shop-item-desc">Cartas enviadas ao deck!</div>`;
        } else {
            const corTitulo = pack.raro ? "#fde047" : "#c084fc";
            const corBotao = pack.raro ? "#eab308" : "#a855f7";
            const corTextoBotao = pack.raro ? "#0f172a" : "white";

            itemEl.innerHTML = `
                <div class="shop-item-title" style="color:${corTitulo};">📦 ${pack.nome}</div>
                <div class="shop-item-desc">${pack.desc}</div>
                <button class="btn-buy" style="background:${corBotao}; color:${corTextoBotao}; font-weight:bold;" onclick="comprarPack(${index})">Abrir Pack (🪙 ${pack.preco})</button>
            `;
        }
        container.appendChild(itemEl);
    });

    // 3. RENDERIZA OS KITS DE UPGRADE
    vitrineUpgrades.forEach((upgrade, index) => {
        const itemEl = document.createElement("div");
        itemEl.className = "shop-item-card";
        itemEl.style.border = "2px solid #38bdf8";

        if (upgrade === null) {
            itemEl.innerHTML = `<div class="shop-item-title" style="color:#64748b;">[USADO]</div><div class="shop-item-desc">Upgrade aplicado a uma carta.</div>`;
        } else {
            itemEl.innerHTML = `
                <div class="shop-item-title" style="color:#38bdf8;">🔧 ${upgrade.nome}</div>
                <div class="shop-item-desc">${upgrade.desc}</div>
                <button class="btn-buy" style="background:#38bdf8; color:#0f172a;" onclick="comprarUpgrade(${index})">Comprar (🪙 ${upgrade.preco})</button>
            `;
        }
        container.appendChild(itemEl);
    });
}

// 💵 NOVA FUNÇÃO: RENDERIZA A ÁREA DE CORINGAS POSSUÍDOS COM BOTÃO DE VENDA
function renderizarJokersEquipadosLoja() {
    let containerLoja = document.getElementById("owned-jokers-shop-container");
    
    // Se o elemento container não existir na HTML da loja, cria dinamicamente acima da vitrine
    if (!containerLoja) {
        const shopItems = document.getElementById("shop-items-container");
        if (shopItems && shopItems.parentNode) {
            const wrapper = document.createElement("div");
            wrapper.id = "owned-jokers-shop-wrapper";
            wrapper.style.marginBottom = "20px";
            wrapper.style.padding = "10px";
            wrapper.style.background = "rgba(15, 23, 42, 0.6)";
            wrapper.style.borderRadius = "8px";
            wrapper.style.border = "1px solid #334155";
            wrapper.innerHTML = `
                <div style="font-weight:bold; color:#cbd5e1; margin-bottom:8px; display:flex; justify-between; align-items:center;">
                    <span>🃏 Meus Coringas Equipados (${gameState.ownedJokers.length}/5):</span>
                    <span style="font-size:0.8em; color:#94a3b8;">Clique em 'Vender' para liberar espaço</span>
                </div>
                <div id="owned-jokers-shop-container" style="display:flex; gap:10px; flex-wrap:wrap;"></div>
            `;
            shopItems.parentNode.insertBefore(wrapper, shopItems);
            containerLoja = document.getElementById("owned-jokers-shop-container");
        }
    }

    if (!containerLoja) return;
    containerLoja.innerHTML = "";

    if (gameState.ownedJokers.length === 0) {
        containerLoja.innerHTML = `<div style="color:#64748b; font-style:italic;">Nenhum Coringa equipado no momento.</div>`;
        return;
    }

    gameState.ownedJokers.forEach((joker, idx) => {
        const precoVenda = Math.max(1, Math.floor((joker.preco || 4) / 2));
        const itemEl = document.createElement("div");
        itemEl.style.cssText = "background:#1e293b; border:1px solid #475569; padding:8px 12px; border-radius:6px; min-width:140px; display:flex; flex-direction:column; justify-content:space-between; gap:6px;";
        itemEl.innerHTML = `
            <div>
                <div style="font-weight:bold; font-size:0.9em; color:#f8fafc;">🃏 ${joker.titulo}</div>
                <div style="font-size:0.75em; color:#94a3b8;">${joker.desc}</div>
            </div>
            <button onclick="venderJoker(${idx})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.8em;">
                Vender (+🪙 ${precoVenda})
            </button>
        `;
        containerLoja.appendChild(itemEl);
    });
}

// 💰 VENDER JOKER
function venderJoker(index) {
    const joker = gameState.ownedJokers[index];
    if (!joker) return;

    const precoVenda = Math.max(1, Math.floor((joker.preco || 4) / 2));
    gameState.money += precoVenda;
    gameState.ownedJokers.splice(index, 1);

    if (typeof tocarSfx === "function") tocarSfx("moeda");
    renderizarLoja();
    if (typeof renderizarJokersNaPartida === "function") renderizarJokersNaPartida();
}

function rerollLoja() {
    if (gameState.money >= gameState.rerollCost) {
        gameState.money -= gameState.rerollCost;
        gameState.rerollCost += 2; // Fica mais caro a cada reroll na mesma visita
        if (typeof tocarSfx === "function") tocarSfx("reroll");
        gerarItensVitrine();
        renderizarLoja();
    } else {
        if (typeof tocarSfx === "function") tocarSfx("erro");
        alert("Sem grana para atualizar a loja!");
    }
}

// =========================================================================
// 🛒 COMPRAS E AÇÕES NA LOJA
// =========================================================================
function comprarJoker(index) {
    const joker = vitrineJokers[index];
    if (!joker) return;
    
    if (gameState.money >= joker.preco) {
        if (gameState.ownedJokers.length >= 5) { 
            alert("Limite de 5 Coringas atingido! Venda um Coringa existente para comprar outro."); 
            return; 
        }
        gameState.money -= joker.preco;
        gameState.ownedJokers.push(joker);
        vitrineJokers[index] = null;
        if (typeof tocarSfx === "function") tocarSfx("comprar");
        renderizarLoja();
        if (typeof renderizarJokersNaPartida === "function") renderizarJokersNaPartida();
    } else {
        if (typeof tocarSfx === "function") tocarSfx("erro");
        alert("Sem grana!");
    }
}

function comprarPack(index) {
    const pack = vitrinePacks[index];
    if (!pack) return;

    const poolCartas = pack.pool();

    if (!poolCartas || poolCartas.length === 0) {
        alert("Erro: Este pacote está sem cartas cadastradas no baralho!");
        return;
    }

    if (gameState.money >= pack.preco) {
        gameState.money -= pack.preco;
        cartasSorteadasTemporarias = [];
        packAtivoAberto = pack;

        // 🎰 Sorteia entre 4 e 8 cartas
        const qtdCartas = 4 + Math.floor(Math.random() * 5);
        for (let i = 0; i < qtdCartas; i++) {
            const cartaSorteada = poolCartas[Math.floor(Math.random() * poolCartas.length)];
            gameState.cartasDesbloqueadasRun.push({ ...cartaSorteada });
            cartasSorteadasTemporarias.push(cartaSorteada);
        }

        // Exibe o painel de animação
        const overlay = document.getElementById("overlay-booster");
        const packClicavel = document.getElementById("pack-clicavel");
        
        if (overlay && packClicavel) {
            overlay.style.display = "flex";
            packClicavel.style.display = "flex";
            packClicavel.classList.remove("explodir", "pack-gold-glow");
            overlay.classList.remove("booster-prime-active");
            
            document.getElementById("booster-cartas-spawn").innerHTML = "";
            document.getElementById("btn-fechar-booster").style.display = "none";

            // 🔥 SE FOR O PACK PRIME: Aplica efeito e visual lendários
            if (pack.raro) {
                overlay.classList.add("booster-prime-active");
                packClicavel.classList.add("pack-gold-glow");
                document.getElementById("txt-titulo-booster").innerHTML = "👑 <span style='color:#fde047;'>PACOTE PRIME LENDÁRIO!</span> CLIQUE PARA RASGAR! 👑";
                if (typeof tocarSfx === "function") tocarSfx("sfxPrimeSurgir");
            } else {
                document.getElementById("txt-titulo-booster").innerText = "CLIQUE NO PACOTE PARA RASGAR!";
            }
        } else {
            alert(`📦 Pack comprado!\nCartas: ${cartasSorteadasTemporarias.map(c => c.nome).join(', ')}`);
        }

        vitrinePacks[index] = null;
        renderizarLoja();
    } else {
        if (typeof tocarSfx === "function") tocarSfx("erro");
        alert("Sem moedas suficientes para abrir o Booster!");
    }
}

function dispararAnimacaoPack() {
    const packEl = document.getElementById("pack-clicavel");
    const overlay = document.getElementById("overlay-booster");
    if (!packEl || packEl.classList.contains("explodir")) return;

    const ehPrime = packAtivoAberto && packAtivoAberto.raro;

    packEl.classList.add("explodir");
    
    // Tremor de impacto na tela
    if (overlay) {
        overlay.classList.add("shake-lendario");
        setTimeout(() => overlay.classList.remove("shake-lendario"), 400);
    }

    if (ehPrime) {
        document.getElementById("txt-titulo-booster").innerHTML = "⚡ <span style='color:#fde047;'>DESPERTANDO OS DEUSES DA CALL...</span> ⚡";
        if (typeof tocarSfx === "function") tocarSfx("abrirPacotePrime");
    } else {
        document.getElementById("txt-titulo-booster").innerText = "A RASGAR O PACOTE...";
        if (typeof tocarSfx === "function") tocarSfx("abrirPacote");
    }

    const spawnContainer = document.getElementById("booster-cartas-spawn");
    spawnContainer.innerHTML = "";

    // Injeta os cartões com visual diferenciado se for PRIME
    cartasSorteadasTemporarias.forEach((card, idx) => {
        const atraso = 0.3 + idx * 0.25;
        const classeExtraCard = ehPrime ? "carta-revelada-prime" : "carta-revelada";
        
        if (typeof criarElementoCarta === "function") {
            const cardEl = criarElementoCarta(card, { classeExtra: classeExtraCard });
            cardEl.style.animationDelay = atraso + "s";
            spawnContainer.appendChild(cardEl);
        }

        setTimeout(() => {
            if (typeof tocarSfx === "function") {
                if (ehPrime) tocarSfx("cartaLendariaReveal");
                else tocarSfx("cartaRevelada");
            }
        }, atraso * 1000);
    });

    // Libera o botão de fechar ao terminar
    setTimeout(() => {
        document.getElementById("btn-fechar-booster").style.display = "block";
        packEl.style.display = "none";
        
        if (ehPrime) {
            document.getElementById("txt-titulo-booster").innerHTML = "👑 <span style='color:#fde047; font-size:1.4em;'>🔥 PODER CRIA ABSOLUTO UNLOCKED! 🔥</span> 👑";
        } else {
            document.getElementById("txt-titulo-booster").innerText = "🔥 NOVAS CARTAS DESBLOQUEADAS! 🔥";
        }
    }, 1400);
}

function fecharOverlayBooster() {
    document.getElementById("overlay-booster").style.display = "none";
    cartasSorteadasTemporarias = [];
}

function comprarUpgrade(index) {
    const upgrade = vitrineUpgrades[index];
    if (!upgrade) return;
    if (gameState.money < upgrade.preco) { 
        if (typeof tocarSfx === "function") tocarSfx("erro"); 
        alert("Sem grana!"); 
        return; 
    }
    if (gameState.cartasDesbloqueadasRun.length === 0) { 
        if (typeof tocarSfx === "function") tocarSfx("erro"); 
        alert("Você não tem nenhuma carta no baralho ainda!"); 
        return; 
    }

    gameState.money -= upgrade.preco;
    vitrineUpgrades[index] = null;
    if (typeof tocarSfx === "function") tocarSfx("comprar");
    renderizarLoja();

    upgradeAtivo = upgrade;
    abrirSeletorDeCarta(upgrade);
}

function abrirSeletorDeCarta(upgrade) {
    document.getElementById("txt-titulo-upgrade").innerText = `🔧 ${upgrade.nome}: escolha uma carta do seu baralho`;
    const grid = document.getElementById("grid-upgrade-cartas");
    grid.innerHTML = "";

    gameState.cartasDesbloqueadasRun.forEach((card, idx) => {
        if (typeof criarElementoCarta === "function") {
            const cardEl = criarElementoCarta(card, { onClick: () => aplicarUpgrade(idx) });
            grid.appendChild(cardEl);
        }
    });

    document.getElementById("overlay-upgrade").style.display = "flex";
}

function aplicarUpgrade(idxCarta) {
    const card = gameState.cartasDesbloqueadasRun[idxCarta];

    if (upgradeAtivo.tipo === "chips") card.chipsBonus = (card.chipsBonus || 0) + upgradeAtivo.valor;
    else if (upgradeAtivo.tipo === "mult") card.multBonus = (card.multBonus || 0) + upgradeAtivo.valor;
    else if (upgradeAtivo.tipo === "clone") gameState.cartasDesbloqueadasRun.push({ ...card });

    if (typeof tocarSfx === "function") tocarSfx("moeda");
    upgradeAtivo = null;
    document.getElementById("overlay-upgrade").style.display = "none";
}
