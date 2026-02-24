import requests
from config import HEADERS
from ultralytics import YOLO
import numpy as np
from PIL import Image
import io

# Load YOLO model for object detection
model = YOLO('yolov8n.pt')  # Pre-trained on COCO

# Map YOLO COCO classes to our categories (approximate)
YOLO_TO_CATEGORY = {
    0: "Uncategorized",  # person
    1: "Uncategorized",  # bicycle
    2: "Uncategorized",  # car
    3: "Uncategorized",  # motorcycle
    5: "Uncategorized",  # bus
    7: "Uncategorized",  # truck
    9: "Streetlight",  # traffic light
    10: "Uncategorized",  # fire hydrant
    11: "Uncategorized",  # stop sign
    13: "Uncategorized",  # bench
    14: "Uncategorized",  # bird
    15: "Uncategorized",  # cat
    16: "Uncategorized",  # dog
    17: "Uncategorized",  # horse
    18: "Uncategorized",  # sheep
    19: "Uncategorized",  # cow
    20: "Uncategorized",  # elephant
    21: "Uncategorized",  # bear
    22: "Uncategorized",  # zebra
    23: "Uncategorized",  # giraffe
    24: "Uncategorized",  # backpack
    25: "Garbage",  # umbrella
    26: "Uncategorized",  # handbag
    27: "Uncategorized",  # tie
    28: "Uncategorized",  # suitcase
    29: "Uncategorized",  # frisbee
    30: "Uncategorized",  # skis
    31: "Uncategorized",  # snowboard
    32: "Uncategorized",  # sports ball
    33: "Uncategorized",  # kite
    34: "Uncategorized",  # baseball bat
    35: "Uncategorized",  # baseball glove
    36: "Uncategorized",  # skateboard
    37: "Uncategorized",  # surfboard
    38: "Uncategorized",  # tennis racket
    39: "Water Leakage",  # bottle
    40: "Uncategorized",  # wine glass
    41: "Uncategorized",  # cup
    42: "Uncategorized",  # fork
    43: "Uncategorized",  # knife
    44: "Uncategorized",  # spoon
    45: "Uncategorized",  # bowl
    46: "Uncategorized",  # banana
    47: "Uncategorized",  # apple
    48: "Uncategorized",  # sandwich
    49: "Uncategorized",  # orange
    50: "Uncategorized",  # broccoli
    51: "Uncategorized",  # carrot
    52: "Uncategorized",  # hot dog
    53: "Uncategorized",  # pizza
    54: "Uncategorized",  # donut
    55: "Uncategorized",  # cake
    56: "Uncategorized",  # chair
    57: "Uncategorized",  # couch
    58: "Uncategorized",  # potted plant
    59: "Uncategorized",  # bed
    60: "Uncategorized",  # dining table
    61: "Uncategorized",  # toilet
    62: "Uncategorized",  # tv
    63: "Uncategorized",  # laptop
    64: "Uncategorized",  # mouse
    65: "Uncategorized",  # remote
    66: "Uncategorized",  # keyboard
    67: "Uncategorized",  # cell phone
    68: "Uncategorized",  # microwave
    69: "Uncategorized",  # oven
    70: "Uncategorized",  # toaster
    71: "Uncategorized",  # sink
    72: "Uncategorized",  # refrigerator
    73: "Uncategorized",  # book
    74: "Uncategorized",  # clock
    75: "Uncategorized",  # vase
    76: "Uncategorized",  # scissors
    77: "Uncategorized",  # teddy bear
    78: "Uncategorized",  # hair drier
    79: "Uncategorized",  # toothbrush
}

# Fallback to HF if YOLO doesn't detect relevant
VISION_MODEL = "https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224"

# Map HF labels to your app's categories
LABEL_MAP = {
    "Pothole": [
        "pothole", "road", "asphalt", "pavement", "street", "crack", "damage",
        "gravel", "cobblestone", "road surface", "tarmac", "highway", "pit"
    ],
    "Streetlight": [
        "street light", "streetlight", "lamp", "lantern", "light", "pole",
        "lamppost", "traffic light", "spotlight", "torch", "electric light"
    ],
    "Garbage": [
        "garbage", "trash", "waste", "litter", "bin", "dump", "rubbish",
        "refuse", "compost", "recycling", "dumpster", "bag", "pile", "heap"
    ],
    "Water Leakage": [
        "water", "pipe", "flood", "leak", "puddle", "drain", "sewage",
        "wet", "moisture", "overflow", "stream", "flow", "tap", "valve"
    ],
}

def map_to_category(label: str):
    label_lower = label.lower()
    for category, keywords in LABEL_MAP.items():
        for keyword in keywords:
            if keyword in label_lower:
                return category
    return "Uncategorized"

def classify_image(image_bytes):
    # First, try YOLO for detection
    image = Image.open(io.BytesIO(image_bytes))
    results = model(image)
    
    if results and len(results) > 0:
        result = results[0]
        if result.boxes and len(result.boxes) > 0:
            # Get the highest confidence detection
            boxes = result.boxes
            max_conf_idx = np.argmax(boxes.conf.cpu().numpy())
            class_id = int(boxes.cls[max_conf_idx].cpu().numpy())
            confidence = float(boxes.conf[max_conf_idx].cpu().numpy())
            category = YOLO_TO_CATEGORY.get(class_id, "Uncategorized")
            if category != "Uncategorized":
                return category, confidence
    
    # Fallback to HF ViT
    response = requests.post(
        VISION_MODEL,
        headers={**HEADERS, "Content-Type": "application/octet-stream"},
        data=image_bytes
    )

    print("HF Status code:", response.status_code)
    print("HF Response text:", response.text)

    if response.status_code != 200:
        print("HF API error:", response.status_code, response.text)
        return "Uncategorized", 0.0

    result = response.json()

    if isinstance(result, list) and len(result) > 0:
        # Try to find a matching category from top results
        for item in result:
            label = item.get("label", "")
            score = item.get("score", 0.0)
            category = map_to_category(label)
            if category != "Uncategorized":
                return category, round(score, 4)

        # If nothing matched, return top result as Uncategorized
        top = result[0]
        return "Uncategorized", round(top.get("score", 0.0), 4)

    return "Uncategorized", 0.0