import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Grupo } from "../../types";

interface GruposState {
    grupos: Grupo[];
}

const initialState: GruposState = {
    grupos: [],
};

const gruposSlice = createSlice({
    name: 'grupos',
    initialState,
    reducers: {
        agregarGrupo: (state, action: PayloadAction<Grupo>) => {
            state.grupos.push(action.payload);
        },
        eliminarGrupo: (state, action: PayloadAction<string>) => {
            state.grupos = state.grupos.filter((g) => g.id !== action.payload);
        },
        clearGrupos: () => initialState,
    },
});

// exportar actions usando el Slice
export const { agregarGrupo, eliminarGrupo, clearGrupos } = gruposSlice.actions;

// exportar el reducer como default
export default gruposSlice.reducer;