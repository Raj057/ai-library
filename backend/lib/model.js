// lib/model.js
const { groq } = require('@ai-sdk/groq');
const { createGroq } = require('@ai-sdk/groq');

const groqProvider = createGroq();

// Initialize the model
const llama = groqProvider("llama3-8b-8192");

module.exports = { llama };
