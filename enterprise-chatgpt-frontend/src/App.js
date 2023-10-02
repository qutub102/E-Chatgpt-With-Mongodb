// App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";
import UserInput from "./components/UserInput";

function App() {
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState("");

  useEffect(() => {
    // setMessages([...messages,{ text: "Generating response....", isUser: false}])
    if (response) {
      let newMessages = [...messages];
      console.log(newMessages);
      newMessages[newMessages.length - 1] = { text: response, isUser: false };
      console.log(newMessages);
      setMessages(newMessages);
      setResponse("");
    }
  }, [response]);

  const sendMessage = async (text) => {
    // Handle sending the message and receiving a response here
    // You can add the user's message to the state and get a response from your backend or AI model.
    const newMessage = { text, isUser: true };
    setMessages([
      ...messages,
      newMessage,
      { text: "Generating response...", isUser: false },
    ]);
    // Handle AI response and add it to the messages state.
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: text }),
    };
    try {
      const resp = await fetch("http://localhost:8002/chat", options);
      const result = await resp.json();
      // console.log("result ",result);
      if(result?.cause?.code === "ENOTFOUND"){
        throw(result.cause)
      }
      if(result.code || result.error){
        throw(result.error)
      }
      setResponse(result.content);
    } catch (error) {
      console.log("error > ",error)
      setResponse(error.message ? error.message : "Something went wrong...")
    }
  };

  const clearMessage = () => {
    setMessages([])
    setResponse('')
  }

  return (
    <div className="App">
      <h1>E-Chatgpt with mongodb</h1>
      <ChatWindow messages={messages} />
      <UserInput onSendMessage={sendMessage} clearMessage={clearMessage} />
    </div>
  );
}

export default App;
