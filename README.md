# Serperise Frontend

Serperise frontend is built using React, with `MainScreen.js` as the main JavaScript file that handles the display of topics, chat interaction with OpenAI for questions, error handling, and input field for user interaction.

## Setup and Run

To run the Serperise frontend on your local machine, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/Sar-thak-3/Serperise
```

### 2. Navigate to the Frontend Directory

```bash
cd serperise
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Navigate to Backend directory
```bash
cd backend
```

### 5. Install dependencies
```bash
npm install
cd..
```

### 4. Start the Application

```bash
npm run start
```

## MainScreen.js Overview

The `MainScreen.js` file is the main entry point for the Serperise frontend application. Here's an overview of its functionality:

### Display List of Topics

The screen displays a list of topics entered, likely retrieved from the backend API.

### Chat with OpenAI for Questions

The chat interface allows users to interact with OpenAI to ask questions. This likely involves sending user input to the backend API, which then communicates with OpenAI's API.

### Error Handling

Errors encountered during the application's operation are displayed to the user, ensuring a smooth user experience even when issues arise.

### Input Field

An input field is provided to allow users to enter their questions or messages, initiating interaction with the chatbot (OpenAI).

## Additional Notes

Ensure that the backend server is running and accessible from the frontend for seamless communication between the frontend and backend components.

For any questions or issues, please refer to the project's documentation or contact the project maintainers.

Happy exploring Serperise!


---

# Serperise Backend APIs

Welcome to Serperise! This document provides details about the backend APIs for the Serperise project, built using Node.js.

## API Endpoints

### 1. Retrieve Trivia Questions

- **Endpoint:** `/v1/api/trivia`
- **Method:** `POST`
- **Description:** This endpoint returns a list of trivia questions along with their answers.
- **Input Format:**
    ```json
        {
            "topic": "topic_name",
            "index": 1
        }
        # The index is handled already in frontend, if you want to try backend api, put index to any integer value
    ```
- **Response Format:**
  ```json
  [
    {
      "question": "What is the capital of France?",
      "answer": "Paris",
      "role": "assistant"
    },
    {
      "question": "Who wrote Romeo and Juliet?",
      "answer": "William Shakespeare",
      "role": "assistant"
    },
    ...
  ]
  ```

### Additional Information

- The `role` field in the response indicates whether the answer is provided by an assistant (in this case, OpenAI's API).
  
- Ensure the backend server is running and accessible to the frontend for fetching data.

## Running the Backend Server
Backend server can start from frontend only, after executing `npm run start`

To start the Serperise backend server, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/Sar-thak-3/Serperise
```

### 2. Navigate to the Backend Directory

```bash
cd serperise/backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Environment Variables

Create a `.env` file and specify any required environment variables.

### 5. Start the Server

```bash
nodemon index
```

## Additional Notes

Ensure the frontend application can communicate with the backend APIs by configuring CORS settings and verifying endpoint URLs.

For any questions or issues, please refer to the project's documentation or contact the project maintainers.

Enjoy using Serperise!