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
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { sender: "RamsAI", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setLoading(false);
  };

  const resetChat = () => {
  setMessages([]); // Clear the chat messages
  setInput(""); // Clear the input box
    };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-white pl-24 pt-24"> 
      <h1 class="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
        Gordon RamsAI
      </h1>
    <div className="flex flex-col items-center space-y-4">
      <MessageList messages={messages} chatEndRef={chatEndRef} />
      {loading && <Loader />}
      <div ref={chatEndRef}></div>
      <InputBox input={input} setInput={setInput} sendMessage={sendMessage} />
      <ResetButton onReset={resetChat} />
    </div>
  </div>
);

};

export default Chatbot;
