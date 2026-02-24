import requests
from config import HEADERS

TEXT_MODEL = "https://router.huggingface.co/hf-inference/models/google/flan-t5-small"

def generate_description(category):
    prompt = f"Describe a civic issue related to: {category}. Keep it short and factual."

    try:
        response = requests.post(
            TEXT_MODEL,
            headers=HEADERS,
            json={"inputs": prompt}
        )

        print("NLP status:", response.status_code)
        print("NLP response:", response.text)

        result = response.json()

        if isinstance(result, list) and len(result) > 0 and "generated_text" in result[0]:
            return result[0]["generated_text"]

    except Exception as e:
        print("NLP error:", e)

    return f"A {category} issue has been reported and requires immediate attention."