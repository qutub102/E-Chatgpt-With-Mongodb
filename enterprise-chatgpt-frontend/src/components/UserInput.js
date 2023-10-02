import React, { useState } from "react";

const UserInput = ({ onSendMessage, clearMessage }) => {
  const [text, setText] = useState("");

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      onSendMessage(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <div className="user-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
        <button type="button" onClick={clearMessage}>Clear</button>
      </div>
    </form>
  );
};

export default UserInput;
