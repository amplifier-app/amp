import { createSlice } from "@reduxjs/toolkit";

const initialChannelState = {
  
};

const channelSlice = createSlice({
  name: "channel",
  initialState: initialChannelState,
  reducers: {
    setChannels(state, action) {
      state.channels = action.payload;
    },
  },
});

export const channelActions = channelSlice.actions;
export default channelSlice;