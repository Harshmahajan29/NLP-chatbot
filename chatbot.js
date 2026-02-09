

async function handleUserInput() {
  const inputField = document.getElementById("user-input");
  const input = inputField.value.trim();

  if (!input) return;

  addMessage("user", input);
  inputField.value = "";

  const loadingId = addMessage("bot", "Searching Wikipedia...");

  const response = await getBotResponse(input);

  updateMessage(loadingId, response);
}



function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");

  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;

  const id = Date.now();
  msg.setAttribute("data-id", id);

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  return id;
}

function updateMessage(id, newText) {
  const msg = document.querySelector(`[data-id="${id}"]`);
  if (msg) msg.innerText = newText;
}



async function getBotResponse(input) {

  const text = input.toLowerCase();

  if (isGreeting(text)) {
    return "Hello! Ask me anything and I'll fetch information for you.";
  }

  if (text.includes("your name")) {
    return "I am a Wikipedia powered chatbot.";
  }

  const topic = extractTopic(text);

  if (!topic) {
    return "Please ask a meaningful question.";
  }

  return await getWikipediaSummary(topic);
}


function isGreeting(text) {
  return /\b(hello|hi|hey)\b/.test(text);
}


function extractTopic(question) {

  const stopWords = [
    "what","is","who","tell","me","about","the",
    "a","an","explain","define","do","you","know",
    "please","can","give","information","on",
    "who","was","are"
  ];

  return question
    .split(" ")
    .filter(word => !stopWords.includes(word))
    .join("_");
}



async function getWikipediaSummary(topic) {

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`;

  try {

    const response = await fetch(url);

    if (!response.ok) {
      return "I couldn't find information on that topic. Try being more specific.";
    }

    const data = await response.json();

    if (data.extract) {
      return data.extract;
    }

    return "No useful summary found.";

  } catch (error) {
    return "Error connecting to Wikipedia service.";
  }
}


document
  .getElementById("user-input")
  .addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
      handleUserInput();
    }

  });
