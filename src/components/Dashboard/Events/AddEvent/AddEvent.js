import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AddEvent(props) {
  const [formData, setFormData] = useState({
    title: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const [open, setOpen] = useState(false);

  const handleClose = (e) => {
    props.handleClose();
    setOpen(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    axios
      .post("/api/v1/event", { name: formData.title })
      .then((data) => {
        handleClose();
        setFormData({});
      })
      .catch((err) => {
        if (err.info) {
          setError(err.info);
          return;
        }
        setError(JSON.stringify(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFieldChange = (e) => {
    var value = e.target.value;
    if (e.target.name == "name") {
      //Only let allowed event names through
      let re = /[^A-Za-z0-9_-]/;
      if (!re.match(value)) return;
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <Modal open={props.open} onClose={handleClose}>
        <Fade in={props.open}>
          <Box
            component="form"
            autoComplete="off"
            onSubmit={submitHandler}
            sx={style}
          >
            <Typography variant="body1" sx={{marginBottom: 2}}>
              New Event
            </Typography>
            <TextField
              label="Event Name"
              name="title"
              variant="standard"
              disabled={loading}
              onChange={handleFieldChange}
              value={formData.title}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Grid className="flex-end" sx={{ my: 2 }}>
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                color="primary"
                disabled={!formData.title}
              >
                Add Event
              </LoadingButton>
            </Grid>
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
