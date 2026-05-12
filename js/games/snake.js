// Snake Game
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.gameRunning = false;
        this.gameSpeed = 100;
        this.highScore = localStorage.getItem('snake_highscore') || 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateScore();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        const startBtn = document.getElementById('snake-start');
        const resetBtn = document.getElementById('snake-reset');
        const difficultySelect = document.getElementById('snake-difficulty');

        if (startBtn) startBtn.addEventListener('click', () => this.startGame());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => this.setDifficulty(e.target.value));
        }
    }

    handleKeyPress(e) {
        if (!this.gameRunning) return;
        
        switch(e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
                e.preventDefault();
                break;
            case 'arrowdown':
            case 's':
                if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
                e.preventDefault();
                break;
            case 'arrowleft':
            case 'a':
                if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
                e.preventDefault();
                break;
            case 'arrowright':
            case 'd':
                if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
                e.preventDefault();
                break;
        }
    }

    startGame() {
        this.gameRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameRunning) return;

        this.update();
        this.draw();
        setTimeout(() => this.gameLoop(), this.gameSpeed);
    }

    update() {
        this.direction = this.nextDirection;
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Check collision with walls
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.endGame();
            return;
        }

        // Check collision with self
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.spawnFood();
            this.updateScore();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        this.ctx.fillStyle = '#f9fafb';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = '#e5e7eb';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.canvas.height; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }

        // Draw snake
        this.ctx.fillStyle = '#6366f1';
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;
            if (index === 0) {
                this.ctx.fillStyle = '#ec4899';
            } else {
                this.ctx.fillStyle = '#6366f1';
            }
            this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
        });

        // Draw food
        this.ctx.fillStyle = '#10b981';
        const foodX = this.food.x * this.gridSize;
        const foodY = this.food.y * this.gridSize;
        this.ctx.beginPath();
        this.ctx.arc(foodX + this.gridSize / 2, foodY + this.gridSize / 2, this.gridSize / 2 - 1, 0, Math.PI * 2);
        this.ctx.fill();
    }

    spawnFood() {
        this.food = {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
        };
    }

    endGame() {
        this.gameRunning = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snake_highscore', this.highScore);
        }
        alert(`Game Over! Score: ${this.score}`);
    }

    updateScore() {
        const scoreEl = document.getElementById('snake-score');
        const highScoreEl = document.getElementById('snake-highscore');
        if (scoreEl) scoreEl.textContent = this.score;
        if (highScoreEl) highScoreEl.textContent = this.highScore;
    }

    setDifficulty(level) {
        const speeds = { easy: 150, medium: 100, hard: 50 };
        this.gameSpeed = speeds[level] || 100;
        const speedEl = document.getElementById('snake-speed');
        if (speedEl) speedEl.textContent = level === 'easy' ? '1' : level === 'medium' ? '2' : '3';
    }

    reset() {
        this.gameRunning = false;
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.spawnFood();
        this.updateScore();
        this.draw();
    }
}

let snakeGame = null;
document.addEventListener('DOMContentLoaded', () => {
    snakeGame = new SnakeGame();
});
