import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: {
    name: null,
    company: null,
    title: null,
    sub: null,
    picture: null,
    email: null,
    given_name: null,
    family_name: null,
    nickname: null,
  },
  reducers: {
    nameGiven(state, action) {
      state.name = action.payload;
    },
    companyGiven(state, action) {
      state.company = action.payload;
    },
    titleGiven(state, action) {
      state.title = action.payload;
    },
    setUserInfo(state, action) {
      //Set UserInfo from Auth0
      state.name = action.payload.name;
      state.sub = action.payload.sub;
      state.picture = action.payload.picture;
      state.nickname = action.payload.nickname;
      state.email = action.payload.email;
      state.given_name = action.payload.given_name;
      state.family_name = action.payload.family_name;
    },
  },
});

export const fetchUserInfo = () => {
  return async (dispatch) => {
    const userInfo = (await axios.get("/api/v1/auth/user")).data;
    if (userInfo && userInfo.sub) {
      dispatch(userProfileSlice.actions.setUserInfo(userInfo));
    }
  };
};

export const userProfileActions = userProfileSlice.actions;
export default userProfileSlice;
