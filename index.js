import init, { System } from './pkg/wasm_math.js';

let system;
let animationId;
let chart;

async function initSystem(seed, alpha, beta) {
    const width = 256; // 256 * 256 で固定
    system = System.new(seed, alpha, beta);

    // キャンバスのサイズを更新
    const configurationCanvas = document.getElementById('configurationCanvas');
    configurationCanvas.width = width;
    configurationCanvas.height = width + 20;

    const colorbarCanvas = document.getElementById('colorbarCanvas');
    colorbarCanvas.width = 80;
    colorbarCanvas.height = width + 20;

    const graphCanvas = document.getElementById('graphCanvas');
    graphCanvas.width = width + 64;
    graphCanvas.height = width + 64;

    // グラフの更新
    if (chart) {
        chart.destroy();
    }
    initChart(width);
}

function initChart(width) {
    const graphCanvas = document.getElementById('graphCanvas');
    chart = new Chart(graphCanvas, {
        type: 'line',
        data: {
            labels: Array.from({length: 100000}, (_, i) => i),
            datasets: [{
                label: 'Cross-section at y=128',
                data: [],
                borderColor: 'blue',
                borderWidth: 1,
                fill: false,
                pointRadius: 0,
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    //type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'avalanche size',
                        color: 'white',
                    },
                    min: 0.01,
                    max: 100000,
                    ticks: {
                        maxTicksLimit: 5,
                        color: 'white',
                    },
                },
                y: {
                    //type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Value',
                        color: 'white',
                    },
                    min: 0.01,
                    max: 1,
                    ticks: {
                        maxTicksLimit: 5,
                        color: 'white',
                    },
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Avalanche size distribution',
                    color: 'white',
                },
            },
            animation: {
                duration: 0,
            },
        }
    });
}

async function run() {
    await init();
    //const widthInput = document.getElementById('widthInput');
    //const radioButtons = document.querySelectorAll('input[name="widthSelect"]');
    const seedInput = document.getElementById('seedInput');
    const alphaInput = document.getElementById('alphaInput');
    const betaInput = document.getElementById('betaInput');
    const updateButton = document.getElementById('updateButton');
    
    // 初期化
    await initSystem(parseInt(seedInput.value), parseFloat(alphaInput.value), parseFloat(betaInput.value));
    drawColorbar();
    
    // 更新ボタンのイベントリスナー
    updateButton.addEventListener('click', async () => {
        const newSeed = parseInt(seedInput.value);
        const newAlpha = parseFloat(alphaInput.value);
        const newBeta = parseFloat(betaInput.value);
        if (newAlpha >= 0.00 && newAlpha <= 0.25 && newBeta >= 0.00 && newBeta <= 0.25) {
            stopAnimation();
            await initSystem(newSeed, newAlpha, newBeta);
            drawColorbar();
            animationLoop();
        } else {
            alert('Alpha and Beta must be between 0.00 and 0.25');
        }
    });

    // radioButtonで入力させる
    /*
    updateButton.addEventListener('click', async () => {
        const selectedRadio = document.querySelector('input[name="widthSelect"]:checked');
        const newWidth = parseInt(selectedRadio.value);
        stopAnimation();
        await initHeatmap(newWidth);
        drawColorbar();
        animationLoop();
    });
    */

    animationLoop();
}

function animationLoop() {
    system.update();
    drawConfiguration();
    updateGraph();
    animationId = requestAnimationFrame(animationLoop);
}

function drawConfiguration() {
    const canvas = document.getElementById('configurationCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(
        new Uint8ClampedArray(system.get_normalized_z()),
        256,
        256
    );
    ctx.putImageData(imageData, 0, 10);
}

function drawColorbar() {
    const canvas = document.getElementById('colorbarCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = 16;
    const gradientHeight = height - 20;

    const gradient = ctx.createLinearGradient(0, gradientHeight, 0, 0);
    gradient.addColorStop(0, 'rgb(0, 16, 0)');
    gradient.addColorStop(0.5, 'rgb(0, 16, 127)');
    gradient.addColorStop(1, 'rgb(0, 16, 255)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 10, barWidth, gradientHeight);

    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const steps = 2;
    for (let i = 0; i <= steps; i++) {
        const y = 10 + (1 - i / steps) * gradientHeight;
        const value = (i / steps).toFixed(1);

        ctx.beginPath();
        ctx.moveTo(barWidth - 5, y);
        ctx.lineTo(barWidth, y);
        ctx.stroke();

        ctx.fillText(value, barWidth + 5, y);
    }
}

function updateGraph() {
    const rowData = system.get_size_distribution();
    chart.data.datasets[0].data = rowData;
    chart.update();
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

document.addEventListener('DOMContentLoaded', run);
