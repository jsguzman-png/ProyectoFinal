import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabaseClient";
import { Gasto } from "../../types";

interface GastosState {
  gastos: Gasto[];
  pagosRealizados: { deudor: string; acreedor: string; grupoId: string }[];
  loading: boolean;
}

const initialState: GastosState = {
  gastos: [],
  pagosRealizados: [],
  loading: false,
};

// ─── THUNKS ────────────────────────────────────────────────────────────────

// Cargar gastos de un grupo
export const fetchGastos = createAsyncThunk(
  'gastos/fetchGastos',
  async (grupoId: string) => {
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .eq('grupo_id', grupoId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((g: any) => ({
      id: g.id,
      grupoId: g.grupo_id,
      descripcion: g.descripcion,
      monto: g.monto,
      pagadoPor: g.pagado_por,
      divididoEntre: g.dividido_entre ?? [],
    })) as Gasto[];
  }
);

// Agregar gasto
export const agregarGastoAsync = createAsyncThunk(
  'gastos/agregarGasto',
  async ({ gasto, userId }: { gasto: Gasto; userId: string }) => {
    const { data, error } = await supabase
      .from('gastos')
      .insert({
        grupo_id: gasto.grupoId,
        descripcion: gasto.descripcion,
        monto: gasto.monto,
        pagado_por: gasto.pagadoPor,
        dividido_entre: gasto.divididoEntre,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      grupoId: data.grupo_id,
      descripcion: data.descripcion,
      monto: data.monto,
      pagadoPor: data.pagado_por,
      divididoEntre: data.dividido_entre ?? [],
    } as Gasto;
  }
);

// Editar gasto
export const editarGastoAsync = createAsyncThunk(
  'gastos/editarGasto',
  async (gasto: Gasto) => {
    const { error } = await supabase
      .from('gastos')
      .update({
        descripcion: gasto.descripcion,
        monto: gasto.monto,
        pagado_por: gasto.pagadoPor,
        dividido_entre: gasto.divididoEntre,
      })
      .eq('id', gasto.id);

    if (error) throw error;
    return gasto;
  }
);

// Eliminar gasto
export const eliminarGastoAsync = createAsyncThunk(
  'gastos/eliminarGasto',
  async (gastoId: string) => {
    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', gastoId);

    if (error) throw error;
    return gastoId;
  }
);

// ─── SLICE ─────────────────────────────────────────────────────────────────

const gastosSlice = createSlice({
  name: 'gastos',
  initialState,
  reducers: {
    registrarPago: (state, action) => {
      const existe = state.pagosRealizados.find(
        (p) => p.deudor === action.payload.deudor &&
               p.acreedor === action.payload.acreedor &&
               p.grupoId === action.payload.grupoId
      );
      if (!existe) state.pagosRealizados.push(action.payload);
    },
    limpiarPagos: (state, action) => {
      state.pagosRealizados = state.pagosRealizados.filter(
        (p) => p.grupoId !== action.payload
      );
    },
    clearGastos: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchGastos
      .addCase(fetchGastos.pending, (state) => { state.loading = true; })
      .addCase(fetchGastos.fulfilled, (state, action) => {
        // Reemplaza solo los gastos del grupo que se cargó
        const grupoId = action.meta.arg;
        state.gastos = [
          ...state.gastos.filter((g) => g.grupoId !== grupoId),
          ...action.payload,
        ];
        state.loading = false;
      })
      .addCase(fetchGastos.rejected, (state) => { state.loading = false; })

      // agregarGasto
      .addCase(agregarGastoAsync.fulfilled, (state, action) => {
        state.gastos.unshift(action.payload);
      })

      // editarGasto
      .addCase(editarGastoAsync.fulfilled, (state, action) => {
        const index = state.gastos.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.gastos[index] = action.payload;
      })

      // eliminarGasto
      .addCase(eliminarGastoAsync.fulfilled, (state, action) => {
        state.gastos = state.gastos.filter((g) => g.id !== action.payload);
      });
  },
});

export const { registrarPago, limpiarPagos, clearGastos } = gastosSlice.actions;
export default gastosSlice.reducer;