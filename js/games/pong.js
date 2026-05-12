// Pong Game
class PongGame {
    constructor() {
        this.canvas = document.getElementById('pongCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.paddleHeight = 100;
        this.paddleWidth = 10;
        this.ballSize = 8;
        this.playerPaddle = { x: 10, y: this.canvas.height / 2 - this.paddleHeight / 2, width: this.paddleWidth, height: this.paddleHeight, dy: 0 };
        this.aiPaddle = { x: this.canvas.width - 20, y: this.canvas.height / 2 - this.paddleHeight / 2, width: this.paddleWidth, height: this.paddleHeight };
        this.ball = { x: this.canvas.width / 2, y: this.canvas.height / 2, dx: 5, dy: 5, size: this.ballSize };
        this.playerScore = 0;
        this.aiScore = 0;
        this.gameRunning = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.draw();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        const startBtn = document.getElementById('pong-start');
        const resetBtn = document.getElementById('pong-reset');
        if (startBtn) startBtn.addEventListener('click', () => this.start());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
    }

    handleKeyDown(e) {
        if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') this.playerPaddle.dy = -7;
        if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') this.playerPaddle.dy = 7;
    }

    handleKeyUp(e) {
        if (['w', 'W', 's', 'S', 'ArrowUp', 'ArrowDown'].includes(e.key)) this.playerPaddle.dy = 0;
    }

    start() {
        if (this.gameRunning) return;
        this.gameRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        this.update();
        this.draw();
        if (this.gameRunning) requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Player paddle
        this.playerPaddle.y += this.playerPaddle.dy;
        if (this.playerPaddle.y < 0) this.playerPaddle.y = 0;
        if (this.playerPaddle.y + this.playerPaddle.height > this.canvas.height) this.playerPaddle.y = this.canvas.height - this.playerPaddle.height;

        // AI paddle
        const aiCenter = this.aiPaddle.y + this.aiPaddle.height / 2;
        if (aiCenter < this.ball.y - 35) this.aiPaddle.y += 6;
        else if (aiCenter > this.ball.y + 35) this.aiPaddle.y -= 6;

        // Ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Ball collision with top/bottom
        if (this.ball.y - this.ball.size < 0 || this.ball.y + this.ball.size > this.canvas.height) {
            this.ball.dy *= -1;
        }

        // Ball collision with paddles
        if (this.isColliding(this.ball, this.playerPaddle)) {
            this.ball.dx *= -1;
            this.ball.x = this.playerPaddle.x + this.playerPaddle.width + this.ball.size;
        }
        if (this.isColliding(this.ball, this.aiPaddle)) {
            this.ball.dx *= -1;
            this.ball.x = this.aiPaddle.x - this.ball.size;
        }

        // Score
        if (this.ball.x - this.ball.size < 0) {
            this.aiScore++;
            this.resetBall();
        }
        if (this.ball.x + this.ball.size > this.canvas.width) {
            this.playerScore++;
            this.resetBall();
        }
    }

    isColliding(ball, paddle) {
        return ball.x - ball.size < paddle.x + paddle.width &&
               ball.x + ball.size > paddle.x &&
               ball.y - ball.size < paddle.y + paddle.height &&
               ball.y + ball.size > paddle.y;
    }

    resetBall() {
        this.ball = { x: this.canvas.width / 2, y: this.canvas.height / 2, dx: (Math.random() > 0.5 ? 1 : -1) * 5, dy: (Math.random() - 0.5) * 8, size: this.ballSize };
        this.updateScore();
    }

    draw() {
        this.ctx.fillStyle = '#f9fafb';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#ccc';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Paddles
        this.ctx.fillStyle = '#6366f1';
        this.ctx.fillRect(this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.width, this.playerPaddle.height);
        this.ctx.fillRect(this.aiPaddle.x, this.aiPaddle.y, this.aiPaddle.width, this.aiPaddle.height);

        // Ball
        this.ctx.fillStyle = '#ec4899';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    updateScore() {
        const playerScoreEl = document.getElementById('pong-player-score');
        const aiScoreEl = document.getElementById('pong-ai-score');
        if (playerScoreEl) playerScoreEl.textContent = this.playerScore;
        if (aiScoreEl) aiScoreEl.textContent = this.aiScore;
    }

    reset() {
        this.gameRunning = false;
        this.playerScore = 0;
        this.aiScore = 0;
        this.resetBall();
        this.playerPaddle.y = this.canvas.height / 2 - this.paddleHeight / 2;
        this.draw();
    }
}

let pongGame = null;
document.addEventListener('DOMContentLoaded', () => {
    pongGame = new PongGame();
});
