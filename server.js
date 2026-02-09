const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

// Chatbot logic
async function getBotResponse(input) {
  if (input.includes("hello") || input.includes("hi")) {
    return "Hello! How can I help you today?";
  } else if (input.includes("your name")) {
    return "I'm ChatBot!";
  } else if (input.includes("what is java")) {
    return "Java is a high-level, class-based, object-oriented programming language.";
  } else if (input.includes("what is python")) {
    return "Python is an interpreted, high-level and general-purpose programming language.";
  } else if (input.includes("data structures")) {
    return "Data structures include arrays, linked lists, stacks, queues, trees, and graphs.";
  } else {
    const topic = extractTopic(input);
    return await getWikipediaSummary(topic);
  }
}

function extractTopic(question) {
  const stopWords = ["what", "is", "about", "who", "tell", "me", "do", "you", "know", "explain"];
  return question
    .toLowerCase()
    .split(" ")
    .filter(word => !stopWords.includes(word))
    .join("_");
}

async function getWikipediaSummary(topic) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Not found");
    const data = await response.json();
    return data.extract || "Sorry, I couldn’t find anything useful.";
  } catch (error) {
    return "Sorry, I couldn't find any info on that topic.";
  }
}

// API Endpoint to get chatbot response
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message || "";
  const botReply = await getBotResponse(userMessage.toLowerCase());
  res.json({ reply: botReply });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Chatbot API Server running on port ${PORT}`);
});
