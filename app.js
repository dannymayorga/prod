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
  const { type, longForm, shortForm } = req.query;
  const apiKey = process.env.CHATGPT_API_KEY;

  // Define a prompt based on the selected type
  let prompt = "";
  switch (type) {
    case "epic":
      prompt = `Generate an Epic:\nLong Form: ${longForm}\n\nShort Form: ${shortForm}\n\n`;
      break;
    case "feature":
      prompt = `Generate a Feature:\nLong Form: ${longForm}\n\nShort Form: ${shortForm}\n\n`;
      break;
    case "user-stories":
      prompt = `Generate User Stories:\nLong Form: ${longForm}\n\nShort Form: ${shortForm}\n\n`;
      break;
    default:
      return res.status(400).send("Invalid content type.");
  }

  try {
    const nodeFetch = await import('node-fetch');
    const fetch = nodeFetch.default;

    const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
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
