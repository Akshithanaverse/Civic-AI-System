import cv2
import numpy as np
from PIL import Image
import io

def calculate_severity(category, confidence, image_bytes=None):
    base_severity = 1
    
    if image_bytes:
        # Decode image
        image = Image.open(io.BytesIO(image_bytes))
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Analyze based on category
        category_lower = category.lower()
        if "pothole" in category_lower:
            base_severity = analyze_pothole_severity(image_cv)
        elif "garbage" in category_lower or "waste" in category_lower:
            base_severity = analyze_garbage_severity(image_cv)
        elif "water leakage" in category_lower or "flood" in category_lower:
            base_severity = analyze_water_severity(image_cv)
        elif "streetlight" in category_lower or "light" in category_lower:
            base_severity = analyze_light_severity(image_cv)
        else:
            base_severity = 2  # default
    else:
        # Fallback to old logic
        category_lower = category.lower()
        if any(word in category_lower for word in ["pothole", "water leakage", "flood", "dam", "pipe", "drain"]):
            base_severity = 4
        elif any(word in category_lower for word in ["garbage", "waste", "trash", "rubbish"]):
            base_severity = 3
        elif any(word in category_lower for word in ["streetlight", "light", "lamp"]):
            base_severity = 2
        else:
            base_severity = 2
    
    # Adjust based on confidence (%)
    if confidence >= 80:
        base_severity = min(base_severity + 1, 5)
    elif confidence < 50:
        base_severity = max(base_severity - 1, 1)
    
    return base_severity

def analyze_pothole_severity(image_cv):
    # Assume potholes are dark areas; threshold and calculate density
    gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 80, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    total_area = sum(cv2.contourArea(c) for c in contours)
    image_area = image_cv.shape[0] * image_cv.shape[1]
    density = total_area / image_area if image_area > 0 else 0
    
    if density > 0.15:
        return 5
    elif density > 0.1:
        return 4
    elif density > 0.05:
        return 3
    elif density > 0.02:
        return 2
    else:
        return 1

def analyze_garbage_severity(image_cv):
    # Count bright/dark blobs as garbage density
    gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    num_blobs = len(contours)
    total_area = sum(cv2.contourArea(c) for c in contours)
    image_area = image_cv.shape[0] * image_cv.shape[1]
    density = total_area / image_area if image_area > 0 else 0
    
    if num_blobs > 20 or density > 0.2:
        return 5
    elif num_blobs > 10 or density > 0.1:
        return 4
    elif num_blobs > 5 or density > 0.05:
        return 3
    elif num_blobs > 2 or density > 0.02:
        return 2
    else:
        return 1

def analyze_water_severity(image_cv):
    # Detect blue/wet areas (simple HSV threshold for blue)
    hsv = cv2.cvtColor(image_cv, cv2.COLOR_BGR2HSV)
    lower_blue = np.array([90, 50, 50])
    upper_blue = np.array([130, 255, 255])
    mask = cv2.inRange(hsv, lower_blue, upper_blue)
    blue_area = cv2.countNonZero(mask)
    image_area = image_cv.shape[0] * image_cv.shape[1]
    density = blue_area / image_area if image_area > 0 else 0
    
    if density > 0.2:
        return 5
    elif density > 0.1:
        return 4
    elif density > 0.05:
        return 3
    elif density > 0.02:
        return 2
    else:
        return 1

def analyze_light_severity(image_cv):
    # For lights, perhaps detect bright spots or assume based on context; simple fallback
    gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray) / 255
    if brightness < 0.3:  # Dark image, maybe broken light
        return 4
    else:
        return 2

def scale_confidence(confidence):
    # Scale 0.0-1.0 to 0-100%
    return round(confidence * 100, 1)