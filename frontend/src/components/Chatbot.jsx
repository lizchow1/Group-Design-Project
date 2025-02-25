import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import MessageList from "./MessageList";
import InputBox from "./InputBox";
import Loader from "./Loader";
import ResetButton from "./ResetButton";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const abortController = new AbortController();
    setController(abortController);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
        signal: abortController.signal,
      });

      const data = await response.json();
      const botMessage = { sender: "RamsAI", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error("Error sending message:", error);
      }
    }

    setLoading(false);
  };

  const resetChat = () => {
    // Abort any ongoing requests
    if (controller) {
      controller.abort();
    }

    setMessages([]); // Clear the chat messages
    setInput(""); // Clear the input box
    setLoading(false);

    fetch("http://127.0.0.1:5000/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch((error) => {
      console.error("Error resetting chat:", error);
    });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Header className="text-2xl font-bold text-center">Gordon RamsAI</Header>
      <div className="flex flex-col items-center space-y-4">
        <MessageList messages={messages} chatEndRef={chatEndRef} />
        {loading && <Loader />}
        <div ref={chatEndRef}></div>
        <InputBox input={input} setInput={setInput} sendMessage={sendMessage} isLoading={loading} />
        <ResetButton onReset={resetChat} />
      </div>
    </div>
  );
};

export default Chatbot;
