import { createSlice } from "@reduxjs/toolkit";

const initialCallState = {
  callItems: {
    local: {
      videoTrackState: null,
      audioTrackState: null,
    },
  },
  clickAllowTimeoutFired: false,
  camOrMicError: null,
  fatalError: null,
};

const callSlice = createSlice({
  name: "call",
  initialState: initialCallState,
  reducers: {
    clickAllowTimeout(state) {
      state.clickAllowTimeoutFired = true;
    },
    camOrMicError(state, action) {
      state.camOrMicError = action.payload;
    },
    fatalError(state, action) {
      state.fatalError = action.payload;
    },
  },
});

const callActions = callSlice.actions;

export {
  callActions,
  callSlice as default,
  isLocal,
  isScreenShare,
  containsScreenShare,
  getMessage,
  getCallItems,
};

function getLocalCallItem(callItems) {
  return callItems["local"];
}

function getCallItems(participants) {
  let callItems = { ...initialCallState.callItems }; // Ensure we *always* have a local participant
  for (const [id, participant] of Object.entries(participants)) {
    callItems[id] = {
      videoTrackState: participant.tracks.video,
      audioTrackState: participant.tracks.audio,
    };
    if (shouldIncludeScreenCallItem(participant)) {
      callItems[id + "-screen"] = {
        videoTrackState: participant.tracks.screenVideo,
        audioTrackState: participant.tracks.screenAudio,
      };
    }
  }
  return callItems;
}

function shouldIncludeScreenCallItem(participant) {
  const trackStatesForInclusion = ["loading", "playable", "interrupted"];
  return (
    trackStatesForInclusion.includes(participant.tracks.screenVideo.state) ||
    trackStatesForInclusion.includes(participant.tracks.screenAudio.state)
  );
}

// --- Derived data ---

// True if id corresponds to local participant (*not* their screen share)
function isLocal(id) {
  return id === "local";
}

function isScreenShare(id) {
  return id.endsWith("-screen");
}

function containsScreenShare(callItems) {
  return Object.keys(callItems).some((id) => isScreenShare(id));
}

function getMessage(callState) {
  const shouldShowClickAllow = () => {
    const localCallItem = getLocalCallItem(callState.callItems);
    const hasLoaded = localCallItem && !localCallItem.isLoading;
    return !hasLoaded && callState.clickAllowTimeoutFired;
  };

  let header = null;
  let detail = null;
  let isError = false;
  if (callState.fatalError) {
    header = `Fatal error: ${callState.fatalError}`;
    isError = true;
  } else if (callState.camOrMicError) {
    header = `Camera or mic access error: ${callState.camOrMicError}`;
    detail =
      "See https://help.daily.co/en/articles/2528184-unblock-camera-mic-access-on-a-computer to troubleshoot.";
    isError = true;
  } else if (shouldShowClickAllow()) {
    header = 'Click "Allow" to enable camera and mic access';
  } else if (Object.keys(callState.callItems).length === 1) {
    header = "Copy and share this page's URL to invite others";
    detail = window.location.href;
  }
  return header || detail ? { header, detail, isError } : null;
}
