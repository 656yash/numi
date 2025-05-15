from flask import Flask, render_template, request, jsonify
import numpy as np
import pickle
from PIL import Image, ImageOps
import base64
import re
import io

# Initialize Flask app
app = Flask(__name__)

# Load trained model
model = pickle.load(open("sklearn_digit_model.pkl", "rb"))

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Clean and decode the base64 image
    img_data = re.sub('^data:image/.+;base64,', '', data['image'])
    img = Image.open(io.BytesIO(base64.b64decode(img_data)))

    # Process the image
    img = img.convert('L')            # Convert to grayscale
    img = ImageOps.invert(img)        # Invert colors (white bg, black digit)
    img = img.resize((8, 8))          # Resize to 8x8 like scikit-learn data
    img_np = np.array(img) / 16.0     # Normalize values (sklearn digits are 0–16)
    img_flat = img_np.flatten().reshape(1, -1)  # Flatten and reshape

    # Predict the digit
    prediction = model.predict(img_flat)

    return jsonify({'prediction': int(prediction[0])})

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
