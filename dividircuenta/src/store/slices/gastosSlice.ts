import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gasto } from "../../types";

interface GastosState {
    gastos: Gasto[];
    pagosRealizados: { deudor: string; acreedor: string; grupoId: string }[];
}

const initialState: GastosState = {
    gastos:[],
    pagosRealizados: [],

};

const gastosSlice = createSlice({
    name: 'gastos',
    initialState,
    reducers: {
        agregarGasto: (state, action: PayloadAction<Gasto>) => {
            state.gastos.push(action.payload);
            console.log('Gasto agregado:', action.payload);
            console.log('Gastos actuales:', state.gastos);
        },
        eliminarGasto: (state, action: PayloadAction<string>) => {
            state.gastos = state.gastos.filter((g) => g.id !== action.payload);
            console.log('Gasto eliminado:', action.payload);
            console.log('Gastos actuales:', state.gastos);
        },
        editarGasto: (state, action: PayloadAction<Gasto>) => {
    const index = state.gastos.findIndex((g) => g.id === action.payload.id);
    if (index !== -1) {
        state.gastos[index] = action.payload;
    }
},
        registrarPago: (state, action: PayloadAction<{ deudor: string; acreedor: string; grupoId: string }>) => {
    const existe = state.pagosRealizados.find(
        (p) => p.deudor === action.payload.deudor &&
               p.acreedor === action.payload.acreedor &&
               p.grupoId === action.payload.grupoId
    );
    if (!existe) {
        state.pagosRealizados.push(action.payload);
    }
},
limpiarPagos: (state, action: PayloadAction<string>) => {
    state.pagosRealizados = state.pagosRealizados.filter(
        (p) => p.grupoId !== action.payload
    );
},
        clearGastos: () => initialState,
    },
});

// exportar actions usando el Slice
export const { agregarGasto, eliminarGasto, editarGasto, registrarPago, limpiarPagos, clearGastos } = gastosSlice.actions;

// exportar el reducer como default
export default gastosSlice.reducer;