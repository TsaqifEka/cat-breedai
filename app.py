import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

IMG_SIZE = 224
TARGET_BREEDS = ['Persian', 'Bengal', 'British_Shorthair', 'Siamese', 'Maine_Coon', 'Sphynx', 'Ragdoll']

# ==================== LOAD LOCAL MODELS ====================

print("Loading Stage 1...")
stage1_model = tf.keras.models.load_model('stage1_local.h5')
print("Stage 1 loaded!")

print("Loading Stage 2...")
stage2_model = tf.keras.models.load_model('stage2_local.h5')
print("Stage 2 loaded!")

# ==================== PREDICTION ====================

def preprocess(image_path):
    img = tf.io.read_file(image_path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, [IMG_SIZE, IMG_SIZE])
    img = tf.cast(img, tf.float32)
    return tf.expand_dims(img, 0)

def predict_cat_breed(image_path):
    img = preprocess(image_path)
    
    # Stage 1: Cat Detector
    cat_prob = float(stage1_model.predict(img, verbose=0)[0][0])
    if cat_prob < 0.60:
        return {
            "success": True,
            "is_cat": False,
            "message": "It's not a cat, please input a cat",
            "cat_confidence": round(cat_prob * 100, 2),
            "breed": None,
            "breed_confidence": None
        }
    
    # Stage 2: Breed Classifier
    probs = stage2_model.predict(img, verbose=0)[0]
    idx = int(np.argmax(probs))
    conf = float(probs[idx])
    
    top3 = np.argsort(probs)[::-1][:3]
    top3_list = [{"breed": TARGET_BREEDS[i], "confidence": round(float(probs[i]) * 100, 2)} for i in top3]
    
    return {
        "success": True,
        "is_cat": True,
        "message": f"This is a {TARGET_BREEDS[idx]} cat",
        "cat_confidence": round(cat_prob * 100, 2),
        "breed": TARGET_BREEDS[idx],
        "breed_confidence": round(conf * 100, 2),
        "top_3_predictions": top3_list
    }

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "Empty filename"}), 400
    
    filename = secure_filename(file.filename)
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(path)
    
    try:
        result = predict_cat_breed(path)
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if os.path.exists(path):
            os.remove(path)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "models_loaded": True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)