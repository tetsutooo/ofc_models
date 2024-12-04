import init, { Gol } from './pkg/game_of_life.js';

let animationId = null;
let gol = null;

// Line graph settings
const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 200;
const PADDING = 40;

function drawLineGraph(data) {
    const canvas = document.getElementById('line-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = GRAPH_WIDTH;
    canvas.height = GRAPH_HEIGHT;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, GRAPH_WIDTH, GRAPH_HEIGHT);

    // Draw axis
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.moveTo(PADDING, PADDING);
    ctx.lineTo(PADDING, GRAPH_HEIGHT - PADDING);
    ctx.lineTo(GRAPH_WIDTH - PADDING, GRAPH_HEIGHT - PADDING);
    ctx.stroke();

    // Draw data points
    if (data && data.length > 0) {
        const xScale = (GRAPH_WIDTH - 2 * PADDING) / data.length;
        const yScale = (GRAPH_HEIGHT - 2 * PADDING);

        ctx.beginPath();
        ctx.strokeStyle = '#00B4D8';
        ctx.lineWidth = 2;

        for (let i = 0; i < data.length; i++) {
            const x = PADDING + i * xScale;
            const y = GRAPH_HEIGHT - PADDING - (data[i].value * yScale);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
}

async function initGame() {
    await init();
    
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;
    
    // Initialize game
    gol = new Gol(canvas.width, canvas.height);
    
    // Draw initial state
    gol.display(ctx);

    // Initialize line graph
    const middleRow = Math.floor(gol.rows / 2);
    const lineData = Array.from(gol.get_horizontal_line_data(middleRow));
    drawLineGraph(lineData);
}

function animate() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    gol.generate();
    gol.display(ctx);

    // Update line graph
    const middleRow = Math.floor(gol.rows / 2);
    const lineData = Array.from(gol.get_horizontal_line_data(middleRow));
    drawLineGraph(lineData);
    
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

        // Reset line graph
        const middleRow = Math.floor(gol.rows / 2);
        const lineData = Array.from(gol.get_horizontal_line_data(middleRow));
        drawLineGraph(lineData);
    }
});

// Initialize the game when the page loads
window.addEventListener('load', initGame);
