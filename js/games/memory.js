// ========================================
// MEMORY MATCHING GAME
// ========================================

const memoryGame = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    gameActive: false,
    difficulty: 'medium',
    startTime: null,
    bestTime: null,
    gameTime: 0,

    symbols: ['🌟', '🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎹', '🎺', '🎻', '🥁'],

    init() {
        this.loadBestTime();
        this.setupEventListeners();
        this.createGame();
    },

    setupEventListeners() {
        const startBtn = document.getElementById('memory-start');
        const resetBtn = document.getElementById('memory-reset');
        const difficultySelect = document.getElementById('memory-difficulty');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.createGame());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.createGame());
        }
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
                this.createGame();
            });
        }
    },

    loadBestTime() {
        const scores = appState.scores.memory;
        if (scores.length > 0) {
            this.bestTime = Math.min(...scores.map(s => s.time));
        }
        this.updateBestTimeDisplay();
    },

    createGame() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameActive = true;
        this.startTime = Date.now();
        this.gameTime = 0;

        // Set up cards based on difficulty
        let pairCount = 0;
        if (this.difficulty === 'easy' || this.difficulty === 'medium') {
            pairCount = 8; // 4x4 grid
        } else if (this.difficulty === 'hard') {
            pairCount = 18; // 6x6 grid
        }

        // Create pairs
        const gameSymbols = this.symbols.slice(0, pairCount);
        gameSymbols.forEach((symbol, index) => {
            this.cards.push({ id: index * 2, symbol, matched: false });
            this.cards.push({ id: index * 2 + 1, symbol, matched: false });
        });

        // Shuffle
        this.cards.sort(() => Math.random() - 0.5);

        this.renderBoard();
        this.updateStats();
    },

    renderBoard() {
        const board = document.getElementById('memory-board');
        board.innerHTML = '';

        let gridClass = 'grid-4';
        if (this.difficulty === 'hard') {
            gridClass = 'grid-6';
        }
        board.className = `memory-board ${gridClass}`;

        this.cards.forEach((card) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card';
            cardEl.dataset.id = card.id;

            if (card.matched) {
                cardEl.classList.add('matched');
                cardEl.textContent = card.symbol;
            }

            cardEl.addEventListener('click', () => this.flipCard(cardEl, card));
            board.appendChild(cardEl);
        });
    },

    flipCard(cardEl, card) {
        if (!this.gameActive || card.matched) return;
        if (this.flippedCards.some(c => c.id === card.id)) return;
        if (this.flippedCards.length >= 2) return;

        cardEl.classList.add('flipped');
        cardEl.textContent = card.symbol;
        this.flippedCards.push(card);
        playSound('click');

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.checkMatch();
        }
    },

    checkMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.symbol === card2.symbol) {
            // Match found
            setTimeout(() => {
                card1.matched = true;
                card2.matched = true;
                this.matchedPairs++;
                playSound('success');

                document.querySelector(`[data-id="${card1.id}"]`)?.classList.add('matched');
                document.querySelector(`[data-id="${card2.id}"]`)?.classList.add('matched');

                this.flippedCards = [];

                if (this.matchedPairs === this.cards.length / 2) {
                    this.gameWon();
                }
            }, 600);
        } else {
            // No match
            setTimeout(() => {
                document.querySelector(`[data-id="${card1.id}"]`)?.classList.remove('flipped');
                document.querySelector(`[data-id="${card2.id}"]`)?.classList.remove('flipped');

                document.querySelector(`[data-id="${card1.id}"]`).textContent = '';
                document.querySelector(`[data-id="${card2.id}"]`).textContent = '';

                this.flippedCards = [];
            }, 1000);
        }
    },

    gameWon() {
        this.gameActive = false;
        this.gameTime = Date.now() - this.startTime;

        // Save score
        saveScore('memory', this.moves, { time: this.gameTime });

        // Update best time
        if (!this.bestTime || this.gameTime < this.bestTime) {
            this.bestTime = this.gameTime;
        }
        this.updateBestTimeDisplay();

        playSound('win');
        const message = `🎉 You won!\nMoves: ${this.moves}\nTime: ${formatTime(this.gameTime)}${this.bestTime === this.gameTime ? '\n🏆 New record!' : ''}`;
        setTimeout(() => {
            alert(message);
        }, 300);
    },

    updateStats() {
        document.getElementById('memory-moves').textContent = this.moves;
        document.getElementById('memory-matches').textContent = this.matchedPairs;
    },

    updateBestTimeDisplay() {
        const bestTimeEl = document.getElementById('memory-best-time');
        if (bestTimeEl) {
            bestTimeEl.textContent = this.bestTime ? formatTime(this.bestTime) : '--:--';
        }
    }
};

// Export for use in main.js
window.memoryGame = memoryGame;