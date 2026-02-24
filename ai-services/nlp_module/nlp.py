import requests
from config import HEADERS
import re
from nltk.tokenize import sent_tokenize
import nltk

# Download NLTK data on first import
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

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

# Enhanced Urgency keywords mapping - SINGLE KEYWORDS ONLY (no multi-word phrases)
URGENCY_KEYWORDS = {
    5: [
        # Emergency/Critical keywords
        "sparking", "electrocution", "fire", "explosion", "emergency", 
        "critical", "danger", "dangerous", "hazard", "accident", "injury",
        "exposed", "electrocuted", "burst", "blackout", "collapsed", 
        "overflow", "sewage"
    ],
    4: [
        # High urgency keywords
        "leaking", "leak", "flooding", "flood", "broken", "fallen",
        "damaged", "severe", "heavy", "major",
        "hazardous", "risk", "disconnected", "congestion", "jam",
        "blocked", "clogged", "inoperative"
    ],
    3: [
        # Medium urgency keywords
        "pothole", "crack", "pit", "hole", "uneven",
        "dirty", "dust", "debris", "garbage", "trash", "waste", "litter",
        "repair", "maintenance", "issue"
    ],
    2: [
        # Low urgency keywords
        "small", "minor", "little", "slight", "routine", "regular"
    ],
    1: [
        # Very low urgency (general complaint)
        "complaint", "feedback", "suggestion", "general"
    ]
}

def classify_text(text):
    """
    Classify complaint text into issue categories using zero-shot classification.
    Returns: (category, confidence) where confidence is 0-100
    """
    if not text or len(text.strip()) < 3:
        return "Uncategorized", 0.0
    
    try:
        # Try local model first
        classifier_model = _load_classifier()
        if classifier_model:
            result = classifier_model(text, ISSUE_CATEGORIES, multi_class=False)
            top_label = result['labels'][0]
            confidence = float(result['scores'][0]) * 100  # Convert to 0-100 scale
            return top_label, round(confidence, 2)
        
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
                    confidence = float(scores[0]) * 100  # Convert to 0-100 scale
                    return labels[0], round(confidence, 2)
        
        print(f"Classification API error: {response.status_code}")
        
    except Exception as e:
        print(f"Text classification error: {e}")
    
    return "Uncategorized", 0.0

def summarize_text(text, max_length=50, min_length=20):
    """
    Summarize complaint text into a concise one-liner.
    Uses hybrid approach: extractive + simple cleaning for better quality
    Returns: summary (string)
    """
    if not text or len(text.strip()) < 10:
        return text.strip()[:100]  # Return original text if too short
    
    text = text.strip()
    
    try:
        # Strategy 1: Extract first sentence (most direct and reliable)
        try:
            sentences = sent_tokenize(text)
            if sentences:
                first_sentence = sentences[0].strip()
                # If first sentence is reasonable length, use it
                if 15 < len(first_sentence) < 200:
                    return first_sentence
        except:
            pass
        
        # Strategy 2: Smart extractive summarization - take multiple sentences
        sentences = text.split('.')
        cleaned_sentences = [s.strip() for s in sentences if s.strip()]
        
        if len(cleaned_sentences) == 1:
            # Single sentence - clean it up and return
            sentence = cleaned_sentences[0].strip()
            # Remove repetition
            words = sentence.split()
            seen = set()
            unique_words = []
            for word in words:
                if word.lower() not in seen:
                    unique_words.append(word)
                    seen.add(word.lower())
            return ' '.join(unique_words)[:100]
        
        # For multiple sentences, take first 1-2 sentences and clean
        selected_sentences = cleaned_sentences[:1]  # Just first sentence
        combined = '.'.join(selected_sentences).strip()
        
        if combined:
            # Remove repetitive words
            words = combined.split()
            seen = set()
            unique_words = []
            for word in words:
                if word.lower() not in seen:
                    unique_words.append(word)
                    seen.add(word.lower())
            clean_summary = ' '.join(unique_words)
            
            # Return up to max_length chars, ending with period
            if len(clean_summary) > max_length:
                return clean_summary[:max_length].rstrip() + '.'
            else:
                return clean_summary if clean_summary.endswith('.') else clean_summary + '.'
        
        # Strategy 3: Try local BART model if extractive fails
        summarizer_model = _load_summarizer()
        if summarizer_model and "model" in summarizer_model and "tokenizer" in summarizer_model:
            try:
                # Truncate to avoid token limit issues
                text_truncated = text[:512]
                tokenizer = summarizer_model["tokenizer"]
                model = summarizer_model["model"]
                
                # Tokenize input
                inputs = tokenizer(text_truncated, max_length=512, truncation=True, return_tensors="pt")
                
                # Generate summary with parameters to reduce hallucination
                summary_ids = model.generate(
                    inputs["input_ids"], 
                    max_length=min(50, max_length),
                    min_length=min(15, min_length),
                    do_sample=False,
                    no_repeat_ngram_size=2  # Prevent repetition
                )
                summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
                
                if summary and len(summary.strip()) > 5:
                    return summary.strip()[:max_length]
            except Exception as local_error:
                print(f"Local model summarization: {local_error}")
        
    except Exception as e:
        print(f"Text summarization error: {e}")
    
    # Final fallback: return cleaned up first sentence
    first_sent = text.split('.')[0].strip()
    if first_sent:
        return first_sent + '.'
    return text[:100]

def detect_urgency(text):
    """
    Detect urgency level from complaint text with improved keyword matching.
    Uses word boundary matching to avoid false positives.
    Returns: (urgency_level: 1-5, urgency_label: str, keywords_found: list)
    """
    if not text:
        return 1, "Very Low", []
    
    text_lower = text.lower()
    max_urgency = 1
    keywords_found = []
    matched_keywords = set()  # Track unique keywords for removing duplicates
    
    # Check keywords from highest to lowest urgency
    for urgency_level in sorted(URGENCY_KEYWORDS.keys(), reverse=True):
        keywords = URGENCY_KEYWORDS[urgency_level]
        for keyword in keywords:
            keyword_lower = keyword.lower().strip()
            
            # Use word boundary matching for better accuracy
            # Check if keyword appears as whole word or part of words
            pattern = r'\b' + re.escape(keyword_lower) + r'\b'
            if re.search(pattern, text_lower):
                if keyword_lower not in matched_keywords:
                    keywords_found.append(keyword_lower)
                    matched_keywords.add(keyword_lower)
                max_urgency = max(max_urgency, urgency_level)
                continue
            
            # Also check for substring matches if word boundary fails
            # Useful for compound words
            if keyword_lower in text_lower:
                if keyword_lower not in matched_keywords:
                    keywords_found.append(keyword_lower)
                    matched_keywords.add(keyword_lower)
                max_urgency = max(max_urgency, urgency_level)
    
    # If no keywords found but text exists, check basic patterns for context
    if max_urgency == 1 and text_lower.strip():
        # Pattern-based urgency assignment as fallback
        if any(word in text_lower for word in ["emergency", "urgent", "critical", "immediately"]):
            max_urgency = 5
        elif any(word in text_lower for word in ["severe", "major", "high-risk"]):
            max_urgency = 4
        elif any(word in text_lower for word in ["issue", "problem", "needs"]):
            max_urgency = 2
    
    # Map to urgency label
    urgency_labels = {
        5: "Critical",
        4: "High",
        3: "Medium",
        2: "Low",
        1: "Very Low"
    }
    
    # Return with properly deduplicated keywords
    return max_urgency, urgency_labels[max_urgency], keywords_found

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
    category, confidence = classify_text(text)  # confidence is 0-100
    summary = summarize_text(text)
    urgency_level, urgency_label, keywords_found = detect_urgency(text)
    
    return {
        "classification": {
            "category": category,
            "confidence": confidence  # Now 0-100 scale
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
