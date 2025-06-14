const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gridSize = 40;
const cols = Math.floor(canvas.width / gridSize);
const rows = Math.floor(canvas.height / gridSize);

const toolSelect = document.getElementById('tool');
const materialSelect = document.getElementById('material');
const radTempInput = document.getElementById('radTemp');
const extTempInput = document.getElementById('extTemp');
const toggleAllBtn = document.getElementById('toggleAll');

const materials = {
    brick: 1.5,
    timber: 2.0,
    concrete: 1.0
};

// initialize cell grid
const cells = [];
for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
        row.push({
            type: 'empty',
            r: 1,
            temp: 20,
            on: false // for radiator cells
        });
    }
    cells.push(row);
}

function temperatureToColor(t) {
    const min = 0;
    const max = 40;
    const ratio = Math.min(Math.max((t - min) / (max - min), 0), 1);
    const r = Math.floor(ratio * 255);
    const b = 255 - r;
    return `rgb(${r},0,${b})`;
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = cells[y][x];
            ctx.fillStyle = temperatureToColor(cell.temp);
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            ctx.strokeStyle = '#333';
            ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
            if (cell.type === 'radiator') {
                ctx.fillStyle = 'red';
                ctx.fillRect(x * gridSize + 10, y * gridSize + 10, gridSize - 20, gridSize - 20);
            } else if (cell.type === 'window') {
                ctx.strokeStyle = 'cyan';
                ctx.strokeRect(x * gridSize + 5, y * gridSize + 5, gridSize - 10, gridSize - 10);
            } else if (cell.type === 'door') {
                ctx.strokeStyle = 'brown';
                ctx.beginPath();
                ctx.moveTo(x * gridSize, y * gridSize);
                ctx.lineTo((x + 1) * gridSize, (y + 1) * gridSize);
                ctx.stroke();
            }
        }
    }
}

function stepSimulation() {
    const extTemp = parseFloat(extTempInput.value);
    const radTemp = parseFloat(radTempInput.value);
    const newGrid = cells.map(row => row.map(cell => ({...cell})));
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = cells[y][x];
            if (cell.type === 'radiator' && cell.on) {
                newGrid[y][x].temp = radTemp;
                continue;
            }
            let sum = 0;
            let count = 0;
            const neighbors = [
                [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
            ];
            neighbors.forEach(([nx, ny]) => {
                if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                    const nb = cells[ny][nx];
                    const rAvg = (cell.r + nb.r) / 2;
                    sum += (nb.temp - cell.temp) / rAvg;
                    count++;
                } else {
                    // outside
                    const rAvg = (cell.r + 1) / 2;
                    sum += (extTemp - cell.temp) / rAvg;
                    count++;
                }
            });
            newGrid[y][x].temp = cell.temp + 0.05 * sum;
        }
    }
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            cells[y][x].temp = newGrid[y][x].temp;
        }
    }
}

function mainLoop() {
    stepSimulation();
    drawGrid();
    requestAnimationFrame(mainLoop);
}

canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / gridSize);
    const y = Math.floor((e.clientY - rect.top) / gridSize);
    if (x < 0 || x >= cols || y < 0 || y >= rows) return;
    const tool = toolSelect.value;
    const cell = cells[y][x];
    if (tool === 'erase') {
        cells[y][x] = {type: 'empty', r: 1, temp: cell.temp, on: false};
    } else if (tool === 'wall') {
        const r = materials[materialSelect.value] || 1;
        cells[y][x] = {type: 'wall', r, temp: cell.temp, on: false};
    } else if (tool === 'window') {
        cells[y][x] = {type: 'window', r: 0.3, temp: cell.temp, on: false};
    } else if (tool === 'door') {
        cells[y][x] = {type: 'door', r: 0.8, temp: cell.temp, on: false};
    } else if (tool === 'radiator') {
        cells[y][x] = {type: 'radiator', r: 1, temp: parseFloat(radTempInput.value), on: true};
    }
});

toggleAllBtn.addEventListener('click', () => {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = cells[y][x];
            if (cell.type === 'radiator') {
                cell.on = !cell.on;
            }
        }
    }
});

mainLoop();
