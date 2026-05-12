// Tic Tac Toe Game
class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.isXNext = true;
        this.gameOver = false;
        this.scores = { player: 0, ai: 0, draws: 0 };
        this.init();
    }

    init() {
        this.loadScores();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        const cells = document.querySelectorAll('#tictactoe-board .cell');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });

        const resetBtn = document.getElementById('ttt-reset');
        const resetScoresBtn = document.getElementById('ttt-reset-scores');
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
        if (resetScoresBtn) resetScoresBtn.addEventListener('click', () => this.resetScores());
    }

    handleCellClick(index) {
        if (this.board[index] || this.gameOver) return;
        
        this.board[index] = 'X';
        this.render();
        
        if (this.checkWinner()) {
            this.gameOver = true;
            this.scores.player++;
            this.updateStatus('You won! 🎉');
            this.saveScores();
            return;
        }

        if (this.isBoardFull()) {
            this.gameOver = true;
            this.scores.draws++;
            this.updateStatus('Draw!');
            this.saveScores();
            return;
        }

        this.isXNext = false;
        this.render();
        setTimeout(() => this.aiMove(), 500);
    }

    aiMove() {
        const emptyIndices = this.board
            .map((cell, idx) => cell === null ? idx : null)
            .filter(val => val !== null);
        
        if (emptyIndices.length === 0) return;
        
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        this.board[randomIndex] = 'O';
        this.render();

        if (this.checkWinner('O')) {
            this.gameOver = true;
            this.scores.ai++;
            this.updateStatus('AI won!');
            this.saveScores();
            return;
        }

        if (this.isBoardFull()) {
            this.gameOver = true;
            this.scores.draws++;
            this.updateStatus('Draw!');
            this.saveScores();
            return;
        }

        this.isXNext = true;
        this.render();
    }

    checkWinner(player = 'X') {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return lines.some(line => line.every(i => this.board[i] === player));
    }

    isBoardFull() {
        return this.board.every(cell => cell !== null);
    }

    updateStatus(message) {
        const statusEl = document.getElementById('ttt-status');
        if (statusEl) statusEl.textContent = message;
    }

    render() {
        const cells = document.querySelectorAll('#tictactoe-board .cell');
        cells.forEach((cell, index) => {
            cell.textContent = this.board[index];
            cell.classList.remove('x', 'o');
            if (this.board[index] === 'X') cell.classList.add('x');
            if (this.board[index] === 'O') cell.classList.add('o');
        });

        if (!this.gameOver) {
            this.updateStatus(this.isXNext ? 'Your turn (X)' : 'AI thinking...');
        }

        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        const playerScore = document.getElementById('ttt-player-score');
        const aiScore = document.getElementById('ttt-ai-score');
        const drawScore = document.getElementById('ttt-draw-score');
        const winsStats = document.getElementById('ttt-wins-stat');
        const aiWinsStats = document.getElementById('ttt-ai-wins-stat');
        const drawsStats = document.getElementById('ttt-draws-stat');

        if (playerScore) playerScore.textContent = this.scores.player;
        if (aiScore) aiScore.textContent = this.scores.ai;
        if (drawScore) drawScore.textContent = this.scores.draws;
        if (winsStats) winsStats.textContent = this.scores.player;
        if (aiWinsStats) aiWinsStats.textContent = this.scores.ai;
        if (drawsStats) drawsStats.textContent = this.scores.draws;
    }

    reset() {
        this.board = Array(9).fill(null);
        this.isXNext = true;
        this.gameOver = false;
        this.render();
    }

    resetScores() {
        if (confirm('Reset all scores?')) {
            this.scores = { player: 0, ai: 0, draws: 0 };
            this.reset();
            this.saveScores();
        }
    }

    saveScores() {
        localStorage.setItem('tictactoe_scores', JSON.stringify(this.scores));
    }

    loadScores() {
        const saved = localStorage.getItem('tictactoe_scores');
        if (saved) {
            this.scores = JSON.parse(saved);
            this.updateScoreDisplay();
        }
    }
}

// Initialize Tic Tac Toe when game section is shown
let tictactoeGame = null;
document.addEventListener('DOMContentLoaded', () => {
    tictactoeGame = new TicTacToe();
});
