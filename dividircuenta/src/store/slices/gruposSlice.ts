import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabaseClient";
import { Grupo } from "../../types";

interface GruposState {
  grupos: Grupo[];
  loading: boolean;
}

const initialState: GruposState = {
  grupos: [],
  loading: false,
};

// ─── THUNKS (operaciones async con Supabase) ───────────────────────────────

// Cargar todos los grupos del usuario
export const fetchGrupos = createAsyncThunk('grupos/fetchGrupos', async (userId: string) => {
  const { data, error } = await supabase
    .from('grupos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((g: any) => ({
    id: g.id,
    nombre: g.nombre,
    emoji: g.emoji,
    miembros: g.miembros ?? [],
    saldado: g.saldado,
  })) as Grupo[];
});

// Agregar grupo
export const agregarGrupoAsync = createAsyncThunk(
  'grupos/agregarGrupo',
  async ({ grupo, userId }: { grupo: Omit<Grupo, 'id'>; userId: string }) => {
    const { data, error } = await supabase
      .from('grupos')
      .insert({ ...grupo, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return { ...data, miembros: data.miembros ?? [], saldado: data.saldado ?? false } as Grupo;
  }
);

// Editar grupo
export const editarGrupoAsync = createAsyncThunk(
  'grupos/editarGrupo',
  async (payload: { id: string; nombre: string; emoji: string }) => {
    const { error } = await supabase
      .from('grupos')
      .update({ nombre: payload.nombre, emoji: payload.emoji })
      .eq('id', payload.id);

    if (error) throw error;
    return payload;
  }
);

// Editar miembros
export const editarMiembrosAsync = createAsyncThunk(
  'grupos/editarMiembros',
  async (payload: { grupoId: string; miembros: string[] }) => {
    const { error } = await supabase
      .from('grupos')
      .update({ miembros: payload.miembros })
      .eq('id', payload.grupoId);

    if (error) throw error;
    return payload;
  }
);

// Eliminar grupo
export const eliminarGrupoAsync = createAsyncThunk(
  'grupos/eliminarGrupo',
  async (grupoId: string) => {
    const { error } = await supabase
      .from('grupos')
      .delete()
      .eq('id', grupoId);

    if (error) throw error;
    return grupoId;
  }
);

// Marcar saldado
export const marcarSaldadoAsync = createAsyncThunk(
  'grupos/marcarSaldado',
  async ({ grupoId, saldado }: { grupoId: string; saldado: boolean }) => {
    const { error } = await supabase
      .from('grupos')
      .update({ saldado })
      .eq('id', grupoId);

    if (error) throw error;
    return { grupoId, saldado };
  }
);

// ─── SLICE ─────────────────────────────────────────────────────────────────

const gruposSlice = createSlice({
  name: 'grupos',
  initialState,
  reducers: {
    clearGrupos: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchGrupos
      .addCase(fetchGrupos.pending, (state) => { state.loading = true; })
      .addCase(fetchGrupos.fulfilled, (state, action) => {
        state.grupos = action.payload;
        state.loading = false;
      })
      .addCase(fetchGrupos.rejected, (state) => { state.loading = false; })

      // agregarGrupo
      .addCase(agregarGrupoAsync.fulfilled, (state, action) => {
        state.grupos.unshift(action.payload);
      })

      // editarGrupo
      .addCase(editarGrupoAsync.fulfilled, (state, action) => {
        const g = state.grupos.find((g) => g.id === action.payload.id);
        if (g) { g.nombre = action.payload.nombre; g.emoji = action.payload.emoji; }
      })

      // editarMiembros
      .addCase(editarMiembrosAsync.fulfilled, (state, action) => {
        const g = state.grupos.find((g) => g.id === action.payload.grupoId);
        if (g) g.miembros = action.payload.miembros;
      })

      // eliminarGrupo
      .addCase(eliminarGrupoAsync.fulfilled, (state, action) => {
        state.grupos = state.grupos.filter((g) => g.id !== action.payload);
      })

      // marcarSaldado
      .addCase(marcarSaldadoAsync.fulfilled, (state, action) => {
        const g = state.grupos.find((g) => g.id === action.payload.grupoId);
        if (g) g.saldado = action.payload.saldado;
      });
  },
});

export const { clearGrupos } = gruposSlice.actions;
export default gruposSlice.reducer;