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
    btnStop: document.getElementById('btn-stop'),
    
    evaluationList: document.getElementById('evaluation-list'),
    btnFinishEvaluation: document.getElementById('btn-finish-evaluation'),
    
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
    roundLetter: '',
    currentThemes: [],
    roundAnswers: {}, // { playerName: { theme: answer } }
    scores: {}, // { playerName: totalScore }
    timerInterval: null,
    timeLeft: 60,
    wordsToEvaluate: []
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
        if (currentRoomId) return; // Não atualiza lista se já estiver em uma sala
        
        DOM.roomsList.innerHTML = '';
        const data = snapshot.val();
        
        if (!data) {
            DOM.roomsList.innerHTML = '<p style="text-align:center; color:gray; padding: 20px;">Nenhuma sala encontrada.</p>';
            return;
        }

        Object.entries(data).forEach(([roomId, roomInfo]) => {
            if (roomInfo.status !== 'waiting') return; // Mostrar apenas salas aguardando
            
            const playersCount = roomInfo.players ? Object.keys(roomInfo.players).length : 0;
            
            // Deleta salas fantasmas (vazias) automaticamente
            if (playersCount === 0) {
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

    const roomRef = ref(db, `rooms/${currentRoomId}`);
    
    roomListenerUnsubscribe = onValue(roomRef, (snapshot) => {
        currentRoomData = snapshot.val();
        if (!currentRoomData) {
            // Sala foi deletada
            leaveRoom();
            return alert("A sala foi fechada.");
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
        if (currentRoomData.status === 'playing' && !state.isPlaying) {
            state.isPlaying = true;
            state.isEvaluating = false;
            prepareOnlineGame(currentRoomData.gameState);
        } else if (currentRoomData.status === 'playing' && state.isPlaying) {
            syncOnlineGame(currentRoomData.gameState);
        } else if (currentRoomData.status === 'waiting' && state.isPlaying) {
            // O host decidiu jogar novamente, voltando todos pro Lobby da sala
            state.isPlaying = false;
            state.isEvaluating = false;
            currentUser.isReady = false;
            DOM.btnReady.textContent = "Estou Pronto";
            showScreen(DOM.roomLobby);
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
    const allReady = players.length > 1 && players.every(p => p.isReady);
    
    // Controles do Host
    if (data.hostId === currentUser.id) {
        DOM.hostControls.classList.remove('hidden');
        DOM.btnStartGame.disabled = !allReady;
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
            sendSystemMessage(`${currentUser.name} saiu. ${newHostName} agora é o Host.`);
            await remove(ref(db, `rooms/${currentRoomId}/players/${currentUser.id}`));
        } else {
            // Jogador comum saindo
            sendSystemMessage(`${currentUser.name} saiu da sala.`);
            await remove(ref(db, `rooms/${currentRoomId}/players/${currentUser.id}`));
        }
    }
    
    forceLeaveRoom();
}

function forceLeaveRoom() {
    state.isPlaying = false;
    state.isEvaluating = false;
    currentRoomId = null;
    showScreen(DOM.rooms);
    loadRooms();
}

DOM.btnStartGame.addEventListener('click', async () => {
    const playersList = Object.values(currentRoomData.players || {});
    const playerNames = playersList.map(p => p.name);
    
    await update(ref(db, `rooms/${currentRoomId}`), {
        status: 'playing',
        gameState: {
            playersOrder: playerNames,
            currentTurnIndex: 0,
            turnEndTime: 0,
            roundLetter: getRandomLetter(),
            themes: shuffleArray([...ALL_THEMES]).slice(0, 4),
            answers: {}
        }
    });
});

// 4. Estrutura do Jogo Online Sincronizado
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
        }
        return;
    }

    const activePlayer = state.players[gameState.currentTurnIndex];
    state.currentPlayerIndex = gameState.currentTurnIndex;
    const isMyTurn = activePlayer === currentUser.name;

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
    });

    DOM.btnStop.style.display = isMyTurn ? 'block' : 'none';
    showScreen(DOM.game);
}

DOM.btnStop.addEventListener('click', () => {
    endOnlineTurn();
});

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
        if (state.wordsToEvaluate.length > 0) {
            renderEvaluationScreen();
        } else {
            calculateScores();
        }
    }, 2000);
}

function renderEvaluationScreen() {
    DOM.evaluationList.innerHTML = '';
    state.wordsToEvaluate.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'eval-item';
        div.innerHTML = `
            <div class="eval-details">
                <strong>${item.theme}:</strong> <span class="eval-word">${item.rawAnswer}</span> <br>
                <small style="color:var(--text-secondary)">por ${item.playerName}</small>
            </div>
            <div class="eval-actions">
                <button class="btn-text btn-accept" data-index="${index}">👍 Aceitar</button>
                <button class="btn-text btn-reject" data-index="${index}" style="color:var(--red-apple)">👎 Rejeitar</button>
            </div>
        `;
        DOM.evaluationList.appendChild(div);
    });

    // Eventos dos botões de avaliação
    document.querySelectorAll('.btn-accept').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            state.wordsToEvaluate[index].status = 'accepted';
            e.target.classList.add('selected');
            e.target.nextElementSibling.classList.remove('selected');
        });
    });

    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            state.wordsToEvaluate[index].status = 'rejected';
            e.target.classList.add('selected');
            e.target.previousElementSibling.classList.remove('selected');
        });
    });

    showScreen(DOM.evaluation);
}

DOM.btnFinishEvaluation.addEventListener('click', () => {
    // Atualizar status das palavras avaliadas
    state.wordsToEvaluate.forEach(item => {
        // Se não clicaram em nada, rejeita por padrão
        const finalStatus = item.status === 'pending' ? 'rejected' : item.status;
        state.roundAnswers[item.playerName][item.theme].status = finalStatus;
    });
    calculateScores();
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
                    roundScore += 10; // Palavra única
                }
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
        gameState: null
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
