const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.post('/generate-content', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    // Replace with your ChatGPT API URL
    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    // Use the environment variable for the API key
    const apiKey = process.env.CHATGPT_API_KEY;

    const response = await axios.post(apiUrl, { prompt: prompt }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    // Send the generated content back to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating content.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
