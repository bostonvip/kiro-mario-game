# Design Document: Game Enhancements

## Overview

This design extends Super Kiro World with three major enhancement categories: persistent score tracking, rich particle-based visual effects, and an enemy obstacle system. The implementation leverages the existing game loop, rendering pipeline, and collision detection system while introducing new subsystems for particle management, local storage persistence, and enemy AI.

The design maintains the vanilla JavaScript architecture with no external dependencies, ensuring compatibility with the existing codebase. All new features integrate seamlessly with the current game state management and rendering cycle.

## Architecture

### High-Level Component Structure

```
Game Loop (existing)
├── Update Phase
│   ├── Input Handling (existing)
│   ├── Physics & Collision (existing)
│   ├── Enemy AI (new)
│   ├── Particle System Update (new)
│   └── Score Management (enhanced)
└── Render Phase
    ├── Background & Platforms (existing)
    ├── Collectibles (existing)
    ├── Enemies (new)
    ├── Particle Effects (new)
    └── Player (existing)

Storage Layer (new)
├── LocalStorage Interface
└── Score Persistence

Particle System (new)
├── Trail Particles
├── Explosion Particles
├── Sparkle Particles
└── Confetti Particles
```

### Integration Points

1. **Game State Extension**: Add `highScore`, `particleSystems`, and `enemies` arrays to the existing `game` object
2. **Update Loop Enhancement**: Insert particle system updates and enemy AI updates into the existing `update()` function
3. **Render Loop Enhancement**: Add particle rendering and enemy rendering to the existing `render()` function
4. **Collision Detection Reuse**: Leverage existing `checkCollision()` for enemy collision detection
5. **Storage Integration**: Hook into game start, score updates, and game over events for persistence

## Components and Interfaces

### 1. Score Persistence Module

**Purpose**: Manage reading and writing scores to browser LocalStorage

**Interface**:
```javascript
const ScoreManager = {
    saveScore(score),           // Save current score
    loadHighScore(),            // Retrieve high score, returns 0 if none
    updateHighScore(newScore),  // Update if newScore > current high score
    isNewHighScore(score)       // Check if score beats high score
}
```

**Storage Keys**:
- `kiroworld_highscore`: Stores the all-time high score as an integer

### 2. Particle System

**Purpose**: Manage creation, update, and rendering of all particle effects

**Base Particle Structure**:
```javascript
{
    x: number,              // World position X
    y: number,              // World position Y
    velocityX: number,      // Horizontal velocity
    velocityY: number,      // Vertical velocity
    life: number,           // Remaining lifetime (0-1)
    maxLife: number,        // Initial lifetime in frames
    size: number,           // Particle size
    color: string,          // CSS color
    type: string            // 'trail', 'explosion', 'sparkle', 'confetti'
}
```

**Particle System Interface**:
```javascript
const ParticleSystem = {
    particles: [],                              // Active particles array
    
    // Creation methods
    createTrail(x, y, velocityX, velocityY),   // Create trail particle
    createExplosion(x, y, count),               // Create explosion burst
    createSparkle(x, y),                        // Create sparkle effect
    createConfetti(),                           // Create screen-wide confetti
    
    // System methods
    update(),                                   // Update all particles
    render(ctx, cameraX),                       // Render all particles
    cleanup()                                   // Remove dead particles
}
```

**Particle Behaviors**:
- **Trail**: Spawns behind player, fades quickly, minimal velocity
- **Explosion**: Radiates outward from point, affected by gravity, fades over time
- **Sparkle**: Rotates and expands, bright colors, quick fade
- **Confetti**: Falls with gravity, rotates, uses brand colors, persists longer

### 3. Enemy System

**Purpose**: Manage enemy spawning, AI movement, and collision

**Enemy Structure**:
```javascript
{
    x: number,              // World position X
    y: number,              // World position Y
    width: number,          // Collision box width
    height: number,         // Collision box height
    velocityX: number,      // Horizontal velocity
    velocityY: number,      // Vertical velocity
    type: string,           // 'patrol' or 'bouncer'
    color: string,          // Render color
    minX: number,           // Movement boundary (patrol type)
    maxX: number,           // Movement boundary (patrol type)
    minY: number,           // Movement boundary (bouncer type)
    maxY: number            // Movement boundary (bouncer type)
}
```

**Enemy Types**:
1. **Patrol Enemy**: Moves horizontally between two points, reverses at boundaries
2. **Bouncer Enemy**: Moves vertically between two points, bounces at boundaries

**Enemy System Interface**:
```javascript
const EnemySystem = {
    enemies: [],                    // Active enemies array
    
    spawnEnemies(levelNum),        // Spawn enemies for level
    update(),                       // Update all enemy positions
    render(ctx, cameraX),          // Render all enemies
    checkPlayerCollision(player)    // Check collision with player
}
```

## Data Models

### Extended Game State

```javascript
const game = {
    // Existing properties
    canvas: null,
    ctx: null,
    score: 0,
    lives: 3,
    level: 1,
    isRunning: false,
    camera: { x: 0, targetX: 0 },
    
    // New properties
    highScore: 0,                   // Loaded from LocalStorage
    particles: [],                  // Active particle effects
    enemies: [],                    // Active enemies
    lastTrailSpawn: 0              // Frame counter for trail throttling
}
```

### Configuration Extensions

```javascript
const config = {
    // Existing config...
    
    particles: {
        maxTrailParticles: 50,      // Limit trail particles
        trailSpawnRate: 3,          // Spawn every N frames
        explosionParticleCount: 15, // Particles per explosion
        sparkleParticleCount: 10,   // Particles per sparkle
        confettiCount: 100          // Particles for confetti
    },
    
    enemies: {
        patrolSpeed: 2,             // Horizontal patrol speed
        bouncerSpeed: 3,            // Vertical bouncer speed
        width: 40,                  // Enemy width
        height: 40                  // Enemy height
    }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: High Score Monotonicity
*For any* sequence of game sessions, the high score should never decrease - it should either stay the same or increase when a new score is achieved.
**Validates: Requirements 1.3**

### Property 2: Score Persistence Round Trip
*For any* valid score value, saving it to LocalStorage and then loading it should return the same value.
**Validates: Requirements 1.1, 1.5**

### Property 3: Particle Lifecycle Completion
*For any* particle created, when its life reaches zero, it should be removed from the active particles array within one update cycle.
**Validates: Requirements 2.3, 3.4, 4.4**

### Property 4: Trail Particle Count Limit
*For any* game state with active trail particles, the number of trail particles should never exceed the configured maximum.
**Validates: Requirements 2.4**

### Property 5: Explosion Trigger on Enemy Collision
*For any* collision between the player and an enemy, an explosion effect should be triggered at the collision point.
**Validates: Requirements 3.2, 6.3**

### Property 6: Enemy Boundary Containment
*For any* enemy with defined movement boundaries, its position should always remain within those boundaries after any update.
**Validates: Requirements 6.7**

### Property 7: Enemy Collision Reduces Lives
*For any* collision between the player and an enemy, the player's lives should decrease by exactly one.
**Validates: Requirements 6.3**

### Property 8: Confetti Triggers Only on New High Score
*For any* score update, confetti should be triggered if and only if the new score exceeds the previous high score.
**Validates: Requirements 5.1**

### Property 9: Sparkle Triggers on Collection
*For any* collectible that transitions from uncollected to collected state, a sparkle effect should be triggered at the collectible's position.
**Validates: Requirements 4.1**

### Property 10: LocalStorage Initialization
*For any* game start with no existing high score in LocalStorage, the high score should be initialized to zero.
**Validates: Requirements 1.4**

## Error Handling

### LocalStorage Failures
- **Scenario**: LocalStorage is disabled or quota exceeded
- **Handling**: Gracefully degrade to session-only scores, log warning to console, continue gameplay
- **User Feedback**: Display message in HUD: "Score saving unavailable"

### Particle System Performance
- **Scenario**: Too many particles causing frame rate drops
- **Handling**: Implement hard cap on total particles (200), prioritize newer particles, remove oldest when limit reached
- **User Feedback**: No user-facing message, transparent performance management

### Enemy Spawn Failures
- **Scenario**: Invalid level data or spawn positions
- **Handling**: Skip invalid enemy spawns, log error to console, continue with valid enemies
- **User Feedback**: No user-facing message, game continues normally

### Image Loading for Enemies
- **Scenario**: Enemy sprites fail to load
- **Handling**: Fall back to colored rectangles with distinct colors per enemy type
- **User Feedback**: Visual fallback is acceptable, no error message needed

## Testing Strategy

### Unit Testing Approach

We will use **Vitest** as our testing framework for unit tests. Unit tests will cover:

1. **Score Persistence Functions**
   - Test saving and loading scores with specific values
   - Test high score comparison logic
   - Test LocalStorage initialization with empty storage
   - Test handling of invalid/corrupted storage data

2. **Particle Creation Functions**
   - Test that each particle type creates correct number of particles
   - Test particle initial properties (position, velocity, color)
   - Test particle cleanup removes particles with life <= 0

3. **Enemy Movement Functions**
   - Test patrol enemy reverses at boundaries
   - Test bouncer enemy reverses at boundaries
   - Test enemy collision detection with player

4. **Integration Points**
   - Test confetti triggers when score exceeds high score
   - Test explosion triggers on enemy collision
   - Test sparkle triggers on collectible collection

### Property-Based Testing Approach

We will use **fast-check** as our property-based testing library for JavaScript. Each property-based test will run a minimum of 100 iterations to ensure robust validation across random inputs.

Property-based tests will verify:

1. **Property 1: High Score Monotonicity**
   - Generate random sequences of scores
   - Verify high score never decreases across updates
   - **Feature: game-enhancements, Property 1: High Score Monotonicity**

2. **Property 2: Score Persistence Round Trip**
   - Generate random valid score values (0 to 999999)
   - Save and load each score
   - Verify loaded value equals saved value
   - **Feature: game-enhancements, Property 2: Score Persistence Round Trip**

3. **Property 3: Particle Lifecycle Completion**
   - Generate random particles with varying lifetimes
   - Update particles until life reaches zero
   - Verify particles are removed from array
   - **Feature: game-enhancements, Property 3: Particle Lifecycle Completion**

4. **Property 4: Trail Particle Count Limit**
   - Generate random player movement sequences
   - Create trail particles during movement
   - Verify particle count never exceeds maximum
   - **Feature: game-enhancements, Property 4: Trail Particle Count Limit**

5. **Property 6: Enemy Boundary Containment**
   - Generate random enemy configurations with boundaries
   - Update enemy positions for random number of frames
   - Verify all enemies remain within boundaries
   - **Feature: game-enhancements, Property 6: Enemy Boundary Containment**

6. **Property 10: LocalStorage Initialization**
   - Clear LocalStorage
   - Initialize score system
   - Verify high score is zero
   - **Feature: game-enhancements, Property 10: LocalStorage Initialization**

Each property-based test will be tagged with a comment explicitly referencing the correctness property from this design document using the format: `**Feature: game-enhancements, Property {number}: {property_text}**`

### Test Organization

Tests will be organized in a `tests/` directory:
- `tests/score-manager.test.js` - Score persistence unit and property tests
- `tests/particle-system.test.js` - Particle system unit and property tests
- `tests/enemy-system.test.js` - Enemy system unit and property tests
- `tests/integration.test.js` - Integration tests for cross-system interactions

### Testing Constraints

- Tests must run in a browser-like environment (use jsdom or similar)
- LocalStorage must be mocked for consistent test execution
- Canvas context must be mocked for rendering tests
- Random number generation should be seeded for reproducible property tests
