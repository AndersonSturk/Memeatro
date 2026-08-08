// js/audio.js
//
// Gerenciador de som do Memeatro. Sons de menu/sfx/memes já vêm prontos no
// projeto — se algum arquivo estiver ausente ou corrompido, o jogo não quebra,
// ele só continua em silêncio (o erro de carregamento é engolido de propósito).

const AUDIO_BASE = "assets/sons/";

// 🎵 Músicas de fundo (loop) — trocam sozinhas conforme a tela muda
const MUSICAS = {
    menu: "musica/menu.mp3",
    partida: "musica/partida.mp3",
    loja: "musica/loja.mp3"
};

// 🔊 Efeitos sonoros pontuais
const SFX = {
    clique: "sfx/clique.mp3",
    descartar: "sfx/descartar.mp3",
    jogarMao: "sfx/jogar_mao.mp3",
    moeda: "sfx/moeda.mp3",
    comprar: "sfx/comprar.mp3",
    erro: "sfx/erro.mp3",
    vitoriaRodada: "sfx/vitoria_rodada.mp3",
    derrota: "sfx/derrota.mp3",
    abrirPacote: "sfx/abrir_pacote.mp3",
    cartaRevelada: "sfx/carta_revelada.mp3",
    multFogo: "sfx/mult_fogo.mp3",
    reroll: "sfx/reroll.mp3"
};

// Volumes vão de 0 a 100 (facilita casar com o slider da tela de configurações)
let volumeMusica = Number(localStorage.getItem("memeatro_vol_musica") ?? 50);
let volumeSfx = Number(localStorage.getItem("memeatro_vol_sfx") ?? 70);
let mutado = localStorage.getItem("memeatro_mutado") === "true";

let musicaAtual = null;
let nomeMusicaAtual = null;
let audioPersonagemAtual = null; // toca no máximo 1 som de personagem por vez
let sfxAtivos = []; // Rastreia todos os SFX tocados em segundo plano para poder parar ao fim da rodada

function tocarSfx(nomeSfx) {
    if (mutado || volumeSfx <= 0) return;
    const caminho = SFX[nomeSfx];
    if (!caminho) return;
    
    const audio = new Audio(AUDIO_BASE + caminho);
    audio.volume = volumeSfx / 100;
    
    sfxAtivos.push(audio);
    audio.onended = () => {
        sfxAtivos = sfxAtivos.filter(a => a !== audio);
    };

    audio.play().catch(() => {}); // arquivo ausente ou autoplay bloqueado: ignora silenciosamente
}

// Deriva o caminho do som do personagem/carta.
// Suporta fotos locais (memes), cartas com 'card.som' customizado e cartas do LoL!
// Deriva o caminho do som do personagem/carta a partir da propriedade 'som', 'foto' ou 'nome'
function caminhoSomPersonagem(card) {
    if (!card) return null;

    // 1. Caminho explícito definido diretamente na carta
    if (card.som) return card.som;

    // 2. Se a carta for do LoL (usando a foto da ddragon ou o nome do campeão)
    if (card.foto && card.foto.includes("ddragon.leagueoflegends.com")) {
        if (!card.nome) return null;
        
        // Trata o nome: minúsculas, troca espaços por '_' e remove caracteres especiais (ex: "Master Yi" -> "master_yi")
        const nomeFormatado = card.nome
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/['’]/g, "")                             // Remove aspas simples (ex: Vel'Koz -> velkoz)
            .trim()
            .replace(/\s+/g, "_");                             // Troca espaços por _

        return `${AUDIO_BASE}lol/${nomeFormatado}.mp3`;
    }

    // 3. Padrão para cartas de Memes/Fotos locais
    if (card.foto && card.foto.startsWith("assets/fotos/")) {
        const nomeBase = card.foto.split("/").pop().replace(/\.[^.]+$/, "");
        return `${AUDIO_BASE}memes/${nomeBase}.mp3`;
    }

    return null;
}

// Interrompe o som de personagem em andamento
function pararSomPersonagem() {
    if (audioPersonagemAtual) {
        audioPersonagemAtual.pause();
        audioPersonagemAtual.currentTime = 0;
        audioPersonagemAtual = null;
    }
}

// 🔇 INTERROMPE TODOS OS EFEITOS SONOROS (Chamado ao encerrar rodada ou mudar de fase)
function pararTodosEfeitos() {
    pararSomPersonagem();
    
    // Interrompe todos os SFX acumulados
    sfxAtivos.forEach(audio => {
        try {
            audio.pause();
            audio.currentTime = 0;
        } catch (e) {}
    });
    sfxAtivos = [];
}

// Toca o som de assinatura do personagem ou campeão do LoL.
// Se não existir o arquivo específico, faz fallback pro clique.
function tocarSomPersonagem(card) {
    pararSomPersonagem();
    if (mutado || volumeSfx <= 0) return;
    
    const caminho = caminhoSomPersonagem(card);
    if (!caminho) { tocarSfx("clique"); return; }
    
    // Aceita tanto caminho local quanto URL completa
    const srcFinal = caminho.startsWith("http") ? caminho : caminho;
    const audio = new Audio(srcFinal);
    audio.volume = volumeSfx / 100;
    
    audio.addEventListener("error", () => tocarSfx("clique"), { once: true });
    audio.play().catch(() => {});
    
    audioPersonagemAtual = audio;
}

function tocarMusica(nomeMusica) {
    if (nomeMusicaAtual === nomeMusica) return; // já está tocando essa faixa, não reinicia
    if (musicaAtual) musicaAtual.pause();

    const caminho = MUSICAS[nomeMusica];
    nomeMusicaAtual = nomeMusica;
    if (!caminho) { musicaAtual = null; return; }

    musicaAtual = new Audio(AUDIO_BASE + caminho);
    musicaAtual.loop = true;
    musicaAtual.volume = mutado ? 0 : volumeMusica / 100;
    musicaAtual.play().catch(() => {});
}

function alternarMudo() {
    mutado = !mutado;
    localStorage.setItem("memeatro_mutado", mutado);
    if (musicaAtual) musicaAtual.volume = mutado ? 0 : volumeMusica / 100;
    atualizarBotaoMudo();
}

function atualizarBotaoMudo() {
    const btn = document.getElementById("btn-mudo");
    if (btn) btn.innerText = mutado ? "🔇" : "🔊";
    const check = document.getElementById("check-mudo");
    if (check) check.checked = mutado;
}

function ajustarVolumeMusica(valor) {
    volumeMusica = Number(valor);
    localStorage.setItem("memeatro_vol_musica", volumeMusica);
    if (musicaAtual && !mutado) musicaAtual.volume = volumeMusica / 100;
}

function ajustarVolumeSfx(valor) {
    volumeSfx = Number(valor);
    localStorage.setItem("memeatro_vol_sfx", volumeSfx);
}

// 🎨 Tema claro/escuro — salvo e restaurado entre sessões
function mudarTema(tema) {
    document.documentElement.setAttribute("data-tema", tema);
    localStorage.setItem("memeatro_tema", tema);
    atualizarBotoesTema();
}

function atualizarBotoesTema() {
    const temaAtual = localStorage.getItem("memeatro_tema") || "escuro";
    document.querySelectorAll(".btn-tema").forEach(btn => {
        btn.classList.toggle("ativo", btn.dataset.tema === temaAtual);
    });
}

function abrirConfiguracoes() {
    document.getElementById("overlay-configuracoes").style.display = "flex";
}

function fecharConfiguracoes() {
    document.getElementById("overlay-configuracoes").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarBotaoMudo();

    const temaSalvo = localStorage.getItem("memeatro_tema") || "escuro";
    document.documentElement.setAttribute("data-tema", temaSalvo);
    atualizarBotoesTema();

    const sliderMusica = document.getElementById("slider-musica");
    const sliderSfx = document.getElementById("slider-sfx");
    if (sliderMusica) sliderMusica.value = volumeMusica;
    if (sliderSfx) sliderSfx.value = volumeSfx;
});