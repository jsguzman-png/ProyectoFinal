import { configureStore } from "@reduxjs/toolkit";
import gruposReducer from "./slices/gruposSlice";
import gastosReducer from "./slices/gastosSlice";

export const store = configureStore({
    reducer: {
        grupos: gruposReducer,
        gastos: gastosReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;