import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import CallObjectContext from "../../CallObjectContext";
import io from "socket.io-client";
import { channelActions } from "../../store/callChannels";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { adminActions } from "../../store/admin";

const AmplifierSocketContext = createContext();

var socket = null;
var myParticipantId = "";
var currentRoomParticipants = []; //Participants in my channel

const AmplifierSocketProvider = (props) => {
  const callObj = useContext(CallObjectContext);

  const dispatch = useDispatch();

  const [allParticipants, setAllParticipants] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState([]);
  // So we can access the latest allParticipants state in the callObject event callbacks
  const allPStateRef = useRef();
  allPStateRef.current = allParticipants;
  const favouritesRef = useRef();
  favouritesRef.current = favouriteIds;

  // States for other components to consume
  const [channel, setChannel] = useState(0);
  const userInfo = useSelector((globalState) => globalState.userProfile);

  const [timerEnd, setTimerEnd] = useState(null);

  /**
   * Set up Breakout Room socket
   **/
  useEffect(() => {
    if (!callObj) return;

    callObj.on("joined-meeting", async () => {
      callObj.setSubscribeToTracksAutomatically(false);
      callObj.setUserName(userInfo.name);

      myParticipantId = callObj.participants().local.user_id;
      const socketQuery = [
        "participantId=" + callObj.participants().local.user_id,
        "roomId=" + (await callObj.room()).id,
      ];
      if (userInfo.sub && userInfo.name) {
        socketQuery.push("name=" + userInfo.name);
        socketQuery.push("company=" + userInfo.company);
        socketQuery.push("title=" + userInfo.title);
        socketQuery.push("sub=" + userInfo.sub);
        socketQuery.push("picture=" + userInfo.picture);
        socketQuery.push("email=" + userInfo.email);
        socketQuery.push("given_name=" + userInfo.given_name);
        socketQuery.push("family_name=" + userInfo.family_name);
        socketQuery.push("nickname=" + userInfo.nickname);
      }
      var socketUrl = `https://${window.location.hostname}`;
      if (process.env.NODE_ENV && process.env.NODE_ENV == "development") {
        //Is in development, use port 3000
        socketUrl = `http://${window.location.hostname}:3000`;
      }
      socket = io(socketUrl, {
        query: socketQuery.join("&"),
      });

      socket.on("connect", () => {
        registerSocketEndpoints();
      });
    });
    callObj.on("left-meeting", () => {
      if (socket) {
        socket.close();
        socket = null;
      }
    });
    callObj.on("participant-left", participantLeft);
  }, [callObj]);

  const participantLeft = () => {
    //Remove participant from local arrays
    const newParticipantIds = Object.keys(callObj.participants()).map((key) =>
      key == "local" ? callObj.participants().local.user_id : key
    );
    setAllParticipants(
      allPStateRef.current.filter((p) => newParticipantIds.includes(p.id))
    );
    setFavourites(
      favouritesRef.current.filter((id) => newParticipantIds.includes(id))
    );
  };

  const registerSocketEndpoints = async () => {
    socket.on("UPDATE_CHANNELS", (data) => {
      updateChannels(data);
    });

    socket.on("ADMIN_MESSAGE", (message) => {
      toast(message);
    });

    // Emit Join event to get channels
    socket.emit("JOIN_ROOM", null, (data) => {
      // updateChannels(data);
      console.log("ADMIN?: ", data);
      if (data.isAdmin && data.isAdmin == true) {
        dispatch(adminActions.grantAdmin());
      }
    });
  };

  const updateChannels = (data) => {
    console.log("updateChannels", data);
    if (data.endTime) {
      setTimerEnd(new Date(data.endTime));
    } else {
      setTimerEnd(null);
    }

    var myChannel = channel;
    const myParticipantId = callObj.participants().local.user_id;

    //Find myChannel
    Object.keys(data.channels).forEach((c) => {
      if (data.channels[c].find((p) => p.id == myParticipantId)) {
        myChannel = c;
        return;
      }
    });

    const newMembers = data.channels[myChannel];

    // Get new members not in my channel (To subscribe to)
    newMembers
      .filter((p) =>
        currentRoomParticipants
          .filter((p1) => p1.id != myParticipantId)
          .includes(p.id)
          ? false
          : true
      )
      .forEach((p) => updateSubscription(p.id, true));

    // Get members no longer in my channel (To unsubscribe from)
    currentRoomParticipants
      .filter((p) => p.id != myParticipantId)
      .filter((p1) => (newMembers.includes(p1.id) ? false : true))
      .forEach((participant) => updateSubscription(participant.id, false));

    currentRoomParticipants = newMembers;

    // Flatten Channels map to All Participants
    var tempArr = [];
    Object.keys(data.channels).forEach((c) => {
      tempArr = tempArr.concat(data.channels[c]);
    });
    setAllParticipants(tempArr);

    dispatch(channelActions.setChannels(data.channels));
    setChannel(myChannel);
  };

  const setFavourites = (arr) => {
    if (!socket) return;
    //feed in participant ID of favourites array
    setFavouriteIds(arr);
    socket.emit("UPDATE_FAVOURITE", arr);
  };

  const updateSubscription = async (participantId, subscribe = true) => {
    if (participantId === callObj.participants().local.user_id) return;
    // Wait 500ms if joining to new person.
    // Sometimes our sockets can return the new user before dailyCo's.
    // This is a hacky fix to update after the new user has joined.
    subscribe && (await new Promise((res) => setTimeout(res, 500)));
    callObj.updateParticipant(participantId, {
      setSubscribedTracks: subscribe,
    });
  };

  const startBreakout = () => {
    socket.emit("START_BREAKOUT");
  };

  const nextBreakout = () => {
    socket.emit("NEXT_BREAKOUT");
  };

  const stopBreakout = () => {
    socket.emit("STOP_BREAKOUT");
  };

  // Items for other contexts to consume
  const amplifyContext = {
    channel: channel,
    startBreakout: startBreakout,
    stopBreakout: stopBreakout,
    nextBreakout: nextBreakout,
    participants: allParticipants,
    currentRoomParticipants: currentRoomParticipants,
    setFavouriteIds: setFavourites,
    favouriteIds: favouriteIds,
    timerEnd: timerEnd,
  };

  return (
    <AmplifierSocketContext.Provider value={amplifyContext}>
      {props.children}
      <ToastContainer position="top-center" draggable pauseOnHover />
    </AmplifierSocketContext.Provider>
  );
};

export { AmplifierSocketContext as default, AmplifierSocketProvider };
