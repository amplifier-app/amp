import React, { useContext, useEffect, useState } from "react";
import AmplifierSocketContext from "../AmplifierSocketProvider";
import Box from "@mui/material/Box";

export default function Timer(props) {
  const socketContext = useContext(AmplifierSocketContext);
  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (socketContext.timerEnd == null) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(getTimeLeftString());
    const intervalId = setInterval(() => {
      setTimeLeft(getTimeLeftString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [socketContext.timerEnd]);

  const getTimeLeftString = () => {
    const ms = socketContext.timerEnd - new Date();
    var sec = Math.floor(ms / 1000);
    var min = Math.floor(sec / 60);
    sec = sec % 60;
    return min + ":" + (sec < 10 ? "0" + sec : sec);
  };

  return (
    <div {...props.className}>
      <Box sx={{ marginLeft: "5px", fontWeight: "600" }}>{timeLeft}</Box>
    </div>
  );
}
