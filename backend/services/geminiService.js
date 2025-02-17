const axios = require('axios');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function processQuery(query, lessonsContext) {
  try {
    const response = await axios.post('https://api.openrouter.io/v1/gemini/query', {
      query,
      context: lessonsContext
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

module.exports = { processQuery };