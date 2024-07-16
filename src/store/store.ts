import { configureStore } from "@reduxjs/toolkit";
import { adminAPIS } from "../api";
import authReducer from "./auth";

const store = configureStore({
  reducer: {
    [adminAPIS.reducerPath]: adminAPIS.reducer,
    authToken: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminAPIS.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
