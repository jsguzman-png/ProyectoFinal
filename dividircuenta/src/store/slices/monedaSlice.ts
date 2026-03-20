import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Moneda = 'HNL' | 'USD';

interface MonedaState {
    monedaActual: Moneda;
    tipoDeCambio: number; // 1 HNL = X USD
}

const initialState: MonedaState = {
    monedaActual: 'HNL',
    tipoDeCambio: 0,
};

const monedaSlice = createSlice({
    name: 'moneda',
    initialState,
    reducers: {
        cambiarMoneda: (state, action: PayloadAction<Moneda>) => {
            state.monedaActual = action.payload;
        },
        setTipoDeCambio: (state, action: PayloadAction<number>) => {
            state.tipoDeCambio = action.payload;
        },
    },
});

export const { cambiarMoneda, setTipoDeCambio } = monedaSlice.actions;
export default monedaSlice.reducer;