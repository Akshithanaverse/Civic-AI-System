# Test the AI Service

import requests
import base64

# Example: Load a test image (replace with actual path)
# with open('test_images/sample.jpg', 'rb') as f:
#     image_data = f.read()
# image_base64 = base64.b64encode(image_data).decode('utf-8')

# For testing, use a dummy base64 (replace with real)
# This is a placeholder; in real use, encode an actual image

def test_ai_service():
    url = 'http://localhost:8000/analyze'
    # Dummy base64 for a small image (not real)
    dummy_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="  # 1x1 pixel PNG
    
    data = {'image': dummy_base64}
    response = requests.post(url, json=data)
    print('Status:', response.status_code)
    print('Response:', response.json())

if __name__ == '__main__':
    test_ai_service()