import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "./slices/groupsSlice";

export const store = configureStore({
  reducer: {
    group: groupReducer,
  },
});

// Tipos inferidos automáticamente — úsalos siempre en lugar de 'any'
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
