from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)

# Load model
model = tf.keras.models.load_model('model/mnist_cnn.h5')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        image_data = base64.b64decode(data['image'].split(',')[1])
        image = Image.open(io.BytesIO(image_data))
        
        # Preprocess
        image = image.convert('L').resize((28, 28))
        img_array = 255 - np.array(image)  # Invert
        img_array = img_array.reshape(1, 28, 28, 1).astype('float32') / 255.0
        
        # Predict
        pred = model.predict(img_array)
        return jsonify({
            'digit': int(np.argmax(pred)),
            'confidence': float(np.max(pred))
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)