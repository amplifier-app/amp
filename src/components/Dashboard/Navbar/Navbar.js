import React from "react";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { NavLink } from "react-router-dom";
import Container from "@mui/material/Container";

export default function Navbar() {
  return (
    <Box
      sx={{
        p: 4,
        py: 1,
        "& .MuiLink-root": { color: "text.primary" },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={8}
        >
          <NavLink variant="contained" to="/">
            <img
              src="/gold-logo.png"
              alt="amplifier logo"
              width="70"
              height="auto"
            />
          </NavLink>
          <div>
            <NavLink variant="contained" to="/dashboard">
              Dashboard
            </NavLink>
          </div>
        </Stack>
      </Container>
    </Box>
  );
}
