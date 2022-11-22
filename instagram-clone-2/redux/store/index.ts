import { useDispatch } from "react-redux";
import { createWrapper } from "next-redux-wrapper";
import {
  combineReducers,
  configureStore,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import userReducers from "../slices/userSlice";
import postReducers from "../slices/postSlice";

const allReducers = combineReducers({
  user: userReducers,
  post: postReducers,
});

// making a store
const makeStore = () => {
  return configureStore({
    reducer: allReducers,
    devTools: true,
  });
};

// Types
export type RootStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<RootStore["getState"]>;
export type AppDispatch = RootStore["dispatch"];
export const useAsyncDispatch = () => useDispatch<AppDispatch>();

// wrapper for ssr
const wrapper = createWrapper(makeStore);

export default wrapper;
