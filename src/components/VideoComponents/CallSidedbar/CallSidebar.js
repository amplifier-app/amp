import React, { useState, useRef } from "react";
import Participants from "../Participants/Participants";
import "./CallSidebar.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chat from "../Chat/Chat";
import { ImBubble } from "react-icons/im";
import { IoPeopleSharp } from "react-icons/io5";
import Badge from "@mui/material/Badge";

export default function CallSidebar(props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const unreadMessagesRef = useRef();
  unreadMessagesRef.current = unreadMessages;

  const handleTabChange = (event, newValue) => {
    if (newValue == 1) setUnreadMessages(0);
    setSelectedTab(newValue);
  };

  function handleNewChat() {
    if (selectedTab == 1) {
      setUnreadMessages(0);
      return;
    }
    setUnreadMessages(unreadMessagesRef.current + 1);
  }

  return (
    <div className="call-sidebar">
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="Sidebar Tabs"
            centered
          >
            <Tab
              icon={<IoPeopleSharp size="1.5em" />}
              aria-label="participants"
            />
            <Tab
              icon={
                <>
                  {unreadMessagesRef.current != 0 ? (
                    <Badge
                      badgeContent={unreadMessagesRef.current}
                      color="primary"
                    >
                      <ImBubble size="1.5em" />
                    </Badge>
                  ) : (
                    <ImBubble size="1.5em" />
                  )}
                </>
              }
              aria-label="chat"
            />
          </Tabs>
        </Box>
        <div className="tabs">
          <div className="sidebarContent">
            <Box sx={{ height: "100%", width: "100%" }}>
              <div
                className="tab-panel"
                style={{ display: selectedTab == 0 ? "block" : "none" }}
              >
                <Participants />
              </div>
              <div
                className="tab-panel"
                style={{ display: selectedTab == 1 ? "block" : "none" }}
              >
                <Chat notification={handleNewChat} />
              </div>
            </Box>
          </div>
        </div>
      </Box>
    </div>
  );
}
