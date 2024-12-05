import init, { Gol } from './pkg/game_of_life.js';

let animationId = null;
let gol = null;

// Constants for canvas sizes
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 200;

async function initGame() {
    try {
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
        gol.draw_graph(graphCtx, Math.floor(GAME_HEIGHT / 8 / 2));

        // Enable controls
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        document.getElementById('reset-btn').disabled = false;

        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

function animate() {
    try {
        const gameCanvas = document.getElementById('game-canvas');
        const graphCanvas = document.getElementById('graph-canvas');
        const gameCtx = gameCanvas.getContext('2d');
        const graphCtx = graphCanvas.getContext('2d');

        if (!gol) {
            console.error('Game not initialized');
            return;
        }
        
        if (gol.generate) {  // Check if generate method exists
            gol.generate();
            gol.display(gameCtx);
            gol.draw_graph(graphCtx, Math.floor(GAME_HEIGHT / 8 / 2));
            
            animationId = requestAnimationFrame(animate);
        } else {
            console.error('Generate method not found');
            stopAnimation();
        }
    } catch (error) {
        console.error('Error in animation:', error);
        stopAnimation();
    }
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
    }
}

// Event listeners
document.getElementById('start-btn').addEventListener('click', () => {
    try {
        if (!animationId && gol) {
            animate();
            document.getElementById('start-btn').disabled = true;
            document.getElementById('stop-btn').disabled = false;
        }
    } catch (error) {
        console.error('Error starting animation:', error);
    }
});

document.getElementById('stop-btn').addEventListener('click', () => {
    stopAnimation();
});

document.getElementById('reset-btn').addEventListener('click', () => {
    try {
        if (gol && gol.init) {
            gol.init();
            const gameCanvas = document.getElementById('game-canvas');
            const graphCanvas = document.getElementById('graph-canvas');
            const gameCtx = gameCanvas.getContext('2d');
            const graphCtx = graphCanvas.getContext('2d');
            gol.display(gameCtx);
            gol.draw_graph(graphCtx, Math.floor(GAME_HEIGHT / 8 / 2));
        }
    } catch (error) {
        console.error('Error resetting game:', error);
    }
});

// Initialize the game when the page loads
window.addEventListener('load', initGame);
