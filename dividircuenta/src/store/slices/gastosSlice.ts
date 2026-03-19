import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gasto } from "../../types";

interface GastosState {
    gastos: Gasto[];
}

const initialState: GastosState = {
    gastos: [],
};

const gastosSlice = createSlice({
    name: 'gastos',
    initialState,
    reducers: {
        agregarGasto: (state, action: PayloadAction<Gasto>) => {
            state.gastos.push(action.payload);
        },
        eliminarGasto: (state, action: PayloadAction<string>) => {
            state.gastos = state.gastos.filter((g) => g.id !== action.payload);
        },
        clearGastos: () => initialState,
    },
});

// exportar actions usando el Slice
export const { agregarGasto, eliminarGasto, clearGastos } = gastosSlice.actions;

// exportar el reducer como default
export default gastosSlice.reducer;