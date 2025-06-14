const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const gridSize = 50; // grid cell size
const cols = Math.floor(width / gridSize);
const rows = Math.floor(height / gridSize);

let heatSourceOn = true;
const heatSource = { x: 0, y: 0 };

// initialize grid temperatures
const tempGrid = Array.from({ length: rows }, () => Array(cols).fill(20)); // 20C baseline
const isWall = Array.from({ length: rows }, () => Array(cols).fill(false));

function drawGrid() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const temp = tempGrid[y][x];
            const color = temperatureToColor(temp);
            ctx.fillStyle = color;
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
    }
}

function temperatureToColor(temp) {
    const minTemp = 0;
    const maxTemp = 40;
    const ratio = (temp - minTemp) / (maxTemp - minTemp);
    const r = Math.floor(255 * ratio);
    const b = 255 - r;
    return `rgb(${r},0,${b})`;
}

function stepSimulation() {
    const newGrid = tempGrid.map(arr => arr.slice());
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (isWall[y][x]) continue;
            let sum = 0;
            let count = 0;
            const neighbors = [
                [x-1, y],[x+1, y],[x, y-1],[x, y+1]
            ];
            neighbors.forEach(([nx, ny]) => {
                if (nx>=0 && nx<cols && ny>=0 && ny<rows && !isWall[ny][nx]) {
                    sum += tempGrid[ny][nx];
                    count++;
                }
            });
            if (count > 0) {
                newGrid[y][x] = tempGrid[y][x] + 0.1*(sum/count - tempGrid[y][x]);
            }
        }
    }
    // add heat source
    if (heatSourceOn) {
        newGrid[heatSource.y][heatSource.x] = 40; // heat source temperature
    }
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            tempGrid[y][x] = newGrid[y][x];
        }
    }
}

function mainLoop() {
    stepSimulation();
    drawGrid();
    requestAnimationFrame(mainLoop);
}

document.getElementById('toggleHeat').addEventListener('click', () => {
    heatSourceOn = !heatSourceOn;
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / gridSize);
    const y = Math.floor((e.clientY - rect.top) / gridSize);
    if (x>=0 && x<cols && y>=0 && y<rows) {
        if (e.shiftKey) {
            heatSource.x = x;
            heatSource.y = y;
        } else {
            if (x!==heatSource.x || y!==heatSource.y) {
                isWall[y][x] = !isWall[y][x];
            }
        }
    }
});

// example walls
for (let y=0; y<rows; y++) {
    isWall[y][3] = true; // vertical wall
}

mainLoop();
