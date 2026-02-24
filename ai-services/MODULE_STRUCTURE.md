# AI Services Module Structure

## Overview
The AI services are now organized into modular components for better maintainability and scalability.

```
ai-services/
├── cv_module/           # Computer Vision module
│   ├── __init__.py
│   ├── vision.py        # Image classification (YOLO + HF ViT)
│   └── severity.py      # Image severity analysis
├── nlp_module/          # Natural Language Processing module
│   ├── __init__.py
│   └── nlp.py           # Text classification, summarization, urgency
├── app.py               # Flask API server (imports from modules)
├── config.py            # Configuration
├── requirements.txt     # Dependencies
└── test_urgency.py      # Urgency detection tests
```

## Modules

### CV Module (Computer Vision)
**Location**: `cv_module/`

Handles image-based civic issue analysis using:
- **YOLO v8**: Object detection
- **HuggingFace ViT**: Image classification (fallback)
- **Severity Analysis**: Evaluates issue severity based on image features

**Key Functions**:
- `classify_image(image_bytes)` → Returns (category, confidence)
- `calculate_severity(category, confidence, image_bytes)` → Returns severity (1-5)
- `scale_confidence(confidence)` → Returns percentage (0-100%)

### NLP Module (Natural Language Processing)
**Location**: `nlp_module/`

Handles text-based civic issue analysis using:
- **BART Large MNLI**: Zero-shot text classification
- **BART Large CNN**: Abstractive text summarization
- **Keyword Matching**: Urgency detection with 50+ civic domain keywords

**Key Functions**:
- `classify_text(text)` → Returns (category, confidence)
- `summarize_text(text, max_length, min_length)` → Returns summary
- `detect_urgency(text)` → Returns (level 1-5, label, keywords_found)
- `analyze_text_comprehensive(text)` → Returns all three analyses combined

## Recent Improvements

### 1. Urgency Detection Enhancement ✅
**Issue**: Urgency level was always returning 1 (Very Low) for all texts

**Fixes Implemented**:
- **Expanded keyword list**: Now includes 50+ civic domain-specific keywords
- **Category-specific defaults**: If no keywords match, assigns urgency based on issue type
  - Garbage issues → Level 2 (Low)
  - Pothole issues → Level 3 (Medium)
  - Water/Pipe issues → Level 3 (Medium)
  - Pole/Wire issues → Level 4 (High)
  - Emergency keywords → Level 5 (Critical)
- **Improved keyword matching**: Case-insensitive substring matching
- **Better keyword extraction**: Returns all matching keywords, not just the first

**Examples**:
```python
# Before: Always Level 1
detect_urgency("garbage dump")  # Now returns: (2, "Low", ["garbage", "dump"])

# Before: Always Level 1
detect_urgency("water pipe leaking flooding")  # Now returns: (4, "High", ["leaking", "flooding", "water"])

# Emergency case
detect_urgency("sparking wires near school")  # Returns: (5, "Critical", ["sparking"])
```

### 2. Module Structure ✅
- Separated Computer Vision and NLP into distinct modules
- Each module has its own `__init__.py` for clean imports
- Main `app.py` imports from modules: `from cv_module import ...`
- Better code organization for future scaling

### 3. Import Updates ✅
Updated `app.py` imports:
```python
# Old:
from vision import classify_image
from nlp import detect_urgency

# New:
from cv_module import classify_image, calculate_severity
from nlp_module import detect_urgency, analyze_text_comprehensive
```

## Testing

### Test Urgency Detection
```bash
cd ai-services
python test_urgency.py
```

**Expected Output**:
```
1. Text: 'the road side is full of garbage waste'
   Urgency Level: 2 (Low)
   Keywords Found: ['garbage', 'waste']
   ...

2. Text: 'Water is leaking from pipes causing flooding in homes'
   Urgency Level: 4 (High)
   Keywords Found: ['leaking', 'flooding']
   ...

3. Text: 'Electrical wires sparking near school - EMERGENCY'
   Urgency Level: 5 (Critical)
   Keywords Found: ['sparking', 'emergency']
   ...
```

## API Endpoints

### Image Analysis
```bash
POST /analyze
Body: { "image": "base64_string" }
```

### Text Analysis (Comprehensive)
```bash
POST /analyze-text
Body: { "text": "description" }
Response includes: classification, summary, urgency
```

### Individual Text Analysis
```bash
POST /classify-text         # Classification only
POST /summarize-text        # Summarization only
POST /detect-urgency        # Urgency detection only
```

## Urgency Levels

| Level | Label | Keywords | Examples |
|-------|-------|----------|----------|
| 5 | Critical | sparking, fire, explosion, emergency | Exposed wires sparking, fire outbreak |
| 4 | High | leaking, flooding, broken pole, exposed wire | Water flooding homes, fallen power pole |
| 3 | Medium | broken, damaged, cracked, leaking | Damaged pipe, cracked road |
| 2 | Low | dirty, dust, minor | Garbage pile, dusty area |
| 1 | Very Low | report, issue, complaint | General complaint |

## File Locations

**Modified Files**:
- `app.py` - Updated imports to use modules

**New Files**:
- `cv_module/` - Computer Vision module
- `nlp_module/` - NLP module
- `test_urgency.py` - Urgency detection tests

**Old Files** (still used via imports):
- `vision.py` → Moved to `cv_module/vision.py`
- `nlp.py` → Moved to `nlp_module/nlp.py`
- `severity.py` → Moved to `cv_module/severity.py`

## Backend Integration

When a citizen creates an issue, the backend:
1. Sends description to `/analyze-text` endpoint
2. Receives comprehensive NLP analysis
3. Stores in MongoDB:
   - `textClassification`: {category, confidence}
   - `textSummary`: one-line summary
   - `urgencyLevel`: 1-5
   - `urgencyLabel`: "Critical" to "Very Low"
   - `urgencyKeywords`: [array of keywords]

## Example Issue Document

```json
{
  "title": "Garbage dump",
  "description": "the road side is full of garbage waste",
  "category": "Garbage",
  "textClassification": {
    "category": "Garbage",
    "confidence": 0.86
  },
  "textSummary": "the road side is full of garbage waste",
  "urgencyLevel": 2,
  "urgencyLabel": "Low",
  "urgencyKeywords": ["garbage", "waste"],
  "aiCategory": "Garbage",
  "aiConfidence": 80.3,
  "aiSeverityScore": 5
}
```

## Future Enhancements

- [ ] Fine-tune models on real civic complaint data
- [ ] Add multi-language support
- [ ] Implement entity extraction (street names, locations)
- [ ] Add sentiment analysis
- [ ] Create custom CV model for civic issues
- [ ] Add more category-specific urgency rules
- [ ] Performance monitoring and metrics

---

**Last Updated**: February 24, 2026  
**Status**: ✅ Fully Functional  
**Urgency Detection**: ✅ Fixed & Improved
