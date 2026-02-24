from flask import Flask, request, jsonify
from vision import classify_image
from nlp import generate_description
from severity import calculate_severity, scale_confidence
import base64

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json

    image_base64 = data.get("image")

    if not image_base64:
        return jsonify({"error": "Image required"}), 400

    image_bytes = base64.b64decode(image_base64)

    category, raw_confidence = classify_image(image_bytes)

    description = generate_description(category)

    confidence_percent = scale_confidence(raw_confidence)

    severity = calculate_severity(category, confidence_percent, image_bytes)
    
    is_miscategorized = confidence_percent < 50

    return jsonify({
        "predicted_category": category,
        "confidence_percent": confidence_percent,
        "generated_description": description,
        "severity_score": severity,
        "is_miscategorized": is_miscategorized
    })

if __name__ == "__main__":
    app.run(port=8000, debug=True)