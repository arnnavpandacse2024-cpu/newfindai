require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There is no direct listModels in the SDK for clients usually, but we can try to hit a known model.
    console.log('Testing with API Key:', process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Test");
    console.log('Success!');
  } catch (err) {
    console.error('Error Status:', err.status);
    console.error('Error Message:', err.message);
  }
}

listModels();
