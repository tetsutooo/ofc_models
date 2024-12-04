import init, { Universe, Cell } from '../pkg/game_of_life';

async function run() {
    // Initialize WebAssembly module
    const wasm = await init();

    const CELL_SIZE = 5;
    const GRID_COLOR = '#ddd';
    const DEAD_COLOR = '#fff';
    const ALIVE_COLOR = '#6366f1';

    // Initialize canvas
    const canvas = document.getElementById('game-of-life-canvas');
    canvas.width = 800;  // キャンバスサイズを明示的に設定
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Create universe
    const universe = Universe.new(canvas.width / CELL_SIZE, canvas.height / CELL_SIZE);
    let animationId = null;
    let isPlaying = false;

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
        const cells = new Uint8Array(wasm.memory.buffer, cellsPtr, universe.width() * universe.height());

        ctx.beginPath();

        // Clear the canvas
        ctx.fillStyle = DEAD_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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
                    CELL_SIZE - 1,  // Leave 1px gap for grid
                    CELL_SIZE - 1
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
        if (isPlaying) {
            clearTimeout(animationId);
            animationId = null;
            isPlaying = false;
            playPauseButton.textContent = 'Play';
        }
        universe = Universe.new(canvas.width / CELL_SIZE, canvas.height / CELL_SIZE);
        drawGrid();
        drawCells();
    };

    canvas.addEventListener('click', event => {
        const boundingRect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / boundingRect.width;
        const scaleY = canvas.height / boundingRect.height;

        const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
        const canvasTop = (event.clientY - boundingRect.top) * scaleY;

        const row = Math.min(Math.floor(canvasTop / CELL_SIZE), universe.height() - 1);
        const col = Math.min(Math.floor(canvasLeft / CELL_SIZE), universe.width() - 1);

        universe.toggle_cell(row, col);
        drawGrid();
        drawCells();
    });

    playPauseButton.addEventListener('click', playPauseGame);
    resetButton.addEventListener('click', resetGame);
    speedControl.addEventListener('input', () => {
        if (isPlaying) {
            clearTimeout(animationId);
            renderLoop();
        }
    });

    // Initial render
    drawGrid();
    drawCells();
}

run().catch(console.error);
