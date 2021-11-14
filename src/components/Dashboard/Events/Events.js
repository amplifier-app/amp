import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Events.css";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { NavLink } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsPinMap } from "react-icons/bs";
import { FiLink } from "react-icons/fi";
import AddEvent from "./AddEvent/AddEvent";

export default function Events() {
  const [events, setEvents] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = (e) => {
    setModalOpen(false);
  };

  useEffect(async () => {
    const eventsResponse = (await axios.get("/api/v1/event")).data;
    setEvents(eventsResponse);
    return;
  }, []);
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ width: "100%", mb: 3 }}
      >
        <Typography component="h4" variant="h4">
          Your Events:
        </Typography>
        <Button variant="contained" onClick={()=>setModalOpen(true)}>Add Event</Button>
      </Stack>
      <Stack direction="column" justifyContent="stretch" spacing={2} sx={{}}>
        {events.map((e) => (
          <Card key={e.id} variant="outlined">
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Avatar
                  variant="square"
                  sx={{ width: 64, height: 64, background: "#0d1535" }}
                >
                  {e.name}
                </Avatar>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ fontSize: 16, mb: 0.5, flex: 1 }}
                >
                  <Grid item xs={8}>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: 600 }}
                      gutterBottom
                    >
                      {e.name}
                    </Typography>
                    <Typography
                      sx={{ ml: 0.5, fontSize: 12 }}
                      color="text.secondary"
                    >
                      <AiOutlineCalendar size="1.2em" /> Tues 10th October,
                      10:00am
                    </Typography>
                    <Typography
                      sx={{ ml: 0.5, fontSize: 12 }}
                      color="text.secondary"
                    >
                      <BsPinMap size="1.2em" />{" "}
                      app.amplifier.community/event-name
                    </Typography>
                  </Grid>
                </Stack>
                <Button
                  href={"/?roomUrl=" + encodeURIComponent(e.eventUrl)}
                  variant="contained"
                >
                  <FiLink style={{ marginRight: "4px" }} />
                  {"  "}Copy Invitation
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <AddEvent open={modalOpen} handleClose={handleModalClose} />
    </>
  );
}
