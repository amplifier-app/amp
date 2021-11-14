import React, { useContext, useState, useEffect } from "react";
import CallObjectContext from "../../../CallObjectContext";
import "./Chat.css";
import { Button, Stack, TextField } from "@mui/material";

export default function Chat(props) {
  const callObject = useContext(CallObjectContext);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (inputValue.trim() == "") return;
    callObject.sendAppMessage({ message: inputValue }, "*");
    const name = callObject.participants().local.user_name
      ? callObject.participants().local.user_name
      : "Guest";
    setChatHistory([
      {
        sender: name,
        message: inputValue,
      },
      ...chatHistory,
    ]);
    setInputValue("");
  }

  /**
   * Update chat state based on a message received to all participants.
   *
   */
  useEffect(() => {
    if (!callObject) {
      return;
    }

    function handleAppMessage(event) {
      const participants = callObject.participants();
      const name = participants[event.fromId].user_name
        ? participants[event.fromId].user_name
        : "Guest";
      setChatHistory([
        {
          sender: name,
          message: event.data.message,
        },
        ...chatHistory,
      ]);
      // Make other icons light up
      props.notification();
    }

    callObject.on("app-message", handleAppMessage);

    return function cleanup() {
      callObject.off("app-message", handleAppMessage);
    };
  }, [callObject, chatHistory]);

  useEffect(() => {}, [chatHistory]);

  return (
    <div className="chat">
      <div className="messageList">
        {chatHistory.map((entry, index) => (
          <div key={`entry-${index}`} className="message">
            <b>{entry.sender}</b>: {entry.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="chatInput"></label>
        <div className="flex">
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
			sx={{width: "100%"}}
          >
            <TextField
              id="chatInput"
              className="chat-input"
              type="text"
              placeholder="Type here.."
              value={inputValue}
              onChange={handleChange}
			  sx={{flex: "1"}}
            ></TextField>
            <Button type="submit" className="send-chat-button">
              Send
            </Button>
          </Stack>
        </div>
      </form>
    </div>
  );
}
