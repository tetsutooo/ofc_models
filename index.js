import init, { Gol } from './pkg/game_of_life.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

let animationId = null;
let gol = null;

// React component for the line chart
function LineChartComponent({ data }) {
    return (
        <LineChart width={800} height={200} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="stepAfter" dataKey="value" stroke="#00B4D8" />
        </LineChart>
    );
}

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
    
    // Initialize line chart with data from middle row
    updateLineChart();
}

function updateLineChart() {
    const middleRow = Math.floor(gol.rows / 2);
    const data = gol.get_horizontal_line_data(middleRow);
    
    // Convert data to array of objects for recharts
    ReactDOM.render(
        <LineChartComponent data={Array.from(data)} />,
        document.getElementById('line-chart')
    );
}

function animate() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    gol.generate();
    gol.display(ctx);
    updateLineChart();
    
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
        updateLineChart();
    }
});

// Initialize the game when the page loads
window.addEventListener('load', initGame);
