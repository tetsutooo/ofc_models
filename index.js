import init, { Gol } from './pkg/game_of_life.js';

let animationId = null;
let gol = null;

async function initGame() {
    await init();
    
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Initialize game
    gol = new Gol(canvas.width, canvas.height);
    
    // Draw initial state
    gol.display(ctx);
}

function animate() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    gol.generate();
    gol.display(ctx);
    
    animationId = requestAnimationFrame(animate);
}

// Event listeners
document.getElementById('start-btn').addEventListener('click', () => {
    if (!animationId) {
        animate();
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
    }
});

document.getElementById('stop-btn').addEventListener('click', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    if (gol) {
        gol.init();
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        gol.display(ctx);
    }
});

// Initialize the game when the page loads
window.addEventListener('load', initGame);
