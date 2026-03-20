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
    saldado: boolean;
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

// tipo para un pago
export type Pago = {
    deudor: string;
    acreedor: string;
    grupoId: string;
};