// --- CONFIGURAÇÃO DO FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, remove, get, onDisconnect } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAEh_V4bSl12ksB8CEflrfbTMKjapa_Bnw",
    authDomain: "adedonha-21959.firebaseapp.com",
    projectId: "adedonha-21959",
    storageBucket: "adedonha-21959.firebasestorage.app",
    messagingSenderId: "774274693558",
    appId: "1:774274693558:web:fc99e28585db5b9ea12917"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const DOM = {
    screens: document.querySelectorAll('.screen'),
    login: document.getElementById('screen-login'),
    rooms: document.getElementById('screen-rooms'),
    roomLobby: document.getElementById('screen-room-lobby'),
    turnTransition: document.getElementById('screen-turn-transition'),
    game: document.getElementById('screen-game'),
    evaluation: document.getElementById('screen-evaluation'),
    results: document.getElementById('screen-results'),
    
    // Login & Salas
    inputPlayerName: document.getElementById('input-player-name'),
    avatarPreview: document.getElementById('player-avatar-preview'),
    btnRandomAvatar: document.getElementById('btn-random-avatar'),
    avatarStyle: document.getElementById('avatar-style'),
    avatarBgColor: document.getElementById('avatar-bg-color'),
    avatarTop: document.getElementById('avatar-top'),
    avatarSkin: document.getElementById('avatar-skin'),
    avatarMouth: document.getElementById('avatar-mouth'),
    avatarClothing: document.getElementById('avatar-clothing'),
    btnLogin: document.getElementById('btn-login'),
    roomsList: document.getElementById('rooms-list'),
    btnCreateRoom: document.getElementById('btn-create-room'),
    
    // Fase de Letra
    letterSelection: document.getElementById('screen-letter-selection'),
    letterCountdownContainer: document.getElementById('letter-countdown-container'),
    letterCountdown: document.getElementById('letter-countdown'),
    letterInputContainer: document.getElementById('letter-input-container'),
    inputChosenLetter: document.getElementById('input-chosen-letter'),
    btnSubmitLetter: document.getElementById('btn-submit-letter'),
    btnRandomLetter: document.getElementById('btn-random-letter'),
    letterRouletteContainer: document.getElementById('letter-roulette-container'),
    rouletteDisplay: document.getElementById('roulette-display'),
    letterSummary: document.getElementById('letter-summary'),
    
    // Lobby Sala
    roomTitle: document.getElementById('room-title-display'),
    btnCopyLink: document.getElementById('btn-copy-link'),
    roomPlayersGrid: document.getElementById('room-players'),
    btnLeaveRoom: document.getElementById('btn-leave-room'),
    btnReady: document.getElementById('btn-ready'),
    hostControls: document.getElementById('host-controls'),
    btnStartGame: document.getElementById('btn-start-game'),
    
    // Chat
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    btnSendChat: document.getElementById('btn-send-chat'),

    currentPlayerDisplay: document.getElementById('current-player-display'),
    roundLetterDisplay: document.getElementById('round-letter-display'),
    btnStartTurn: document.getElementById('btn-start-turn'),
    
    gameLetter: document.getElementById('game-letter'),
    gamePlayer: document.getElementById('game-player'),
    gameTimer: document.getElementById('game-timer'),
    themesContainer: document.getElementById('themes-container'),
    btnSkipTurn: document.getElementById('btn-skip-turn'),
    btnStop: document.getElementById('btn-stop'),
    
    evaluationList: document.getElementById('evaluation-list'),
    btnFinishEvaluation: document.getElementById('btn-finish-evaluation'),
    btnMockHahaha: document.getElementById('btn-mock-hahaha'),
    btnMockSad: document.getElementById('btn-mock-sad'),
    
    scoreboard: document.getElementById('scoreboard'),
    btnNextRound: document.getElementById('btn-next-round'),
    btnLeaveResults: document.getElementById('btn-leave-results'),
    feedbackContainer: document.getElementById('feedback-container')
};

const ALL_THEMES = [
    "Comidas", "Estado", "País", "Objeto", 
    "Nome de pessoa", "Verbo", "Tem na festa", "Tem na praia"
];

// Dicionário básico para validação local
const DICTIONARY = {
    "Comidas": ["abacate", "abacaxi", "arroz", "batata", "bolo", "carne", "cebola", "chocolate", "doce", "empada", "feijao", "frango", "goiaba", "hamburguer", "iogurte", "jaca", "kiwi", "laranja", "limao", "macarrao", "maca", "morango", "nabo", "ovo", "pao", "peixe", "queijo", "repolho", "salsicha", "tomate", "uva"],
    "Estado": ["acre", "alagoas", "amapa", "amazonas", "bahia", "ceara", "espirito santo", "goias", "maranhao", "mato grosso", "mato grosso do sul", "minas gerais", "para", "paraiba", "parana", "pernambuco", "piaui", "rio de janeiro", "rio grande do norte", "rio grande do sul", "rondonia", "roraima", "santa catarina", "sao paulo", "sergipe", "tocantins", "alaska", "california", "florida", "texas"],
    "País": ["afeganistao", "alemanha", "angola", "argentina", "australia", "bahamas", "belgica", "bolivia", "brasil", "bulgaria", "camaroes", "canada", "chile", "china", "colombia", "coreia", "croacia", "cuba", "dinamarca", "egito", "equador", "espanha", "estados unidos", "franca", "grecia", "holanda", "hungria", "india", "indonesia", "inglaterra", "irao", "iraque", "irlanda", "israel", "italia", "jamaica", "japao", "libano", "madagascar", "malasia", "marrocos", "mexico", "mocambique", "noruega", "nova zelandia", "paraguai", "peru", "polonia", "portugal", "quenia", "reino unido", "romenia", "russia", "servia", "siria", "suecia", "suica", "tailandia", "taiwan", "turquia", "ucrania", "uruguai", "venezuela", "vietna", "zimbabue"],
    "Objeto": ["anel", "armario", "balde", "bola", "cadeira", "cama", "caneta", "carro", "celular", "chave", "copo", "dado", "espelho", "faca", "faca", "garfo", "guitarra", "helicoptero", "ima", "janela", "livro", "lapis", "mesa", "navio", "oculos", "panela", "quadro", "relogio", "sapato", "tampa", "tesoura", "urso", "vaso", "xicara", "ziper"],
    "Nome de pessoa": ["alice", "ana", "andre", "arthur", "bruno", "bianca", "carlos", "camila", "daniel", "diego", "eduardo", "elena", "felipe", "fernanda", "gabriel", "giovana", "hugo", "helena", "igor", "isabela", "joao", "julia", "kleber", "karina", "lucas", "laura", "marcos", "maria", "nicolas", "natalia", "otavio", "olivia", "paulo", "pedro", "rafael", "roberta", "samuel", "sofia", "thiago", "tatiana", "ulisses", "ursula", "victor", "vitoria", "wagner", "xuxa", "yuri", "zeca"],
    "Verbo": ["amar", "andar", "beber", "brincar", "cantar", "correr", "dancar", "dormir", "escrever", "estudar", "falar", "fazer", "ganhar", "gostar", "haver", "ir", "jogar", "juntar", "ler", "limpar", "mandar", "morar", "nadar", "nascer", "olhar", "ouvir", "pagar", "pegar", "querer", "quebrar", "rir", "roubar", "sair", "sorrir", "ter", "tocar", "usar", "unir", "ver", "viver", "xingar", "zangar"],
    "Tem na festa": ["agua", "amigos", "bolo", "balao", "bebida", "cerveja", "copo", "convidado", "danca", "docinho", "enfeite", "fantasia", "garcom", "gelo", "musica", "mesa", "prato", "presente", "refrigerante", "salgadinho"],
    "Tem na praia": ["agua", "areia", "barco", "biquini", "boia", "cadeira", "calor", "caranguejo", "concha", "coqueiro", "guarda-sol", "mar", "onda", "peixe", "picolé", "prancha", "protetor solar", "sal", "sol", "sunga", "toalha"]
};

// Estado local e online do jogo
let currentUser = { id: null, name: '', avatar: '', isReady: false };
let currentRoomId = null;
let currentRoomData = null;
let roomListenerUnsubscribe = null;
let chatListenerUnsubscribe = null;
let reactionListenerUnsubscribe = null;
let lastReactionTime = Date.now();
let idleRoomTimer = null;

// Efeitos Sonoros (SFX)
const SFX = {
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    perfect: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'),
    miss: new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3')
};
SFX.click.volume = 0.3;
SFX.perfect.volume = 0.5;
SFX.miss.volume = 0.5;

document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        SFX.click.currentTime = 0;
        SFX.click.play().catch(() => {}); // Catch ignora erros se o navegador bloquear o autoplay
    }
});

let state = {
    isPlaying: false,
    isEvaluating: false,
    isChoosingLetter: false,
    isRoulette: false,
    hostPhaseTimer: null, // Timer exclusivo do Host para controlar fases automáticas
    roundLetter: '',
    currentThemes: [],
    roundAnswers: {}, // { playerName: { theme: answer } }
    scores: {}, // { playerName: totalScore }
    timerInterval: null,
    timeLeft: 60,
    wordsToEvaluate: [],
    currentEvaluationThemeIndex: 0,
    isResults: false
};

// --- FUNÇÕES UTILITÁRIAS ---
function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));
}

function showScreen(screenElement) {
    DOM.screens.forEach(s => s.classList.remove('active'));
    DOM.screens.forEach(s => s.classList.add('hidden'));
    screenElement.classList.remove('hidden');
    screenElement.classList.add('active');
}

function normalizeString(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function getRandomLetter() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[Math.floor(Math.random() * letters.length)];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- ANIMAÇÕES JUST DANCE ---
function showJustDanceFeedback(type) {
    const el = document.createElement('div');
    el.className = `feedback-popup feedback-${type}`;
    el.textContent = type === 'perfect' ? 'PERFEITO!' : 'ERROU!';
    
    // Adiciona uma pequena variação de posição
    const top = 30 + Math.random() * 40;
    const left = 20 + Math.random() * 60;
    el.style.top = `${top}%`;
    el.style.left = `${left}%`;
    
    if (type === 'perfect') {
        SFX.perfect.currentTime = 0;
        SFX.perfect.play().catch(() => {});
    } else {
        SFX.miss.currentTime = 0;
        SFX.miss.play().catch(() => {});
    }
    
    DOM.feedbackContainer.appendChild(el);
    
    setTimeout(() => {
        el.remove();
    }, 1500);
}

// --- FLUXO DO JOGO ---

// 1. Login e Gerador de Avatar DiceBear
let avatarSeed = Math.random().toString(36).substring(7);

function generateAvatar() {
    const style = DOM.avatarStyle.value;
    const bgColor = DOM.avatarBgColor.value.replace('#', '');
    const top = DOM.avatarTop.value;
    const skin = DOM.avatarSkin.value;
    const mouth = DOM.avatarMouth.value;
    const clothing = DOM.avatarClothing.value;
    
    const controls = document.querySelector('#screen-login').querySelectorAll('select:not(#avatar-style)');
    controls.forEach(select => {
        select.style.display = style === 'avataaars' ? 'block' : 'none';
    });

    let url = `https://api.dicebear.com/9.x/${style}/svg?seed=${avatarSeed}&backgroundColor=${bgColor}`;
    if (style === 'avataaars') {
        url += `&top=${top}&skinColor=${skin}&mouth=${mouth}&clothing=${clothing}`;
    }
    currentUser.avatar = url;
    DOM.avatarPreview.src = currentUser.avatar;
}

DOM.btnRandomAvatar.addEventListener('click', () => {
    avatarSeed = Math.random().toString(36).substring(7);
    generateAvatar();
});
DOM.avatarStyle.addEventListener('change', generateAvatar);
DOM.avatarBgColor.addEventListener('input', generateAvatar);
DOM.avatarTop.addEventListener('change', generateAvatar);
DOM.avatarSkin.addEventListener('change', generateAvatar);
DOM.avatarMouth.addEventListener('change', generateAvatar);
DOM.avatarClothing.addEventListener('change', generateAvatar);

// Permite apertar Enter no campo de nome para entrar no jogo (útil para celulares)
DOM.inputPlayerName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        DOM.btnLogin.click();
    }
});

DOM.btnLogin.addEventListener('click', () => {
    const name = DOM.inputPlayerName.value.trim();
    if (!name) return alert("Digite um nome!");
    
    DOM.btnLogin.disabled = true;
    DOM.btnLogin.textContent = "Conectando...";
    
    signInAnonymously(auth).then(({ user }) => {
        currentUser.id = user.uid;
        currentUser.name = name;
        
        DOM.btnLogin.disabled = false;
        DOM.btnLogin.textContent = "Entrar no Jogo";

        // Verifica se o jogador chegou por um link de convite
        const urlParams = new URLSearchParams(window.location.search);
        const roomIdFromUrl = urlParams.get('room');
        
        if (roomIdFromUrl) {
            joinRoom(roomIdFromUrl);
        } else {
            showScreen(DOM.rooms);
            loadRooms();
        }
    }).catch(err => {
        console.error("Erro na autenticação:", err);
        alert(`Falha ao se conectar: ${err.message}`);
        DOM.btnLogin.disabled = false;
        DOM.btnLogin.textContent = "Entrar no Jogo";
    });
});

generateAvatar(); // Inicia com um avatar aleatório

// 2. Sistema de Salas (Realtime DB)
function loadRooms() {
    const roomsRef = ref(db, 'rooms');
    onValue(roomsRef, (snapshot) => {
        if (currentRoomId) return; // NÃ£o atualiza lista se jÃ¡ estiver em uma sala
        
        DOM.roomsList.innerHTML = '';
        const data = snapshot.val();
        
        if (!data) {
            DOM.roomsList.innerHTML = '<p style="text-align:center; color:gray; padding: 20px;">Nenhuma sala encontrada.</p>';
            return;
        }

        Object.entries(data).forEach(([roomId, roomInfo]) => {
            if (roomInfo.status !== 'waiting') return; // Mostrar apenas salas aguardando
            
            const playersCount = roomInfo.players ? Object.keys(roomInfo.players).length : 0;
            const isIdle = roomInfo.status === 'waiting' && roomInfo.waitingSince && (Date.now() - roomInfo.waitingSince > 60000);
            
            // Deleta salas fantasmas (vazias) ou inativas automaticamente
            if (playersCount === 0 || isIdle) {
                remove(ref(db, `rooms/${roomId}`));
                return;
            }
            
            const div = document.createElement('div');
            div.className = 'room-item';
            div.innerHTML = `
                <div class="room-item-info">
                    <strong>Sala de ${roomInfo.hostName}</strong>
                    <span>${playersCount}/4 Jogadores</span>
                </div>
                <button class="btn-join" data-id="${roomId}">Entrar</button>
            `;
            DOM.roomsList.appendChild(div);
        });

        document.querySelectorAll('.btn-join').forEach(btn => {
            btn.addEventListener('click', (e) => joinRoom(e.target.dataset.id));
        });
    });
}

DOM.btnCreateRoom.addEventListener('click', async () => {
    try {
        const newRoomRef = push(ref(db, 'rooms'));
        currentRoomId = newRoomRef.key;
        
        await set(newRoomRef, {
            hostId: currentUser.id,
            hostName: currentUser.name,
            status: 'waiting',
            waitingSince: Date.now(),
            players: {
                [currentUser.id]: { ...currentUser, isReady: false }
            }
        });
        
        sendSystemMessage(`${currentUser.name} criou a sala.`);
        enterRoomLobby();
    } catch (error) {
        console.error("Erro ao criar sala:", error);
        currentRoomId = null; // Limpa o ID já que a criação falhou
        alert(`Falha ao criar sala: ${error.message}`);
    }
});

async function joinRoom(roomId) {
    // Valida se a sala existe antes de tentar entrar (útil para links antigos)
    const roomSnap = await get(ref(db, `rooms/${roomId}`));
    if (!roomSnap.exists()) {
        alert("Esta sala não existe mais ou já foi fechada.");
        window.history.replaceState({}, document.title, window.location.pathname);
        showScreen(DOM.rooms);
        loadRooms();
        return;
    }

    currentRoomId = roomId;
    await update(ref(db, `rooms/${roomId}/players/${currentUser.id}`), {
        ...currentUser, isReady: false
    });
    sendSystemMessage(`${currentUser.name} entrou na sala.`);
    enterRoomLobby();
}

// 3. Lobby da Sala (Sistema de Pronto)
function enterRoomLobby() {
    showScreen(DOM.roomLobby);
    DOM.roomTitle.textContent = "Sala de Jogo";
    currentUser.isReady = false;
    DOM.btnReady.textContent = "Estou Pronto";
    DOM.btnReady.style.background = "";
    DOM.btnReady.style.color = "";

    // Se a pessoa fechar a aba do navegador do nada, o Firebase avisa para removê-la
    const myPlayerRef = ref(db, `rooms/${currentRoomId}/players/${currentUser.id}`);
    onDisconnect(myPlayerRef).remove();

    if (reactionListenerUnsubscribe) reactionListenerUnsubscribe();
    lastReactionTime = Date.now(); // Reseta o tempo da última reação ao entrar na sala
    reactionListenerUnsubscribe = onValue(ref(db, `rooms/${currentRoomId}/reactions`), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            let maxTimestamp = lastReactionTime;
            Object.values(data).forEach(reaction => {
                if (reaction.timestamp > lastReactionTime) {
                    if (reaction.type === 'sad') {
                        showReactionAnimation('😭 TRISTE', 'var(--blue-apple)');
                    } else {
                        showReactionAnimation('🤣 HAHAHA', '#ff9500');
                    }
                    if (reaction.timestamp > maxTimestamp) maxTimestamp = reaction.timestamp;
                }
            });
            lastReactionTime = maxTimestamp;
        }
    });

    const roomRef = ref(db, `rooms/${currentRoomId}`);
    
    roomListenerUnsubscribe = onValue(roomRef, (snapshot) => {
        currentRoomData = snapshot.val();
        if (!currentRoomData) {
            // Sala foi deletada
            leaveRoom();
            return alert("A sala foi fechada por inatividade ou pelo Host.");
        }
        
        // Limpa o timer antigo se houver
        if (idleRoomTimer) {
            clearTimeout(idleRoomTimer);
            idleRoomTimer = null;
        }
        
        // Se a sala estÃ¡ aguardando, inicia a contagem de 60 segundos
        if (currentRoomData.status === 'waiting' && currentRoomData.waitingSince) {
            const timeLeft = 60000 - (Date.now() - currentRoomData.waitingSince);
            if (timeLeft <= 0) {
                if (currentRoomData.hostId === currentUser.id) remove(ref(db, `rooms/${currentRoomId}`));
            } else {
                idleRoomTimer = setTimeout(() => {
                    if (currentRoomId && currentRoomData && currentRoomData.hostId === currentUser.id && currentRoomData.status === 'waiting') {
                        remove(ref(db, `rooms/${currentRoomId}`));
                    }
                }, timeLeft);
            }
        }

        // Verifica se fui expulso pelo Host (Estava na sala, mas meu ID não está mais na lista)
        if (currentRoomData.hostId !== currentUser.id && (!currentRoomData.players || !currentRoomData.players[currentUser.id])) {
            if (roomListenerUnsubscribe) roomListenerUnsubscribe();
            alert("Você foi removido da sala pelo Host.");
            forceLeaveRoom();
            return;
        }

        renderRoomPlayers(currentRoomData);
        checkReadyStatus(currentRoomData);
        
        // Sincronização de Estado do Jogo
        if (currentRoomData.status === 'choosing_letter') {
            if (!state.isChoosingLetter) {
                state.isChoosingLetter = true;
                startLetterChoicePhase();
            }
            // Host avança a fase se o tempo limite estourar
            if (currentRoomData.hostId === currentUser.id && currentRoomData.letterPhaseEndTime) {
                const timeLeft = currentRoomData.letterPhaseEndTime - Date.now();
                if (timeLeft <= 0) advanceToRoulette(currentRoomData);
                else {
                    if(state.hostPhaseTimer) clearTimeout(state.hostPhaseTimer);
                    state.hostPhaseTimer = setTimeout(() => advanceToRoulette(currentRoomData), timeLeft);
                }
            }
        } else if (currentRoomData.status === 'roulette') {
            if (!state.isRoulette) {
                state.isRoulette = true;
                startRoulettePhase(currentRoomData.gameState);
            }
            // Host avança para o jogo oficial após animação
            if (currentRoomData.hostId === currentUser.id && currentRoomData.rouletteEndTime) {
                const timeLeft = currentRoomData.rouletteEndTime - Date.now();
                if (timeLeft <= 0) {
                    update(ref(db, `rooms/${currentRoomId}`), { 
                        status: 'playing',
                        'gameState/turnEndTime': Date.now() + 60000 // Inicia os 60s automaticamente!
                    });
                } else {
                    if(state.hostPhaseTimer) clearTimeout(state.hostPhaseTimer);
                    state.hostPhaseTimer = setTimeout(() => update(ref(db, `rooms/${currentRoomId}`), { 
                        status: 'playing',
                        'gameState/turnEndTime': Date.now() + 60000 
                    }), timeLeft);
                }
            }
        } else if (currentRoomData.status === 'playing' && !state.isPlaying) {
            state.isPlaying = true;
            prepareOnlineGame(currentRoomData.gameState);
        } else if (currentRoomData.status === 'playing' && state.isPlaying) {
            syncOnlineGame(currentRoomData.gameState);
        } else if (currentRoomData.status === 'waiting' && state.isPlaying) {
            // Limpa o jogo para uma nova rodada
            forceLeaveRoom(true); 
        }
    });

    // --- SISTEMA DE CHAT ---
    if (chatListenerUnsubscribe) chatListenerUnsubscribe();
    chatListenerUnsubscribe = onValue(ref(db, `rooms/${currentRoomId}/chat`), (snapshot) => {
        DOM.chatMessages.innerHTML = '';
        const messages = snapshot.val();
        if (messages) {
            Object.values(messages).forEach(msg => {
                const div = document.createElement('div');
                const isSystem = msg.senderId === 'system';
                div.className = `chat-msg ${msg.senderId === currentUser.id ? 'my-msg' : ''} ${isSystem ? 'system-msg' : ''}`;
                
                if (isSystem) {
                    div.innerHTML = `<em>${escapeHTML(msg.text)}</em>`;
                } else {
                    div.innerHTML = `<strong>${escapeHTML(msg.senderName)}</strong> <span>${escapeHTML(msg.text)}</span>`;
                }
                DOM.chatMessages.appendChild(div);
            });
            DOM.chatMessages.scrollTo({
                top: DOM.chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
}

function renderRoomPlayers(data) {
    DOM.roomPlayersGrid.innerHTML = '';
    const players = data.players || {};
    const isHost = data.hostId === currentUser.id;
    
    Object.values(players).forEach(p => {
        const isMe = p.id === currentUser.id;
        const card = document.createElement('div');
        card.className = `player-card ${p.isReady ? 'ready' : ''}`;
        card.innerHTML = `
            ${isHost && !isMe ? `<button class="btn-kick" data-id="${p.id}" title="Expulsar">❌</button>` : ''}
            <img src="${escapeHTML(p.avatar)}" class="player-avatar">
            <strong style="font-size:14px;">${escapeHTML(p.name)} ${isMe ? '(Você)' : ''}</strong>
            <span class="status-badge">${p.isReady ? 'PRONTO' : 'AGUARDANDO'}</span>
        `;
        DOM.roomPlayersGrid.appendChild(card);
    });

    // Adicionar eventos para os botões de expulsar
    if (isHost) {
        document.querySelectorAll('.btn-kick').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const targetId = e.target.dataset.id;
                const targetName = data.players[targetId] ? data.players[targetId].name : 'Um jogador';
                sendSystemMessage(`${targetName} foi removido pelo Host.`);
                await remove(ref(db, `rooms/${currentRoomId}/players/${targetId}`));
            });
        });
    }
}

function checkReadyStatus(data) {
    const players = Object.values(data.players || {});
    // Alterado para permitir iniciar a partida com 1 jogador (ideal para testes)
    const allReady = players.length > 0 && players.every(p => p.isReady);
    
    // Controles do Host
    if (data.hostId === currentUser.id) {
        DOM.hostControls.classList.add('hidden');
        if (allReady && data.status === 'waiting') {
            update(ref(db, `rooms/${currentRoomId}`), {
                status: 'choosing_letter',
                letterChoices: null,
                letterPhaseEndTime: Date.now() + 13000
            });
        }
    } else {
        DOM.hostControls.classList.add('hidden');
    }
}

DOM.btnReady.addEventListener('click', async () => {
    currentUser.isReady = !currentUser.isReady;
    DOM.btnReady.textContent = currentUser.isReady ? "Cancelar" : "Estou Pronto";
    
    await update(ref(db, `rooms/${currentRoomId}/players/${currentUser.id}`), {
        isReady: currentUser.isReady
    });
});

DOM.btnLeaveRoom.addEventListener('click', leaveRoom);

// Enviar Mensagem no Chat
function sendMessage() {
    const text = DOM.chatInput.value.trim();
    if (!text || !currentRoomId) return;
    
    // Guarda a referência da nova mensagem criada
    const newMessageRef = push(ref(db, `rooms/${currentRoomId}/chat`), {
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: text,
        timestamp: Date.now()
    });
    
    DOM.chatInput.value = '';

    // Remove a mensagem após 60 segundos (60000 milissegundos) para não pesar o banco
    setTimeout(() => {
        remove(newMessageRef).catch(() => {});
    }, 60000);
}
DOM.btnSendChat.addEventListener('click', sendMessage);
DOM.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Copiar Link da Sala
DOM.btnCopyLink.addEventListener('click', () => {
    const inviteLink = `${window.location.origin}${window.location.pathname}?room=${currentRoomId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
        DOM.btnCopyLink.textContent = "✅ Copiado!";
        setTimeout(() => DOM.btnCopyLink.textContent = "🔗 Copiar Link", 2000);
    });
});

// Mensagem de Sistema Automática
function sendSystemMessage(text) {
    if (!currentRoomId) return;
    const newMessageRef = push(ref(db, `rooms/${currentRoomId}/chat`), {
        senderId: 'system',
        senderName: 'Sistema',
        text: text,
        timestamp: Date.now()
    });
    setTimeout(() => {
        remove(newMessageRef).catch(() => {});
    }, 60000); // Também será apagada automaticamente
}

async function leaveRoom() {
    if (roomListenerUnsubscribe) roomListenerUnsubscribe();
    if (chatListenerUnsubscribe) chatListenerUnsubscribe();
    if (reactionListenerUnsubscribe) reactionListenerUnsubscribe();
    if (idleRoomTimer) clearTimeout(idleRoomTimer);
    
    if (currentRoomData && currentRoomId) {
        const playersCount = currentRoomData.players ? Object.keys(currentRoomData.players).length : 0;
        
        if (playersCount <= 1) {
            // Se for o último a sair, destrói a sala
            await remove(ref(db, `rooms/${currentRoomId}`));
        } else if (currentRoomData.hostId === currentUser.id) {
            // Se for o host saindo e tiver mais gente, passa o host para outro
            const remainingPlayers = Object.keys(currentRoomData.players).filter(id => id !== currentUser.id);
            const newHostId = remainingPlayers[0];
            const newHostName = currentRoomData.players[newHostId].name;
            
            await update(ref(db, `rooms/${currentRoomId}`), { hostId: newHostId, hostName: newHostName });
            sendSystemMessage(`${currentUser.name} saiu. ${newHostName} agora Ã© o Host.`);
            await remove(ref(db, `rooms/${currentRoomId}/players/${currentUser.id}`));
        } else {
            // Jogador comum saindo
            sendSystemMessage(`${currentUser.name} saiu da sala.`);
            await remove(ref(db, `rooms/${currentRoomId}/players/${currentUser.id}`));
        }
    }
    
    forceLeaveRoom();
}

function forceLeaveRoom(stayInLobby = false) {
    if (reactionListenerUnsubscribe) reactionListenerUnsubscribe();
    state.isPlaying = false;
    state.isEvaluating = false;
    state.isChoosingLetter = false;
    state.isRoulette = false;
    state.isResults = false;
    state.currentEvaluationThemeIndex = 0;
    if(state.hostPhaseTimer) clearTimeout(state.hostPhaseTimer);
    
    if (!stayInLobby) {
    currentRoomId = null;
    showScreen(DOM.rooms);
    loadRooms();
    } else {
        currentUser.isReady = false;
        DOM.btnReady.textContent = "Estou Pronto";
        DOM.btnReady.style.background = "";
        DOM.btnReady.style.color = "";
        if (!DOM.roomLobby.classList.contains('active')) showScreen(DOM.roomLobby);
    }
}

DOM.btnStartGame.addEventListener('click', async () => {
    await update(ref(db, `rooms/${currentRoomId}`), {
        status: 'choosing_letter',
        letterChoices: null,
        letterPhaseEndTime: Date.now() + 13000 // 3s contagem + 10s para digitar
    });
});

// 4. Fases de Escolha de Letra
function startLetterChoicePhase() {
    showScreen(DOM.letterSelection);
    DOM.letterCountdownContainer.classList.remove('hidden');
    DOM.letterInputContainer.classList.add('hidden');
    DOM.letterRouletteContainer.classList.add('hidden');
    DOM.inputChosenLetter.value = '';
    DOM.btnSubmitLetter.disabled = false;
    DOM.btnSubmitLetter.textContent = "Enviar Letra";
    DOM.btnRandomLetter.disabled = false;
    
    let count = 3;
    DOM.letterCountdown.textContent = count;
    
    const countInterval = setInterval(() => {
        count--;
        if (count > 0) {
            DOM.letterCountdown.textContent = count;
        } else {
            clearInterval(countInterval);
            DOM.letterCountdownContainer.classList.add('hidden');
            DOM.letterInputContainer.classList.remove('hidden');
            DOM.inputChosenLetter.focus();
        }
    }, 1000);
}

DOM.btnSubmitLetter.addEventListener('click', async () => {
    const letter = DOM.inputChosenLetter.value.trim().toUpperCase();
    if (!letter || !/^[A-Z]$/.test(letter)) return alert("Digite uma letra válida do alfabeto!");
    
    DOM.btnSubmitLetter.disabled = true;
    DOM.btnRandomLetter.disabled = true;
    DOM.btnSubmitLetter.textContent = "Enviado!";
    
    // Valores primitivos (como texto/letras) precisam do comando 'set' e nÃ£o 'update'
    await set(ref(db, `rooms/${currentRoomId}/letterChoices/${currentUser.id}`), letter);
});

DOM.inputChosenLetter.addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase());
DOM.inputChosenLetter.addEventListener('keypress', (e) => { if (e.key === 'Enter') DOM.btnSubmitLetter.click(); });

DOM.btnRandomLetter.addEventListener('click', () => {
    DOM.inputChosenLetter.value = getRandomLetter();
    DOM.btnSubmitLetter.click();
});

async function advanceToRoulette(roomData) {
    if (!currentRoomId || roomData.status !== 'choosing_letter') return;
    
    const choices = roomData.letterChoices || {};
    let submittedLetters = Object.values(choices).map(c => c.toUpperCase());
    
    if (submittedLetters.length === 0) submittedLetters = [getRandomLetter()];
    
    const pickedLetter = submittedLetters[Math.floor(Math.random() * submittedLetters.length)];
    const playersList = Object.values(roomData.players || {});
    const playerNames = playersList.map(p => p.name);
    
    await update(ref(db, `rooms/${currentRoomId}`), {
        status: 'roulette',
        rouletteEndTime: Date.now() + 5000,
        gameState: {
            playersOrder: playerNames,
            currentTurnIndex: 0,
            turnEndTime: 0,
            roundLetter: pickedLetter,
            submittedLetters: submittedLetters,
            themes: shuffleArray([...ALL_THEMES]).slice(0, 4),
            answers: {}
        }
    });
}

function startRoulettePhase(gameState) {
    showScreen(DOM.letterSelection);
    DOM.letterCountdownContainer.classList.add('hidden');
    DOM.letterInputContainer.classList.add('hidden');
    DOM.letterRouletteContainer.classList.remove('hidden');
    
    const submitted = gameState.submittedLetters || [gameState.roundLetter];
    const finalLetter = gameState.roundLetter;
    
    DOM.letterSummary.innerHTML = '';
    const letterCounts = {};
    submitted.forEach(l => letterCounts[l] = (letterCounts[l] || 0) + 1);
    Object.entries(letterCounts).forEach(([letra, qtd]) => {
        const span = document.createElement('span');
        span.className = 'letter-summary-item';
        span.textContent = `${letra}: ${qtd}x`;
        DOM.letterSummary.appendChild(span);
    });

    DOM.rouletteDisplay.innerHTML = '';
    const letterElements = [];
    const roulettePool = [...submitted];
    while(roulettePool.length < 8) { roulettePool.push(getRandomLetter()); }
    shuffleArray(roulettePool);
    
    roulettePool.forEach(l => {
        const span = document.createElement('span');
        span.className = 'roulette-item';
        span.textContent = l;
        DOM.rouletteDisplay.appendChild(span);
        letterElements.push(span);
    });
    
    let flashes = 20, currentFlash = 0;
    const rouletteInterval = setInterval(() => {
        letterElements.forEach(el => el.classList.remove('highlighted'));
        letterElements[Math.floor(Math.random() * letterElements.length)].classList.add('highlighted');
        
        currentFlash++;
        if (currentFlash >= flashes) {
            clearInterval(rouletteInterval);
            DOM.rouletteDisplay.innerHTML = `<span class="roulette-item final-winner pulse-animation">${finalLetter}</span>`;
            SFX.perfect.currentTime = 0; SFX.perfect.play().catch(()=>{});
        } else {
            SFX.click.currentTime = 0; SFX.click.play().catch(()=>{});
        }
    }, 150);
}

// 5. Estrutura do Jogo Online Sincronizado
function prepareOnlineGame(gameState) {
    state.players = gameState.playersOrder || [];
    state.roundLetter = gameState.roundLetter;
    state.currentThemes = gameState.themes || [];
    state.players.forEach(p => state.scores[p] = state.scores[p] || 0);
    
    syncOnlineGame(gameState); 
}

function syncOnlineGame(gameState) {
    if (!gameState) return;
    state.roundAnswers = gameState.answers || {};

    if (gameState.currentTurnIndex >= state.players.length) {
        // Todos jogaram
        if (!state.isEvaluating) {
            state.isEvaluating = true;
            clearInterval(state.timerInterval);
            processAnswersAndEvaluate();
        } else {
            // Sincroniza o progresso da tela de avaliação se já estiver nela
            const remoteEvalIndex = gameState.evalIndex || 0;
            const remoteEvalFinished = gameState.isEvalFinished || false;

            if (remoteEvalFinished && !state.isResults) {
                state.isResults = true;
                state.roundAnswers = gameState.answers || state.roundAnswers; // Puxa os julgamentos do Host
                calculateScores();
            } else if (remoteEvalIndex > state.currentEvaluationThemeIndex) {
                state.currentEvaluationThemeIndex = remoteEvalIndex;
                state.roundAnswers = gameState.answers || state.roundAnswers;
                renderEvaluationScreen();
            }
        }
        return;
    }

    const activePlayer = state.players[gameState.currentTurnIndex];
    state.currentPlayerIndex = gameState.currentTurnIndex;
    const isMyTurn = activePlayer === currentUser.name;

    const isHost = currentRoomData && currentRoomData.hostId === currentUser.id;
    DOM.btnSkipTurn.classList.toggle('hidden', !isHost || gameState.turnEndTime === 0);

    if (gameState.turnEndTime === 0) {
        // Aguardando jogador iniciar o turno
        DOM.currentPlayerDisplay.textContent = activePlayer;
        DOM.roundLetterDisplay.textContent = state.roundLetter;
        DOM.btnStartTurn.style.display = isMyTurn ? 'block' : 'none';
        
        showScreen(DOM.turnTransition);
        clearInterval(state.timerInterval);
    } else {
        // Turno rolando com tempo em andamento
        if (!DOM.game.classList.contains('active')) {
            startTurnUI(activePlayer, isMyTurn);
        }
        
        clearInterval(state.timerInterval);
        state.timerInterval = setInterval(() => {
            // Relógio baseado na hora universal para manter todos em sincronia
            const timeLeft = Math.max(0, Math.ceil((gameState.turnEndTime - Date.now()) / 1000));
            DOM.gameTimer.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(state.timerInterval);
                if (isMyTurn) endOnlineTurn();
            }
        }, 1000);
    }
}

DOM.btnStartTurn.addEventListener('click', async () => {
    await update(ref(db, `rooms/${currentRoomId}/gameState`), {
        turnEndTime: Date.now() + 60000 // Inicia 60 segundos cravados para todos
    });
});

function startTurnUI(playerName, isMyTurn) {
    DOM.gamePlayer.textContent = playerName;
    DOM.gameLetter.textContent = state.roundLetter;
    
    DOM.themesContainer.innerHTML = '';
    state.currentThemes.forEach(theme => {
        const div = document.createElement('div');
        div.className = 'theme-item';
        div.innerHTML = `
            <label>${theme}</label>
            <div class="theme-input-wrapper">
                <input type="text" class="apple-input theme-answer" data-theme="${theme}" autocomplete="off" maxlength="40" ${!isMyTurn ? 'disabled' : ''} placeholder="${!isMyTurn ? 'Aguardando jogador...' : ''}">
            </div>
        `;
        DOM.themesContainer.appendChild(div);
        
        if (isMyTurn) {
            const inputEl = div.querySelector('.theme-answer');
            inputEl.addEventListener('input', (e) => {
                const val = normalizeString(e.target.value);
                const expectedInitial = normalizeString(state.roundLetter);
                
                if (val && val.startsWith(expectedInitial)) {
                    const dict = DICTIONARY[theme] || [];
                    const isCorrect = dict.some(word => normalizeString(word) === val);
                    if (isCorrect) {
                        e.target.classList.add('input-success');
                    } else {
                        e.target.classList.remove('input-success');
                    }
                } else {
                    e.target.classList.remove('input-success');
                }
            });
        }
    });

    DOM.btnStop.style.display = isMyTurn ? 'block' : 'none';
    showScreen(DOM.game);
}

DOM.btnStop.addEventListener('click', () => {
    endOnlineTurn();
});

DOM.btnSkipTurn.addEventListener('click', async () => {
    if (currentRoomId && currentRoomData && currentRoomData.hostId === currentUser.id) {
        await update(ref(db, `rooms/${currentRoomId}/gameState`), {
            turnEndTime: Date.now() // Zera o tempo instantaneamente para todos
        });
    }
});

let isReactionCooldown = false;

function startReactionCooldown() {
    isReactionCooldown = true;
    DOM.btnMockHahaha.disabled = true;
    DOM.btnMockSad.disabled = true;
    
    setTimeout(() => {
        isReactionCooldown = false;
        DOM.btnMockHahaha.disabled = false;
        DOM.btnMockSad.disabled = false;
    }, 3000); // 3 segundos de recarga
}

DOM.btnMockHahaha.addEventListener('click', () => {
    if (!currentRoomId || isReactionCooldown) return;
    startReactionCooldown();
    const reactionRef = push(ref(db, `rooms/${currentRoomId}/reactions`), {
        type: 'hahaha',
        timestamp: Date.now()
    });
    setTimeout(() => remove(reactionRef).catch(() => {}), 5000); // Limpa o banco rapidamente
});

DOM.btnMockSad.addEventListener('click', () => {
    if (!currentRoomId || isReactionCooldown) return;
    startReactionCooldown();
    const reactionRef = push(ref(db, `rooms/${currentRoomId}/reactions`), {
        type: 'sad',
        timestamp: Date.now()
    });
    setTimeout(() => remove(reactionRef).catch(() => {}), 5000);
});

function showReactionAnimation(text, color) {
    const el = document.createElement('div');
    el.className = 'feedback-popup';
    el.textContent = text;
    el.style.color = color;
    
    const top = 20 + Math.random() * 60;
    const left = 20 + Math.random() * 60;
    el.style.top = `${top}%`;
    el.style.left = `${left}%`;
    
    DOM.feedbackContainer.appendChild(el);
    setTimeout(() => el.remove(), 1500);
}

// Submeter jogo (STOP) apertando ENTER
document.addEventListener('keydown', (e) => {
    // Verifica se a tela ativa é a de Jogo e se o botão STOP está visível (indicando que é a minha vez)
    if (e.key === 'Enter' && DOM.game.classList.contains('active') && DOM.btnStop.style.display === 'block') {
        endOnlineTurn();
    }
});

async function endOnlineTurn() {
    clearInterval(state.timerInterval);
    const playerName = currentUser.name;
    
    const inputs = document.querySelectorAll('.theme-answer');
    const myAnswers = {};
    inputs.forEach(input => {
        myAnswers[input.dataset.theme] = input.value || "";
    });

    const updates = {};
    updates[`rooms/${currentRoomId}/gameState/answers/${playerName}`] = myAnswers;
    updates[`rooms/${currentRoomId}/gameState/currentTurnIndex`] = state.currentPlayerIndex + 1;
    updates[`rooms/${currentRoomId}/gameState/turnEndTime`] = 0;

    await update(ref(db), updates);
}

function processAnswersAndEvaluate() {
    state.wordsToEvaluate = [];
    const processedAnswers = {}; // Objeto para armazenar os resultados processados
    let acertos = 0;
    let erros = 0;
    
    // Referência para as respostas originais do banco de dados
    const dbAnswers = state.roundAnswers;
    
    for (const playerName of state.players) {
        processedAnswers[playerName] = {}; 
        
        for (const theme of state.currentThemes) {
            const rawAnswer = dbAnswers[playerName] ? dbAnswers[playerName][theme] || "" : "";
            const answer = normalizeString(rawAnswer);
            const expectedInitial = normalizeString(state.roundLetter);

            let status = 'pending'; // pending, accepted, rejected
            const inputEl = playerName === currentUser.name ? document.querySelector(`.theme-answer[data-theme="${theme}"]`) : null;

            if (!answer) {
                status = 'rejected'; // Vazio é errado
                if (playerName === currentUser.name) {
                    erros++;
                    if(inputEl) inputEl.classList.add('shake');
                }
            } else if (!answer.startsWith(expectedInitial)) {
                status = 'rejected'; // Letra errada
                if (playerName === currentUser.name) {
                    erros++;
                    if(inputEl) inputEl.classList.add('shake');
                }
            } else {
                const dict = DICTIONARY[theme] || [];
                const found = dict.some(word => normalizeString(word) === answer);
                
                if (found) {
                    status = 'accepted'; // IA conhece
                    if (playerName === currentUser.name) acertos++;
                } else {
                    state.wordsToEvaluate.push({ playerName, theme, rawAnswer, answer, status: 'pending' });
                }
            }
            
            processedAnswers[playerName][theme] = {
                raw: rawAnswer,
                normalized: answer,
                status: status
            };
        }
    }

    // Atualiza o estado global com as respostas já processadas
    state.roundAnswers = processedAnswers;

    // Exibe a animação "Just Dance" apenas baseada na performance local
    if (erros > 0) {
        showJustDanceFeedback('miss');
    } else if (acertos === state.currentThemes.length) {
        showJustDanceFeedback('perfect');
    }

    setTimeout(() => {
        // Todo mundo vai para a tela de avaliação ver as respostas
        state.currentEvaluationThemeIndex = 0;
        renderEvaluationScreen();
    }, 2000);
}

function renderEvaluationScreen() {
    DOM.evaluationList.innerHTML = '';
    
    const isHost = currentRoomData && currentRoomData.hostId === currentUser.id;
    const theme = state.currentThemes[state.currentEvaluationThemeIndex];
    const progressText = `Tema ${state.currentEvaluationThemeIndex + 1} de ${state.currentThemes.length}`;

    // Adiciona o Wrapper da Animação CSS
    const animWrapper = document.createElement('div');
    animWrapper.className = 'slide-in-right';

    const themeSection = document.createElement('div');
    themeSection.className = 'eval-theme-section';
    themeSection.innerHTML = `
        <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px; font-weight: 600;">${progressText}</div>
        <h3 style="color: var(--blue-apple); border-bottom: 2px solid var(--blue-apple); padding-bottom: 5px; text-align: left;">${theme}</h3>
    `;
    
    const answersGrid = document.createElement('div');
    answersGrid.style.display = 'grid';
    answersGrid.style.gap = '10px';
    answersGrid.style.marginTop = '10px';
    
    state.players.forEach(playerName => {
        const ansData = state.roundAnswers[playerName][theme];
        const div = document.createElement('div');
        div.className = 'eval-item';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'flex-start';
        div.style.background = '#f9f9f9';
        div.style.padding = '10px';
        div.style.borderRadius = '8px';
        div.style.border = '1px solid #e8e8ed';
        
        let statusText = '';
        let actionsHTML = '';
        
        if (ansData.status === 'accepted') {
            statusText = `<span style="color: var(--green-apple); font-weight: bold; font-size: 13px;">✔ Sistema aprovou</span>`;
        } else if (ansData.status === 'rejected') {
            statusText = `<span style="color: var(--red-apple); font-weight: bold; font-size: 13px;">✖ Incorreto ou Vazio</span>`;
        } else {
            statusText = `<span style="color: #ff9500; font-weight: bold; font-size: 13px;">⚠ Sistema não reconheceu</span>`;
            
            if (isHost) {
                actionsHTML = `
                    <div class="eval-actions" style="margin-top: 8px; width: 100%; display: flex; justify-content: space-around;">
                        <button class="btn-text btn-accept" data-player="${playerName}" data-theme="${theme}" style="background: rgba(52, 199, 89, 0.1);">👍 Válido</button>
                        <button class="btn-text btn-reject" data-player="${playerName}" data-theme="${theme}" style="color:var(--red-apple); background: rgba(255, 59, 48, 0.1);">👎 Inválido</button>
                    </div>
                `;
            } else {
                actionsHTML = `
                    <div style="margin-top: 8px; font-size: 12px; color: var(--text-secondary); width: 100%; text-align: center;">
                        Aguardando o Host julgar...
                    </div>
                `;
            }
        }
        
        div.innerHTML = `
            <div style="width: 100%; text-align: left;">
                <small style="color:var(--text-secondary); font-weight: bold;">${playerName}</small><br>
                <span class="eval-word" style="font-size: 18px; display: block; margin: 4px 0;">${ansData.raw || '<em>(vazio)</em>'}</span>
                ${statusText}
            </div>
            ${actionsHTML}
        `;
        answersGrid.appendChild(div);
    });
    
    themeSection.appendChild(answersGrid);
    animWrapper.appendChild(themeSection);
    DOM.evaluationList.appendChild(animWrapper);

    if (isHost) {
        document.querySelectorAll('.btn-accept').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pName = e.target.dataset.player;
                const pTheme = e.target.dataset.theme;
                state.roundAnswers[pName][pTheme].status = 'accepted';
                e.target.style.background = 'var(--green-apple)';
                e.target.style.color = 'white';
                e.target.nextElementSibling.style.background = 'rgba(255, 59, 48, 0.1)';
                e.target.nextElementSibling.style.color = 'var(--red-apple)';
            });
        });

        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pName = e.target.dataset.player;
                const pTheme = e.target.dataset.theme;
                state.roundAnswers[pName][pTheme].status = 'rejected';
                e.target.style.background = 'var(--red-apple)';
                e.target.style.color = 'white';
                e.target.previousElementSibling.style.background = 'rgba(52, 199, 89, 0.1)';
                e.target.previousElementSibling.style.color = 'var(--blue-apple)';
            });
        });

        DOM.btnFinishEvaluation.style.display = 'block';
        if (state.currentEvaluationThemeIndex < state.currentThemes.length - 1) {
            DOM.btnFinishEvaluation.textContent = "Próximo Tema";
        } else {
            DOM.btnFinishEvaluation.textContent = "Finalizar Votação";
        }
    } else {
        DOM.btnFinishEvaluation.style.display = 'none';
        
        const waitMsg = document.createElement('div');
        waitMsg.style.textAlign = 'center';
        waitMsg.style.marginTop = '15px';
        waitMsg.style.color = 'var(--text-secondary)';
        waitMsg.innerHTML = '<strong>Aguarde o Host finalizar a votação...</strong>';
        DOM.evaluationList.appendChild(waitMsg);
    }

    showScreen(DOM.evaluation);
}

DOM.btnFinishEvaluation.addEventListener('click', async () => {
    const currentTheme = state.currentThemes[state.currentEvaluationThemeIndex];
    
    state.players.forEach(playerName => {
        if (state.roundAnswers[playerName][currentTheme].status === 'pending') {
            state.roundAnswers[playerName][currentTheme].status = 'rejected';
        }
    });
    
    let nextIndex = state.currentEvaluationThemeIndex + 1;
    let isFinished = nextIndex >= state.currentThemes.length;

    // O Host salva a decisão e avança a fase no Firebase para todos verem!
    await update(ref(db, `rooms/${currentRoomId}/gameState`), {
        evalIndex: nextIndex,
        isEvalFinished: isFinished,
        answers: state.roundAnswers // Envia as correções oficiais feitas pelo Host
    });
});

// 6. Pontuação e Placar
function calculateScores() {
    // Agrupar respostas para verificar palavras iguais
    const answersByTheme = {}; // { theme: { normalizedWord: [playerName1, playerName2] } }
    
    state.currentThemes.forEach(theme => {
        answersByTheme[theme] = {};
        state.players.forEach(playerName => {
            const ansData = state.roundAnswers[playerName][theme];
            if (ansData.status === 'accepted') {
                if (!answersByTheme[theme][ansData.normalized]) {
                    answersByTheme[theme][ansData.normalized] = [];
                }
                answersByTheme[theme][ansData.normalized].push(playerName);
            }
        });
    });

    // Calcular pontos
    state.players.forEach(playerName => {
        let roundScore = 0;
        state.currentThemes.forEach(theme => {
            const ansData = state.roundAnswers[playerName][theme];
            if (ansData.status === 'accepted') {
                const count = answersByTheme[theme][ansData.normalized].length;
                if (count > 1) {
                    roundScore += 5; // Palavra repetida
                } else {
                roundScore += 15; // Palavra única
                }
            } else if (ansData.status === 'rejected') {
                roundScore -= 5; // Penalidade por erro ou campo vazio
            }
        });
        state.scores[playerName] += roundScore;
    });

    renderScoreboard();
}

function renderScoreboard() {
    DOM.scoreboard.innerHTML = '';
    
    // Ordenar por pontuação
    const sortedPlayers = [...state.players].sort((a, b) => state.scores[b] - state.scores[a]);

    sortedPlayers.forEach(p => {
        const div = document.createElement('div');
        div.className = 'room-item';
        div.innerHTML = `<strong>${p}</strong> <strong>${state.scores[p] || 0} pts</strong>`;
        DOM.scoreboard.appendChild(div);
    });

    // Apenas o Host pode reiniciar a partida
    if (currentRoomData && currentRoomData.hostId === currentUser.id) {
        DOM.btnNextRound.style.display = 'block';
    } else {
        DOM.btnNextRound.style.display = 'none';
    }

    showScreen(DOM.results);
}

DOM.btnNextRound.addEventListener('click', async () => {
    // Retorna a sala para o status "waiting" e limpa o gameState
    const updates = {
        status: 'waiting',
        waitingSince: Date.now(),
        gameState: null,
        letterChoices: null
    };
    
    // Remove o status de "pronto" de todos para forçá-los a dar pronto novamente
    if (currentRoomData && currentRoomData.players) {
        Object.keys(currentRoomData.players).forEach(playerId => {
            updates[`players/${playerId}/isReady`] = false;
        });
    }

    await update(ref(db, `rooms/${currentRoomId}`), updates);
});

DOM.btnLeaveResults.addEventListener('click', () => {
    leaveRoom();
});
