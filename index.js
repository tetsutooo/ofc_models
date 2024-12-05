import init, { Gol } from './pkg/game_of_life.js';

let animationId = null;
let gol = null;

// Constants for canvas sizes
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 200;

async function initGame() {
    await init();
    
    const gameCanvas = document.getElementById('game-canvas');
    const graphCanvas = document.getElementById('graph-canvas');
    const gameCtx = gameCanvas.getContext('2d');
    const graphCtx = graphCanvas.getContext('2d');
    
    // Set canvas sizes
    gameCanvas.width = GAME_WIDTH;
    gameCanvas.height = GAME_HEIGHT;
    graphCanvas.width = GRAPH_WIDTH;
    graphCanvas.height = GRAPH_HEIGHT;
    
    // Initialize game with both canvas sizes
    gol = new Gol(GAME_WIDTH, GAME_HEIGHT, GRAPH_WIDTH, GRAPH_HEIGHT);
    
    // Initial draw
    gol.display(gameCtx);
    gol.draw_graph(graphCtx, Math.floor(gol.rows / 2));
}

function animate() {
    const gameCanvas = document.getElementById('game-canvas');
    const graphCanvas = document.getElementById('graph-canvas');
    const gameCtx = gameCanvas.getContext('2d');
    const graphCtx = graphCanvas.getContext('2d');
    
    gol.generate();
    gol.display(gameCtx);
    gol.draw_graph(graphCtx, Math.floor(gol.rows / 2));
    
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
        const gameCanvas = document.getElementById('game-canvas');
        const graphCanvas = document.getElementById('graph-canvas');
        const gameCtx = gameCanvas.getContext('2d');
        const graphCtx = graphCanvas.getContext('2d');
        gol.display(gameCtx);
        gol.draw_graph(graphCtx, Math.floor(gol.rows / 2));
    }
});

// Initialize the game when the page loads
window.addEventListener('load', initGame);
