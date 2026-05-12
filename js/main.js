// ========================================
// MAIN APPLICATION LOGIC
// ========================================

// State Management
const appState = {
    currentSection: 'home',
    darkMode: localStorage.getItem('darkMode') === 'true',
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
    scores: {
        snake: JSON.parse(localStorage.getItem('snakeScores')) || [],
        memory: JSON.parse(localStorage.getItem('memoryScores')) || [],
        tictactoe: JSON.parse(localStorage.getItem('tictactoeScores')) || { wins: 0, losses: 0, draws: 0 }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeSound();
    setupNavigation();
    setupHamburgerMenu();
    loadLeaderboard();
});

// ========================================
// NAVIGATION
// ========================================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const buttons = document.querySelectorAll('[data-section]');

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
            updateActiveNavLink(section);
            closeHamburgerMenu();
        });
    });

    // Other buttons with section data
    buttons.forEach(btn => {
        if (!btn.classList.contains('nav-link')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = btn.getAttribute('data-section');
                showSection(section);
                updateActiveNavLink(section);
                closeHamburgerMenu();
            });
        }
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        appState.currentSection = sectionId;
        
        // Initialize games when section is shown
        if (sectionId === 'tictactoe') {
            initTicTacToe();
        } else if (sectionId === 'snake') {
            initSnake();
        } else if (sectionId === 'memory') {
            initMemory();
        } else if (sectionId === 'leaderboard') {
            loadLeaderboard();
        }
    }
}

function updateActiveNavLink(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// ========================================
// HAMBURGER MENU
// ========================================

function setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

function closeHamburgerMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

// ========================================
// THEME MANAGEMENT
// ========================================

function initializeTheme() {
    const themeBtn = document.getElementById('themeBtn');
    
    if (appState.darkMode) {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }

    themeBtn.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    appState.darkMode = !appState.darkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', appState.darkMode);
    updateThemeIcon();
    playSound('click');
}

function updateThemeIcon() {
    const themeBtn = document.getElementById('themeBtn');
    const icon = themeBtn.querySelector('i');
    if (appState.darkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        themeBtn.title = 'Toggle Light Mode';
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        themeBtn.title = 'Toggle Dark Mode';
    }
}

// ========================================
// SOUND MANAGEMENT
// ========================================

function initializeSound() {
    const soundBtn = document.getElementById('soundBtn');
    updateSoundIcon();
    soundBtn.addEventListener('click', toggleSound);
}

function toggleSound() {
    appState.soundEnabled = !appState.soundEnabled;
    localStorage.setItem('soundEnabled', appState.soundEnabled);
    updateSoundIcon();
}

function updateSoundIcon() {
    const soundBtn = document.getElementById('soundBtn');
    const icon = soundBtn.querySelector('i');
    if (appState.soundEnabled) {
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
        soundBtn.title = 'Mute Sound';
    } else {
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
        soundBtn.title = 'Unmute Sound';
    }
}

function playSound(type) {
    if (!appState.soundEnabled) return;

    // Create sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sounds for different events
    switch (type) {
        case 'click':
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'success':
            oscillator.frequency.value = 1200;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'error':
            oscillator.frequency.value = 400;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
        case 'win':
            // Play a simple win melody
            const notes = [800, 1000, 1200];
            notes.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.1, audioContext.currentTime + (i * 0.1));
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (i * 0.1) + 0.1);
                osc.start(audioContext.currentTime + (i * 0.1));
                osc.stop(audioContext.currentTime + (i * 0.1) + 0.1);
            });
            break;
    }
}

// ========================================
// LEADERBOARD
// ========================================

function loadLeaderboard() {
    // Snake Leaderboard
    const snakeLeaderboard = document.getElementById('snake-leaderboard');
    const snakeScores = appState.scores.snake;
    
    if (snakeScores.length > 0) {
        snakeScores.sort((a, b) => b.score - a.score);
        const topScores = snakeScores.slice(0, 10);
        snakeLeaderboard.innerHTML = topScores.map((entry, index) => `
            <div class="leaderboard-entry">
                <div class="entry-rank">
                    <div class="rank-number">${index + 1}</div>
                    <div class="entry-name">Player</div>
                </div>
                <div class="entry-score">${entry.score} pts</div>
            </div>
        `).join('');
    } else {
        snakeLeaderboard.innerHTML = '<p class="empty-message">No scores yet. Play a game to get on the leaderboard!</p>';
    }

    // Memory Leaderboard
    const memoryLeaderboard = document.getElementById('memory-leaderboard');
    const memoryScores = appState.scores.memory;
    
    if (memoryScores.length > 0) {
        memoryScores.sort((a, b) => a.time - b.time);
        const topTimes = memoryScores.slice(0, 10);
        memoryLeaderboard.innerHTML = topTimes.map((entry, index) => `
            <div class="leaderboard-entry">
                <div class="entry-rank">
                    <div class="rank-number">${index + 1}</div>
                    <div class="entry-name">Player</div>
                </div>
                <div class="entry-score">${formatTime(entry.time)}</div>
            </div>
        `).join('');
    } else {
        memoryLeaderboard.innerHTML = '<p class="empty-message">No scores yet. Play a game to get on the leaderboard!</p>';
    }

    // Tic Tac Toe Stats
    const tttStats = appState.scores.tictactoe;
    document.getElementById('ttt-wins-stat').textContent = tttStats.wins || 0;
    document.getElementById('ttt-ai-wins-stat').textContent = tttStats.losses || 0;
    document.getElementById('ttt-draws-stat').textContent = tttStats.draws || 0;

    // Clear all scores button
    const clearBtn = document.getElementById('clear-all-scores');
    clearBtn.addEventListener('click', clearAllScores);
}

function clearAllScores() {
    if (confirm('Are you sure you want to clear all scores? This cannot be undone.')) {
        localStorage.removeItem('snakeScores');
        localStorage.removeItem('memoryScores');
        localStorage.removeItem('tictactoeScores');
        appState.scores = {
            snake: [],
            memory: [],
            tictactoe: { wins: 0, losses: 0, draws: 0 }
        };
        loadLeaderboard();
        playSound('success');
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function saveScore(game, score, additionalData = {}) {
    const timestamp = new Date().toISOString();
    
    if (game === 'snake') {
        const snakeScores = appState.scores.snake;
        snakeScores.push({ score, timestamp, ...additionalData });
        localStorage.setItem('snakeScores', JSON.stringify(snakeScores));
        appState.scores.snake = snakeScores;
    } else if (game === 'memory') {
        const memoryScores = appState.scores.memory;
        memoryScores.push({ score, timestamp, ...additionalData });
        localStorage.setItem('memoryScores', JSON.stringify(memoryScores));
        appState.scores.memory = memoryScores;
    }
}

function updateTicTacToeStats(result) {
    if (result === 'win') {
        appState.scores.tictactoe.wins++;
    } else if (result === 'loss') {
        appState.scores.tictactoe.losses++;
    } else if (result === 'draw') {
        appState.scores.tictactoe.draws++;
    }
    localStorage.setItem('tictactoeScores', JSON.stringify(appState.scores.tictactoe));
}

// ========================================
// PLACEHOLDER GAME INITIALIZERS
// ========================================

function initTicTacToe() {
    if (typeof window.tictactoeGame !== 'undefined') {
        window.tictactoeGame.init();
    }
}

function initSnake() {
    if (typeof window.snakeGame !== 'undefined') {
        window.snakeGame.init();
    }
}

function initMemory() {
    if (typeof window.memoryGame !== 'undefined') {
        window.memoryGame.init();
    }
}

// Initialize home section on load
showSection('home');
updateActiveNavLink('home');