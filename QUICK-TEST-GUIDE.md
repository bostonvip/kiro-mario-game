# Quick Test Guide - Super Kiro World Enhancements

## 🚀 Quick Start

1. **Open the game**: Open `index.html` in your browser
2. **Play and observe**: All features should work automatically!

---

## ✅ What to Look For (30-Second Test)

### 1. Score Persistence (10 seconds)
1. Collect a few stars
2. Note your score
3. Refresh the page (F5)
4. ✅ **High Score should persist!**

### 2. Visual Effects (10 seconds)
1. Move around - ✅ **See purple trail particles**
2. Jump - ✅ **Trail particles increase**
3. Run into a platform side - ✅ **See explosion effect**
4. Collect a star - ✅ **See gold sparkle effect**

### 3. Enemy System (10 seconds)
1. Look for red enemies (patrol) - ✅ **Moving horizontally**
2. Look for teal enemies (bouncer) - ✅ **Moving vertically**
3. Touch an enemy - ✅ **Explosion + lose 1 life**

### 4. High Score Celebration
1. Clear LocalStorage: Open browser console and type:
   ```javascript
   localStorage.clear()
   ```
2. Refresh the page
3. Collect stars until you get a new high score
4. ✅ **See confetti celebration!**

---

## 🧪 Automated Tests

Open `test-verification.html` in your browser and click the test buttons to run automated verification.

---

## 🎮 Full Gameplay Test (2 minutes)

1. Start game
2. Move through level collecting stars
3. Observe all visual effects
4. Avoid/collide with enemies
5. Reach goal flag
6. Progress to next level
7. Verify everything works smoothly

---

## 🐛 Troubleshooting

### No high score showing?
- Check browser console for errors
- Verify LocalStorage is enabled
- Try: `localStorage.setItem('kiroworld_highscore', '1000')` then refresh

### No particles showing?
- Check browser console for errors
- Verify game is running (not paused)
- Try moving the player character

### No enemies showing?
- Scroll right in the level
- Enemies spawn at x positions: 800, 1200, 1500, 2000, etc.

---

## 📊 Browser Console Verification

Open browser console (F12) and paste:

```javascript
// Quick verification
console.log("✅ ScoreManager:", typeof ScoreManager !== 'undefined');
console.log("✅ ParticleSystem:", typeof ParticleSystem !== 'undefined');
console.log("✅ EnemySystem:", typeof EnemySystem !== 'undefined');
console.log("📊 High Score:", game.highScore);
console.log("🎨 Active Particles:", ParticleSystem.particles.length);
console.log("👾 Active Enemies:", EnemySystem.enemies.length);
console.log("\n🎮 All systems operational!");
```

Expected output:
```
✅ ScoreManager: true
✅ ParticleSystem: true
✅ EnemySystem: true
📊 High Score: [your high score]
🎨 Active Particles: [number of particles]
👾 Active Enemies: 9
🎮 All systems operational!
```

---

## ✨ Feature Checklist

- [x] Score persistence across browser sessions
- [x] Trail particles during movement
- [x] Explosion effects on collisions
- [x] Sparkle effects on star collection
- [x] Confetti celebration on new high score
- [x] Patrol enemies (horizontal movement)
- [x] Bouncer enemies (vertical movement)
- [x] Enemy collision detection
- [x] Life reduction on enemy collision
- [x] Player respawn after collision
- [x] High score display in HUD
- [x] All effects use Kiro brand colors

---

## 🎯 Success Criteria

✅ **All features working** = You see trails, explosions, sparkles, enemies, and high score persists
✅ **No console errors** = Open F12, no red error messages
✅ **Smooth gameplay** = 60 FPS, no lag or stuttering
✅ **Visual polish** = Effects look good and enhance gameplay

---

## 📝 Feedback

If you encounter any issues or have suggestions, note:
1. What you were doing
2. What you expected to happen
3. What actually happened
4. Any console errors (F12)

---

**Ready to play? Open `index.html` and enjoy Super Kiro World! 🎮✨**
