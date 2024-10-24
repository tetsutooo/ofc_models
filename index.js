import init, { HeatmapData } from './pkg/wasm_math.js';

let heatmap;
let animationId;
let chart;

async function initHeatmap(width) {
    const height = width; // 正方形を維持
    heatmap = HeatmapData.new(width, height);

    // 初期データの設定
    const padding = Math.floor(width * 0.0625); // 16/256の比率を維持
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x > padding && x < (width - padding) && y > padding && y < (height - padding)) {
                heatmap.set_value(x, y, Math.random());
            }
        }
    }

    // キャンバスのサイズを更新
    const heatmapCanvas = document.getElementById('heatmapCanvas');
    heatmapCanvas.width = width;
    heatmapCanvas.height = width + 20;

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
            labels: Array.from({length: width}, (_, i) => i),
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
                    title: {
                        display: true,
                        text: 'avalanche size',
                        color: 'white',
                    },
                    ticks: {
                        maxTicksLimit: 5,
                        color: 'white',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value',
                        color: 'white',
                    },
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
    const radioButtons = document.querySelectorAll('input[name="widthSelect"]');
    const updateButton = document.getElementById('updateButton');
    
    // 初期化
    //await initHeatmap(parseInt(widthInput.value));
    //drawColorbar();
    await initHeatmap(256);
    drawColorbar();
    
    // 更新ボタンのイベントリスナー
    // Userに入力させる
    /*updateButton.addEventListener('click', async () => {
        const newWidth = parseInt(widthInput.value);
        if (newWidth >= 32 && newWidth <= 1024) {
            stopAnimation();
            await initHeatmap(newWidth);
            drawColorbar();
            animationLoop();
        } else {
            alert('Width must be between 32 and 1024');
        }
    });*/

    // トグルボタンで入力させる
    updateButton.addEventListener('click', async () => {
        const selectedRadio = document.querySelector('input[name="widthSelect"]:checked');
        const newWidth = parseInt(selectedRadio.value);
        stopAnimation();
        await initHeatmap(newWidth);
        drawColorbar();
        animationLoop();
    });

    animationLoop();
}

function animationLoop() {
    heatmap.update();
    drawHeatmap();
    updateGraph();
    animationId = requestAnimationFrame(animationLoop);
}

function drawHeatmap() {
    const canvas = document.getElementById('heatmapCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(
        new Uint8ClampedArray(heatmap.get_data()),
        heatmap.width(),
        heatmap.height()
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
    gradient.addColorStop(0, 'rgb(0, 255, 0)');
    gradient.addColorStop(0.5, 'rgb(255, 255, 0)');
    gradient.addColorStop(1, 'rgb(255, 0, 0)');

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
    const rowData = heatmap.get_row_data(Math.floor(heatmap.height() / 2));
    chart.data.datasets[0].data = rowData;
    chart.update();
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

document.addEventListener('DOMContentLoaded', run);

/* import init, { HeatmapData } from './pkg/wasm_math.js';

let heatmap;
let animationId;
let chart;

async function run() {
    await init();
    const width = 256; // この値をUserからの入力値に変更する
    const height = 256;
    heatmap = HeatmapData.new(width, height);

    // 初期データの設定
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x > 16 && x < 240 && y > 16 && y < 240) {
                heatmap.set_value(x, y, Math.random());
            }
        }
    }

    const heatmapCanvas = document.getElementById('heatmapCanvas');
    heatmapCanvas.width = 256;
    heatmapCanvas.height = 256 + 20;

    const colorbarCanvas = document.getElementById('colorbarCanvas');
    colorbarCanvas.width = 80;
    colorbarCanvas.height = 256 + 20;

    const graphCanvas = document.getElementById('graphCanvas');
    graphCanvas.width = 256 + 64;
    graphCanvas.height = 256 + 64;

    // Chart.jsでグラフを初期化
    chart = new Chart(graphCanvas, {
        type: 'line',
        data: {
            labels: Array.from({length: 256}, (_, i) => i),
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
                    title: {
                        display: true,
                        text: 'avalanche size',
                        color: 'white',
                    },
                    ticks: {
                        maxTicksLimit: 5,
                        color: 'white',
                    },
                },
                y: {
                    // type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Value',
                        color: 'white',
                    },
                    //min: 0.001,
                    //max: 1,
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

    drawColorbar();
    animationLoop();
}

function animationLoop() {
    heatmap.update();
    drawHeatmap();
    updateGraph();
    animationId = requestAnimationFrame(animationLoop);
}

function drawHeatmap() {
    const canvas = document.getElementById('heatmapCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(
        new Uint8ClampedArray(heatmap.get_data()),
        heatmap.width(),
        heatmap.height()
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
    gradient.addColorStop(0, 'rgb(0, 255, 0)');
    gradient.addColorStop(0.5, 'rgb(255, 255, 0)');
    gradient.addColorStop(1, 'rgb(255, 0, 0)');

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
    const rowData = heatmap.get_row_data(128);
    chart.data.datasets[0].data = rowData;
    chart.update();
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

document.addEventListener('DOMContentLoaded', run);
*/
