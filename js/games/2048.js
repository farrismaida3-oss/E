// 2048 Game
class Game2048 {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.init();
    }

    init() {
        this.newBoard();
        this.setupEventListeners();
        this.render();
    }

    newBoard() {
        this.board = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
        this.addNewTile();
        this.addNewTile();
        this.score = 0;
        this.gameOver = false;
        this.won = false;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        const newGameBtn = document.getElementById('btn-new-game-2048');
        if (newGameBtn) newGameBtn.addEventListener('click', () => this.newGame());
    }

    handleKeyPress(e) {
        const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (!keys.includes(e.key)) return;
        
        e.preventDefault();
        const directions = {
            'ArrowUp': (-1, 0),
            'ArrowDown': (1, 0),
            'ArrowLeft': (0, -1),
            'ArrowRight': (0, 1)
        };
        
        const moved = this.move(e.key);
        if (moved) {
            this.addNewTile();
            this.render();
            this.checkGameState();
        }
    }

    move(direction) {
        const original = JSON.stringify(this.board);
        
        if (direction === 'ArrowLeft') this.moveLeft();
        else if (direction === 'ArrowRight') this.moveRight();
        else if (direction === 'ArrowUp') this.moveUp();
        else if (direction === 'ArrowDown') this.moveDown();
        
        return JSON.stringify(this.board) !== original;
    }

    moveLeft() {
        for (let i = 0; i < this.size; i++) {
            let row = this.board[i].filter(val => val !== 0);
            row = this.merge(row);
            while (row.length < this.size) row.push(0);
            this.board[i] = row;
        }
    }

    moveRight() {
        for (let i = 0; i < this.size; i++) {
            let row = this.board[i].filter(val => val !== 0).reverse();
            row = this.merge(row);
            while (row.length < this.size) row.push(0);
            this.board[i] = row.reverse();
        }
    }

    moveUp() {
        for (let i = 0; i < this.size; i++) {
            let col = [];
            for (let j = 0; j < this.size; j++) col.push(this.board[j][i]);
            col = col.filter(val => val !== 0);
            col = this.merge(col);
            while (col.length < this.size) col.push(0);
            for (let j = 0; j < this.size; j++) this.board[j][i] = col[j];
        }
    }

    moveDown() {
        for (let i = 0; i < this.size; i++) {
            let col = [];
            for (let j = 0; j < this.size; j++) col.push(this.board[j][i]);
            col = col.filter(val => val !== 0).reverse();
            col = this.merge(col);
            while (col.length < this.size) col.push(0);
            col = col.reverse();
            for (let j = 0; j < this.size; j++) this.board[j][i] = col[j];
        }
    }

    merge(arr) {
        const merged = [];
        for (let i = 0; i < arr.length; i++) {
            if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
                merged.push(arr[i] * 2);
                this.score += arr[i] * 2;
                i++;
            } else {
                merged.push(arr[i]);
            }
        }
        return merged;
    }

    addNewTile() {
        const empty = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) empty.push({i, j});
            }
        }
        if (empty.length > 0) {
            const {i, j} = empty[Math.floor(Math.random() * empty.length)];
            this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    checkGameState() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 2048 && !this.won) {
                    this.won = true;
                    alert('You reached 2048! 🎉');
                }
            }
        }
        
        let canMove = false;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) canMove = true;
                if (j + 1 < this.size && this.board[i][j] === this.board[i][j + 1]) canMove = true;
                if (i + 1 < this.size && this.board[i][j] === this.board[i + 1][j]) canMove = true;
            }
        }
        if (!canMove) this.gameOver = true;
    }

    render() {
        const scoreEl = document.getElementById('game2048-score');
        if (scoreEl) scoreEl.textContent = this.score;
        
        const board = document.getElementById('game-board-2048');
        if (!board) return;
        
        board.innerHTML = '';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile-2048';
                tile.dataset.value = this.board[i][j] || 0;
                tile.textContent = this.board[i][j] || '';
                board.appendChild(tile);
            }
        }
    }

    newGame() {
        this.newBoard();
        this.render();
    }
}

let game2048 = null;
document.addEventListener('DOMContentLoaded', () => {
    game2048 = new Game2048();
});
