const express = require("express");
const cors = require("cors");

const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 SAFE API KEY (from Render env or .env)
const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/chat", async (req, res) => {

  try {

    const message = req.body.message;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are NovaAI, a smart assistant."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    res.json(data);

  } catch (err) {
    res.json({ error: "Server error" });
  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 NovaAI backend running");
});