import { Box } from "@mui/system";
import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack"
import "./Footer.css";

export default function Footer() {
  return (
    <Stack
      sx={{
        width: "100%",
        background: "#1a1b1f",
        color: "white",
        marginTop: 8,
        py: 3,
      }}
      alignItems="center"
      justifyContent="center"
      className="footer"
    >
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="flex-start"
          sx={{ height: "100%", width: "100%" }}
        >
          <a href="https://amplifier.community">
            <img
              src="/white-logo.png"
              alt="amplifier logo"
              width="120"
              height="auto"
            />
          </a>
          <Stack direction="column" spacing={0.5}>
            <a href="https://amplifier.community/about">About Us</a>
            <a href="https://amplifier.community/careers">Careers</a>
            <a href="https://amplifier.community/contact">Contact Us</a>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
}
