// Game Configuration
const config = {
    canvas: {
        width: 800,
        height: 600
    },
    player: {
        width: 48,
        height: 48,
        speed: 5,
        jumpPower: 12,
        gravity: 0.5,
        friction: 0.8
    },
    camera: {
        smoothing: 0.1
    }
};

// Score Manager Module
const ScoreManager = {
    STORAGE_KEY: 'kiroworld_highscore',
    
    saveScore(score) {
        try {
            localStorage.setItem(this.STORAGE_KEY, score.toString());
            console.log('Saved score to LocalStorage:', score);
        } catch (e) {
            console.warn('Failed to save score to LocalStorage:', e);
        }
    },
    
    loadHighScore() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? parseInt(saved, 10) : 0;
        } catch (e) {
            console.warn('Failed to load high score from LocalStorage:', e);
            return 0;
        }
    },
    
    updateHighScore(newScore) {
        const currentHigh = this.loadHighScore();
        if (newScore > currentHigh) {
            this.saveScore(newScore);
            return true;
        }
        return false;
    },
    
    isNewHighScore(score) {
        return score > this.loadHighScore();
    }
};

// Particle System Module
const ParticleSystem = {
    particles: [],
    
    // Create a trail particle
    createTrail(x, y, velocityX, velocityY) {
        this.particles.push({
            x: x,
            y: y,
            velocityX: velocityX * 0.3 + (Math.random() - 0.5) * 2,
            velocityY: velocityY * 0.3 + (Math.random() - 0.5) * 2,
            life: 1,
            maxLife: 20,
            size: 4 + Math.random() * 4,
            color: '#790ECB',
            type: 'trail'
        });
    },
    
    // Create an explosion effect
    createExplosion(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            this.particles.push({
                x: x,
                y: y,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                life: 1,
                maxLife: 30,
                size: 3 + Math.random() * 5,
                color: ['#790ECB', '#FFD700', '#FF6B6B'][Math.floor(Math.random() * 3)],
                type: 'explosion'
            });
        }
    },
    
    // Create a sparkle effect
    createSparkle(x, y) {
        const count = 10;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 1 + Math.random() * 2;
            this.particles.push({
                x: x,
                y: y,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                life: 1,
                maxLife: 25,
                size: 2 + Math.random() * 4,
                color: '#FFD700',
                type: 'sparkle'
            });
        }
    },
    
    // Create confetti effect
    createConfetti() {
        const count = 100;
        const colors = ['#790ECB', '#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3'];
        // Spawn confetti across the visible screen area in world coordinates
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * config.canvas.width + game.camera.x,
                y: -20 - Math.random() * 100,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: Math.random() * 2 + 1,
                life: 1,
                maxLife: 120,
                size: 4 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                type: 'confetti'
            });
        }
    },
    
    // Update all particles
    update() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.velocityX;
            p.y += p.velocityY;
            
            // Apply physics based on particle type
            if (p.type === 'explosion' || p.type === 'confetti') {
                p.velocityY += 0.15; // Gravity
            }
            
            // Update rotation for confetti
            if (p.type === 'confetti' && p.rotation !== undefined) {
                p.rotation += p.rotationSpeed;
            }
            
            // Decrease life
            p.life -= 1 / p.maxLife;
            
            // Fade velocity for trail particles
            if (p.type === 'trail') {
                p.velocityX *= 0.95;
                p.velocityY *= 0.95;
            }
        }
    },
    
    // Render all particles
    render(ctx, cameraX) {
        ctx.save();
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Calculate opacity based on life
            const opacity = Math.max(0, p.life);
            
            ctx.globalAlpha = opacity;
            ctx.fillStyle = p.color;
            
            // Draw particle with camera offset
            if (p.type === 'confetti' && p.rotation !== undefined) {
                // Draw rotated rectangle for confetti
                ctx.save();
                ctx.translate(p.x - cameraX, p.y);
                ctx.rotate(p.rotation);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
                ctx.restore();
            } else {
                // Draw circle for other particles
                ctx.beginPath();
                ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    },
    
    // Remove dead particles
    cleanup() {
        this.particles = this.particles.filter(p => p.life > 0);
    }
};

// Game State
const game = {
    canvas: null,
    ctx: null,
    score: 0,
    lives: 3,
    level: 1,
    isRunning: false,
    camera: { x: 0, targetX: 0 },
    highScore: 0,
    particles: [],
    lastTrailSpawn: 0,
    frameCount: 0
};

// Player Object
const player = {
    x: 100,
    y: 100,
    width: config.player.width,
    height: config.player.height,
    velocityX: 0,
    velocityY: 0,
    isGrounded: false,
    image: null
};

// Input State
const keys = {};

// Level Data
let platforms = [];
let collectibles = [];

// Initialize Game
function init() {
    game.canvas = document.getElementById('gameCanvas');
    game.ctx = game.canvas.getContext('2d');
    game.canvas.width = config.canvas.width;
    game.canvas.height = config.canvas.height;

    // Load high score from LocalStorage
    game.highScore = ScoreManager.loadHighScore();
    console.log('Loaded high score from LocalStorage:', game.highScore);

    // Load player sprite
    player.image = new Image();
    player.image.src = 'kiro-logo.png';
    
    // Setup event listeners
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    document.getElementById('restartBtn').addEventListener('click', restartGame);
    document.getElementById('nextLevelBtn').addEventListener('click', nextLevel);

    // Start game
    loadLevel(game.level);
    game.isRunning = true;
    updateHUD();
    gameLoop();
}

// Load Level
function loadLevel(levelNum) {
    platforms = [];
    collectibles = [];
    player.x = 100;
    player.y = 100;
    player.velocityX = 0;
    player.velocityY = 0;
    game.camera.x = 0;
    game.camera.targetX = 0;

    // Ground platforms
    for (let i = 0; i < 30; i++) {
        platforms.push({
            x: i * 200,
            y: 550,
            width: 200,
            height: 50,
            color: '#2a2a3e'
        });
    }

    // Floating platforms - varied heights and positions
    const platformData = [
        { x: 400, y: 450, width: 150 },
        { x: 650, y: 380, width: 120 },
        { x: 900, y: 320, width: 150 },
        { x: 1150, y: 400, width: 130 },
        { x: 1400, y: 350, width: 140 },
        { x: 1650, y: 280, width: 150 },
        { x: 1900, y: 380, width: 160 },
        { x: 2150, y: 320, width: 140 },
        { x: 2400, y: 420, width: 150 },
        { x: 2700, y: 350, width: 180 },
        { x: 3000, y: 280, width: 150 },
        { x: 3300, y: 400, width: 140 },
        { x: 3600, y: 320, width: 160 },
        { x: 3900, y: 450, width: 150 },
        { x: 4200, y: 350, width: 200 }
    ];

    platformData.forEach(p => {
        platforms.push({
            x: p.x,
            y: p.y,
            width: p.width,
            height: 20,
            color: '#790ECB'
        });
    });

    // Add collectibles (stars)
    const collectiblePositions = [
        { x: 300, y: 480 },
        { x: 500, y: 380 },
        { x: 750, y: 310 },
        { x: 1000, y: 250 },
        { x: 1250, y: 330 },
        { x: 1500, y: 280 },
        { x: 1750, y: 210 },
        { x: 2000, y: 310 },
        { x: 2250, y: 250 },
        { x: 2500, y: 350 },
        { x: 2800, y: 280 },
        { x: 3100, y: 210 },
        { x: 3400, y: 330 },
        { x: 3700, y: 250 },
        { x: 4000, y: 380 },
        { x: 4300, y: 280 }
    ];

    collectiblePositions.forEach(pos => {
        collectibles.push({
            x: pos.x,
            y: pos.y,
            width: 24,
            height: 24,
            collected: false
        });
    });

    // Goal flag at the end
    platforms.push({
        x: 4500,
        y: 450,
        width: 100,
        height: 100,
        color: '#00ff00',
        isGoal: true
    });
}

// Update Game State
function update() {
    if (!game.isRunning) return;

    game.frameCount++;

    // Player input
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.velocityX = -config.player.speed;
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.velocityX = config.player.speed;
    } else {
        player.velocityX *= config.player.friction;
    }

    // Jump
    if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.isGrounded) {
        player.velocityY = -config.player.jumpPower;
        player.isGrounded = false;
    }

    // Apply gravity
    player.velocityY += config.player.gravity;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Create trail particles when player is moving
    const isMoving = Math.abs(player.velocityX) > 0.5 || Math.abs(player.velocityY) > 0.5;
    const trailSpawnRate = player.isGrounded ? 3 : 2; // Higher frequency when airborne
    
    if (isMoving && game.frameCount - game.lastTrailSpawn >= trailSpawnRate) {
        // Limit trail particles to 50
        const trailCount = ParticleSystem.particles.filter(p => p.type === 'trail').length;
        if (trailCount < 50) {
            ParticleSystem.createTrail(
                player.x + player.width / 2,
                player.y + player.height / 2,
                player.velocityX,
                player.velocityY
            );
        }
        game.lastTrailSpawn = game.frameCount;
    }

    // Check platform collisions
    player.isGrounded = false;
    
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            // Check if goal
            if (platform.isGoal) {
                levelComplete();
                return;
            }

            // Vertical collision (landing on platform)
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y + 5) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isGrounded = true;
            }
            // Top collision (hitting head)
            else if (player.velocityY < 0 && player.y - player.velocityY >= platform.y + platform.height) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
            // Horizontal collision (side impact)
            else {
                // Trigger explosion effect on side collision
                ParticleSystem.createExplosion(
                    player.x + player.width / 2,
                    player.y + player.height / 2,
                    15
                );
                
                if (player.velocityX > 0) {
                    player.x = platform.x - player.width;
                } else if (player.velocityX < 0) {
                    player.x = platform.x + platform.width;
                }
                player.velocityX = 0;
            }
        }
    });

    // Check collectible collisions
    collectibles.forEach(collectible => {
        if (!collectible.collected && checkCollision(player, collectible)) {
            collectible.collected = true;
            
            // Trigger sparkle effect at collectible position
            ParticleSystem.createSparkle(
                collectible.x + collectible.width / 2,
                collectible.y + collectible.height / 2
            );
            
            const previousHighScore = game.highScore;
            game.score += 100;
            
            // Check and update high score
            if (ScoreManager.isNewHighScore(game.score)) {
                game.highScore = game.score;
                ScoreManager.updateHighScore(game.score);
                
                // Trigger confetti effect on new high score
                if (game.score > previousHighScore) {
                    ParticleSystem.createConfetti();
                }
            }
            
            updateHUD();
        }
    });

    // Check if player fell off
    if (player.y > config.canvas.height + 100) {
        loseLife();
    }

    // Keep player in bounds horizontally
    if (player.x < 0) player.x = 0;

    // Update camera
    game.camera.targetX = player.x - config.canvas.width / 3;
    if (game.camera.targetX < 0) game.camera.targetX = 0;
    game.camera.x += (game.camera.targetX - game.camera.x) * config.camera.smoothing;
    
    // Update particle system
    ParticleSystem.update();
    ParticleSystem.cleanup();
}

// Collision Detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Render Game
function render() {
    // Clear canvas
    game.ctx.fillStyle = '#1a1a2e';
    game.ctx.fillRect(0, 0, config.canvas.width, config.canvas.height);

    // Save context for camera
    game.ctx.save();
    game.ctx.translate(-game.camera.x, 0);

    // Draw platforms
    platforms.forEach(platform => {
        game.ctx.fillStyle = platform.color;
        game.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Add border for better visibility
        game.ctx.strokeStyle = '#ffffff';
        game.ctx.lineWidth = 2;
        game.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        
        // Draw goal flag
        if (platform.isGoal) {
            game.ctx.fillStyle = '#00ff00';
            game.ctx.font = '20px Arial';
            game.ctx.fillText('GOAL!', platform.x + 25, platform.y + 60);
        }
    });

    // Draw collectibles (stars)
    collectibles.forEach(collectible => {
        if (!collectible.collected) {
            drawStar(game.ctx, collectible.x + collectible.width / 2, collectible.y + collectible.height / 2, 5, 12, 6);
        }
    });
    
    // Draw particles (context is already translated, so pass 0 for camera offset)
    ParticleSystem.render(game.ctx, 0);

    // Draw player
    if (player.image.complete) {
        game.ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        // Fallback rectangle if image not loaded
        game.ctx.fillStyle = '#790ECB';
        game.ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Restore context
    game.ctx.restore();
}

// Draw Star Shape
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Game Loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Update HUD
function updateHUD() {
    document.getElementById('score').textContent = game.score;
    document.getElementById('lives').textContent = game.lives;
    document.getElementById('level').textContent = game.level;
    document.getElementById('highScore').textContent = game.highScore;
}

// Lose Life
function loseLife() {
    game.lives--;
    updateHUD();
    
    if (game.lives <= 0) {
        gameOver();
    } else {
        // Respawn player
        player.x = 100;
        player.y = 100;
        player.velocityX = 0;
        player.velocityY = 0;
        game.camera.x = 0;
        game.camera.targetX = 0;
    }
}

// Game Over
function gameOver() {
    game.isRunning = false;
    
    // Save score and update high score if needed
    if (ScoreManager.isNewHighScore(game.score)) {
        game.highScore = game.score;
        ScoreManager.updateHighScore(game.score);
        updateHUD();
    }
    
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Level Complete
function levelComplete() {
    game.isRunning = false;
    document.getElementById('levelScore').textContent = game.score;
    document.getElementById('levelComplete').classList.remove('hidden');
}

// Restart Game
function restartGame() {
    game.score = 0;
    game.lives = 3;
    game.level = 1;
    document.getElementById('gameOver').classList.add('hidden');
    updateHUD();
    loadLevel(game.level);
    game.isRunning = true;
}

// Next Level
function nextLevel() {
    game.level++;
    document.getElementById('levelComplete').classList.add('hidden');
    updateHUD();
    loadLevel(game.level);
    game.isRunning = true;
}

// Start game when page loads
window.addEventListener('load', init);
