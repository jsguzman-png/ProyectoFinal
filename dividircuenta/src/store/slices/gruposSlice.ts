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
            state.grupos.push({ ...action.payload, saldado: false });
            console.log('Grupo agregado:', action.payload);
            console.log('Grupos actuales:', state.grupos);
        },
        editarGrupo: (state, action: PayloadAction<{ id: string; nombre: string; emoji: string }>) => {
            const grupo = state.grupos.find((g) => g.id === action.payload.id);
            if (grupo) {
                grupo.nombre = action.payload.nombre;
                grupo.emoji = action.payload.emoji;
            }
        },
        eliminarGrupo: (state, action: PayloadAction<string>) => {
            state.grupos = state.grupos.filter((g) => g.id !== action.payload);
        },
        // actualiza los miembros de un grupo
        editarMiembros: (state, action: PayloadAction<{ grupoId: string; miembros: string[] }>) => {
            const grupo = state.grupos.find((g) => g.id === action.payload.grupoId);
            if (grupo) {
                grupo.miembros = action.payload.miembros;
            }
        },
        marcarSaldado: (state, action: PayloadAction<string>) => {
            const grupo = state.grupos.find((g) => g.id === action.payload);
            if (grupo) {
                grupo.saldado = true;
            }
        },
       resetearSaldado: (state, action: PayloadAction<string>) => {
    const grupo = state.grupos.find((g) => g.id === action.payload);
    if (grupo) {
        grupo.saldado = false;
    }
}, 


        clearGrupos: () => initialState,
    },
});

// exportar actions usando el Slice
export const { agregarGrupo, eliminarGrupo, editarMiembros, editarGrupo, marcarSaldado, resetearSaldado, clearGrupos } = gruposSlice.actions;
// exportar el reducer como default
export default gruposSlice.reducer;
