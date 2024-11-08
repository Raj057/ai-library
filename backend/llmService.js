// llmService.js (Using Together
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Function to query the Together AI API
const queryLLM = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.together.xyz/v1', // Together AI generation endpoint
      {
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', // You can use models like 'gpt-j-6B', 'gpt-neox-20B', etc.
        prompt: prompt,
        max_tokens: 512,
        temperature: 0.5,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ['\n', 'User Type:'], // Stop generation at newline or 'User Type
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_AI_API_KEY}`,
        },
      }
    );

    return response.data.text.trim();
  } catch (error) {
    console.error('Error querying Together AI:', error);
    throw error;
  }
};

module.exports = { queryLLM };
