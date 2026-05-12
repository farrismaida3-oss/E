// Flappy Bird Game
class FlappyBird {
    constructor() {
        this.canvas = document.getElementById('flappyCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.bird = { x: 50, y: this.canvas.height / 2, width: 30, height: 30, velocity: 0 };
        this.gravity = 0.5;
        this.flapPower = -12;
        this.pipes = [];
        this.pipeWidth = 50;
        this.pipeGap = 120;
        this.pipeDistance = 200;
        this.score = 0;
        this.bestScore = localStorage.getItem('flappy_best') || 0;
        this.gameRunning = false;
        this.gameOver = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateBestScore();
        this.draw();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.gameRunning) this.start();
                else this.flap();
            }
        });
        document.addEventListener('click', () => {
            if (!this.gameRunning) this.start();
            else this.flap();
        });

        const startBtn = document.getElementById('flappy-start');
        const resetBtn = document.getElementById('flappy-reset');
        if (startBtn) startBtn.addEventListener('click', () => this.start());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
    }

    start() {
        if (this.gameRunning) return;
        this.gameRunning = true;
        this.gameOver = false;
        this.gameLoop();
    }

    flap() {
        this.bird.velocity = this.flapPower;
    }

    gameLoop() {
        this.update();
        this.draw();
        if (this.gameRunning) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    update() {
        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;

        // Check collision with top and bottom
        if (this.bird.y + this.bird.height > this.canvas.height || this.bird.y < 0) {
            this.endGame();
            return;
        }

        // Spawn pipes
        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - this.pipeDistance) {
            const gapStart = Math.random() * (this.canvas.height - this.pipeGap - 50) + 25;
            this.pipes.push({ x: this.canvas.width, gapStart });
        }

        // Update pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].x -= 5;
            
            // Check collision with pipes
            if (this.checkPipeCollision(this.pipes[i])) {
                this.endGame();
                return;
            }
            
            // Check if pipe passed
            if (this.pipes[i].x + this.pipeWidth < this.bird.x && !this.pipes[i].passed) {
                this.pipes[i].passed = true;
                this.score++;
                this.updateScore();
            }
            
            // Remove off-screen pipes
            if (this.pipes[i].x < -this.pipeWidth) {
                this.pipes.splice(i, 1);
            }
        }
    }

    checkPipeCollision(pipe) {
        const topPipe = { x: pipe.x, y: 0, width: this.pipeWidth, height: pipe.gapStart };
        const bottomPipe = { x: pipe.x, y: pipe.gapStart + this.pipeGap, width: this.pipeWidth, height: this.canvas.height - pipe.gapStart - this.pipeGap };

        return this.isColliding(this.bird, topPipe) || this.isColliding(this.bird, bottomPipe);
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#e0f2fe';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bird
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillRect(this.bird.x, this.bird.y, this.bird.width, this.bird.height);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(this.bird.x + 20, this.bird.y + 10, 5, 5);

        // Draw pipes
        this.ctx.fillStyle = '#10b981';
        this.pipes.forEach(pipe => {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.gapStart);
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.gapStart + this.pipeGap, this.pipeWidth, this.canvas.height - pipe.gapStart - this.pipeGap);
        });
    }

    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('flappy_best', this.bestScore);
        }
        this.updateBestScore();
    }

    updateScore() {
        const scoreEl = document.getElementById('flappy-score');
        if (scoreEl) scoreEl.textContent = this.score;
    }

    updateBestScore() {
        const bestEl = document.getElementById('flappy-best');
        if (bestEl) bestEl.textContent = this.bestScore;
    }

    reset() {
        this.gameRunning = false;
        this.gameOver = false;
        this.bird = { x: 50, y: this.canvas.height / 2, width: 30, height: 30, velocity: 0 };
        this.pipes = [];
        this.score = 0;
        this.updateScore();
        this.draw();
    }
}

let flappyGame = null;
document.addEventListener('DOMContentLoaded', () => {
    flappyGame = new FlappyBird();
});
