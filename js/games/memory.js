// Memory Match Game
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.startTime = null;
        this.gameActive = false;
        this.difficulty = 'medium';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createCards();
    }

    setupEventListeners() {
        const startBtn = document.getElementById('memory-start');
        const resetBtn = document.getElementById('memory-reset');
        const difficultySelect = document.getElementById('memory-difficulty');

        if (startBtn) startBtn.addEventListener('click', () => this.startGame());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
                this.reset();
                this.createCards();
            });
        }
    }

    createCards() {
        const board = document.getElementById('memory-board');
        if (!board) return;

        const sizes = { easy: 8, medium: 8, hard: 36 };
        const size = sizes[this.difficulty];
        const cols = this.difficulty === 'hard' ? 6 : 4;
        board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        board.innerHTML = '';

        const emojis = ['🍎', '🍌', '🍒', '🍓', '🍊', '🍋', '🥝', '🍉', '🍇', '🍈', '🍍', '🥭', '🍑', '🍐', '🍏', '🥗', '🌽', '🥕'];
        const pairs = emojis.slice(0, size / 2);
        const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);

        this.cards = cards.map((emoji, index) => ({
            emoji,
            id: index,
            flipped: false,
            matched: false
        }));

        this.cards.forEach(card => {
            const cardEl = document.createElement('button');
            cardEl.className = 'memory-card';
            cardEl.dataset.id = card.id;
            cardEl.textContent = '?';
            cardEl.addEventListener('click', () => this.flipCard(card.id, cardEl));
            board.appendChild(cardEl);
        });
    }

    startGame() {
        this.reset();
        this.gameActive = true;
        this.startTime = Date.now();
    }

    flipCard(id, element) {
        if (!this.gameActive || this.flipped.length >= 2 || this.cards[id].matched) return;
        if (this.flipped.includes(id)) return;

        this.flipped.push(id);
        this.cards[id].flipped = true;
        element.textContent = this.cards[id].emoji;
        element.classList.add('flipped');

        if (this.flipped.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkMatch();
        }
    }

    checkMatch() {
        const [id1, id2] = this.flipped;
        if (this.cards[id1].emoji === this.cards[id2].emoji) {
            this.cards[id1].matched = true;
            this.cards[id2].matched = true;
            this.matched.push(id1, id2);
            this.flipped = [];

            if (this.matched.length === this.cards.length) {
                this.endGame();
            }
        } else {
            setTimeout(() => {
                document.querySelectorAll('.memory-card').forEach((el, idx) => {
                    if (!this.cards[idx].matched) {
                        el.textContent = '?';
                        el.classList.remove('flipped');
                        this.cards[idx].flipped = false;
                    }
                });
                this.flipped = [];
            }, 1000);
        }
    }

    updateDisplay() {
        const movesEl = document.getElementById('memory-moves');
        const matchesEl = document.getElementById('memory-matches');
        if (movesEl) movesEl.textContent = this.moves;
        if (matchesEl) matchesEl.textContent = this.matched.length / 2;
    }

    endGame() {
        this.gameActive = false;
        const time = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const bestTimeEl = document.getElementById('memory-best-time');
        if (bestTimeEl) bestTimeEl.textContent = timeStr;
        
        alert(`You won in ${this.moves} moves and ${timeStr}!`);
    }

    reset() {
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.gameActive = false;
        this.updateDisplay();
        document.querySelectorAll('.memory-card').forEach(el => {
            el.textContent = '?';
            el.classList.remove('flipped', 'matched');
        });
    }
}

let memoryGame = null;
document.addEventListener('DOMContentLoaded', () => {
    memoryGame = new MemoryGame();
});
