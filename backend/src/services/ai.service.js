const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function analyzeImage(imageBase64) {
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

module.exports = { analyzeImage };
