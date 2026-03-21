import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ── Tipos ────────────────────────────────────────────────────────────────────

export type Gasto = {
  id: string;
  descripcion: string;
  monto: number;
  pagadoPor: string;
  grupoId: string;
  settled?: boolean;
};

export type Grupo = {
  id: string;
  nombre: string;
  emoji: string;
  miembros: string[];
};

type GroupState = {
  grupos: Grupo[];
  gastos: Gasto[];
  exchangeRate: number | null;
  loadingRate: boolean;
};

// ── Estado inicial ────────────────────────────────────────────────────────────

const initialState: GroupState = {
  grupos: [],
  gastos: [],
  exchangeRate: null,
  loadingRate: false,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    agregarGrupo: (state, action: PayloadAction<{ nombre: string; emoji: string }>) => {
      const nuevoGrupo: Grupo = {
        id: Date.now().toString(),
        nombre: action.payload.nombre,
        emoji: action.payload.emoji,
        miembros: [],
      };
      state.grupos.unshift(nuevoGrupo);
    },

    eliminarGrupo: (state, action: PayloadAction<string>) => {
      state.grupos = state.grupos.filter((g) => g.id !== action.payload);
      state.gastos = state.gastos.filter((g) => g.grupoId !== action.payload);
    },

    agregarMiembro: (
      state,
      action: PayloadAction<{ grupoId: string; miembro: string }>
    ) => {
      const grupo = state.grupos.find((g) => g.id === action.payload.grupoId);
      if (grupo) {
        grupo.miembros.push(action.payload.miembro);
      }
    },

    eliminarMiembro: (
    state,
    action: PayloadAction<{ grupoId: string; miembro: string }>
    ) => {
    const grupo = state.grupos.find(g => g.id === action.payload.grupoId);
    if (grupo) {
    grupo.miembros = grupo.miembros.filter(m => m !== action.payload.miembro);
    }
  },

    agregarGasto: (
      state,
      action: PayloadAction<{
        grupoId: string;
        descripcion: string;
        monto: number;
        pagadoPor: string;
      }>
    ) => {
      const nuevoGasto: Gasto = {
        id: Date.now().toString(),
        descripcion: action.payload.descripcion,
        monto: action.payload.monto,
        pagadoPor: action.payload.pagadoPor,
        grupoId: action.payload.grupoId,
        settled: false,
      };
      state.gastos.unshift(nuevoGasto);
    },

    eliminarGasto: (state, action: PayloadAction<string>) => {
      state.gastos = state.gastos.filter((g) => g.id !== action.payload);
    },

    liquidarGasto: (state, action: PayloadAction<string>) => {
      const gasto = state.gastos.find((g) => g.id === action.payload);
      if (gasto) {
        gasto.settled = true;
      }
    },

    setExchangeRate: (state, action: PayloadAction<number>) => {
      state.exchangeRate = action.payload;
    },

    setLoadingRate: (state, action: PayloadAction<boolean>) => {
      state.loadingRate = action.payload;
    },
  },
});

//  SOLO ESTA EXPORTACIÓN
export const {
  agregarGrupo,
  eliminarGrupo,
  agregarMiembro,
  eliminarMiembro,
  agregarGasto,
  eliminarGasto,
  liquidarGasto,
  setExchangeRate,
  setLoadingRate,
} = groupSlice.actions;

export default groupSlice.reducer;