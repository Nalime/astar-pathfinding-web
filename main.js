const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");
canvas.style.position = "absolute";

const buttonWall = document.querySelector("#button-wall");
const buttonEmpty = document.querySelector("#button-empty");
const buttonStart = document.querySelector("#button-start");
const buttonEnd = document.querySelector("#button-end");
const buttonRun = document.querySelector("#button-run");
const buttonReset = document.querySelector("#button-reset");
let clickMode = "wall"
buttonWall.onclick = function () { clickMode = "wall"; }
buttonEmpty.onclick = function () { clickMode = "empty"; }
buttonStart.onclick = function () { clickMode = "start"; }
buttonEnd.onclick = function () { clickMode = "end"; }
buttonRun.onclick = function () { runAstar(); }
buttonReset.onclick = function () { resetGrid(); }

let squareSize = 10;
let squareGap = 2;
let squareTotal = squareSize + squareGap;
let gridWidth = 50;
let gridHeight = 50;
let gridEmptyColor = "#EEE";
let gridWallColor = "#333";
let gridStartColor = "#0E0";
let gridEndColor = "#E00";
let grid = [];
let isButtonDown = false;
let pathFindLoopSpeed = 20;

setBoardSize(gridWidth, gridHeight)

// document.addEventListener("resize", adaptBoardPosition, false);
document.addEventListener("pointerdown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);
document.addEventListener("touchend", onMouseUp, false);
document.addEventListener("mousemove", onMouseMove, false);
document.addEventListener("touchmove", onMouseMove, false);

function drawSquare(x, y, colorHexCode) {
    ctx.fillStyle = colorHexCode;
    ctx.fillRect(x * squareTotal, y * squareTotal,
        squareSize, squareSize);
}

function flatten(x, y) {
    return x * gridWidth + y;
}

function twoDimensionify(index) {
    return [Math.floor(index / gridWidth), index % gridWidth];
}

function setGrid(x, y, value) {
    grid[flatten(x, y)] = value;
    switch (value) {
        case 0:
            drawSquare(x, y, gridEmptyColor);
            break;
        case 1:
            drawSquare(x, y, gridWallColor);
            break;
        case 2:
            drawSquare(x, y, gridStartColor);
            break;
        case 3:
            drawSquare(x, y, gridEndColor);
            break;
        default:
            console.warn(`${setGrid.name}: switch default value`);
            break;
    }
}

function getGrid(x, y) {
    return grid[flatten(x, y)];
}

function resetGrid() {
    grid = [];
    for (let i = 0; i < gridWidth; i++)
        for (let j = 0; j < gridHeight; j++)
            setGrid(i, j, 0);
}

// // https://stackoverflow.com/questions/1038727/how-to-get-browser-width-using-javascript-code
// function getWidth() {
//     return Math.max(
//         document.body.scrollWidth,
//         document.documentElement.scrollWidth,
//         document.body.offsetWidth,
//         document.documentElement.offsetWidth,
//         document.documentElement.clientWidth
//     );
// }

// function getHeight() {
//     return Math.max(
//         document.body.scrollHeight,
//         document.documentElement.scrollHeight,
//         document.body.offsetHeight,
//         document.documentElement.offsetHeight,
//         document.documentElement.clientHeight
//     );
// }

// function adaptBoardPosition() {
//     canvas.style.top = squareGap.toString() + "px";
//     canvas.style.left = ((getWidth() - gridWidth * squareTotal - squareGap) / 2).toFixed().toString() + "px";
// }

function setBoardSize(x, y) {
    gridWidth = x;
    gridHeight = y;
    canvas.width = gridWidth * squareTotal;
    canvas.height = gridHeight * squareTotal;
    // adaptBoardPosition();
    resetGrid();
}

function getPointerPosition(x, y) {
    return [Math.floor((x + squareGap / 2) / squareTotal),
    Math.floor((y + squareGap / 2) / squareTotal)];
}

function inBounds(x, y) {
    return x > -1 && x < gridWidth && y > -1 && y < gridHeight;
}

function getGridDistance(x1, y1, x2, y2) {
    xd = Math.abs(x2 - x1);
    yd = Math.abs(y2 - y1);
    diag = Math.min(xd, yd);
    return diag * (Math.sqrt(2) - 1) + Math.max(xd, yd);
}

function getNeighbour(index) {
    p = twoDimensionify(index);
    li = [];
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i == 0 && j == 0)
                continue;
            if (inBounds(p[0] + i, p[1] + j))
                li.push(flatten(p[0] + i, p[1] + j));
        }
    }
    return li;
}

async function runAstar() {
    let start = grid.indexOf(2);
    if (start == -1) {
        console.log("No start!");
        return;
    }

    let end = grid.indexOf(3);
    if (end == -1) {
        console.log("No end!");
        return;
    }

    open = [start];
    closed = [];

    g_score = [];
    h_score = [];
    f_score = [];

    // while (open.length != 0) {
    //     cur = [-1, -1];
    //     lowest = 0;
    //     for (let i in open) {

    //     }
    // }
}

function setGridOnPointer(x, y) {
    switch (clickMode) {
        case "wall":
            if (getGrid(x, y) != 1)
                setGrid(x, y, 1);
            break;
        case "empty":
            if (getGrid(x, y) != 0)
                setGrid(x, y, 0);
            break;
        case "start":
            if (getGrid(x, y) != 2) {
                existing = grid.indexOf(2);
                if (existing != -1) {
                    p = twoDimensionify(existing);
                    setGrid(p[0], p[1], 0);
                }
                setGrid(x, y, 2);
            }
            break;
        case "end":
            if (getGrid(x, y) != 3) {
                existing = grid.indexOf(3);
                if (existing != -1) {
                    p = twoDimensionify(existing);
                    setGrid(p[0], p[1], 0);
                }
                setGrid(x, y, 3);
            }
            break;
        default:
            console.warn(`${setGridOnPointer.name}: switch default value`);
            break;
    }
}

function onMouseDown(e) {
    isButtonDown = true;
    onMouseMove(e);
}

function onMouseUp(e) {
    isButtonDown = false;
}

function onMouseMove(e) {
    if (!isButtonDown)
        return;
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
    pointer = getPointerPosition(mouseX, mouseY);
    if (inBounds(pointer[0], pointer[1]))
        setGridOnPointer(pointer[0], pointer[1]);
}