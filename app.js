const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/generate-content", async (req, res) => {
  // Extract the values of the new fields from the request query parameters
  const { type, role, title, description } = req.query;
  const apiKey = process.env.CHATGPT_API_KEY;

  let prompt = "";
  switch (type) {
    case "epic":
      prompt = `As a ${role}, I want to create an Epic with the title "${title}" and the following description: ${description}\n\n`;
      break;
    case "feature":
      prompt = `As a ${role}, I want to create a Feature with the title "${title}" and the following description: ${description}\n\n`;
      break;
    case "user-stories":
      prompt = `As a ${role}, I want to create User Stories with the title "${title}" and the following description: ${description}\n\n`;
      break;
    default:
      return res.status(400).send("Invalid content type.");
  }

  try {
    const nodeFetch = await import('node-fetch');
    const fetch = nodeFetch.default;

    const response = await fetch("https://api.openai.com/v1/engines/davinci/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 1,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching ChatGPT:", error);
    res.status(500).send("Error: Unable to generate content.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
