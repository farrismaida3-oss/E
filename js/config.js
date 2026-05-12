// Configuration and constants
const GAMES = [
    { id: 'tictactoe', name: 'Tic Tac Toe', icon: '⭕', category: 'logic', description: 'Classic game of strategy' },
    { id: 'snake', name: 'Snake Game', icon: '🐍', category: 'action', description: 'Guide the snake' },
    { id: 'memory', name: 'Memory Match', icon: '🧠', category: 'memory', description: 'Test your memory' },
    { id: '2048', name: '2048', icon: '🎲', category: 'puzzle', description: 'Merge tiles to reach 2048' },
    { id: 'flappy', name: 'Flappy Bird', icon: '🐦', category: 'action', description: 'Tap to fly' },
    { id: 'pong', name: 'Pong', icon: '🎾', category: 'action', description: 'Classic paddle game' },
    { id: 'breakout', name: 'Breakout', icon: '🧱', category: 'action', description: 'Break the bricks' },
    { id: 'hangman', name: 'Hangman', icon: '🎭', category: 'puzzle', description: 'Guess the word' },
    { id: 'connect4', name: 'Connect 4', icon: '🔴', category: 'logic', description: 'Connect four in a row' },
    { id: 'minesweeper', name: 'Minesweeper', icon: '💣', category: 'logic', description: 'Avoid the mines' },
    { id: 'numberguess', name: 'Number Guess', icon: '🔢', category: 'logic', description: 'Guess the number' },
    { id: 'simon', name: 'Simon Says', icon: '🌈', category: 'memory', description: 'Remember the sequence' },
    { id: 'wordle', name: 'Wordle', icon: '📝', category: 'puzzle', description: 'Guess the word' },
    { id: 'rockpaperscissors', name: 'Rock Paper Scissors', icon: '✋', category: 'action', description: 'Beat the AI' },
    { id: 'dice', name: 'Dice Roller', icon: '🎲', category: 'logic', description: 'Roll the dice' }
];

const SOUND_EFFECTS = {
    click: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
    success: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
    error: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
};

const STORAGE_KEYS = {
    THEME: 'farrisGames_theme',
    SOUND: 'farrisGames_sound',
    SCORES: 'farrisGames_scores',
    STATS: 'farrisGames_stats'
};
