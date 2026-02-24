import requests
from config import HEADERS
import re

# Lazy load models on first use
classifier = None
summarizer = None
TEXT_MODEL = "https://router.huggingface.co/hf-inference/models/google/flan-t5-small"

def _load_classifier():
    """Lazy load classifier on first use."""
    global classifier
    if classifier is None:
        try:
            from transformers import pipeline
            classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
            print("✓ Classifier model loaded")
        except Exception as e:
            print(f"Warning: Could not load classifier: {e}")
    return classifier

def _load_summarizer():
    """Lazy load summarizer on first use."""
    global summarizer
    if summarizer is None:
        try:
            from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
            model_name = "facebook/bart-large-cnn"
            summarizer = {
                "model": AutoModelForSeq2SeqLM.from_pretrained(model_name),
                "tokenizer": AutoTokenizer.from_pretrained(model_name)
            }
            print("✓ Summarizer model loaded")
        except Exception as e:
            print(f"Warning: Could not load summarizer: {e}")
    return summarizer

# Issue categories for classification
ISSUE_CATEGORIES = [
    "Pothole",
    "Garbage",
    "Streetlight",
    "Water Leakage",
    "Traffic Congestion",
    "Broken Pole",
    "Drainage Issue",
    "Uncategorized"
]

# Urgency keywords mapping
URGENCY_KEYWORDS = {
    5: ["sparking", "fire", "explosion", "danger", "critical", "emergency", "blocking road", "accident", "injury", "dangerous"],
    4: ["leaking water", "flooding", "broken pole", "no light", "fallen", "disconnected", "exposed wire", "hazard"],
    3: ["broken", "damaged", "cracked", "holes", "stuck", "not working", "leaking", "dirty"],
    2: ["dirty", "dust", "minor", "small", "little"],
    1: ["report", "issue", "complaint"]
}

def classify_text(text):
    """
    Classify complaint text into issue categories using zero-shot classification.
    Returns: (category, confidence)
    """
    if not text or len(text.strip()) < 3:
        return "Uncategorized", 0.0
    
    try:
        # Try local model first
        classifier_model = _load_classifier()
        if classifier_model:
            result = classifier_model(text, ISSUE_CATEGORIES, multi_class=False)
            top_label = result['labels'][0]
            confidence = float(result['scores'][0])
            return top_label, round(confidence, 4)
        
        # Fallback to HF API
        response = requests.post(
            "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
            headers=HEADERS,
            json={"inputs": text, "parameters": {"candidate_labels": ISSUE_CATEGORIES}}
        )
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, dict):
                labels = result.get("labels", [])
                scores = result.get("scores", [])
                if labels and scores:
                    return labels[0], round(scores[0], 4)
        
        print(f"Classification API error: {response.status_code}")
        
    except Exception as e:
        print(f"Text classification error: {e}")
    
    return "Uncategorized", 0.0

def summarize_text(text, max_length=50, min_length=20):
    """
    Summarize complaint text into a concise one-liner.
    Returns: summary (string)
    """
    if not text or len(text.strip()) < 10:
        return text[:100]  # Return first 100 chars if too short
    
    try:
        # Try local model first
        summarizer_model = _load_summarizer()
        if summarizer_model and "model" in summarizer_model and "tokenizer" in summarizer_model:
            try:
                # Truncate to avoid token limit issues
                text_truncated = text[:1024]
                tokenizer = summarizer_model["tokenizer"]
                model = summarizer_model["model"]
                
                # Tokenize input
                inputs = tokenizer(text_truncated, max_length=1024, truncation=True, return_tensors="pt")
                
                # Generate summary
                summary_ids = model.generate(inputs["input_ids"], max_length=max_length, min_length=min_length, do_sample=False)
                summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
                return summary.strip() if summary else text[:100]
            except Exception as local_error:
                print(f"Local model summarization failed: {local_error}")
        
        # Fallback to HF API
        response = requests.post(
            "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
            headers=HEADERS,
            json={"inputs": text[:1024]}
        )
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                summary = result[0].get('summary_text', text[:100])
                return summary.strip()
        
        print(f"Summarization API error: {response.status_code}")
        
    except Exception as e:
        print(f"Text summarization error: {e}")
    
    # Fallback: return first sentence or truncated text
    sentences = text.split('.')
    return (sentences[0] + '.').strip() if sentences else text[:100]

def detect_urgency(text):
    """
    Detect urgency level from complaint text.
    Returns: (urgency_level: 1-5, urgency_label: str, keywords_found: list)
    """
    if not text:
        return 1, "Low", []
    
    text_lower = text.lower()
    max_urgency = 1
    keywords_found = []
    
    # Check keywords
    for urgency_level in sorted(URGENCY_KEYWORDS.keys(), reverse=True):
        keywords = URGENCY_KEYWORDS[urgency_level]
        for keyword in keywords:
            if keyword in text_lower:
                keywords_found.append(keyword)
                max_urgency = max(max_urgency, urgency_level)
    
    # Map to urgency label
    urgency_labels = {
        5: "Critical",
        4: "High",
        3: "Medium",
        2: "Low",
        1: "Very Low"
    }
    
    return max_urgency, urgency_labels[max_urgency], list(set(keywords_found))

def analyze_text_comprehensive(text):
    """
    Comprehensive text analysis: classification + summarization + urgency detection.
    Returns: dict with all analysis results
    """
    if not text or len(text.strip()) < 3:
        return {
            "classification": {
                "category": "Uncategorized",
                "confidence": 0.0
            },
            "summary": text[:100] if text else "",
            "urgency": {
                "level": 1,
                "label": "Very Low",
                "keywords": []
            },
            "error": "Text too short for analysis"
        }
    
    # Run all analyses
    category, confidence = classify_text(text)
    summary = summarize_text(text)
    urgency_level, urgency_label, keywords_found = detect_urgency(text)
    
    return {
        "classification": {
            "category": category,
            "confidence": confidence
        },
        "summary": summary,
        "urgency": {
            "level": urgency_level,
            "label": urgency_label,
            "keywords": keywords_found
        }
    }

def generate_description(category):
    """
    Generate a detailed description for an issue category (kept for backward compatibility).
    """
    prompt = f"Describe a civic issue related to: {category}. Keep it short and factual."

    try:
        response = requests.post(
            TEXT_MODEL,
            headers=HEADERS,
            json={"inputs": prompt}
        )

        print("NLP status:", response.status_code)

        result = response.json()

        if isinstance(result, list) and len(result) > 0 and "generated_text" in result[0]:
            return result[0]["generated_text"]

    except Exception as e:
        print("NLP error:", e)

    return f"A {category} issue has been reported and requires immediate attention."