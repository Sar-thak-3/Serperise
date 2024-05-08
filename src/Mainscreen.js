import React from "react";
import { useState, useRef, useEffect } from "react";
import "./App.css";

function ChatMessage(props) {
  if (props.message.role === "assistant") {
    return (
      <div className="col-start-1 col-end-8 p-3 rounded-lg">
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
            A
          </div>
          <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl text-left">
            <div>
              {"Question: "}
              {props.message.question}
            </div>
            <div>
              {"Answer: "}
              {props.message.answer}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (props.message.role === "user") {
    return (
      <div className="col-start-6 col-end-13 p-3 rounded-lg">
        <div className="flex items-center justify-start flex-row-reverse">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500 flex-shrink-0">
            U
          </div>
          <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl text-left">
            <div>{props.message.question}</div>
          </div>
        </div>
      </div>
    );
  }
}

const SearchForm = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [chatindex, setChatindex] = useState(0);
  const [errors, setErrors] = useState("");
  const [errorshow, setErrorshow] = useState(false);
  const [message, setMessage] = useState("Generating data...");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  async function chatRequest(topic) {
    setInput("");
    try {
      const hostedapi = "https://serperise-backend.vercel.app/v1/api/trivia";
      const localapi = "http://localhost:4001/v1/api/trivia"
      setLoading(true)
      const response = await fetch(hostedapi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic, index: chatindex }),
      });
      const content = await response.json();
      if (!response.ok) {
        setLoading(false)
        setErrors(content.error);
        setErrorshow(true);
        throw new Error({ message: content.error });
      }
      setHistory((history) => [...history, ...content.triviaQuestions]);
      setChatindex(chatindex + content.triviaQuestions.length + 3);
      setErrorshow(false);
      setLoading(false);
    } catch (error) {
      console.error("Failed to send chat history:", error);
      if(!errorshow){
        setErrorshow(true)
        setErrors("Failed to send request to backend")
      }
    }
  }

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full p-6 ">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto">
              <div className="grid grid-cols-12 gap-y-2">
                {history.map((message) => (
                  <ChatMessage message={message} key={message.index} />
                ))}
                <div ref={chatEndRef}></div>
              </div>
            </div>

            {errorshow && (
              <div
                className="bg-red-100 flex flex-row border border-red-400 mx-auto items-center text-red-700 px-4 py-3 rounded"
                role="alert"
              >
                <strong className="font-bold">Holy smokes!</strong>
                <span className="pl-2 block sm:inline">{errors}</span>
              </div>
            )}

            {loading && (
              <div
                className="bg-teal-100 flex flex-row border border-teal-400 mx-auto items-center text-teal-700 px-4 py-3 rounded"
                role="alert"
              >
                <strong className="font-bold">Holy smokes!</strong>
                <span className="pl-2 block sm:inline">{message}</span>
              </div>
            )}

            <div className="flex flex-row items-center mx-auto w-full h-16 rounded-xl bg-white px-4">
              <div className="w-full">
                <label htmlFor="voice-search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                  <input
                    type="text"
                    id="voice-search"
                    // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search your topic..."
                    required
                    className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const newMessage = {
                          question: input,
                          answer: "",
                          role: "user",
                          index: chatindex,
                        };
                        setChatindex(chatindex + 1);
                        setHistory([...history, newMessage]);
                        chatRequest(newMessage.question);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 end-0 flex items-center pe-3"
                  >
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="pl-2 ml-4">
                <button
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                  onClick={() => {
                    const newMessage = {
                      question: input,
                      answer: "",
                      role: "user",
                      index: chatindex,
                    };
                    setChatindex(chatindex + 1);
                    setHistory([...history, newMessage]);
                    chatRequest(newMessage.question);
                  }}
                >
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
