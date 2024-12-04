import init, { Universe, Cell } from '../pkg/game_of_life';

let universe;
let animationId = null;
let isPlaying = false;

const CELL_SIZE = 5;
const GRID_COLOR = '#ddd';
const DEAD_COLOR = '#fff';
const ALIVE_COLOR = '#6366f1';

// Initialize canvas
const canvas = document.getElementById('game-of-life-canvas');
const ctx = canvas.getContext('2d');

// Initialize controls
const playPauseButton = document.getElementById('play-pause');
const resetButton = document.getElementById('reset');
const speedControl = document.getElementById('speed');

const getSpeed = () => {
    return 1000 / parseInt(speedControl.value);
};

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines
    for (let i = 0; i <= universe.width(); i++) {
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, universe.height() * CELL_SIZE);
    }

    // Horizontal lines
    for (let j = 0; j <= universe.height(); j++) {
        ctx.moveTo(0, j * CELL_SIZE);
        ctx.lineTo(universe.width() * CELL_SIZE, j * CELL_SIZE);
    }

    ctx.stroke();
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, universe.width() * universe.height());

    ctx.beginPath();

    // Draw alive cells
    ctx.fillStyle = ALIVE_COLOR;
    for (let row = 0; row < universe.height(); row++) {
        for (let col = 0; col < universe.width(); col++) {
            const idx = row * universe.width() + col;
            if (cells[idx] !== Cell.Alive) {
                continue;
            }

            ctx.fillRect(
                col * CELL_SIZE,
                row * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    // Draw dead cells
    ctx.fillStyle = DEAD_COLOR;
    for (let row = 0; row < universe.height(); row++) {
        for (let col = 0; col < universe.width(); col++) {
            const idx = row * universe.width() + col;
            if (cells[idx] !== Cell.Dead) {
                continue;
            }

            ctx.fillRect(
                col * CELL_SIZE,
                row * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

const renderLoop = () => {
    universe.tick();
    drawGrid();
    drawCells();
    animationId = setTimeout(renderLoop, getSpeed());
};

const playPauseGame = () => {
    if (isPlaying) {
        clearTimeout(animationId);
        animationId = null;
        playPauseButton.textContent = 'Play';
    } else {
        renderLoop();
        playPauseButton.textContent = 'Pause';
    }
    isPlaying = !isPlaying;
};

const resetGame = () => {
    universe = Universe.new(canvas.width / CELL_SIZE, canvas.height / CELL_SIZE);
    if (!isPlaying) {
        drawGrid();
        drawCells();
    }
};

canvas.addEventListener('click', event => {
    const boundingRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - bounding
