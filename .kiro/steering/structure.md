# Project Structure

## Root Files
- `index.html` - Main HTML entry point with canvas element, HUD, and game overlays
- `game.js` - Complete game logic including physics, collision detection, rendering, and game state
- `style.css` - All styling for UI elements, HUD, overlays, and canvas
- `kiro-logo.png` - Player character sprite image

## Code Organization (game.js)

### Configuration
- `config` object - Game constants (canvas size, player physics, camera settings)

### State Management
- `game` object - Global game state (score, lives, level, running status, camera)
- `player` object - Player state (position, velocity, grounded status, sprite)
- `keys` object - Input state tracking
- `platforms` array - Level geometry and collision objects
- `collectibles` array - Star pickups for scoring

### Core Systems
- **Initialization** - `init()` sets up canvas, event listeners, loads assets
- **Level Loading** - `loadLevel()` generates platforms and collectibles per level
- **Game Loop** - `gameLoop()` using requestAnimationFrame
- **Update Logic** - `update()` handles input, physics, collisions, scoring
- **Rendering** - `render()` draws all game objects with camera offset
- **Collision Detection** - `checkCollision()` for AABB rectangle collision
- **UI Management** - Functions for HUD updates, game over, level complete screens

## Styling Structure (style.css)
- Global resets and body styling
- `.game-container` - Main game wrapper
- `.hud` - Score/lives/level display
- `.overlay` - Game over and level complete screens
- Button styles with hover/active states
- Controls instruction text
