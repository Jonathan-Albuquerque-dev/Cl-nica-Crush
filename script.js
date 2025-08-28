 const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');

        // --- ELEMENTOS DA UI ---
        const levelSelectionScreen = document.getElementById('level-selection-screen');
        const gameContainer = document.getElementById('game-container');
        const levelTitleEl = document.getElementById('level-title');
        const movesCounterEl = document.getElementById('moves-counter');
        const goalsListEl = document.getElementById('goals-list');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalFactEl = document.getElementById('modal-fact');
        const nextLevelBtn = document.getElementById('next-level-btn');
        const finishBtn = document.getElementById('finish-btn');

        // --- CONFIGURAÇÕES DO JOGO ---
        const COLS = 8;
        const ROWS = 8;
        let TILE_SIZE = 60;
        const PADDING = 10;
        const REMEDY_TYPES = 5;
        const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
        const REMEDY_NAMES = ['Analgésico', 'Antitérmico', 'Anti-inflamatório', 'Vitamina', 'Antibiótico'];

        const LEVELS = [
            { title: "Dor de Cabeça", moves: 20, goals: { 0: 15 }, fact: "Sabia que a dor de cabeça tensional, geralmente causada por estresse, é a mais comum? Analgésicos ajudam a bloquear os sinais de dor." },
            { title: "Controlar a Febre", moves: 25, goals: { 1: 20, 3: 10 }, fact: "A febre não é uma doença, mas uma defesa do corpo! A temperatura mais alta ajuda a combater vírus e bactérias." },
            { title: "Combater Infecção", moves: 30, goals: { 4: 15, 2: 15 }, fact: "Antibióticos só funcionam contra bactérias, não contra vírus (como os da gripe). Foram descobertos por acidente a partir de um mofo!" }
        ];

        let board = [], isAnimating = false, dragStartTile = null, isDragging = false, cursorPos = { x: 0, y: 0 };
        let currentLevelIndex = 0, movesLeft = 0, levelGoals = {};
        
        // --- LÓGICA DE RESPONSIVIDADE ---
        function resizeCanvas() {
            const screenWidth = window.innerWidth;
            let availableWidth;

            if (screenWidth <= 850) {
                availableWidth = screenWidth * 0.9;
            } else {
                const uiPanelWidth = 250;
                const gaps = 60;
                availableWidth = Math.min(screenWidth - uiPanelWidth - gaps, window.innerHeight * 0.8);
            }

            TILE_SIZE = Math.floor(availableWidth / COLS);
            canvas.width = COLS * TILE_SIZE;
            canvas.height = ROWS * TILE_SIZE;

            if (gameContainer.style.display === 'flex') {
                draw();
            }
        }

        // --- LÓGICA DA TELA DE SELEÇÃO ---
        function showLevelSelection() {
            gameContainer.style.display = 'none';
            document.querySelector('h1').style.display = 'block';
            levelSelectionScreen.style.display = 'flex';
            levelSelectionScreen.innerHTML = '';

            LEVELS.forEach((level, index) => {
                const card = document.createElement('div');
                card.className = 'level-card';
                let goalsHtml = '<div class="goals-list">';
                for(const type in level.goals) { goalsHtml += `<p>${level.goals[type]} x ${REMEDY_NAMES[type]}</p>`; }
                goalsHtml += '</div>';
                card.innerHTML = `<div><h2>${level.title}</h2><p>Movimentos: ${level.moves}</p>${goalsHtml}</div><button class="start-button" data-level="${index}">Começar Jogo</button>`;
                levelSelectionScreen.appendChild(card);
            });

            document.querySelectorAll('.start-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const levelIndex = parseInt(e.target.getAttribute('data-level'));
                    startGame(levelIndex);
                });
            });
        }

        function startGame(levelIndex) {
            levelSelectionScreen.style.display = 'none';
            document.querySelector('h1').style.display = 'none';
            gameContainer.style.display = 'flex';
            startLevel(levelIndex);
            resizeCanvas(); 
        }

        // --- LÓGICA DO JOGO ---
        function startLevel(levelIndex) {
            currentLevelIndex = levelIndex;
            const level = LEVELS[levelIndex];
            if (!level) {
                modalFactEl.innerHTML = "<strong>Parabéns!</strong><br>Você completou todos os desafios com sucesso.";
                nextLevelBtn.style.display = 'none';
                modalOverlay.style.display = 'flex';
                return;
            }
            movesLeft = level.moves;
            levelGoals = JSON.parse(JSON.stringify(level.goals));
            initBoard();
            updateUI();
        }

        function updateUI() {
            const level = LEVELS[currentLevelIndex];
            levelTitleEl.textContent = level.title;
            movesCounterEl.innerHTML = `Movimentos: <strong>${movesLeft}</strong>`;
            
            goalsListEl.innerHTML = "";
            for (const type in level.goals) {
                const remaining = levelGoals[type];
                const goalEl = document.createElement('div');
                goalEl.className = 'goal';
                goalEl.innerHTML = `
                    <div class="goal-color" style="background: linear-gradient(to bottom, ${COLORS[type]} 50%, #ffffff 50%)"></div>
                    <span>${REMEDY_NAMES[type]}: ${remaining > 0 ? remaining : 0}</span>
                `;
                goalsListEl.appendChild(goalEl);
            }
        }

        function initBoard() { /* ...código sem alterações... */ }
        function removeMatches(matches, shouldTrackGoal = true) { /* ...código sem alterações... */ }
        async function gameLoop() { /* ...código sem alterações... */ }
        function checkWinCondition() { /* ...código sem alterações... */ }
        
        // --- LÓGICA DO MODAL ---
        function showWinModal() { /* ...código sem alterações... */ }
        function hideModal() { /* ...código sem alterações... */ }
        nextLevelBtn.addEventListener('click', () => { hideModal(); startGame(currentLevelIndex + 1); });
        finishBtn.addEventListener('click', () => { hideModal(); showLevelSelection(); });

        async function handleSwap(tile1, tile2) { /* ...código sem alterações... */ }
        
        // --- Funções de Desenho, Animação e Controle ---
        const wait = (ms) => new Promise(res => setTimeout(res, ms));
        async function animateMatches(matches) { isAnimating = true; let scale = 1.0; const animationSpeed = 0.08; while (scale > 0) { scale -= animationSpeed; if (scale < 0) scale = 0; draw(); matches.forEach(match => { const tile = board[match.y][match.x]; if (tile) { drawPill(match.x, match.y, tile.type, scale); } }); await wait(10); } }
        async function animateDrop() { isAnimating = true; let somethingDropped; do { somethingDropped = false; for (let x = 0; x < COLS; x++) { for (let y = ROWS - 2; y >= 0; y--) { if (board[y][x] && !board[y + 1][x]) { board[y + 1][x] = board[y][x]; board[y][x] = null; somethingDropped = true; } } } if (somethingDropped) { draw(); await wait(80); } } while (somethingDropped); isAnimating = false; }
        
        function drawPill(x, y, type, scale = 1) {
            const pillWidth = (TILE_SIZE / 2) * scale;
            const pillHeight = (TILE_SIZE - PADDING) * scale;
            const radius = pillWidth / 2;

            if (radius <= 0) return;

            const drawX = x * TILE_SIZE + (TILE_SIZE - pillWidth) / 2;
            const drawY = y * TILE_SIZE + (TILE_SIZE - pillHeight) / 2;
            const middleY = drawY + pillHeight / 2;

            ctx.fillStyle = COLORS[type];
            ctx.fillRect(drawX, drawY + radius, pillWidth, (pillHeight / 2) - radius);
            ctx.beginPath();
            ctx.arc(drawX + radius, drawY + radius, radius, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(drawX, middleY, pillWidth, (pillHeight / 2) - radius);
            ctx.beginPath();
            ctx.arc(drawX + radius, middleY + (pillHeight / 2) - radius, radius, 0, Math.PI);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.ellipse(drawX + radius, drawY + pillHeight * 0.25, pillWidth * 0.3, pillHeight * 0.15, 0, 0, 2 * Math.PI);
            ctx.fill();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                    if (isDragging && dragStartTile && dragStartTile.x === x && dragStartTile.y === y) {
                        continue;
                    }
                    if (board[y] && board[y][x]) {
                        drawPill(x, y, board[y][x].type);
                    }
                }
            }
            if (isDragging && dragStartTile) {
                const tileData = board[dragStartTile.y][dragStartTile.x];
                if (tileData) {
                    const scale = 1.1;
                    const pillWidth = (TILE_SIZE / 2) * scale;
                    const pillHeight = (TILE_SIZE - PADDING) * scale;
                    
                    const startPixelX = dragStartTile.x * TILE_SIZE + TILE_SIZE / 2;
                    const startPixelY = dragStartTile.y * TILE_SIZE + TILE_SIZE / 2;
                    let deltaX = cursorPos.x - startPixelX;
                    let deltaY = cursorPos.y - startPixelY;

                    let finalPixelX, finalPixelY;

                    // **FIX: Lógica para restringir e limitar o movimento visual**
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        deltaY = 0; // Trava o movimento vertical
                        // Limita o movimento horizontal a uma casa de distância
                        deltaX = Math.max(-TILE_SIZE, Math.min(TILE_SIZE, deltaX));
                    } else {
                        deltaX = 0; // Trava o movimento horizontal
                        // Limita o movimento vertical a uma casa de distância
                        deltaY = Math.max(-TILE_SIZE, Math.min(TILE_SIZE, deltaY));
                    }

                    finalPixelX = startPixelX + deltaX;
                    finalPixelY = startPixelY + deltaY;

                    const drawX = finalPixelX - pillWidth / 2;
                    const drawY = finalPixelY - pillHeight / 2;
                    
                    // Reutiliza a lógica de desenho da pílula
                    const radius = pillWidth / 2;
                    const middleY = drawY + pillHeight / 2;
                    ctx.fillStyle = COLORS[tileData.type];
                    ctx.fillRect(drawX, drawY + radius, pillWidth, (pillHeight / 2) - radius);
                    ctx.beginPath();
                    ctx.arc(drawX + radius, drawY + radius, radius, Math.PI, 0);
                    ctx.fill();
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(drawX, middleY, pillWidth, (pillHeight / 2) - radius);
                    ctx.beginPath();
                    ctx.arc(drawX + radius, middleY + (pillHeight / 2) - radius, radius, 0, Math.PI);
                    ctx.fill();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                    ctx.beginPath();
                    ctx.ellipse(drawX + radius, drawY + pillHeight * 0.25, pillWidth * 0.3, pillHeight * 0.15, 0, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }
        function findMatches() { let matches = []; for (let y = 0; y < ROWS; y++) { for (let x = 0; x < COLS - 2; x++) { if (board[y][x] && board[y][x + 1] && board[y][x + 2] && board[y][x].type === board[y][x + 1].type && board[y][x + 1].type === board[y][x + 2].type) { matches.push({ x: x, y: y }, { x: x + 1, y: y }, { x: x + 2, y: y }); } } } for (let x = 0; x < COLS; x++) { for (let y = 0; y < ROWS - 2; y++) { if (board[y][x] && board[y + 1][x] && board[y + 2][x] && board[y][x].type === board[y + 1][x].type && board[y + 1][x].type === board[y + 2][x].type) { matches.push({ x: x, y: y }, { x: x, y: y + 1 }, { x: x, y: y + 2 }); } } } return [...new Set(matches.map(m => `${m.x},${m.y}`))].map(s => { const [x, y] = s.split(','); return { x: parseInt(x), y: parseInt(y) }; }); }
        function fillBoard() { for (let y = 0; y < ROWS; y++) { for (let x = 0; x < COLS; x++) { if (board[y][x] === null) { board[y][x] = { type: Math.floor(Math.random() * REMEDY_TYPES) }; } } } }
        function getTileAt(clientX, clientY) { const rect = canvas.getBoundingClientRect(); const x = clientX - rect.left; const y = clientY - rect.top; if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return null; return { x: Math.floor(x / TILE_SIZE), y: Math.floor(y / TILE_SIZE) }; }
        function updateCursorPos(e) { const rect = canvas.getBoundingClientRect(); cursorPos.x = e.clientX - rect.left; cursorPos.y = e.clientY - rect.top; }
        function onDragStart(e) { if (isAnimating) return; dragStartTile = getTileAt(e.clientX, e.clientY); if (dragStartTile) { isDragging = true; updateCursorPos(e); draw(); } }
        function onDragMove(e) { if (!isDragging) return; updateCursorPos(e); draw(); }
        async function onDragEnd(e) { if (isAnimating || !isDragging) return; const dragEndTile = getTileAt(e.clientX, e.clientY); isDragging = false; if (dragStartTile && dragEndTile) { const dx = Math.abs(dragEndTile.x - dragStartTile.x); const dy = Math.abs(dragEndTile.y - dragStartTile.y); if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) { await handleSwap(dragStartTile, dragEndTile); } } dragStartTile = null; draw(); }
        initBoard = function() { board = []; for (let y = 0; y < ROWS; y++) { board[y] = []; for (let x = 0; x < COLS; x++) { board[y][x] = { type: Math.floor(Math.random() * REMEDY_TYPES) }; } } while (findMatches().length > 0) { removeMatches(findMatches(), false); fillBoard(); } }
        removeMatches = function(matches, shouldTrackGoal = true) { if (matches.length > 0) { matches.forEach(match => { if (shouldTrackGoal && board[match.y][match.x]) { const type = board[match.y][match.x].type; if (levelGoals[type] !== undefined) { levelGoals[type]--; } } board[match.y][match.x] = null; }); updateUI(); return true; } return false; }
        gameLoop = async function() { isAnimating = true; let matches = findMatches(); while (matches.length > 0) { await animateMatches(matches); removeMatches(matches); await animateDrop(); await wait(100); fillBoard(); draw(); await wait(200); matches = findMatches(); } isAnimating = false; checkWinCondition(); }
        checkWinCondition = function() { let goalsMet = true; for (const type in levelGoals) { if (levelGoals[type] > 0) { goalsMet = false; break; } } if (goalsMet) { showWinModal(); } else if (movesLeft <= 0) { alert("Fim dos movimentos! Tente novamente."); showLevelSelection(); } }
        showWinModal = function() { const level = LEVELS[currentLevelIndex]; modalFactEl.textContent = level.fact; if (LEVELS[currentLevelIndex + 1]) { nextLevelBtn.style.display = 'inline-block'; } else { nextLevelBtn.style.display = 'none'; } modalOverlay.style.display = 'flex'; }
        hideModal = function() { modalOverlay.style.display = 'none'; }
        handleSwap = async function(tile1, tile2) { const temp = board[tile1.y][tile1.x]; board[tile1.y][tile1.x] = board[tile2.y][tile2.x]; board[tile2.y][tile2.x] = temp; if (findMatches().length > 0) { movesLeft--; updateUI(); await gameLoop(); } else { await wait(200); const temp = board[tile1.y][tile1.x]; board[tile1.y][tile1.x] = board[tile2.y][tile2.x]; board[tile2.y][tile2.x] = temp; } }

        // Event listeners
        canvas.addEventListener('mousedown', (e) => onDragStart(e));
        canvas.addEventListener('mousemove', (e) => onDragMove(e));
        canvas.addEventListener('mouseup', (e) => onDragEnd(e));
        canvas.addEventListener('mouseleave', (e) => onDragEnd(e));
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); onDragStart(e.touches[0]); });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); onDragMove(e.touches[0]); });
        canvas.addEventListener('touchend', (e) => { e.preventDefault(); onDragEnd(e.changedTouches[0]); });
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('load', resizeCanvas);

        // --- INICIAR O JOGO ---
        showLevelSelection();