"""
Simple keyword-based fallback classifier for when AI services timeout.
This is FAST (milliseconds) and doesn't require Gemini API.
"""

import re

CATEGORY_KEYWORDS = {
    "Pothole": [
        "pothole", "hole", "road damage", "pavement", "asphalt", "crack", "broken road",
        "uneven", "bump", "dent", "pit", "cavity", "surface damage", "damaged road"
    ],
    "Garbage": [
        "garbage", "trash", "waste", "litter", "rubbish", "junk", "dump", "debris",
        "mess", "scrap", "refuse", "discarded", "littered", "dumped", "pollution",
        "plastic", "waste dump", "illegal dumping"
    ],
    "Streetlight": [
        "streetlight", "light", "lamp", "lamppost", "street light", "lighting", "broken light",
        "dark", "no light", "light pole", "not working", "off", "damaged lamp", "light out",
        "street lamp"
    ],
    "Water Leakage": [
        "water", "leak", "leaking", "flooding", "flood", "pipe", "water pipe", "sewage",
        "overflow", "drainage", "draining", "wet", "puddle", "water spill", "water damage",
        "sewer"
    ]
}

def classify_by_keywords(text, description=""):
    """
    Fast keyword-based classification.
    
    Args:
        text: Description or title from user
        description: Optional additional description
        
    Returns:
        (category, confidence_percent, method)
    """
    combined_text = f"{text} {description}".lower()
    
    # Score each category by keyword matches
    category_scores = {}
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        matches = sum(1 for keyword in keywords if keyword in combined_text)
        if matches > 0:
            category_scores[category] = matches
    
    if not category_scores:
        return "Uncategorized", 0.0, "keyword_no_match"
    
    # Find category with highest matches
    best_category = max(category_scores, key=category_scores.get)
    match_count = category_scores[best_category]
    
    # Confidence based on number of matches
    # 1 match = 60%, 2+ matches = 85%, 3+ = 95%
    if match_count >= 3:
        confidence = 0.95
    elif match_count >= 2:
        confidence = 0.85
    else:
        confidence = 0.60
    
    return best_category, confidence * 100, "keyword_match"


def get_description_by_category(category):
    """Get a simple description for a category."""
    descriptions = {
        "Pothole": "A pothole has been reported on the road surface. This requires immediate attention to prevent damage to vehicles and ensure public safety.",
        "Garbage": "Garbage or litter has been reported in this location. This needs cleanup and proper waste disposal.",
        "Streetlight": "A streetlight malfunction has been reported. This affects public safety and visibility in the area.",
        "Water Leakage": "Water leakage or flooding has been reported. This requires urgent attention to prevent property damage and health hazards.",
        "Uncategorized": "The issue has been reported. Please provide more details in the description for better categorization."
    }
    return descriptions.get(category, descriptions["Uncategorized"])
