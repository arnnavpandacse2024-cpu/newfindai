const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.json({ 
        response: "Oops! The GEMINI_API_KEY is not set correctly. Please add your API key to enable AI responses." 
      });
    }

    // Using direct fetch to Gemini API v1 (more stable than SDK's v1beta for some keys)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const body = {
      contents: [{
        parts: [{
          text: `You are a helpful Career Guide for CareerForge. Help students identify skill gaps and provide career advice. User says: ${message}`
        }]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.error || !data.candidates) {
      console.error('Gemini API Error, using local fallback:', data.error);
      return res.json({ response: getLocalFallbackResponse(message) });
    }

    res.json({ response: data.candidates[0].content.parts[0].text });

  } catch (error) {
    console.error('Chat Route Error, using local fallback:', error);
    res.json({ response: getLocalFallbackResponse(req.body.message || "") });
  }
});

function getLocalFallbackResponse(input) {
  const lowInput = input.toLowerCase();
  
  const knowledge = [
    { keys: ['hi', 'hello', 'hey'], resp: "Hello! I'm your CareerForge guide. How can I help with your career journey today?" },
    { keys: ['python', 'learn python'], resp: "Python is essential for Data Science and Backend dev. Start with basic syntax, then move to libraries like Pandas for data or Django for web!" },
    { keys: ['java', 'spring'], resp: "Java is great for enterprise apps. I recommend learning Spring Boot to become a highly sought-after backend developer." },
    { keys: ['salary', 'pay', 'money'], resp: "Salaries vary by role and location. For example, a Junior Full Stack Dev in India typically starts at ₹5-8 LPA, while ML Engineers can start higher!" },
    { keys: ['skill gap', 'what is gap'], resp: "A skill gap is the difference between the skills you have and those required for your dream job. Our analyzer helps you identify and bridge them!" },
    { keys: ['roadmap', 'plan'], resp: "Once you complete the Skill Analyzer, I'll generate a personalized roadmap just for you!" },
    { keys: ['help', 'what can you do'], resp: "I can help you understand career roles, suggest learning resources, and explain how to use the CareerForge analyzer." },
    { keys: ['thank', 'thanks'], resp: "You're very welcome! Let me know if you have more questions. Own your future!" }
  ];

  for (const item of knowledge) {
    if (item.keys.some(k => lowInput.includes(k))) return item.resp;
  }

  return "That's an interesting question! I recommend using our Skill Analyzer to get the most accurate insights for your specific goals, or try asking about specific languages like Python or Java.";
}

module.exports = router;
