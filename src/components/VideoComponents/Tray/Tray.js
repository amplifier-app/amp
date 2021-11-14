import React, { useContext, useEffect, useState } from "react";
import TrayButton, { TYPE_LEAVE } from "../TrayButton/TrayButton";
import CallObjectContext from "../../../CallObjectContext";
import DailyIframe from "@daily-co/daily-js";
import AmplifierSocketContext from "../AmplifierSocketProvider";
import { useSelector, useDispatch } from "react-redux";
import { adminActions } from "../../../store/admin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Timer from "../Timer/Timer";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { MdVideocam, MdVideocamOff, MdScreenShare } from "react-icons/md";
import "./Tray.css";
/**
 * Gets [isCameraMuted, isMicMuted, isSharingScreen].
 * This function is declared outside Tray() so it's not recreated every render
 * (which would require us to declare it as a useEffect dependency).
 */
function getStreamStates(callObject) {
  let isCameraMuted,
    isMicMuted,
    isSharingScreen = false;
  if (
    callObject &&
    callObject.participants() &&
    callObject.participants().local
  ) {
    const localParticipant = callObject.participants().local;
    isCameraMuted = !localParticipant.video;
    isMicMuted = !localParticipant.audio;
    isSharingScreen = localParticipant.screen;
  }
  return [isCameraMuted, isMicMuted, isSharingScreen];
}

/**
 * Props:
 * - onClickLeaveCall: () => ()
 * - disabled: boolean
 */
export default function Tray(props) {
  const callObject = useContext(CallObjectContext);
  const socketContext = useContext(AmplifierSocketContext);
  const userInfo = useSelector((globalState) => globalState.userProfile);

  //redux admin
  const isAdmin = useSelector((state) => state.admin.isAdmin);
  const dispatch = useDispatch();

  const grantAdminHandler = (event) => {
    event.preventDefault();
    dispatch(adminActions.grantAdmin());
  };
  const removeAdminHandler = (event) => {
    event.preventDefault();
    dispatch(adminActions.removeAdmin());
  };

  const [isCameraMuted, setCameraMuted] = useState(false);
  const [isMicMuted, setMicMuted] = useState(false);
  const [isSharingScreen, setSharingScreen] = useState(false);
  const [displayChat, setChatDisplay] = useState(false);
  const [highlightedChat, setChatHighlight] = useState(false);
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  function toggleCamera(e) {
    callObject.setLocalVideo(isCameraMuted);
  }

  function toggleMic() {
    callObject.setLocalAudio(isMicMuted);
  }

  function toggleSharingScreen() {
    isSharingScreen
      ? callObject.stopScreenShare()
      : callObject.startScreenShare();
  }

  function leaveCall() {
    props.onClickLeaveCall && props.onClickLeaveCall();
  }

  /**
   * Start listening for participant changes when callObject is set (i.e. when the component mounts).
   * This event will capture any changes to your audio/video mute state.
   */
  useEffect(() => {
    if (!callObject) return;

    function handleNewParticipantsState(event) {
      // event && logDailyEvent(event);
      const [isCameraMuted, isMicMuted, isSharingScreen] =
        getStreamStates(callObject);
      setCameraMuted(isCameraMuted);
      setMicMuted(isMicMuted);
      setSharingScreen(isSharingScreen);
    }

    // Use initial state
    handleNewParticipantsState();

    // Listen for changes in state
    callObject.on("participant-updated", handleNewParticipantsState);

    // Stop listening for changes in state
    return function cleanup() {
      callObject.off("participant-updated", handleNewParticipantsState);
    };
  }, [callObject]);

  return (
    <div className="tray">
      <TrayButton
        disabled={props.disabled}
        highlighted={isCameraMuted}
        onClick={toggleCamera}
        popupDeviceType="camera"
      >
        {!isCameraMuted ? <MdVideocam /> : <MdVideocamOff />}
      </TrayButton>
      <TrayButton
        disabled={props.disabled}
        highlighted={isMicMuted}
        onClick={toggleMic}
        popupDeviceType="mic"
      >
        {!isMicMuted ? <IoMdMic /> : <IoMdMicOff />}
      </TrayButton>
      {DailyIframe.supportedBrowser().supportsScreenShare && (
        <TrayButton
          disabled={props.disabled}
          highlighted={isSharingScreen}
          onClick={toggleSharingScreen}
        >
          <MdScreenShare />
        </TrayButton>
      )}
      {isAdmin && (
        <button onClick={removeAdminHandler} className="hidden-features">
          admin
        </button>
      )}
      {!isAdmin && (
        <button onClick={grantAdminHandler} className="hidden-features">
          notAdmin
        </button>
      )}
      {isAdmin && (
        <TrayButton
          button="Start"
          disabled={props.disabled}
          highlighted={highlightedChat}
          onClick={socketContext.startBreakout}
        />
      )}
      {isAdmin && (
        <TrayButton
          button="Switch"
          disabled={props.disabled}
          highlighted={highlightedChat}
          onClick={socketContext.nextBreakout}
        />
      )}
      {isAdmin && (
        <TrayButton
          button="End"
          disabled={props.disabled}
          highlighted={highlightedChat}
          onClick={socketContext.stopBreakout}
        />
      )}
      <Box sx={{marginleft: "auto"}}>
        <Timer />
      </Box>
      {/* <p>
				{userInfo.name} | {userInfo.title} | {userInfo.company}
			</p> */}
      <TrayButton
        type={TYPE_LEAVE}
        disabled={props.disabled}
        newButtonGroup={true}
        highlighted={true}
        onClick={leaveCall}
      />
    </div>
  );
}
