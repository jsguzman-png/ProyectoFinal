// Tipo para un miembro del grupo
export type Miembro = {
    id: string;
    nombre: string;
    email: string;
};

// Tipo para un grupo
export type Grupo = {
    id: string;
    nombre: string;
    emoji: string;
    miembros: string[];
    creadoPor: string;
};

// Tipo para un gasto
export type Gasto = {
    id: string;
    grupoId: string;
    descripcion: string;
    monto: number;
    pagadoPor: string;
    creadoEn: string;
};