import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
	name: "admin",
	initialState: { isAdmin: false },
	reducers: {
		grantAdmin(state) {
			state.isAdmin = true;
		},
		removeAdmin(state) {
			state.isAdmin = false;
		},
	},
});

export const adminActions = adminSlice.actions;
export default adminSlice;
