// ========================================
// SNAKE GAME
// ========================================

const snakeGame = {
    canvas: null,
    ctx: null,
    gridSize: 20,
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    score: 0,
    highScore: 0,
    gameActive: false,
    gameRunning: false,
    speed: 1,
    difficulty: 'medium',
    gameLoopId: null,

    init() {
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = this.canvas.width / 20; // Adjust grid size based on canvas
        this.loadHighScore();
        this.setupEventListeners();
        this.resetGame();
        this.draw();
    },

    setupEventListeners() {
        const startBtn = document.getElementById('snake-start');
        const resetBtn = document.getElementById('snake-reset');
        const difficultySelect = document.getElementById('snake-difficulty');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
                this.setSpeedByDifficulty();
                this.resetGame();
            });
        }

        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    },

    loadHighScore() {
        const scores = appState.scores.snake;
        this.highScore = scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0;
        this.updateScoreDisplay();
    },

    setSpeedByDifficulty() {
        switch (this.difficulty) {
            case 'easy':
                this.speed = 1;
                break;
            case 'medium':
                this.speed = 2;
                break;
            case 'hard':
                this.speed = 3;
                break;
        }
    },

    startGame() {
        if (this.gameRunning) {
            this.pauseGame();
        } else {
            this.gameRunning = true;
            this.gameActive = true;
            this.setSpeedByDifficulty();
            document.getElementById('snake-start').textContent = 'Pause Game';
            this.gameLoop();
        }
    },

    pauseGame() {
        this.gameRunning = false;
        document.getElementById('snake-start').textContent = 'Resume Game';
        cancelAnimationFrame(this.gameLoopId);
    },

    resetGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.generateFood();
        this.gameRunning = false;
        this.gameActive = true;
        this.setSpeedByDifficulty();
        this.updateScoreDisplay();
        document.getElementById('snake-start').textContent = 'Start Game';
        this.draw();
    },

    generateFood() {
        let foodValid = false;
        while (!foodValid) {
            this.food = {
                x: Math.floor(Math.random() * 20),
                y: Math.floor(Math.random() * 20)
            };
            foodValid = !this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y);
        }
    },

    handleKeyPress(e) {
        if (!this.gameActive) return;

        const key = e.key.toLowerCase();
        const arrowKey = e.code;

        // Prevent default scrolling
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(arrowKey)) {
            e.preventDefault();
        }

        switch (key) {
            case 'w':
            case 'arrowup':
                if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
                break;
            case 's':
            case 'arrowdown':
                if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
                break;
            case 'a':
            case 'arrowleft':
                if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
                break;
            case 'd':
            case 'arrowright':
                if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
                break;
        }
    },

    gameLoop() {
        if (!this.gameRunning || !this.gameActive) return;

        // Control game speed
        const updateInterval = 100 - (this.speed * 25);

        this.update();
        this.draw();

        this.gameLoopId = setTimeout(() => this.gameLoop(), updateInterval);
    },

    update() {
        if (!this.gameRunning || !this.gameActive) return;

        this.direction = { ...this.nextDirection };

        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10 * this.speed;
            playSound('success');
            this.updateScoreDisplay();
            this.generateFood();
        } else {
            this.snake.pop();
        }
    },

    gameOver() {
        this.gameRunning = false;
        this.gameActive = false;
        playSound('error');
        saveScore('snake', this.score);
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.updateScoreDisplay();
        alert(`Game Over! Final Score: ${this.score}\nHigh Score: ${this.highScore}`);
    },

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = '#222';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= 20; i++) {
            const pos = i * this.gridSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }

        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#10b981';
            } else {
                // Body
                this.ctx.fillStyle = '#34d399';
            }
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw food
        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    },

    updateScoreDisplay() {
        document.getElementById('snake-score').textContent = this.score;
        document.getElementById('snake-highscore').textContent = this.highScore;
        document.getElementById('snake-speed').textContent = this.speed;
    }
};

// Export for use in main.js
window.snakeGame = snakeGame;