// js/loja.js

let vitrineJokers = [];
let vitrinePacks = [];
let vitrineUpgrades = [];
let vitrinePlanetas = [];
let cartasSorteadasTemporarias = [];
let packAtivoAberto = null;
let upgradeAtivo = null;

const DADOS_PACKS = [
    { id: "p_lol", nome: "Booster Pack: League of Legends", desc: "Contém de 4 a 8 cartas aleatórias de Campeões do LoL.", preco: 5, pool: () => typeof POOL_PACK_LOL !== "undefined" ? POOL_PACK_LOL : [], peso: 45 },
    { id: "p_streamer", nome: "Booster Pack: Sindicato dos Streamers", desc: "Contém de 4 a 8 cartas aleatórias da elite das Streams.", preco: 6, pool: () => typeof POOL_PACK_STREAMERS !== "undefined" ? POOL_PACK_STREAMERS : [], peso: 30 },
    { id: "p_raro", nome: "Booster Pack: Memes Lendários", desc: "Contém de 4 a 8 cartas aleatórias dos maiores caos da internet.", preco: 8, pool: () => typeof POOL_PACK_MEMES_LENDARIOS !== "undefined" ? POOL_PACK_MEMES_LENDARIOS : [], peso: 25 },
    { id: "p_cria_prime", nome: "Booster Pack: Gank dos Crias PRIME", desc: "Contém de 4 a 8 cartas EVOLUÍDAS e apelonas dos deuses da call!", preco: 15, pool: () => typeof POOL_PACK_CRIA_PRIME !== "undefined" ? POOL_PACK_CRIA_PRIME : [], raro: true }
];

function limparVitrineLoja() {
    vitrineJokers = [];
    vitrinePacks = [];
    vitrineUpgrades = [];
    vitrinePlanetas = [];
}

function sortearPackPonderado(packs) {
    const pesoTotal = packs.reduce((soma, p) => soma + (p.peso || 10), 0);
    let rand = Math.random() * pesoTotal;
    
    for (const pack of packs) {
        if (rand < (pack.peso || 10)) return pack;
        rand -= (pack.peso || 10);
    }
    return packs[0];
}

function gerarItensVitrine() {
    if (typeof LISTA_JOKERS !== "undefined" && LISTA_JOKERS.length > 0) {
        const copiaJokers = [...LISTA_JOKERS];
        copiaJokers.sort(() => Math.random() - 0.5);
        vitrineJokers = copiaJokers.slice(0, 2);
    }

    const packsComuns = DADOS_PACKS.filter(p => !p.raro);
    const packPrime = DADOS_PACKS.find(p => p.raro);
    
    if (packPrime && Math.random() < 0.18) {
        vitrinePacks = [{ ...packPrime }];
    } else {
        vitrinePacks = [{ ...sortearPackPonderado(packsComuns) }];
    }

    if (typeof DADOS_UPGRADES !== "undefined" && DADOS_UPGRADES.length > 0) {
        const copiaUpgrades = [...DADOS_UPGRADES];
        copiaUpgrades.sort(() => Math.random() - 0.5);
        vitrineUpgrades = copiaUpgrades.slice(0, 1);
    }

    if (typeof CARTAS_PLANETA !== "undefined" && CARTAS_PLANETA.length > 0) {
        const copiaPlanetas = [...CARTAS_PLANETA];
        copiaPlanetas.sort(() => Math.random() - 0.5);
        vitrinePlanetas = copiaPlanetas.slice(0, 1);
    }
}

function renderizarLoja() {
    const elMoney = document.getElementById("shop-money");
    const elReroll = document.getElementById("lbl-reroll-cost");
    
    if (elMoney) elMoney.innerText = gameState.money;
    if (elReroll) elReroll.innerText = gameState.rerollCost;
    
    if (vitrineJokers.length === 0 && vitrinePacks.length === 0 && vitrineUpgrades.length === 0 && vitrinePlanetas.length === 0) {
        gerarItensVitrine();
    }

    const container = document.getElementById("shop-items-container") || document.querySelector(".shop-container");
    if (!container) return;

    container.innerHTML = "";

    // 1. Jokers
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

    // 2. Booster Packs
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

    // 3. Upgrades
    vitrineUpgrades.forEach((upgrade, index) => {
        const itemEl = document.createElement("div");
        itemEl.className = "shop-item-card";
        itemEl.style.border = "2px solid #38bdf8";

        if (upgrade === null) {
            itemEl.innerHTML = `<div class="shop-item-title" style="color:#64748b;">[USADO]</div><div class="shop-item-desc">Upgrade aplicado.</div>`;
        } else {
            itemEl.innerHTML = `
                <div class="shop-item-title" style="color:#38bdf8;">🔧 ${upgrade.nome}</div>
                <div class="shop-item-desc">${upgrade.desc}</div>
                <button class="btn-buy" style="background:#38bdf8; color:#0f172a;" onclick="comprarUpgrade(${index})">Comprar (🪙 ${upgrade.preco})</button>
            `;
        }
        container.appendChild(itemEl);
    });

    // 4. Planetas
    vitrinePlanetas.forEach((planeta, index) => {
        const itemEl = document.createElement("div");
        itemEl.className = "shop-item-card";
        itemEl.style.border = "2px solid #34d399";

        if (planeta === null) {
            itemEl.innerHTML = `<div class="shop-item-title" style="color:#64748b;">[USADO]</div><div class="shop-item-desc">Nível de mão aumentado.</div>`;
        } else {
            itemEl.innerHTML = `
                <div class="shop-item-title" style="color:#34d399;">🪐 ${planeta.nome}</div>
                <div class="shop-item-desc">${planeta.desc}</div>
                <button class="btn-buy" style="background:#34d399; color:#0f172a;" onclick="comprarPlaneta(${index})">Comprar (🪙 ${planeta.preco})</button>
            `;
        }
        container.appendChild(itemEl);
    });

    renderizarJokersEquipadosLoja();
}

function renderizarJokersEquipadosLoja() {
    let containerLoja = document.getElementById("owned-jokers-shop-container");
    
    if (!document.getElementById("owned-jokers-shop-wrapper")) {
        const shopBody = document.querySelector(".shop-container");
        if (shopBody && shopBody.children.length > 0) {
            const wrapper = document.createElement("div");
            wrapper.id = "owned-jokers-shop-wrapper";
            wrapper.style.marginBottom = "20px";
            wrapper.style.padding = "10px";
            wrapper.style.background = "rgba(15, 23, 42, 0.6)";
            wrapper.style.borderRadius = "8px";
            wrapper.style.border = "1px solid #334155";
            wrapper.innerHTML = `
                <div style="font-weight:bold; color:#cbd5e1; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span>🃏 Meus Coringas Equipados (${gameState.ownedJokers ? gameState.ownedJokers.length : 0}/5):</span>
                    <span style="font-size:0.8em; color:#94a3b8;">Clique em 'Vender' para liberar espaço</span>
                </div>
                <div id="owned-jokers-shop-container" style="display:flex; gap:10px; flex-wrap:wrap;"></div>
            `;
            shopBody.insertBefore(wrapper, shopBody.children[0]);
            containerLoja = document.getElementById("owned-jokers-shop-container");
        }
    }

    if (!containerLoja) return;
    containerLoja.innerHTML = "";

    if (!gameState.ownedJokers || gameState.ownedJokers.length === 0) {
        containerLoja.innerHTML = `<div style="color:#64748b; font-style:italic;">Nenhum Coringa equipado no momento.</div>`;
        return;
    }

    gameState.ownedJokers.forEach((joker, idx) => {
        const precoVenda = Math.max(1, Math.floor((joker.preco || 4) / 2));
        const itemEl = document.createElement("div");
        itemEl.style.cssText = "background:#1e293b; border:1px solid #475569; padding:8px 12px; border-radius:6px; min-width:140px; display:flex; flex-direction:column; justify-content:space-between; gap:6px;";
        itemEl.innerHTML = `
            <div>
                <div class="shop-item-title-only" style="justify-content: flex-start; color: #f8fafc;">🃏 ${joker.titulo}</div>
                <div class="shop-item-desc-hidden">${joker.desc}</div>
            </div>
            <button onclick="venderJoker(${idx})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.8em;">
                Vender (+🪙 ${precoVenda})
            </button>
        `;
        containerLoja.appendChild(itemEl);
    });
}

function venderJoker(index) {
    if (!gameState.ownedJokers || !gameState.ownedJokers[index]) return;

    const joker = gameState.ownedJokers[index];
    const precoVenda = Math.max(1, Math.floor((joker.preco || 4) / 2));
    gameState.money += precoVenda;
    gameState.ownedJokers.splice(index, 1);

    if (typeof tocarSfx === "function") tocarSfx("moeda");
    renderizarLoja();
    if (typeof renderizarJokersNaPartida === "function") renderizarJokersNaPartida();
    if (typeof atualizarInterface === "function") atualizarInterface();
}

function rerollLoja() {
    if (gameState.money >= gameState.rerollCost) {
        gameState.money -= gameState.rerollCost;
        gameState.rerollCost += 2;
        if (typeof tocarSfx === "function") tocarSfx("reroll");
        
        limparVitrineLoja();
        gerarItensVitrine();
        renderizarLoja();
        if (typeof atualizarInterface === "function") atualizarInterface();
    } else {
        if (typeof tocarSfx === "function") tocarSfx("erro");
        alert("Sem moedas para atualizar a loja!");
    }
}

function comprarJoker(index) {
    const joker = vitrineJokers[index];
    if (!joker) return;
    
    if (gameState.money >= joker.preco) {
        if (gameState.ownedJokers.length >= 5) { 
            alert("Limite de 5 Coringas atingido! Venda um Coringa existente primeiro."); 
            return; 
        }
        gameState.money -= joker.preco;
        gameState.ownedJokers.push(joker);
        vitrineJokers[index] = null;
        if (typeof tocarSfx === "function") tocarSfx("comprar");
        renderizarLoja();
        if (typeof renderizarJokersNaPartida === "function") renderizarJokersNaPartida();
        if (typeof atualizarInterface === "function") atualizarInterface();
    } else {
        if (typeof tocarSfx === "function") tocarSfx("erro");
        alert("Sem moedas suficientes!");
    }
}

function comprarPack(index) {
    const pack = vitrinePacks[index];
    if (!pack) return;

    const poolCartas = pack.pool();

    if (!poolCartas || poolCartas.length === 0) {
        alert("Erro: Este pacote não possui cartas configuradas!");
        return;
    }

    if (gameState.money >= pack.preco) {
        gameState.money -= pack.preco;
        cartasSorteadasTemporarias = [];
        packAtivoAberto = pack;

        const qtdCartas = 4 + Math.floor(Math.random() * 5);
        for (let i = 0; i < qtdCartas; i++) {
            const cartaSorteada = poolCartas[Math.floor(Math.random() * poolCartas.length)];
            gameState.cartasDesbloqueadasRun.push({ ...cartaSorteada });
            cartasSorteadasTemporarias.push(cartaSorteada);
        }

        const overlay = document.getElementById("overlay-booster");
        const packClicavel = document.getElementById("pack-clicavel");
        
        if (overlay && packClicavel) {
            overlay.style.display = "flex";
            packClicavel.style.display = "flex";
            packClicavel.classList.remove("explodir", "pack-gold-glow");
            overlay.classList.remove("booster-prime-active");
            
            const spawnContainer = document.getElementById("booster-cartas-spawn");
            if (spawnContainer) spawnContainer.innerHTML = "";
            const btnFechar = document.getElementById("btn-fechar-booster");
            if (btnFechar) btnFechar.style.display = "none";

            const txtTitulo = document.getElementById("txt-titulo-booster");
            if (txtTitulo) {
                if (pack.raro) {
                    overlay.classList.add("booster-prime-active");
                    packClicavel.classList.add("pack-gold-glow");
                    txtTitulo.innerHTML = "👑 <span style='color:#fde047;'>PACOTE PRIME LENDÁRIO!</span> CLIQUE PARA RASGAR! 👑";
                } else {
                    txtTitulo.innerText = "CLIQUE NO PACOTE PARA RASGAR!";
                }
            }
        } else {
            alert(`📦 Pack comprado!\nCartas adicionadas: ${cartasSorteadasTemporarias.map(c => c.nome).join(', ')}`);
        }

        vitrinePacks[index] = null;
        renderizarLoja();
        if (typeof atualizarInterface === "function") atualizarInterface();
    } else {
        if (typeof tocarSfx === "function") tocarSfx("erro");
        alert("Sem moedas suficientes para abrir o Booster!");
    }
}

function comprarPlaneta(index) {
    const planeta = vitrinePlanetas[index];
    if (!planeta) return;

    if (gameState.money >= planeta.preco) {
        gameState.money -= planeta.preco;
        
        const alvo = planeta.alvoMao;
        if (typeof MAOS_POKER !== "undefined" && MAOS_POKER[alvo]) {
            MAOS_POKER[alvo].chips += planeta.bonus.chips;
            MAOS_POKER[alvo].mult += planeta.bonus.mult;
        }

        vitrinePlanetas[index] = null;
        if (typeof tocarSfx === "function") tocarSfx("comprar");
        if (typeof gerarPainelColaMaos === "function") gerarPainelColaMaos();

        alert(`🪐 ${planeta.nome} Usado!\n+${planeta.bonus.chips} Chips e +${planeta.bonus.mult} Mult para '${alvo}'.`);
        renderizarLoja();
        if (typeof atualizarInterface === "function") atualizarInterface();
    } else {
        if (typeof tocarSfx === "function") tocarSfx("erro");
        alert("Sem moedas suficientes!");
    }
}

function dispararAnimacaoPack() {
    const packEl = document.getElementById("pack-clicavel");
    const overlay = document.getElementById("overlay-booster");
    if (!packEl || packEl.classList.contains("explodir")) return;

    const ehPrime = packAtivoAberto && packAtivoAberto.raro;

    packEl.classList.add("explodir");
    
    if (overlay) {
        overlay.classList.add("shake-lendario");
        setTimeout(() => overlay.classList.remove("shake-lendario"), 400);
    }

    const txtTitulo = document.getElementById("txt-titulo-booster");
    if (txtTitulo) {
        if (ehPrime) {
            txtTitulo.innerHTML = "⚡ <span style='color:#fde047;'>DESPERTANDO OS DEUSES DA CALL...</span> ⚡";
            if (typeof tocarSfx === "function") tocarSfx("abrirPacotePrime");
        } else {
            txtTitulo.innerText = "RASGANDO O PACOTE...";
            if (typeof tocarSfx === "function") tocarSfx("abrirPacote");
        }
    }

    const spawnContainer = document.getElementById("booster-cartas-spawn");
    if (spawnContainer) spawnContainer.innerHTML = "";

    cartasSorteadasTemporarias.forEach((card, idx) => {
        const atraso = 0.3 + idx * 0.25;
        const classeExtraCard = ehPrime ? "carta-revelada-prime" : "carta-revelada";
        
        if (typeof criarElementoCarta === "function" && spawnContainer) {
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

    setTimeout(() => {
        const btnFechar = document.getElementById("btn-fechar-booster");
        if (btnFechar) btnFechar.style.display = "block";
        packEl.style.display = "none";
        
        if (txtTitulo) {
            if (ehPrime) {
                txtTitulo.innerHTML = "👑 <span style='color:#fde047; font-size:1.4em;'>🔥 PODER CRIA ABSOLUTO DESBLOQUEADO! 🔥</span> 👑";
            } else {
                txtTitulo.innerText = "🔥 NOVAS CARTAS DESBLOQUEADAS! 🔥";
            }
        }
    }, 1400);
}

function fecharOverlayBooster() {
    const overlay = document.getElementById("overlay-booster");
    if (overlay) overlay.style.display = "none";
    cartasSorteadasTemporarias = [];
}

function comprarUpgrade(index) {
    const upgrade = vitrineUpgrades[index];
    if (!upgrade) return;
    if (gameState.money < upgrade.preco) { 
        if (typeof tocarSfx === "function") tocarSfx("erro"); 
        alert("Sem moedas suficientes!"); 
        return; 
    }
    if (gameState.cartasDesbloqueadasRun.length === 0) { 
        if (typeof tocarSfx === "function") tocarSfx("erro"); 
        alert("Você não possui cartas no baralho no momento!"); 
        return; 
    }

    gameState.money -= upgrade.preco;
    vitrineUpgrades[index] = null;
    if (typeof tocarSfx === "function") tocarSfx("comprar");
    renderizarLoja();
    if (typeof atualizarInterface === "function") atualizarInterface();

    upgradeAtivo = upgrade;
    abrirSeletorDeCarta(upgrade);
}

function abrirSeletorDeCarta(upgrade) {
    const tituloEl = document.getElementById("txt-titulo-upgrade");
    if (tituloEl) tituloEl.innerText = `🔧 ${upgrade.nome}: escolha uma carta do seu baralho`;
    
    const grid = document.getElementById("grid-upgrade-cartas");
    if (!grid) return;
    grid.innerHTML = "";

    gameState.cartasDesbloqueadasRun.forEach((card, idx) => {
        if (typeof criarElementoCarta === "function") {
            const cardEl = criarElementoCarta(card, { onClick: () => aplicarUpgrade(idx) });
            grid.appendChild(cardEl);
        }
    });

    const overlay = document.getElementById("overlay-upgrade");
    if (overlay) overlay.style.display = "flex";
}

function aplicarUpgrade(idxCarta) {
    const card = gameState.cartasDesbloqueadasRun[idxCarta];
    if (!card || !upgradeAtivo) return;

    if (upgradeAtivo.tipo === "chips") card.chipsBonus = (card.chipsBonus || 0) + upgradeAtivo.valor;
    else if (upgradeAtivo.tipo === "mult") card.multBonus = (card.multBonus || 0) + upgradeAtivo.valor;
    else if (upgradeAtivo.tipo === "clone") gameState.cartasDesbloqueadasRun.push({ ...card });

    if (typeof tocarSfx === "function") tocarSfx("moeda");
    upgradeAtivo = null;
    const overlay = document.getElementById("overlay-upgrade");
    if (overlay) overlay.style.display = "none";
}

// 🔥 ALTAR DE FUSÃO DE CARTAS
function abrirAltarDeFusao() {
    let overlay = document.getElementById("overlay-altar");
    
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "overlay-altar";
        overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); backdrop-filter:blur(5px); display:none; justify-content:center; align-items:center; z-index:9999;";
        
        overlay.innerHTML = `
            <div class="altar-painel" style="background:#0f172a; border:2px solid #f59e0b; border-radius:12px; padding:24px; max-width:720px; width:95%; max-height:85vh; overflow-y:auto; box-shadow:0 0 25px rgba(245,158,11,0.3); color:#f8fafc;">
                <div class="altar-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #334155; padding-bottom:10px;">
                    <div class="altar-titulo" style="font-size:1.4rem; font-weight:bold; color:#fbbf24;">🔥 Altar de Fusão 🔥</div>
                    <button class="altar-fechar" style="background:none; border:none; color:#94a3b8; font-size:1.5rem; cursor:pointer;" onclick="fecharAltarDeFusao()">✕</button>
                </div>
                <div class="altar-desc" style="color:#94a3b8; font-size:0.9rem; margin-bottom:12px;">
                    <b>Idênticas</b>: fortalece a carta (+25 Chips, +4 Mult)<br>
                    <b>Diferentes</b>: cria FUSÃO LENDÁRIA com as duas fotos originais lado a lado<br>
                    <b>Mesmo grupo</b>: fusão ainda mais forte!
                </div>
                <div id="selecao-fusao" style="display:flex; gap:12px; justify-content:center; margin-bottom:16px; min-height:120px; align-items:center; background:#1e293b; border-radius:8px; padding:10px;">
                    <div id="slot-fusao-1" style="width:100px; height:140px; border:2px dashed #475569; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#64748b; font-size:0.8rem;">1ª carta</div>
                    <div style="font-size:1.5rem; color:#fbbf24;">+</div>
                    <div id="slot-fusao-2" style="width:100px; height:140px; border:2px dashed #475569; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#64748b; font-size:0.8rem;">2ª carta</div>
                </div>
                <button id="btn-confirmar-fusao" onclick="confirmarFusaoSelecionada()" style="display:none; width:100%; background:linear-gradient(135deg,#f59e0b,#d97706); color:#0f172a; font-weight:bold; border:none; padding:12px; border-radius:8px; cursor:pointer; margin-bottom:16px; font-size:1rem;">
                    🔀 CONFIRMAR FUSÃO
                </button>
                <div class="altar-grid" id="grid-altar-cartas" style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center;"></div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    window._fusaoSelecionada = [];
    renderizarAltar();
    overlay.style.display = "flex";
}

function fecharAltarDeFusao() {
    const overlay = document.getElementById("overlay-altar");
    if (overlay) overlay.style.display = "none";
    window._fusaoSelecionada = [];
}

function renderizarAltar() {
    const grid = document.getElementById("grid-altar-cartas");
    if (!grid) return;
    grid.innerHTML = "";

    atualizarSlotsFusao();

    if (!gameState.cartasDesbloqueadasRun || gameState.cartasDesbloqueadasRun.length < 2) {
        grid.innerHTML = `<div style="color:#64748b; padding:20px; font-style:italic;">Você precisa de pelo menos 2 cartas para fundir.</div>`;
        return;
    }

    gameState.cartasDesbloqueadasRun.forEach((card, idx) => {
        const container = document.createElement("div");
        container.style.cssText = "background:#1e293b; border:1px solid #475569; padding:8px; border-radius:8px; cursor:pointer; transition:0.2s;";
        container.onmouseover = () => container.style.borderColor = "#f59e0b";
        container.onmouseout = () => container.style.borderColor = "#475569";

        const cardEl = criarElementoCarta(card, { classeExtra: "pequena" });
        container.appendChild(cardEl);

        container.onclick = () => selecionarCartaParaFusao(idx);
        grid.appendChild(container);
    });
}

function selecionarCartaParaFusao(idx) {
    if (!window._fusaoSelecionada) window._fusaoSelecionada = [];

    const jaSelecionada = window._fusaoSelecionada.indexOf(idx);
    if (jaSelecionada !== -1) {
        window._fusaoSelecionada.splice(jaSelecionada, 1);
    } else {
        if (window._fusaoSelecionada.length >= 2) {
            window._fusaoSelecionada.shift();
        }
        window._fusaoSelecionada.push(idx);
    }
    atualizarSlotsFusao();
}

function atualizarSlotsFusao() {
    const slot1 = document.getElementById("slot-fusao-1");
    const slot2 = document.getElementById("slot-fusao-2");
    const btn = document.getElementById("btn-confirmar-fusao");
    if (!slot1 || !slot2) return;

    const sel = window._fusaoSelecionada || [];

    if (sel[0] !== undefined && gameState.cartasDesbloqueadasRun[sel[0]]) {
        const c = gameState.cartasDesbloqueadasRun[sel[0]];
        slot1.innerHTML = "";
        slot1.appendChild(criarElementoCarta(c, { classeExtra: "pequena" }));
        slot1.style.border = "2px solid #f59e0b";
    } else {
        slot1.innerHTML = "1ª carta";
        slot1.style.border = "2px dashed #475569";
    }

    if (sel[1] !== undefined && gameState.cartasDesbloqueadasRun[sel[1]]) {
        const c = gameState.cartasDesbloqueadasRun[sel[1]];
        slot2.innerHTML = "";
        slot2.appendChild(criarElementoCarta(c, { classeExtra: "pequena" }));
        slot2.style.border = "2px solid #f59e0b";
    } else {
        slot2.innerHTML = "2ª carta";
        slot2.style.border = "2px dashed #475569";
    }

    if (btn) {
        if (sel.length === 2) {
            if (typeof gameState.fusoesRealizadas !== "number") gameState.fusoesRealizadas = 0;
            const custo = 8 + (gameState.fusoesRealizadas * 4);
            btn.innerText = `🔀 CONFIRMAR FUSÃO (🪙 ${custo})`;
            btn.style.display = "block";
            if ((gameState.money || 0) < custo) {
                btn.style.opacity = "0.5";
                btn.style.cursor = "not-allowed";
            } else {
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
            }
        } else {
            btn.style.display = "none";
        }
    }
}

function confirmarFusaoSelecionada() {
    const sel = window._fusaoSelecionada || [];
    if (sel.length !== 2) return;

    const cartaA = gameState.cartasDesbloqueadasRun[sel[0]];
    const cartaB = gameState.cartasDesbloqueadasRun[sel[1]];
    if (!cartaA || !cartaB) return;

    if (typeof gameState.fusoesRealizadas !== "number") gameState.fusoesRealizadas = 0;
    const custo = 8 + (gameState.fusoesRealizadas * 4);

    if ((gameState.money || 0) < custo) {
        alert(`Fusão custa 🪙 ${custo}. Você tem apenas 🪙 ${gameState.money || 0}.`);
        return;
    }

    gameState.money -= custo;
    gameState.fusoesRealizadas += 1;

    const indices = sel.slice().sort((a,b) => b - a);
    indices.forEach(i => gameState.cartasDesbloqueadasRun.splice(i, 1));

    if (cartaA.nome === cartaB.nome) {
        const nova = { ...cartaA };
        nova.chipsBonus = (nova.chipsBonus || 0) + 25;
        nova.multBonus = (nova.multBonus || 0) + 4;
        gameState.cartasDesbloqueadasRun.push(nova);
    } else {
        if (typeof criarCartaFundida === "function") {
            const fundida = criarCartaFundida(cartaA, cartaB);
            gameState.cartasDesbloqueadasRun.push(fundida);
        } else {
            const fundida = {
                nome: `${cartaA.nome.split(" ")[0]} + ${cartaB.nome.split(" ")[0]}`,
                meme: "FUSÃO LENDÁRIA",
                foto: cartaA.foto,
                fotoA: cartaA.foto,
                fotoB: cartaB.foto,
                chips: 60,
                chipsBonus: 30,
                multBonus: 8,
                colecao: "fusao"
            };
            gameState.cartasDesbloqueadasRun.push(fundida);
        }
    }

    if (typeof tocarSfx === "function") tocarSfx("multFogo");
    if (typeof atualizarInterface === "function") atualizarInterface();
    window._fusaoSelecionada = [];
    renderizarAltar();
}

function abrirAltarDeSacrificio() {
    let overlay = document.getElementById("overlay-sacrificio");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "overlay-sacrificio";
        overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); backdrop-filter:blur(5px); display:none; justify-content:center; align-items:center; z-index:9999;";

        overlay.innerHTML = `
            <div class="altar-painel" style="background:#18181b; border:2px solid #ef4444; border-radius:12px; padding:24px; max-width:700px; width:90%; max-height:85vh; overflow-y:auto; box-shadow:0 0 25px rgba(239,68,68,0.3); color:#f8fafc;">
                <div class="altar-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #3f3f46; padding-bottom:10px;">
                    <div class="altar-titulo" style="font-size:1.4rem; font-weight:bold; color:#f87171;">💀 Altar do Sacrifício 💀</div>
                    <button class="altar-fechar" style="background:none; border:none; color:#94a3b8; font-size:1.5rem; cursor:pointer;" onclick="fecharAltarDeSacrificio()">✕</button>
                </div>
                <div class="altar-desc" style="color:#a1a1aa; font-size:0.9rem; margin-bottom:16px;">
                    Escolha uma carta para <b style="color:#ef4444;">DESTRUIR PERMANENTEMENTE</b> e passar <b style="color:#38bdf8;">+15 Chips</b> e <b style="color:#f87171;">+3 Mult</b> a outra carta aleatória.
                </div>
                <div class="altar-grid" id="grid-sacrificio-cartas" style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center;"></div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    renderizarSacrificio();
    overlay.style.display = "flex";
}

function fecharAltarDeSacrificio() {
    const overlay = document.getElementById("overlay-sacrificio");
    if (overlay) overlay.style.display = "none";
}

function renderizarSacrificio() {
    const grid = document.getElementById("grid-sacrificio-cartas");
    if (!grid) return;
    grid.innerHTML = "";

    if (!gameState.cartasDesbloqueadasRun || gameState.cartasDesbloqueadasRun.length <= 1) {
        grid.innerHTML = `<div style="color:#94a3b8; padding:20px; font-style:italic;">Você precisa de pelo menos 2 cartas no baralho para realizar um sacrifício.</div>`;
        return;
    }

    gameState.cartasDesbloqueadasRun.forEach((card, idx) => {
        const containerItem = document.createElement("div");
        containerItem.style.cssText = "background:#27272a; border:1px solid #3f3f46; padding:10px; border-radius:8px; display:flex; flex-direction:column; align-items:center; gap:8px;";

        const cardEl = typeof criarElementoCarta === "function" ? criarElementoCarta(card) : document.createElement("div");
        if (typeof criarElementoCarta !== "function") cardEl.innerText = card.nome;
        
        const btnSacrificar = document.createElement("button");
        btnSacrificar.style.cssText = "background:#dc2626; color:white; font-weight:bold; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; width:100%;";
        btnSacrificar.innerText = "Sacrificar 💀";
        btnSacrificar.onclick = () => executarSacrificio(idx);

        containerItem.appendChild(cardEl);
        containerItem.appendChild(btnSacrificar);
        grid.appendChild(containerItem);
    });
}

function executarSacrificio(indexSacrificado) {
    if (!gameState.cartasDesbloqueadasRun || gameState.cartasDesbloqueadasRun.length <= 1) return;

    const cartaSacrificada = gameState.cartasDesbloqueadasRun[indexSacrificado];
    gameState.cartasDesbloqueadasRun.splice(indexSacrificado, 1);

    const idxBeneficiada = Math.floor(Math.random() * gameState.cartasDesbloqueadasRun.length);
    const cartaBeneficiada = gameState.cartasDesbloqueadasRun[idxBeneficiada];

    cartaBeneficiada.chipsBonus = (cartaBeneficiada.chipsBonus || 0) + 15;
    cartaBeneficiada.multBonus = (cartaBeneficiada.multBonus || 0) + 3;

    if (typeof tocarSfx === "function") tocarSfx("derrota");
    
    alert(`🔥 ${cartaSacrificada.nome} foi sacrificado!\n✨ ${cartaBeneficiada.nome} recebeu +15 Chips e +3 Mult!`);
    
    renderizarSacrificio();
}