import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
//the auth reducer is being imported here
// store configuration with auth reducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
