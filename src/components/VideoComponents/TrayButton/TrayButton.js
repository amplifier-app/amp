import React from "react";
import "./TrayButton.css";
import Icon, {
  TYPE_MUTE_CAMERA,
  TYPE_MUTE_MIC,
  TYPE_SCREEN,
  TYPE_LEAVE,
  TYPE_CHAT,
} from "../Icon/Icon";
import { Button, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import DevicePopup from "../DevicePopup/DevicePopup";

/**
 * Props:
 * - text: string | null
 * - type: string | null
 * - disabled: boolean
 * - highlighted: boolean
 * - onClick: () => ()
 * - newButtonGroup: boolean
 */
export default function TrayButton(props) {

  const ButtonComponent = props.button != null ? Button : IconButton;
  return (
    <Box style={{ marginLeft: props.newButtonGroup ? "auto" : "0" }}>
      <ButtonComponent
        disabled={props.disabled}
        onClick={props.onClick}
        className={"tray-button" + (props.highlighted ? " highlighted" : "")}
      >
        {props.type && (
          <Icon type={props.type} highlighted={props.highlighted} />
        )}
        {props.text && <h1 style={{ margin: "0" }}>{props.text}</h1>}
        {props.button && props.button}
        {props.children}
      </ButtonComponent>
      {/* Show Audio/Video device popup */}
      {props.popupDeviceType && (
        <>
          <DevicePopup
            disabled={props.disabled}
            deviceType={props.popupDeviceType}
          />
        </>
      )}
    </Box>
  );
}

export { TYPE_MUTE_CAMERA, TYPE_MUTE_MIC, TYPE_SCREEN, TYPE_LEAVE, TYPE_CHAT };
