import { createSlice } from "@reduxjs/toolkit";

import CookieHelper from "../helpers/CookieHelper";

const getUserFromSession = () => {
  const cookieHelper = new CookieHelper();
  const data = cookieHelper.getCookie();
  return data;
};

const initialState = {
  data: getUserFromSession(),
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginData(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setLoginData } = loginSlice.actions;
export default loginSlice.reducer;
