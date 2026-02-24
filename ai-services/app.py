from flask import Flask, request, jsonify
from cv_module import classify_image, calculate_severity, scale_confidence
from nlp_module import generate_description, analyze_text_comprehensive, classify_text, summarize_text, detect_urgency
import base64

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Complete image analysis: classification, severity, description, and AI insights.
    """
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

@app.route("/analyze-text", methods=["POST"])
def analyze_text():
    """
    Comprehensive text analysis: classification + summarization + urgency detection.
    Endpoint for analyzing complaint descriptions.
    """
    data = request.json
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "Text required"}), 400

    try:
        result = analyze_text_comprehensive(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/classify-text", methods=["POST"])
def classify_text_endpoint():
    """
    Text classification only: classify complaint into issue categories.
    """
    data = request.json
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "Text required"}), 400

    try:
        category, confidence = classify_text(text)
        return jsonify({
            "category": category,
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/summarize-text", methods=["POST"])
def summarize_text_endpoint():
    """
    Text summarization only: convert long complaint into one-liner.
    """
    data = request.json
    text = data.get("text", "").strip()
    max_length = data.get("max_length", 50)
    min_length = data.get("min_length", 20)

    if not text:
        return jsonify({"error": "Text required"}), 400

    try:
        summary = summarize_text(text, max_length, min_length)
        return jsonify({
            "summary": summary,
            "original_length": len(text),
            "summary_length": len(summary)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/detect-urgency", methods=["POST"])
def detect_urgency_endpoint():
    """
    Urgency detection: analyze text for urgency keywords and level.
    """
    data = request.json
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "Text required"}), 400

    try:
        urgency_level, urgency_label, keywords = detect_urgency(text)
        return jsonify({
            "urgency_level": urgency_level,
            "urgency_label": urgency_label,
            "keywords_found": keywords
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    """
    Health check endpoint.
    """
    return jsonify({"status": "AI Service is running", "version": "1.0"}), 200

if __name__ == "__main__":
    app.run(port=8000, debug=True)