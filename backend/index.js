const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 4001; // Define the port for the server
app.use(bodyParser.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Define a route
app.post("/v1/api/trivia", async (req, res) => {
  try {
    // Destructure required parameters from request body
    let { topic, index } = await req.body;

    // Check if required parameters are present
    if (!topic || index === undefined || index === null) {
      return res
        .status(400)
        .json({ error: "Missing 'topic' or 'index' in request body" });
    }

    let triviaQuestions = [];
    let loopCount = 0;

    while (triviaQuestions.length < 20 && loopCount < 2) {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions",
        {
          prompt: `Generate 20 trivia questions and answers about ${topic}. Give just questions and answers without any special characters. Q: before each question and A: before each answer and no numbering`,
          max_tokens: 150,
          n: 20,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const choices = response.data["choices"];
      let latestQuestion = "";

      for (const text of choices) {
        const pairs = text["text"];
        const lines = pairs.split("\n");

        lines.forEach((line) => {
          line = line.trim();
          if (line.startsWith("Q:")) {
            const question = line.split("Q:")[1].trim();
            latestQuestion = question;
          } else if (line.startsWith("A:")) {
            const answer = line.split("A:")[1].trim();
            if (answer !== "" && latestQuestion !== "") {
              triviaQuestions.push({
                role: "assistant",
                question: latestQuestion,
                answer: answer,
                index: index,
              });
              index++;
            }
            latestQuestion = "";
          }
        });

        if (triviaQuestions.length >= 20) {
          break;
        }
      }

      loopCount++;
    }

    if (triviaQuestions.length < 20) {
      return res
        .status(400)
        .json({ error: "Insufficient trivia questions generated" });
    }

    res.json({ triviaQuestions });
  } catch (error) {
    console.error("Error generating trivia:", error);

    // Handle specific error scenarios
    if (axios.isAxiosError(error)) {
      // Axios error (e.g., network error, request timeout)
      return res
        .status(500)
        .json({ error: "Error communicating with OpenAI API" });
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      // OpenAI API error response (if available)
      return res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    } else {
      // Other unexpected errors
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Error handler middleware for handling internal server errors
app.use((req, res) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Sorry! you hit the wrong API" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
