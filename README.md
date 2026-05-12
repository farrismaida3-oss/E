# Farris Games - Browser Games Website

A modern, fully responsive web-based gaming platform featuring three classic games: Tic Tac Toe, Snake, and Memory Match. Built with vanilla HTML, CSS, and JavaScript.

## 🎮 Features

### Games Included

1. **Tic Tac Toe** ⭕❌
   - Play against an intelligent AI opponent
   - Score tracking (wins, losses, draws)
   - Restart and reset score options
   - Optimal AI decision-making

2. **Snake Game** 🐍
   - Classic snake gameplay
   - Three difficulty levels (Easy, Medium, Hard)
   - Score system with high score tracking
   - Grid-based canvas rendering
   - Smooth keyboard controls

3. **Memory Match** 🧠
   - Flip and match emoji pairs
   - Two difficulty levels (4x4 and 6x6 grids)
   - Move counter and best time tracker
   - Leaderboard integration

### Global Features

- ✨ **Dark Mode Toggle** - Switch between light and dark themes
- 🔊 **Sound Effects** - Play/mute game sounds (Web Audio API)
- 📊 **Leaderboard** - Track high scores for Snake and Memory Match
- 💾 **LocalStorage** - All scores persist across browser sessions
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful gradient designs and smooth animations
- ♿ **Accessible** - Keyboard navigation and focus states

## 📁 Project Structure

```
farris-games/
├── index.html                 # Main HTML file
├── css/
│   └── style.css             # All styles and responsive design
├── js/
│   ├── main.js               # Navigation, theme, sound, leaderboard
│   └── games/
│       ├── tictactoe.js      # Tic Tac Toe game logic
│       ├── snake.js          # Snake game logic
│       └── memory.js         # Memory matching game logic
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server required!
- No external dependencies

### Installation

1. **Clone or download the repository:**
   ```bash
   git clone https://github.com/farrismaida3-oss/E.git
   cd E
   ```

2. **Open the website:**
   - Simply open `index.html` in your web browser
   - Or use a local server for better performance:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (with http-server)
     npx http-server
     
     # Using Live Server in VS Code
     # Install Live Server extension and click "Go Live"
     ```

3. **Navigate to:**
   - `http://localhost:8000` (or the port shown in terminal)

## 📈 Deploying to GitHub Pages

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Farris Games website"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/farrismaida3-oss/E.git

# Push to main branch
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Scroll to **Pages** section (left sidebar)
4. Under "Source", select the branch (usually `main`)
5. Select the folder (`/ (root)` or `/docs` if applicable)
6. Click **Save**

### Step 3: Access Your Site

Your site will be available at:
```
https://farrismaida3-oss.github.io/E/
```

It may take 1-2 minutes for GitHub Pages to build and deploy.

## 🎮 How to Play

### Tic Tac Toe
- Click on empty cells to place your X
- AI automatically places O
- First to get 3 in a row wins
- Click "New Game" to restart
- Scores are tracked automatically

### Snake Game
- **Controls:** Arrow keys or WASD
- **Objective:** Eat red food to grow and score points
- **Avoid:** Hitting walls or your own body
- **Difficulty:** Choose Easy (slow), Medium (normal), or Hard (fast)
- **Score:** Each food eaten = 10 points × speed multiplier

### Memory Match
- Click cards to flip them and reveal symbols
- Match pairs of identical symbols
- Fewer moves = better score
- Complete the game to see your time
- Leaderboard tracks best times

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #6366f1;      /* Change this */
    --secondary-color: #ec4899;    /* And this */
    /* ... more colors ... */
}
```

### Adding More Games
1. Create a new game file: `js/games/yourname.js`
2. Add HTML section in `index.html`
3. Add navigation link
4. Initialize the game in `main.js`

### Modifying Game Rules
- **Snake difficulty:** Adjust speed multipliers in `js/games/snake.js`
- **Memory grid sizes:** Change pairCount in `js/games/memory.js`
- **AI difficulty:** Modify getBestMove() in `js/games/tictactoe.js`

## 💾 Data Storage

All game data is stored locally in your browser's **localStorage**:
- Snake high scores
- Memory match best times
- Tic Tac Toe statistics
- Theme preference (dark mode)
- Sound preference

Data persists even after closing the browser. To clear:
1. Click "Clear All Scores" on the Leaderboard page
2. Or clear browser data manually

## 🔊 Sound Features

The game uses the **Web Audio API** to generate:
- Click sounds for button presses
- Success sounds for correct matches
- Error sounds for collisions
- Victory sounds when games are won

You can toggle sound on/off with the speaker icon in the navbar.

## 🌙 Dark Mode

Click the moon icon in the navbar to toggle between light and dark themes. Your preference is saved automatically.

## 📱 Mobile Optimization

The website is fully responsive:
- **Mobile:** Touch controls, optimized layouts
- **Tablet:** Adjusted grid sizes
- **Desktop:** Full features and animations

Hamburger menu appears on screens smaller than 768px.

## 🧪 Testing Checklist

- [x] All navigation links work
- [x] All games function correctly
- [x] Scores persist after page reload
- [x] Dark mode toggle works
- [x] Sound can be toggled
- [x] Leaderboard updates correctly
- [x] Responsive design on mobile
- [x] No console errors
- [x] Animations are smooth
- [x] All buttons are clickable
- [x] Game AI works correctly
- [x] Score systems accurate

## 🐛 Known Issues

None currently! Please report any bugs you find.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Credits

Built with vanilla HTML, CSS, and JavaScript - no frameworks required!

## 📞 Support

For questions or issues:
1. Check that you're using a modern browser
2. Clear your browser cache
3. Try a different browser
4. Check browser console for errors (F12)

## 🎯 Future Enhancements

Potential additions:
- Multiplayer games
- More game varieties
- Daily challenges
- Achievement system
- Difficulty progressions
- Sound effect library
- Game statistics/analytics
- Social sharing

---

**Enjoy Farris Games! 🎮✨**

Made with ❤️ by Farris Maida