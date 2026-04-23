FROM python:3.11.9-slim

WORKDIR /app

# System dependencies for opencv
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir \
    Flask==3.1.3 \
    gunicorn==21.2.0 \
    python-dotenv==1.2.1 \
    requests==2.32.5 \
    Pillow==10.4.0 \
    numpy==1.26.4 \
    opencv-python-headless==4.9.0.80 \
    torch==2.5.1+cpu torchvision==0.20.1+cpu \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir \
    ultralytics==8.1.47 \
    google-generativeai==0.5.4 \
    cloudinary==1.36.0 \
    transformers==4.40.0 \
    sentencepiece==0.2.0 \
    nltk==3.8.1 \
    werkzeug==3.1.6

COPY . .

EXPOSE 8000

CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:8000", "--timeout", "120", "app:app"]