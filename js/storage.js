// Storage Management
class GameStorage {
    static saveScore(gameName, score, metadata = {}) {
        const scores = this.getScores();
        if (!scores[gameName]) scores[gameName] = [];
        
        const entry = {
            score: score,
            date: new Date().toISOString(),
            ...metadata
        };
        
        scores[gameName].push(entry);
        scores[gameName] = scores[gameName].sort((a, b) => b.score - a.score).slice(0, 10);
        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
        return entry;
    }

    static getScores(gameName = null) {
        const scores = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCORES) || '{}');
        if (gameName) return scores[gameName] || [];
        return scores;
    }

    static saveStats(stats) {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    }

    static getStats() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || '{}');
    }

    static clearAllScores() {
        if (confirm('Are you sure you want to clear all scores?')) {
            localStorage.removeItem(STORAGE_KEYS.SCORES);
            localStorage.removeItem(STORAGE_KEYS.STATS);
            location.reload();
        }
    }

    static getHighScore(gameName) {
        const scores = this.getScores(gameName);
        return scores.length > 0 ? scores[0].score : 0;
    }

    static updateStats(gameName, stats) {
        const allStats = this.getStats();
        allStats[gameName] = { ...allStats[gameName], ...stats };
        this.saveStats(allStats);
    }
}

// Audio Management
class SoundManager {
    static init() {
        this.enabled = localStorage.getItem(STORAGE_KEYS.SOUND) !== 'false';
    }

    static play(type = 'click') {
        if (!this.enabled) return;
        const audio = document.getElementById('soundEffect');
        if (audio && SOUND_EFFECTS[type]) {
            audio.src = SOUND_EFFECTS[type];
            audio.play().catch(() => {});
        }
    }

    static toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem(STORAGE_KEYS.SOUND, this.enabled);
        return this.enabled;
    }
}

// Theme Management
class ThemeManager {
    static init() {
        const isDark = localStorage.getItem(STORAGE_KEYS.THEME) === 'dark';
        if (isDark) this.toggle();
    }

    static toggle() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
        return isDark;
    }
}
