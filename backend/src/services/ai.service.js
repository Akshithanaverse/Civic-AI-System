import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export async function analyzeImage(imageBase64) {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/analyze`, {
            image: imageBase64
        });
        return response.data;
    } catch (error) {
        console.error('AI Service Error:', error.message);
        throw new Error('Failed to analyze image');
    }
}

export async function analyzeText(text) {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/analyze-text`, {
            text: text
        });
        return response.data;
    } catch (error) {
        console.error('AI Service Text Error:', error.message);
        throw new Error('Failed to analyze text');
    }
}

export async function classifyText(text) {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/classify-text`, {
            text: text
        });
        return response.data;
    } catch (error) {
        console.error('AI Service Classification Error:', error.message);
        throw new Error('Failed to classify text');
    }
}

export async function summarizeText(text, maxLength = 50, minLength = 20) {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/summarize-text`, {
            text: text,
            max_length: maxLength,
            min_length: minLength
        });
        return response.data;
    } catch (error) {
        console.error('AI Service Summarization Error:', error.message);
        throw new Error('Failed to summarize text');
    }
}

export async function detectUrgency(text) {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/detect-urgency`, {
            text: text
        });
        return response.data;
    } catch (error) {
        console.error('AI Service Urgency Detection Error:', error.message);
        throw new Error('Failed to detect urgency');
    }
}