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
    initChart();
}

function initChart() {
    const graphCanvas = document.getElementById('graphCanvas');
    chart = new Chart(graphCanvas, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Avalanche size distribution',
                data: [],
                borderColor: 'blue',
                backgroundColor: 'blue',
                borderWidth: 1,
                pointRadius: 3,
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'logarithmic',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'avalanche size',
                        color: 'white',
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white',
                        callback: function(value, index, values) {
                            if (value === 1 || value === 10 || value === 100 || 
                                value === 1000 || value === 10000 || value === 100000) {
                                return value.toString();
                            }
                            return '';
                        },
                        autoSkip: true,
                        maxTicksLimit: 6
                    },
                    min: 1,
                    max: 100000
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'P(s)',
                        color: 'white',
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white',
                        callback: function(value) {
                            return value.toExponential(0);
                        },
                        autoSkip: true,
                        maxTicksLimit: 6
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Size: ${context.parsed.x.toFixed(1)}, P(s): ${context.parsed.y.toExponential(2)}`;
                        }
                    }
                }
            },
            animation: {
                duration: 0
            },
            parsing: false,
            normalized: true
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
    //await initSystem(parseInt(seedInput.value), parseFloat(alphaInput.value), parseFloat(betaInput.value));
    await initSystem(7, 0.20, 0.00);
    drawColorbar();
    
    // 更新ボタンのイベントリスナー
    // updateButton.addEventListener('click', async () => {
    //     const newSeed = parseInt(seedInput.value);
    //     const newAlpha = parseFloat(alphaInput.value);
    //     const newBeta = parseFloat(betaInput.value);
    //     if (newAlpha >= 0.00 && newAlpha <= 0.25 && newBeta >= 0.00 && newBeta <= 0.25) {
    //         stopAnimation();
    //         await initSystem(newSeed, newAlpha, newBeta);
    //         drawColorbar();
    //         animationLoop();
    //     } else {
    //         alert('Alpha and Beta must be between 0.00 and 0.25');
    //     }
    // });

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
/*
function updateGraph() {
    const rowData = system.get_size_distribution();
    chart.data.datasets[0].data = rowData;
    chart.update();
}
*/

function updateGraph() {
    const rawData = system.get_size_distribution();
    const dataArray = Array.from(rawData);
    
    const points = [];
    for (let i = 0; i < dataArray.length; i += 2) {
        // 値が0より大きい場合のみデータポイントとして追加
        if (dataArray[i] > 0 && dataArray[i+1] > 0) {
            points.push({
                x: dataArray[i],
                y: dataArray[i + 1]
            });
        }
    }

    chart.data.datasets[0].data = points;
    chart.update('none'); // アニメーションなしで更新
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

document.addEventListener('DOMContentLoaded', run);
