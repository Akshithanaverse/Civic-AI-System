# 🎯 Quick Start: NLP Module Usage Guide

## Overview
The NLP module automatically analyzes citizen complaints for classification, summarization, and urgency detection. All analysis happens transparently when issues are created.

---

## 🚀 Quick Start (5 minutes)

### 1. Start Services
```bash
# Terminal 1: Start AI Service
cd ai-services
python app.py
# ✓ Running on http://localhost:8000

# Terminal 2: Start Backend  
cd backend
npm start
# ✓ Running on http://localhost:5000
```

### 2. Create an Issue (Automatic NLP Analysis)
The system automatically analyzes the description when you create an issue.

```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Large pothole on Main Street causing damage to cars",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "images": ["url_to_image"]
  }'
```

### 3. Response - Includes NLP Analysis
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "description": "Large pothole on Main Street causing damage to cars",
  "userId": "user_id",
  "createdAt": "2026-02-24T11:00:00Z",
  
  "textClassification": {
    "category": "Pothole",
    "confidence": 0.89
  },
  "textSummary": "Large pothole on Main Street damaging vehicles",
  "urgencyLevel": 3,
  "urgencyLabel": "Medium",
  "urgencyKeywords": ["pothole", "damage", "cars"]
}
```

---

## 🔌 Backend API Endpoints

### 1. Comprehensive Text Analysis
Analyze text and get classification + summarization + urgency all at once.

```bash
curl -X POST http://localhost:5000/api/nlp/analyze \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Water leaking from pipes causing severe flooding in homes"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "classification": {
      "category": "Water Leakage",
      "confidence": 0.92
    },
    "summary": "Pipe leakage causing severe home flooding",
    "urgency": {
      "level": 4,
      "label": "High",
      "keywords": ["flooding", "leaking", "severe"]
    }
  }
}
```

### 2. Classification Only
Get only category classification for an issue.

```bash
curl -X POST http://localhost:5000/api/nlp/classify \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Streetlight broken near school"}'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "category": "Streetlight",
    "confidence": 0.91
  }
}
```

### 3. Summarization Only
Get a concise summary of longer text.

```bash
curl -X POST http://localhost:5000/api/nlp/summarize \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The garbage collection area has accumulated several tons of waste over the past week. It smells terrible and is attracting rats and insects. Kids from nearby school play area could get infections."
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": "Garbage accumulation attracting pests and posing health risk near school"
  }
}
```

### 4. Urgency Detection Only
Analyze text specifically for urgency indicators.

```bash
curl -X POST http://localhost:5000/api/nlp/urgency \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Exposed electrical wires sparking near playground - EMERGENCY"}'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "urgencyLevel": 5,
    "urgencyLabel": "Critical",
    "keywords": ["exposed", "sparking", "emergency"]
  }
}
```

### 5. Batch Analysis (Admin Only)
Process multiple texts at once (admin privilege required).

```bash
curl -X POST http://localhost:5000/api/nlp/batch \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "texts": [
      "Large pothole on Main Street",
      "Garbage dump causing pollution",
      "Street light broken"
    ]
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "processed": 3,
    "results": [
      {
        "text": "Large pothole on Main Street",
        "classification": {"category": "Pothole", "confidence": 0.89}
      },
      {
        "text": "Garbage dump causing pollution",
        "classification": {"category": "Garbage", "confidence": 0.87}
      },
      {
        "text": "Street light broken",
        "classification": {"category": "Streetlight", "confidence": 0.91}
      }
    ]
  }
}
```

### 6. NLP Service Status
Check service health and available endpoints.

```bash
curl -X GET http://localhost:5000/api/nlp/status
```

**Response**:
```json
{
  "success": true,
  "data": {
    "serviceStatus": "RUNNING",
    "endpoints": {
      "analyze": "/api/nlp/analyze",
      "classify": "/api/nlp/classify",
      "summarize": "/api/nlp/summarize",
      "urgency": "/api/nlp/urgency",
      "batch": "/api/nlp/batch",
      "status": "/api/nlp/status"
    },
    "modelsLoaded": {
      "classifier": true,
      "summarizer": true
    }
  }
}
```

---

## 🎓 Understanding Issue Categories

When text is classified, it's assigned to one of these 8 categories:

| Category | Indicators | Example |
|----------|-----------|---------|
| **Pothole** | hole, crack, damage, road | "Large pothole on Main Street" |
| **Garbage** | trash, waste, dump, litter | "Garbage pile near park" |
| **Streetlight** | light, dark, lamp, broken | "Streetlight not working" |
| **Water Leakage** | water, leak, flood, pipe | "Water leaking from pipes" |
| **Traffic Congestion** | traffic, jam, congestion, cars | "Heavy traffic on road" |
| **Broken Pole** | pole, fallen, wire, damage | "Electrical pole fallen" |
| **Drainage Issue** | drain, blocked, overflow, water | "Drain is clogged" |
| **Uncategorized** | other, unclear | General complaints |

---

## ⚡ Understanding Urgency Levels

Urgency is detected from keywords and assigned a level 1-5:

```
Level 5: CRITICAL ⚠️ EMERGENCY
  Keywords: sparking, fire, explosion, injury
  Action: Immediate response needed

Level 4: HIGH 🔴
  Keywords: flooding, broken pole, exposed wire
  Action: Urgent response within hours

Level 3: MEDIUM 🟡
  Keywords: broken, damaged, cracked
  Action: Response within 24 hours

Level 2: LOW 🟢
  Keywords: dirty, dust, minor issue
  Action: Response within 3-5 days

Level 1: VERY LOW 🔵
  Keywords: report, issue, complaint
  Action: Routine processing
```

---

## 📱 Frontend Integration Example (React)

### Example: Issue Report with NLP
```javascript
import { useState } from 'react';
import api from './services/api';

export function ReportIssue() {
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Analyze text before submission
    const response = await api.post('/nlp/analyze', {
      text: description
    });

    const { classification, summary, urgency } = response.data.data;

    // Show user the AI analysis
    setAnalysis({
      category: classification.category,
      summary: summary,
      urgency: urgency.label
    });

    // Submit issue with analysis
    await api.post('/issues', {
      description,
      category: classification.category,
      suggestedUrgency: urgency.level
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the issue..."
      />
      
      {analysis && (
        <div className="analysis">
          <p>Category: {analysis.category}</p>
          <p>Summary: {analysis.summary}</p>
          <p>Urgency: {analysis.urgency}</p>
        </div>
      )}

      <button type="submit">Report Issue</button>
    </form>
  );
}
```

---

## 🔑 Authentication

### Get JWT Token
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'

# Response includes token
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Use Token in Requests
```bash
curl -X POST http://localhost:5000/api/nlp/analyze \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"text": "..."}'
```

---

## 📊 Example Workflow

### 1. Citizen Reports Issue
```
"Water is leaking from the big pipe near my house and flooding the road"
```

### 2. System Analysis (Automatic)
```
Classification: "Water Leakage" (92% confidence)
Summary: "Pipe leakage causing road flooding"
Urgency Level: 4 (High)
Keywords Found: ["flooding", "leaking", "water"]
```

### 3. Admin View (Admin Dashboard)
- Issue Category: Water Leakage ✓
- Urgency: High (highlighted in red)
- Summary shows: "Pipe leakage causing road flooding"
- Keywords help admin understand issue quickly

### 4. Crew Assignment
- Route crew based on: Location + Category + Urgency
- They can see: Original description + AI summary
- They check: Keywords to understand context

---

## 🧪 Testing in Postman

### Setup
1. Import example requests
2. Set {{base_url}} = http://localhost:5000
3. Set {{token}} = Your JWT token
4. Click "Send"

### Example Request Collection
```
@base_url = http://localhost:5000
@token = Bearer YOUR_JWT_TOKEN

### Analyze Text
POST {{base_url}}/api/nlp/analyze
Authorization: {{token}}
Content-Type: application/json

{
  "text": "There is a large pothole on Main Street"
}

### Classify Text
POST {{base_url}}/api/nlp/classify
Authorization: {{token}}
Content-Type: application/json

{
  "text": "Streetlight broken near school"
}
```

---

## ⚙️ Configuration & Customization

### Modify Urgency Keywords
File: `ai-services/nlp.py`

```python
URGENCY_KEYWORDS = {
    5: ["sparking", "fire", "explosion", "emergency"],
    4: ["leaking", "flooding", "broken"],
    3: ["damaged", "cracked"],
    2: ["dirty"],
    1: ["report"]
}
```

### Add New Categories
File: `ai-services/nlp.py`

```python
ISSUE_CATEGORIES = [
    "Pothole",
    "Garbage",
    "Streetlight",
    "Water Leakage",
    "Traffic Congestion",
    "Broken Pole",
    "Drainage Issue",
    "Uncategorized",
    "YOUR_NEW_CATEGORY"  # Add here
]
```

---

## 🐛 Troubleshooting

### Problem: 401 Unauthorized
**Solution**: Include valid JWT token in header
```bash
-H "Authorization: Bearer YOUR_TOKEN"
```

### Problem: Slow Response (First Request)
**Solution**: This is normal - models load on first use (~5-10 seconds)

### Problem: Text not classified
**Solution**: Text might be too short (<3 characters) or too ambiguous

### Problem: Service returns 502
**Solution**: Restart AI service:
```bash
cd ai-services
python app.py
```

---

## 📚 More Information

- **Implementation Guide**: See `STAGE1_NLP_GUIDE.md`
- **Test Results**: See `STAGE1_TEST_RESULTS.md`  
- **Implementation Summary**: See `STAGE1_IMPLEMENTATION_SUMMARY.md`
- **API Code**: See `backend/src/controllers/nlp.controller.js`
- **NLP Code**: See `ai-services/nlp.py`

---

## ✅ Checklist for Integration

- [ ] Installed dependencies: `pip install transformers torch`
- [ ] Started AI service: `python app.py`
- [ ] Started backend: `npm start`
- [ ] Generated JWT token
- [ ] Test `/api/nlp/analyze` endpoint
- [ ] Test issue creation (auto-analysis)
- [ ] Verify NLP fields in MongoDB
- [ ] Test classification accuracy
- [ ] Test batch processing (admin)
- [ ] Deploy to staging

---

**Status**: ✅ Ready for Integration  
**Last Updated**: February 24, 2026  
**Version**: 1.0
