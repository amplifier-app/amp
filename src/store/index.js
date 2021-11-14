import { configureStore } from "@reduxjs/toolkit";
import userProfileSlice from "./userProfile";
import authSlice from "./admin";
import channelSlice from "./callChannels";

const store = configureStore({
	reducer: {
		userProfile: userProfileSlice.reducer,
		admin: authSlice.reducer,
		channel: channelSlice.reducer,
	},
});

export default store;
