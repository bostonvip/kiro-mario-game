# 🎮 Super Kiro World

A browser-based 2D platformer game featuring side-scrolling gameplay, particle effects, enemy obstacles, and persistent high score tracking. Built with vanilla JavaScript and HTML5 Canvas.

![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### 🎯 Core Gameplay
- **Side-scrolling platformer** with smooth camera movement
- **Collectible stars** for scoring points
- **Multiple levels** with progressive difficulty
- **Lives system** with respawning mechanics
- **Goal flags** to complete levels

### 🎨 Visual Effects
- **Trail particles** that follow player movement
- **Explosion effects** on collisions
- **Sparkle animations** when collecting stars
- **Confetti celebration** for new high scores
- **Kiro brand colors** throughout (#790ECB purple, #FFD700 gold)

### 👾 Enemy System
- **Patrol enemies** (red) - Move horizontally between boundaries
- **Bouncer enemies** (teal) - Move vertically with bounce patterns
- **Smart AI** with boundary detection and direction reversal
- **Collision detection** with explosion effects

### 💾 Score Persistence
- **High score tracking** across browser sessions
- **LocalStorage integration** for data persistence
- **Real-time score updates** in HUD
- **Automatic high score detection** with celebrations

---

## 🚀 Quick Start

### Play the Game

1. **Clone or download** this repository
2. **Open `index.html`** in any modern web browser
3. **Start playing!** No installation or build process required

```bash
# Clone the repository
git clone <repository-url>
cd super-kiro-world

# Open in browser (or just double-click index.html)
open index.html
```

### Controls

| Key | Action |
|-----|--------|
| **Arrow Keys** or **A/D** | Move left/right |
| **Space** or **W** or **↑** | Jump |

---

## 📁 Project Structure

```
super-kiro-world/
├── index.html              # Main game HTML
├── game.js                 # Complete game logic
├── style.css               # Game styling
├── kiro-logo.png          # Player character sprite
├── README.md              # This file
│
├── test-verification.html  # Automated test suite
├── QUICK-TEST-GUIDE.md    # Quick testing instructions
├── CHECKPOINT-SUMMARY.md  # Implementation details
│
└── .kiro/
    └── specs/
        └── game-enhancements/
            ├── requirements.md  # Feature requirements
            ├── design.md       # Technical design
            └── tasks.md        # Implementation tasks
```

---

## 🎮 How to Play

### Objective
Collect stars, avoid enemies, and reach the goal flag to complete each level!

### Gameplay Tips
1. **Collect stars** to increase your score (100 points each)
2. **Avoid enemies** - touching them costs you a life
3. **Watch for explosions** - they indicate collisions
4. **Beat your high score** to trigger confetti celebration
5. **Reach the green goal flag** to complete the level

### Scoring
- Each star collected: **+100 points**
- High score persists across browser sessions
- New high scores trigger special confetti effects

### Lives System
- Start with **3 lives**
- Lose a life when:
  - Colliding with an enemy
  - Falling off the map
- Game over when all lives are lost
- Respawn at start position after losing a life

---

## 🛠️ Technical Details

### Tech Stack
- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript (ES6+)** - Game logic
- **CSS3** - UI styling
- **LocalStorage API** - Score persistence

### Architecture
- **No dependencies** - Pure client-side code
- **No build process** - Run directly in browser
- **Modular design** - Separate systems for particles, enemies, scoring
- **60 FPS target** - Smooth gameplay with requestAnimationFrame

### Key Systems

#### Score Manager
```javascript
ScoreManager.saveScore(score)      // Save to LocalStorage
ScoreManager.loadHighScore()       // Load from LocalStorage
ScoreManager.updateHighScore(score) // Update if new high
ScoreManager.isNewHighScore(score) // Check if beats current
```

#### Particle System
```javascript
ParticleSystem.createTrail(x, y, vx, vy)  // Player trails
ParticleSystem.createExplosion(x, y, count) // Collision effects
ParticleSystem.createSparkle(x, y)        // Collection effects
ParticleSystem.createConfetti()           // High score celebration
```

#### Enemy System
```javascript
EnemySystem.spawnEnemies(level)    // Create enemies for level
EnemySystem.update()               // Update AI and movement
EnemySystem.render(ctx, camera)    // Draw enemies
EnemySystem.checkPlayerCollision() // Detect collisions
```

---

## 🧪 Testing

### Quick Test (30 seconds)
1. Open `index.html` in browser
2. Move around - see trail particles ✨
3. Collect a star - see sparkle effect ⭐
4. Touch an enemy - see explosion 💥
5. Refresh page - high score persists 💾

### Automated Tests
Open `test-verification.html` in your browser and click the test buttons to run:
- Score persistence tests
- Particle system tests
- Enemy system tests
- Integration tests

### Browser Console Verification
Press **F12** to open console, then paste:
```javascript
console.log("ScoreManager:", typeof ScoreManager !== 'undefined');
console.log("ParticleSystem:", typeof ParticleSystem !== 'undefined');
console.log("EnemySystem:", typeof EnemySystem !== 'undefined');
console.log("High Score:", game.highScore);
console.log("Active Particles:", ParticleSystem.particles.length);
console.log("Active Enemies:", EnemySystem.enemies.length);
```

---

## 🎨 Customization

### Modify Game Settings
Edit the `config` object in `game.js`:

```javascript
const config = {
    canvas: {
        width: 800,
        height: 600
    },
    player: {
        speed: 5,        // Movement speed
        jumpPower: 12,   // Jump height
        gravity: 0.5,    // Gravity strength
        friction: 0.8    // Ground friction
    }
};
```

### Add More Enemies
Edit `EnemySystem.spawnEnemies()` in `game.js`:

```javascript
enemyConfigs.push({
    x: 1000,           // X position
    y: 400,            // Y position
    type: 'patrol',    // 'patrol' or 'bouncer'
    minX: 900,         // Left boundary (patrol)
    maxX: 1200         // Right boundary (patrol)
});
```

### Change Colors
Modify particle colors in `ParticleSystem` methods:

```javascript
color: '#790ECB'  // Kiro purple
color: '#FFD700'  // Gold
color: '#FF6B6B'  // Red
color: '#4ECDC4'  // Teal
```

---

## 🐛 Troubleshooting

### High score not saving?
- Ensure LocalStorage is enabled in your browser
- Check browser console (F12) for errors
- Try: `localStorage.clear()` then restart game

### No particles showing?
- Verify game is running (not paused)
- Check browser console for JavaScript errors
- Try moving the player character

### No enemies visible?
- Scroll right in the level (enemies spawn at x > 800)
- Check browser console for errors
- Verify `EnemySystem.enemies.length > 0` in console

### Performance issues?
- Close other browser tabs
- Reduce particle count in `config` object
- Try a different browser (Chrome recommended)

---

## 📝 Development

### Adding New Features

1. **New particle effect:**
   - Add method to `ParticleSystem`
   - Call from appropriate game event
   - Update particle rendering if needed

2. **New enemy type:**
   - Add to `enemyConfigs` in `spawnEnemies()`
   - Implement movement logic in `EnemySystem.update()`
   - Add visual styling in `EnemySystem.render()`

3. **New level:**
   - Modify `loadLevel()` function
   - Add platform configurations
   - Add collectible positions
   - Configure enemy spawns

### Code Style
- Use ES6+ features (const, let, arrow functions)
- Modular design with separate systems
- Clear naming conventions
- Comments for complex logic
- No external dependencies

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions
- Additional enemy types
- Power-ups and special abilities
- Sound effects and music
- More levels with unique themes
- Mobile touch controls
- Leaderboard system
- Achievement system

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ using vanilla JavaScript
- Kiro logo used as player sprite
- Inspired by classic platformer games
- Created during AWS re:Invent workshop

---

## 📞 Support

Having issues? Here's how to get help:

1. Check the **Troubleshooting** section above
2. Review `QUICK-TEST-GUIDE.md` for testing instructions
3. Check browser console (F12) for error messages
4. Open an issue on GitHub with:
   - Browser and version
   - Steps to reproduce
   - Console error messages
   - Expected vs actual behavior

---

## 🎯 Roadmap

### Completed ✅
- [x] Core platformer mechanics
- [x] Score persistence system
- [x] Particle effects (trail, explosion, sparkle, confetti)
- [x] Enemy system (patrol and bouncer types)
- [x] High score tracking
- [x] Multiple levels
- [x] Lives system

### Future Enhancements 🚀
- [ ] Sound effects and background music
- [ ] Additional enemy types
- [ ] Power-ups (double jump, invincibility, etc.)
- [ ] Boss battles
- [ ] Level editor
- [ ] Mobile touch controls
- [ ] Online leaderboard
- [ ] Achievement system
- [ ] Save game progress
- [ ] Difficulty settings

---

## 🎮 Play Now!

Ready to play? Just open `index.html` in your browser and start your adventure in Super Kiro World!

**Have fun and beat that high score! 🏆✨**

---

<div align="center">

Made with 💜 by the Kiro Team

[Report Bug](https://github.com/your-repo/issues) · [Request Feature](https://github.com/your-repo/issues) · [Documentation](.kiro/specs/game-enhancements/)

</div>
