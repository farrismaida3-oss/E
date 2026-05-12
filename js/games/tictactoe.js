// ========================================
// TIC TAC TOE GAME
// ========================================

const tictactoeGame = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameActive: false,
    playerScore: 0,
    aiScore: 0,
    drawScore: 0,

    init() {
        this.loadScores();
        this.setupEventListeners();
        this.resetGame();
    },

    setupEventListeners() {
        const cells = document.querySelectorAll('#tictactoe-board .cell');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });

        const resetBtn = document.getElementById('ttt-reset');
        const resetScoresBtn = document.getElementById('ttt-reset-scores');

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }
        if (resetScoresBtn) {
            resetScoresBtn.addEventListener('click', () => this.resetScores());
        }
    },

    loadScores() {
        const tttStats = appState.scores.tictactoe;
        this.playerScore = tttStats.wins || 0;
        this.aiScore = tttStats.losses || 0;
        this.drawScore = tttStats.draws || 0;
        this.updateScoreDisplay();
    },

    resetGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.updateBoardDisplay();
        this.updateStatus('Your turn (X)');
    },

    resetScores() {
        if (confirm('Reset all scores to 0?')) {
            this.playerScore = 0;
            this.aiScore = 0;
            this.drawScore = 0;
            updateTicTacToeStats('reset');
            appState.scores.tictactoe = { wins: 0, losses: 0, draws: 0 };
            localStorage.setItem('tictactoeScores', JSON.stringify(appState.scores.tictactoe));
            this.updateScoreDisplay();
            this.resetGame();
            playSound('click');
        }
    },

    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '' || this.currentPlayer !== 'X') {
            return;
        }

        this.board[index] = 'X';
        this.currentPlayer = 'O';
        this.updateBoardDisplay();
        playSound('click');

        const result = this.checkResult();
        if (result) {
            this.endGame(result);
            return;
        }

        this.updateStatus('AI is thinking...');
        setTimeout(() => this.aiMove(), 500);
    },

    aiMove() {
        // Get best move
        const bestMove = this.getBestMove();
        this.board[bestMove] = 'O';
        this.updateBoardDisplay();
        playSound('click');

        const result = this.checkResult();
        if (result) {
            this.endGame(result);
            return;
        }

        this.currentPlayer = 'X';
        this.updateStatus('Your turn (X)');
    },

    getBestMove() {
        const winningMoves = this.findWinningMoves('O');
        if (winningMoves.length > 0) {
            return winningMoves[0];
        }

        const blockingMoves = this.findWinningMoves('X');
        if (blockingMoves.length > 0) {
            return blockingMoves[0];
        }

        // Prefer center
        if (this.board[4] === '') return 4;

        // Take corners
        const corners = [0, 2, 6, 8].filter(i => this.board[i] === '');
        if (corners.length > 0) {
            return corners[Math.floor(Math.random() * corners.length)];
        }

        // Take sides
        const sides = [1, 3, 5, 7].filter(i => this.board[i] === '');
        return sides[Math.floor(Math.random() * sides.length)];
    },

    findWinningMoves(player) {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        const availableMoves = [];
        winningCombos.forEach(combo => {
            const values = combo.map(i => this.board[i]);
            const playerCount = values.filter(v => v === player).length;
            const emptyCount = values.filter(v => v === '').length;

            if (playerCount === 2 && emptyCount === 1) {
                const emptyIndex = combo[values.indexOf('')];
                availableMoves.push(emptyIndex);
            }
        });

        return availableMoves;
    },

    checkResult() {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (
                this.board[a] &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]
            ) {
                return this.board[a];
            }
        }

        if (this.board.every(cell => cell !== '')) {
            return 'DRAW';
        }

        return null;
    },

    endGame(result) {
        this.gameActive = false;

        if (result === 'X') {
            this.updateStatus('🎉 You Won! Congratulations!');
            this.playerScore++;
            updateTicTacToeStats('win');
            playSound('win');
        } else if (result === 'O') {
            this.updateStatus('😔 AI Won! Try again.');
            this.aiScore++;
            updateTicTacToeStats('loss');
            playSound('error');
        } else if (result === 'DRAW') {
            this.updateStatus("🤝 It's a Draw!");
            this.drawScore++;
            updateTicTacToeStats('draw');
            playSound('success');
        }

        this.updateScoreDisplay();
    },

    updateBoardDisplay() {
        const cells = document.querySelectorAll('#tictactoe-board .cell');
        cells.forEach((cell, index) => {
            cell.textContent = this.board[index];
            cell.className = 'cell';
            if (this.board[index] === 'X') {
                cell.classList.add('x');
            } else if (this.board[index] === 'O') {
                cell.classList.add('o');
            }
        });
    },

    updateStatus(message) {
        const statusEl = document.getElementById('ttt-status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    },

    updateScoreDisplay() {
        document.getElementById('ttt-player-score').textContent = this.playerScore;
        document.getElementById('ttt-ai-score').textContent = this.aiScore;
        document.getElementById('ttt-draw-score').textContent = this.drawScore;
    }
};

// Export for use in main.js
window.tictactoeGame = tictactoeGame;