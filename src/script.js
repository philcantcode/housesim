const container = document.getElementById('three-container');
const toolSelect = document.getElementById('tool');
const materialSelect = document.getElementById('material');
const radTempInput = document.getElementById('radTemp');
const extTempInput = document.getElementById('extTemp');
const toggleAllBtn = document.getElementById('toggleAll');
const widthInput = document.getElementById('roomWidth');
const heightInput = document.getElementById('roomHeight');
const depthInput = document.getElementById('roomDepth');
const applySizeBtn = document.getElementById('applySize');

const materials = {
    brick: 1.5,
    timber: 2.0,
    concrete: 1.0
};

let scene, camera, renderer, controls;
let cells = [];
let meshes = [];
let cols = 10, rows = 10, layers = 10;
let group;

function temperatureToColor(t) {
    const min = 0;
    const max = 40;
    const ratio = Math.min(Math.max((t - min) / (max - min), 0), 1);
    const r = Math.floor(ratio * 255);
    const b = 255 - r;
    return new THREE.Color(`rgb(${r},0,${b})`);
}

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(15, 15, 15);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff));
}

function createGrid() {
    cols = parseInt(widthInput.value) || 10;
    rows = parseInt(heightInput.value) || 10;
    layers = parseInt(depthInput.value) || 10;
    cells = [];
    meshes = [];
    if (group) {
        scene.remove(group);
    }
    group = new THREE.Group();
    const geo = new THREE.BoxGeometry(1, 1, 1);
    for (let z = 0; z < layers; z++) {
        const layerCells = [];
        const layerMeshes = [];
        for (let y = 0; y < rows; y++) {
            const rowCells = [];
            const rowMeshes = [];
            for (let x = 0; x < cols; x++) {
                const cell = {type: 'empty', r: 1, temp: 20, on: false};
                const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color: temperatureToColor(20)}));
                mesh.position.set(x - cols / 2 + 0.5, y - rows / 2 + 0.5, z - layers / 2 + 0.5);
                group.add(mesh);
                rowCells.push(cell);
                rowMeshes.push(mesh);
            }
            layerCells.push(rowCells);
            layerMeshes.push(rowMeshes);
        }
        cells.push(layerCells);
        meshes.push(layerMeshes);
    }
    scene.add(group);
}

function stepSimulation() {
    const extTemp = parseFloat(extTempInput.value);
    const radTemp = parseFloat(radTempInput.value);
    const newGrid = cells.map(layer => layer.map(row => row.map(cell => ({...cell}))));
    for (let z = 0; z < layers; z++) {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = cells[z][y][x];
                if (cell.type === 'radiator' && cell.on) {
                    newGrid[z][y][x].temp = radTemp;
                    continue;
                }
                let sum = 0;
                const neighbors = [
                    [x - 1, y, z], [x + 1, y, z], [x, y - 1, z], [x, y + 1, z], [x, y, z - 1], [x, y, z + 1]
                ];
                neighbors.forEach(([nx, ny, nz]) => {
                    if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && nz >= 0 && nz < layers) {
                        const nb = cells[nz][ny][nx];
                        const rAvg = (cell.r + nb.r) / 2;
                        sum += (nb.temp - cell.temp) / rAvg;
                    } else {
                        const rAvg = (cell.r + 1) / 2;
                        sum += (extTemp - cell.temp) / rAvg;
                    }
                });
                newGrid[z][y][x].temp = cell.temp + 0.05 * sum;
            }
        }
    }
    for (let z = 0; z < layers; z++) {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                cells[z][y][x].temp = newGrid[z][y][x].temp;
            }
        }
    }
}

function updateMeshes() {
    for (let z = 0; z < layers; z++) {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                meshes[z][y][x].material.color.copy(temperatureToColor(cells[z][y][x].temp));
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    stepSimulation();
    updateMeshes();
    controls.update();
    renderer.render(scene, camera);
}

function findCellByMesh(mesh) {
    for (let z = 0; z < layers; z++) {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (meshes[z][y][x] === mesh) {
                    return {x, y, z};
                }
            }
        }
    }
    return null;
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);
    if (intersects.length === 0) return;
    const {x, y, z} = findCellByMesh(intersects[0].object) || {};
    if (x === undefined) return;
    const cell = cells[z][y][x];
    const tool = toolSelect.value;
    if (tool === 'erase') {
        cells[z][y][x] = {type: 'empty', r: 1, temp: cell.temp, on: false};
    } else if (tool === 'wall') {
        const r = materials[materialSelect.value] || 1;
        cells[z][y][x] = {type: 'wall', r, temp: cell.temp, on: false};
    } else if (tool === 'window') {
        cells[z][y][x] = {type: 'window', r: 0.3, temp: cell.temp, on: false};
    } else if (tool === 'door') {
        cells[z][y][x] = {type: 'door', r: 0.8, temp: cell.temp, on: false};
    } else if (tool === 'radiator') {
        cells[z][y][x] = {type: 'radiator', r: 1, temp: parseFloat(radTempInput.value), on: true};
    } else if (tool === 'curtain') {
        cells[z][y][x] = {type: 'curtain', r: 2.0, temp: cell.temp, on: false};
    }
}

renderer?.domElement.addEventListener('click', onClick);

toggleAllBtn.addEventListener('click', () => {
    for (let z = 0; z < layers; z++) {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = cells[z][y][x];
                if (cell.type === 'radiator') {
                    cell.on = !cell.on;
                }
            }
        }
    }
});

applySizeBtn.addEventListener('click', () => {
    createGrid();
});

initScene();
createGrid();
animate();
