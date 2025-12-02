# Implementation Plan

- [x] 1. Implement Score Persistence System




  - Create ScoreManager module with LocalStorage interface
  - Add `saveScore()`, `loadHighScore()`, `updateHighScore()`, and `isNewHighScore()` methods
  - Extend game state with `highScore` property
  - Hook into game initialization to load high score
  - Hook into score updates to check and save high scores
  - Display high score in HUD alongside current score
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 1.1 Write property test for score persistence
  - **Property 2: Score Persistence Round Trip**
  - **Validates: Requirements 1.1, 1.5**

- [ ]* 1.2 Write property test for high score monotonicity
  - **Property 1: High Score Monotonicity**
  - **Validates: Requirements 1.3**

- [ ]* 1.3 Write property test for LocalStorage initialization
  - **Property 10: LocalStorage Initialization**
  - **Validates: Requirements 1.4**

- [x] 2. Implement Particle System Foundation





  - Create ParticleSystem module with base particle structure
  - Implement `update()` method to update particle life and physics
  - Implement `render()` method to draw particles with camera offset
  - Implement `cleanup()` method to remove dead particles
  - Add particles array to game state
  - Integrate particle update and render into main game loop
  - _Requirements: 2.3, 3.4, 4.4_

- [ ]* 2.1 Write property test for particle lifecycle
  - **Property 3: Particle Lifecycle Completion**
  - **Validates: Requirements 2.3, 3.4, 4.4**

- [x] 3. Implement Visual Effects (Trail, Explosion, Sparkle, Confetti)





  - Implement `createTrail()` for player movement particles
  - Add trail spawning logic in update loop when player moves
  - Implement particle count limiting for trails
  - Implement `createExplosion()` for collision impacts
  - Implement `createSparkle()` for collectible pickups
  - Implement `createConfetti()` for new high score celebration
  - Hook explosion effect to platform collisions
  - Hook sparkle effect to collectible collection
  - Hook confetti effect to high score achievement
  - Use Kiro brand colors (#790ECB, #FFD700, etc.) for all effects
  - _Requirements: 2.1, 2.2, 2.4, 2.5, 3.1, 3.2, 3.3, 3.5, 4.1, 4.2, 4.3, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 3.1 Write property test for trail particle limit
  - **Property 4: Trail Particle Count Limit**
  - **Validates: Requirements 2.4**

- [ ]* 3.2 Write property test for confetti trigger
  - **Property 8: Confetti Triggers Only on New High Score**
  - **Validates: Requirements 5.1**

- [ ]* 3.3 Write property test for sparkle trigger
  - **Property 9: Sparkle Triggers on Collection**
  - **Validates: Requirements 4.1**

- [x] 4. Implement Enemy System





  - Create EnemySystem module with enemy structure
  - Implement `spawnEnemies()` to create patrol and bouncer enemies for each level
  - Implement patrol enemy AI (horizontal movement with boundary reversal)
  - Implement bouncer enemy AI (vertical movement with boundary reversal)
  - Implement `update()` method for enemy movement
  - Implement `render()` method to draw enemies with distinct colors
  - Implement `checkPlayerCollision()` using existing collision detection
  - Add enemies array to game state
  - Integrate enemy spawning into `loadLevel()`
  - Integrate enemy update and render into main game loop
  - _Requirements: 6.1, 6.2, 6.5, 6.6, 6.7, 6.8_

- [ ]* 4.1 Write property test for enemy boundary containment
  - **Property 6: Enemy Boundary Containment**
  - **Validates: Requirements 6.7**

- [ ]* 4.2 Write unit tests for enemy movement patterns
  - Test patrol enemy reverses at boundaries
  - Test bouncer enemy reverses at boundaries
  - _Requirements: 6.2, 6.5, 6.7_

- [x] 5. Integrate Enemy Collisions and Effects





  - Hook enemy collision detection into update loop
  - Trigger explosion effect on enemy collision
  - Decrease player lives by one on enemy collision
  - Respawn player after enemy collision
  - Ensure explosion effect appears at collision point
  - Test complete gameplay flow with all features active
  - _Requirements: 6.3, 6.4, 3.2_

- [ ]* 5.1 Write property test for enemy collision life reduction
  - **Property 7: Enemy Collision Reduces Lives**
  - **Validates: Requirements 6.3**

- [ ]* 5.2 Write property test for explosion on enemy collision
  - **Property 5: Explosion Trigger on Enemy Collision**
  - **Validates: Requirements 3.2, 6.3**

- [x] 6. Final Checkpoint - Ensure all features work together





  - Verify score persistence across browser sessions
  - Verify all visual effects render correctly
  - Verify enemies spawn and move correctly
  - Verify enemy collisions trigger proper effects and life loss
  - Verify high score celebration with confetti
  - Test complete gameplay flow from start to game over
  - Ensure all tests pass, ask the user if questions arise
