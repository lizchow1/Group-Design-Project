import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import MessageList from "./MessageList";
import InputBox from "./InputBox";
import Loader from "./Loader";

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <Header />
      <MessageList messages={messages} chatEndRef={chatEndRef} />
      {loading && <Loader />}
      <InputBox input={input} setInput={setInput} sendMessage={sendMessage} />
    </div>
  );
};

export default Chatbot;
