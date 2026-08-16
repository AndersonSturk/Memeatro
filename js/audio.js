// js/audio.js
// Gerenciador de som e música do Memeatro.

const AUDIO_BASE = "assets/sons/";

const MUSICAS = {
    menu: "musica/menu.mp3",
    partida: "musica/partida.mp3",
    loja: "musica/loja.mp3"
};

const SFX = {
    clique: "sfx/clique.mp3",
    descartar: "sfx/descartar.mp3",
    jogarMao: "sfx/jogar_mao.mp3",
    moeda: "sfx/moeda.mp3",
    comprar: "sfx/comprar.mp3",
    erro: "sfx/erro.mp3",
    vitoria: "sfx/vitoria_rodada.mp3",
    vitoriaRodada: "sfx/vitoria_rodada.mp3",
    derrota: "sfx/derrota.mp3",
    abrirPacote: "sfx/abrir_pacote.mp3",
    cartaRevelada: "sfx/carta_revelada.mp3",
    abrirPacotePrime: "sfx/abrir_pacote_prime.mp3", 
    cartaLendariaReveal: "sfx/carta_lendaria_reveal.mp3",
    multFogo: "sfx/mult_fogo.mp3",
    reroll: "sfx/reroll.mp3"
};

let volumeMusica = Number(localStorage.getItem("memeatro_vol_musica") ?? 50);
let volumeSfx = Number(localStorage.getItem("memeatro_vol_sfx") ?? 70);
let mutado = localStorage.getItem("memeatro_mutado") === "true";

let musicaAtual = null;
let nomeMusicaAtual = null;
let audioPersonagemAtual = null; 
let sfxAtivos = []; 
const cacheAudioSfx = {};
let audioDestravado = false;

function preCarregarSfx() {
    Object.keys(SFX).forEach(chave => {
        const caminho = SFX[chave];
        const srcFinal = caminho.startsWith("http") ? caminho : (AUDIO_BASE + caminho);
        const audio = new Audio(srcFinal);
        audio.preload = "auto";
        cacheAudioSfx[chave] = audio;
    });
}

let audioCtx = null;

function destravarAudioContexto() {
    if (audioDestravado) return;

    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            if (!audioCtx) audioCtx = new AudioContextClass();
            if (audioCtx.state === "suspended") {
                audioCtx.resume().catch(() => {});
            }
        }
    } catch (e) {
        console.warn("[ÁUDIO] WebAudio não suportado ou bloqueado:", e);
    }

    const audioTeste = new Audio();
    audioTeste.play().then(() => {
        audioDestravado = true;
        window.removeEventListener("click", destravarAudioContexto);
        window.removeEventListener("keydown", destravarAudioContexto);
    }).catch(() => {});
}

window.addEventListener("click", destravarAudioContexto);
window.addEventListener("keydown", destravarAudioContexto);

function tocarSfx(nomeSfx) {
    if (mutado || volumeSfx <= 0) return;
    const caminho = SFX[nomeSfx];
    
    if (!caminho) {
        console.warn(`[ÁUDIO] Efeito sonoro "${nomeSfx}" não foi registrado.`);
        return;
    }

    try {
        const srcFinal = caminho.startsWith("http") ? caminho : (AUDIO_BASE + caminho);
        const audio = cacheAudioSfx[nomeSfx] ? cacheAudioSfx[nomeSfx].cloneNode(true) : new Audio(srcFinal);
        audio.volume = volumeSfx / 100;
        audio.currentTime = 0;
        
        sfxAtivos.push(audio);
        audio.onended = () => {
            sfxAtivos = sfxAtivos.filter(a => a !== audio);
        };

        const promise = audio.play();
        if (promise !== undefined) {
            promise.catch(() => {
                // Falha de reprodução silenciosa ou arquivo ausente
            });
        }
    } catch (e) {
        console.error(`[ÁUDIO] Erro ao tocar "${nomeSfx}":`, e);
    }
}

function caminhoSomPersonagem(card) {
    if (!card) return null;
    if (card.som) return card.som;

    if (card.foto && card.foto.includes("ddragon.leagueoflegends.com")) {
        if (!card.nome) return null;
        const nomeFormatado = card.nome
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/['’]/g, "")
            .trim()
            .replace(/\s+/g, "_");

        return `lol/${nomeFormatado}.mp3`;
    }

    if (card.foto && card.foto.startsWith("assets/fotos/")) {
        const nomeBase = card.foto.split("/").pop().replace(/\.[^.]+$/, "");
        return `memes/${nomeBase}.mp3`;
    }

    return null;
}

function pararSomPersonagem() {
    if (audioPersonagemAtual) {
        audioPersonagemAtual.pause();
        audioPersonagemAtual.currentTime = 0;
        audioPersonagemAtual = null;
    }
}

function pararTodosEfeitos() {
    pararSomPersonagem();
    sfxAtivos.forEach(audio => {
        try {
            audio.pause();
            audio.currentTime = 0;
        } catch (e) {}
    });
    sfxAtivos = [];
}

function tocarSomPersonagem(card) {
    pararSomPersonagem();
    if (mutado || volumeSfx <= 0) return;
    
    const caminho = caminhoSomPersonagem(card);
    if (!caminho) { tocarSfx("clique"); return; }
    
    const srcFinal = caminho.startsWith("http") ? caminho : (AUDIO_BASE + caminho);
    const audio = new Audio(srcFinal);
    audio.volume = volumeSfx / 100;
    
    audio.addEventListener("error", () => {
        tocarSfx("clique");
    }, { once: true });

    audio.play().catch(() => {
        tocarSfx("clique");
    });
    
    audioPersonagemAtual = audio;
}

function tocarMusica(nomeMusica) {
    if (nomeMusicaAtual === nomeMusica) return; 
    if (musicaAtual) musicaAtual.pause();

    const caminho = MUSICAS[nomeMusica];
    nomeMusicaAtual = nomeMusica;
    if (!caminho) { musicaAtual = null; return; }

    const srcFinal = caminho.startsWith("http") ? caminho : (AUDIO_BASE + caminho);
    musicaAtual = new Audio(srcFinal);
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
    const el = document.getElementById("overlay-configuracoes");
    if (el) el.style.display = "flex";
}

function fecharConfiguracoes() {
    const el = document.getElementById("overlay-configuracoes");
    if (el) el.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    preCarregarSfx();
    atualizarBotaoMudo();

    const temaSalvo = localStorage.getItem("memeatro_tema") || "escuro";
    document.documentElement.setAttribute("data-tema", temaSalvo);
    atualizarBotoesTema();

    const sliderMusica = document.getElementById("slider-musica");
    const sliderSfx = document.getElementById("slider-sfx");
    if (sliderMusica) sliderMusica.value = volumeMusica;
    if (sliderSfx) sliderSfx.value = volumeSfx;
});
