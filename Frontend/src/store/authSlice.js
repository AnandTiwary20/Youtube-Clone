import { createSlice } from "@reduxjs/toolkit";
// redux used here

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
// auth creation with initial objects

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: token || null,
    user: user || null,
    isAuthenticated: !!token,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
       localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    //logout state token and authentication will be false
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
       localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

