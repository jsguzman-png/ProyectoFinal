import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Actividad } from "../../types";

interface ActividadState {
    cola: Actividad[]; // Cola: el primero en entrar es el primero en salir
}

const MAX_ACTIVIDADES = 20; // tamaño máximo de la cola

const initialState: ActividadState = {
    cola: [],
};

const actividadSlice = createSlice({
    name: 'actividad',
    initialState,
    reducers: {
        // encolar - agrega al final de la cola
        encolarActividad: (state, action: PayloadAction<Actividad>) => {
            state.cola.push(action.payload);

            // si la cola supera el máximo, se elimina el más antiguo (desencolar)
            if (state.cola.length > MAX_ACTIVIDADES) {
                state.cola.shift(); // desencolar - elimina el primero
            }

            console.log(' Actividad encolada:', action.payload.mensaje);
            console.log(' Cola actual:', state.cola.length, 'elementos');
        },

        clearActividad: () => initialState,
    },
});

export const { encolarActividad, clearActividad } = actividadSlice.actions;
export default actividadSlice.reducer;