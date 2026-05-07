from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os


app = Flask(__name__)
CORS(app)

MODEL_PATH = 'model.pkl'

if not os.path.exists(MODEL_PATH):
    print(f"WARNING: {MODEL_PATH} not found. Please run train_model.py first.")
    model = None
else:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "model_loaded": model is not None})

@app.route('/categorize', methods=['POST'])
def categorize_expense():
    """
    Endpoint to categorize a single expense title.
    Expected JSON: {"title": "dominos pizza"}
    Returns JSON: {"category": "Food"}
    """
    if model is None:
        return jsonify({"category": "General", "error": "Model not loaded"}), 200

    data = request.json
    if not data or 'title' not in data:
        return jsonify({"error": "Please provide a 'title' in the JSON body"}), 400

    title = data['title']
    
    try:

        prediction = model.predict([title])[0]
        return jsonify({"category": prediction})
    except Exception as e:
        print(f"Prediction error: {e}")
        # Fallback category
        return jsonify({"category": "General"}), 200

@app.route('/categorize/batch', methods=['POST'])
def categorize_batch():
    """
    Endpoint to categorize multiple expense titles at once.
    Expected JSON: {"titles": ["dominos", "uber"]}
    Returns JSON: {"categories": ["Food", "Transport"]}
    """
    if model is None:
        data = request.json
        fallback = ["General"] * len(data.get('titles', []))
        return jsonify({"categories": fallback, "error": "Model not loaded"}), 200

    data = request.json
    if not data or 'titles' not in data:
        return jsonify({"error": "Please provide an array of 'titles'"}), 400

    titles = data['titles']
    
    try:
        predictions = model.predict(titles)
        return jsonify({"categories": list(predictions)})
    except Exception as e:
        print(f"Batch prediction error: {e}")
        return jsonify({"categories": ["General"] * len(titles)}), 200


if __name__ == '__main__':

    print("Starting ML Categorization Service on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True)


