import { analyzeText, classifyText, summarizeText, detectUrgency } from "../services/ai.service.js";

/**
 * Comprehensive text analysis: classification + summarization + urgency
 */
export const analyzeComplaintText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 3) {
      return res.status(400).json({ 
        message: "Text must be at least 3 characters long" 
      });
    }

    const result = await analyzeText(text);

    res.status(200).json({
      message: "Text analysis completed successfully",
      analysis: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Classify complaint text into issue categories
 */
export const classifyComplaintText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 3) {
      return res.status(400).json({ 
        message: "Text must be at least 3 characters long" 
      });
    }

    const result = await classifyText(text);

    res.status(200).json({
      message: "Text classification completed",
      classification: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Summarize complaint text into one-liner
 */
export const summarizeComplaintText = async (req, res, next) => {
  try {
    const { text, max_length = 50, min_length = 20 } = req.body;

    if (!text || text.trim().length < 3) {
      return res.status(400).json({ 
        message: "Text must be at least 3 characters long" 
      });
    }

    const result = await summarizeText(text, max_length, min_length);

    res.status(200).json({
      message: "Text summarization completed",
      summary: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Detect urgency level from complaint text
 */
export const detectComplaintUrgency = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 3) {
      return res.status(400).json({ 
        message: "Text must be at least 3 characters long" 
      });
    }

    const result = await detectUrgency(text);

    res.status(200).json({
      message: "Urgency detection completed",
      urgency: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Batch analysis endpoint for bulk text processing
 */
export const batchAnalyzeText = async (req, res, next) => {
  try {
    const { texts } = req.body;

    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ 
        message: "texts must be a non-empty array" 
      });
    }

    const results = [];
    for (const text of texts) {
      if (text.trim().length >= 3) {
        try {
          const analysis = await analyzeText(text);
          results.push({
            text: text,
            success: true,
            analysis: analysis
          });
        } catch (error) {
          results.push({
            text: text,
            success: false,
            error: error.message
          });
        }
      }
    }

    res.status(200).json({
      message: "Batch analysis completed",
      total: texts.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results: results
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Health check and model info
 */
export const nlpStatus = async (req, res, next) => {
  res.status(200).json({
    message: "NLP Models Status",
    models: {
      "Text Classification": "facebook/bart-large-mnli (zero-shot)",
      "Text Summarization": "facebook/bart-large-cnn",
      "Urgency Detection": "Keyword-based + Hugging Face"
    },
    endpoints: {
      "/api/nlp/analyze": "Comprehensive text analysis",
      "/api/nlp/classify": "Text classification only",
      "/api/nlp/summarize": "Text summarization only",
      "/api/nlp/urgency": "Urgency detection only",
      "/api/nlp/batch": "Batch text analysis",
      "/api/nlp/status": "NLP status and model info"
    },
    version: "1.0"
  });
};
