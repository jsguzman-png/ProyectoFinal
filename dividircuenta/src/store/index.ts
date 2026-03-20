import { configureStore } from "@reduxjs/toolkit";
import gruposReducer from "./slices/gruposSlice";
import gastosReducer from "./slices/gastosSlice";
import monedaReducer from "./slices/monedaSlice";

export const store = configureStore({
    reducer: {
        grupos: gruposReducer,
        gastos: gastosReducer,
        moneda: monedaReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;