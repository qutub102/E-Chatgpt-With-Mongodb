import React, { useEffect, useState } from "react";
import Typewriter from "./Typewritter";

const Message = ({ message }) => {
  const lines = message.text?.split("\n");
  return (
    <div
      className={`message ${message.isUser ? "user-message" : "bot-message"}`}
    >
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {!message.isUser ? (
            line === "Generating response..." ? (
              line
            ) : (
              <Typewriter text={line} delay={20} />
            )
          ) : (
            line
          )}
          {index !== lines.length - 1 && <br />}
        </React.Fragment>
      ))}
      {/* {!message.isUser ? (
        message.text === "Generating response..." ? (
          message.text
        ) : (
          <Typewriter text={message.text} delay={20} />
        )
      ) : (
        message.text
      )} */}
    </div>
  );
};

export default Message;
