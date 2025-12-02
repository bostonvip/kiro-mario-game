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

// Game State
const game = {
    canvas: null,
    ctx: null,
    score: 0,
    lives: 3,
    level: 1,
    isRunning: false,
    camera: { x: 0, targetX: 0 }
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
            // Horizontal collision
            else {
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
            game.score += 100;
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
