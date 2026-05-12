// Main Application Logic
class FarrisGames {
    constructor() {
        this.currentSection = 'home';
        this.soundEnabled = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.loadSound();
        this.populateGamesGrid();
        this.updateStats();
        this.setupGameNavigation();
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Game card buttons
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.classList.contains('nav-link')) {
                    e.preventDefault();
                    this.navigateToSection(btn.dataset.section);
                }
            });
        });

        // Theme toggle
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                ThemeManager.toggle();
                this.updateThemeIcon();
            });
        }

        // Sound toggle
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                SoundManager.toggle();
                this.updateSoundIcon();
            });
        }

        // Search and filter
        const searchInput = document.getElementById('gameSearch');
        const categorySelect = document.getElementById('gameCategory');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterGames());
        }
        if (categorySelect) {
            categorySelect.addEventListener('change', () => this.filterGames());
        }

        // Leaderboard clear button
        const clearBtn = document.getElementById('clear-all-scores');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => GameStorage.clearAllScores());
        }
    }

    setupGameNavigation() {
        document.querySelectorAll('.btn-back').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(btn.dataset.section);
            });
        });
    }

    navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            this.currentSection = sectionId;
        }

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });

        // Scroll to top
        window.scrollTo(0, 0);
    }

    populateGamesGrid() {
        const gamesGrid = document.getElementById('gamesGrid');
        if (!gamesGrid) return;

        gamesGrid.innerHTML = GAMES.map(game => `
            <div class="game-card" data-category="${game.category}" data-game="${game.id}">
                <div class="game-icon">${game.icon}</div>
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <button class="btn btn-secondary" data-section="${game.id}">Play</button>
            </div>
        `).join('');

        // Reattach event listeners
        gamesGrid.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(btn.dataset.section);
            });
        });
    }

    filterGames() {
        const searchValue = document.getElementById('gameSearch')?.value.toLowerCase() || '';
        const categoryValue = document.getElementById('gameCategory')?.value || 'all';
        const cards = document.querySelectorAll('.game-card');

        cards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const category = card.dataset.category;
            const matchesSearch = name.includes(searchValue);
            const matchesCategory = categoryValue === 'all' || category === categoryValue;

            card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });
    }

    updateThemeIcon() {
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            const isDark = document.body.classList.contains('dark-mode');
            themeBtn.innerHTML = isDark ? '☀️' : '🌙';
        }
    }

    updateSoundIcon() {
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
            const isMuted = localStorage.getItem(STORAGE_KEYS.SOUND) === 'false';
            soundBtn.innerHTML = isMuted ? '🔇' : '🔊';
        }
    }

    loadTheme() {
        ThemeManager.init();
        this.updateThemeIcon();
    }

    loadSound() {
        SoundManager.init();
        this.updateSoundIcon();
    }

    updateStats() {
        const stats = GameStorage.getStats();
        const totalPlays = Object.values(stats).reduce((sum, game) => sum + (game.plays || 0), 0);
        const totalScore = Object.values(stats).reduce((sum, game) => sum + (game.totalScore || 0), 0);

        const playsEl = document.getElementById('totalPlays');
        const scoreEl = document.getElementById('totalScore');
        if (playsEl) playsEl.textContent = totalPlays;
        if (scoreEl) scoreEl.textContent = totalScore;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new FarrisGames();
});

// Helper function to navigate to game
function navigateTo(section) {
    if (window.game) {
        window.game.navigateToSection(section);
    }
}

function backToGames() {
    navigateTo('games');
}

function resetCurrentGame() {
    // Will be overridden by individual games
    console.log('Reset current game');
}
