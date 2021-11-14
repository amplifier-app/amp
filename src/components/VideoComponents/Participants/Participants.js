import React, { useContext, useEffect, useState } from "react";
import CallObjectContext from "../../../CallObjectContext";
import { useDispatch, useSelector } from "react-redux";
import AmplifierSocketContext from "../AmplifierSocketProvider";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import ordinal from "ordinal";

export default function Participants() {
	const callObj = useContext(CallObjectContext);
	const userInfo = useSelector((globalState) => globalState.userProfile);
	const socketContext = useContext(AmplifierSocketContext);
	const favouriteIds = socketContext.favouriteIds;

	// Shift Array index
	function arrayMove(arr, old_index, new_index) {
		if (new_index >= arr.length) {
			var k = new_index - arr.length + 1;
			while (k--) {
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		return arr; // for testing
	}

	// Move item in array
	const moveItem = (item, upvote) => {
		var newArray = [...favouriteIds];
		const order = upvote ? -1 : 1;
		const index = newArray.indexOf(item);
		var newIndex = index + order;
		if (index === -1 && upvote) {
			// Add item at 3rd
			newArray = [...newArray.slice(0, 2), item, ...newArray.slice(2)];
			setFavourites(newArray.slice(0, 3));
			return;
		}
		if (index === 0 && upvote) return; //Don't move 1st up
		if (index === newArray.length - 1 && !upvote) {
			// Remove last off
			setFavourites(newArray.slice(0, newArray.length - 1));
			return;
		}
		newArray = arrayMove(newArray, index, newIndex);
		//Cut array to 3 items
		setFavourites(newArray.slice(0, 3));
	};

	const setFavourites = (array) => {
		socketContext.setFavouriteIds(array);
	};

	const renderParticipant = (participant, index) => {
		if (!participant) return;
		var isFav = false;
		if (favouriteIds.includes(participant.id)) {
			isFav = true;
		}
		return (
      <Card
        key={participant.id}
        variant="outlined"
        style={{ marginBottom: "12px", padding: "0px 12px" }}
      >
        <Stack
          key={participant.id}
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Avatar
            variant="square"
            sx={{ width: 64, height: 64 }}
            src={participant.picture}
          />
          <Box
            style={{
              flex: "1",
              textAlign: "center",
              maxWidth: "195px",
              overflowWrap: "anywhere",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
              {participant.name}
            </Typography>
            <Typography variant="subtitle2">{participant.title}</Typography>
            <Typography variant="body1">{participant.company}</Typography>
          </Box>
          <Stack direction="column" spacing={0} alignItems="center">
            <IconButton
              disabled={isFav && index == 0}
              onClick={() => moveItem(participant.id, true)}
              aria-label="upvote"
              color="success"
            >
              <ImArrowUp size="1em" />
            </IconButton>
            <Typography variant="span">
              {isFav && ordinal(index + 1)}
              {!isFav && "-"}
            </Typography>
            <IconButton
              aria-label="downvote"
              color="warning"
              disabled={!isFav}
              onClick={() => moveItem(participant.id, false)}
            >
              <ImArrowDown size="1em" />
            </IconButton>
          </Stack>
        </Stack>
      </Card>
    );
	};

	return (
		<>
			<Box sx={{ textAlign: "left" }}>
				{/* Render Favouriteids */}
				<Box sx={{ width: "100%" }}>
					<Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: "600" }}>
						Favourites
					</Typography>
					{favouriteIds.map((id, index) =>
						renderParticipant(
							socketContext.participants.find((p) => p.id == id),
							index
						)
					)}
				</Box>
				<Box sx={{ width: "100%" }}>
					{socketContext.participants
						.filter((p) => {
							if (!callObj.participants() || !callObj.participants().local) {
								// DailyCo hasn't initialized yet, don't render anything
								return false;
							}
							// Don't render self
							if (p.id == callObj.participants().local.user_id) return false;
							// Don't rerender the favourite people rendered above ^^
							if (favouriteIds.includes(p.id)) return false;
							return true;
						})
						.map(renderParticipant)}
				</Box>
			</Box>
		</>
	);
}
