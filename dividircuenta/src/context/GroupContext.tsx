/*import { createContext, useContext, useState } from "react";

export type Gasto = {
  id: string;
  descripcion: string;
  monto: number;
  pagadoPor: string;
  grupoId: string;
};

export type Grupo = {
  id: string;
  nombre: string;
  emoji: string;
  miembros: string[];
};

type GroupContextType = {
  grupos: Grupo[];
  gastos: Gasto[];
  crearGrupo: (nombre: string, emoji: string) => void;
  agregarGasto: (grupoId: string, descripcion: string, monto: number, pagadoPor: string) => void;
  getGastosPorGrupo: (grupoId: string) => Gasto[];
};

// 1. Definir el contexto
const GroupContext = createContext<GroupContextType | null>(null);

// 2. Hook personalizado
export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error('useGroup debe usarse dentro de GroupProvider');
  return context;
};

// 3. Provider
export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const [grupos, setGrupos] = useState<Grupo[]>([
  ]);

  const [gastos, setGastos] = useState<Gasto[]>([
  ]);

  const crearGrupo = (nombre: string, emoji: string) => {
    const nuevoGrupo: Grupo = {
      id: Date.now().toString(),
      nombre,
      emoji,
      miembros: ['Tú'],
    };
    setGrupos([...grupos, nuevoGrupo]);
  };

  const agregarGasto = (grupoId: string, descripcion: string, monto: number, pagadoPor: string) => {
    const nuevoGasto: Gasto = {
      id: Date.now().toString(),
      descripcion,
      monto,
      pagadoPor,
      grupoId,
    };
    setGastos([...gastos, nuevoGasto]);
  };

  const getGastosPorGrupo = (grupoId: string) => {
    return gastos.filter((g) => g.grupoId === grupoId);
  };

  return (
    <GroupContext.Provider value={{ grupos, gastos, crearGrupo, agregarGasto, getGastosPorGrupo }}>
      {children}
    </GroupContext.Provider>
  );
};*/