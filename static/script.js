// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resultElement = document.getElementById('result');
const clearBtn = document.getElementById('clearBtn');
const predictBtn = document.getElementById('predictBtn');

// Set initial canvas style
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = 'white';
ctx.lineWidth = 15;
ctx.lineCap = 'round';

// Drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch event handlers
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', stopDrawing);

// Button event listeners
clearBtn.addEventListener('click', clearCanvas);
predictBtn.addEventListener('click', predictDigit);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getPosition(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    const [x, y] = getPosition(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    lastX = x;
    lastY = y;
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    startDrawing(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    draw(mouseEvent);
}

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return [
        e.clientX - rect.left,
        e.clientY - rect.top
    ];
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    resultElement.textContent = 'Prediction: ...';
}

function predictDigit() {
    const imageData = preprocessCanvas();
    simulatePrediction(imageData);
}

function preprocessCanvas() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    
    tempCtx.drawImage(canvas, 0, 0, 28, 28);
    return tempCtx.getImageData(0, 0, 28, 28);
}

function simulatePrediction(imageData) {
    resultElement.textContent = "Predicting...";
    
    setTimeout(() => {
        const randomDigit = Math.floor(Math.random() * 10);
        resultElement.textContent = `Prediction: ${randomDigit}`;
    }, 500);
}