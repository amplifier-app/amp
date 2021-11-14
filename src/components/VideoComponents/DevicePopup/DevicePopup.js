import React, { useState, useContext, useEffect } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import IconButton from "@mui/material/IconButton";
import CallObjectContext from "../../../CallObjectContext";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import "./DevicePopup.css";

export default function DevicePopup({ deviceType, disabled }) {
  const callObject = useContext(CallObjectContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [currentDevices, setCurrentDevices] = useState(null);
  const [devices, setDevices] = useState([]);

  const toggleOpen = (event) => {
    if (!anchorEl) setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleDeviceChange = (event, nextValue) => {
    if (!currentDevices) return;
    if (deviceType == "mic") {
      callObject.setInputDevicesAsync({
        audioSource: nextValue,
        // videoSource: currentDevices.camera.deviceId,
      });
    } else if (deviceType == "camera") {
      callObject.setInputDevicesAsync({
        videoSource: nextValue,
        // audioSource: currentDevices.mic.deviceId,
      });
    }
    setSelectedDevice(nextValue);
  };

  const getCurrentDevices = async () => {
    const tempDevices = await callObject.getInputDevices();
    const currentDevice =
      deviceType == "mic"
        ? tempDevices.mic.deviceId
        : tempDevices.camera.deviceId;
    setCurrentDevices(tempDevices);
    setSelectedDevice(currentDevice);
  };

  useEffect(() => {
    if (!callObject) return;
    callObject.on("joined-meeting", async () => {
      setCurrentDevices(await callObject.getInputDevices());
      callObject.enumerateDevices().then((devices) => {
        if (deviceType == "camera") {
          setDevices(devices.devices.filter((d) => d.kind == "videoinput"));
        } else if (deviceType == "mic") {
          setDevices(devices.devices.filter((d) => d.kind == "audioinput"));
        }
      });
      await getCurrentDevices();
    });
  }, [callObject]);

  //Don't show dropdown if there's only one device
  if (devices.length < 2) {
    return <></>;
    disabled = true;
  }
  if (!currentDevices) {
    disabled = true;
  }

  if (!selectedDevice) {
    disabled = true;
  }

  return (
    <>
      {/* Dropdown Arrow button */}
      <IconButton
        disabled={disabled}
        onClick={toggleOpen}
        sx={{ padding: "4px", marginTop: "-8px", marginLeft: "-8px" }}
      >
        {open ? <FaChevronUp size="0.5em" /> : <FaChevronDown size="0.5em" />}
      </IconButton>
      {/* Popover / Device List */}
      {!disabled && (
        <Popover
          id="devices-popover"
          sx={{
            zIndex: "1",
            borderRadius: "0px",
          }}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={open}
          onClose={() => setOpen(false)}
          disableRestoreFocus
        >
          <Box>
            <Typography
              variant="body1"
              sx={{ fontSize: "1em", margin: "10px 10px", fontWeight: "600" }}
            >
              Select {deviceType == "cam" ? "Video" : "Audio"} Device
            </Typography>
            <ToggleButtonGroup
              className="borderRadiusZero"
              orientation="vertical"
              value={selectedDevice}
              exclusive
              onChange={handleDeviceChange}
              sx={{ fontSize: "0.4em", borderRadius: 0 }}
            >
              {devices.map((device, index) => (
                <ToggleButton
                  className="borderRadiusZero"
                  key={index}
                  value={device.deviceId}
                  sx={{ padding: "5px 15px", textTransform: "initial" }}
                >
                  {device.deviceId == "default" ? "Built In" : device.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Popover>
      )}
    </>
  );
}
