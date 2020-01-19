const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");
canvas.style.position = "absolute";

let squareSize = 10
let squareGap = 2
let squareTotal = squareSize + squareGap
let gridWidth = 50
let gridHeight = 50
let gridEmptyColor = "#EEE"
let gridWallColor = "#333"
let grid = []
let isButtonDown = false;

setBoardSize(gridWidth, gridHeight)

document.addEventListener("resize", adaptBoardPosition, false);
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

function resetBoard() {
    for (let i = 0; i < gridWidth; i++) {
        for (let j = 0; j < gridHeight; j++) {
            grid[i + j * gridWidth] = 0;
            drawSquare(i, j, gridEmptyColor);
        }
    }
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
    grid = [];
    for (let i = 0; i < gridWidth; i++)
        grid.push(new Array(10));
    canvas.width = gridWidth * squareTotal
    canvas.height = gridHeight * squareTotal
    // adaptBoardPosition();
    resetBoard();
}

function getPointerPosition(x, y) {
    
}

function onMouseDown(e) {
    isButtonDown = true;
}

function onMouseUp(e) {
    isButtonDown = false;
}

function onMouseMove(e) {
    if (isButtonDown) {
        mouseX = e.clientX - canvas.offsetLeft;
        mouseY = e.clientY - canvas.offsetTop;
        drawVertex(mouseX, mouseY, 0.5);
    }
}