document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clearBtn');
    const predictBtn = document.getElementById('predictBtn');
    const predictionResult = document.getElementById('predictionResult');

    // Set initial canvas style (white background, black brush)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Mouse event handlers
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        lastX = e.offsetX;
        lastY = e.offsetY;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Clear canvas
    clearBtn.addEventListener('click', () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        predictionResult.textContent = 'Prediction: ';
    });

    // Predict digit (connect to your Flask backend)
    predictBtn.addEventListener('click', async () => {
        // Convert canvas to image data
        const imageData = canvas.toDataURL('image/png');
        
        try {
            predictionResult.textContent = 'Predicting...';
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageData })
            });
            const result = await response.json();
            predictionResult.textContent = `Prediction: ${result.digit} (${result.confidence*100}% accuracy)`;
        } catch (error) {
            console.error('Error:', error);
            predictionResult.textContent = 'Error making prediction';
        }
    });
});