import { useMemo } from "react";
import { useAppSelector } from "../store/hooks";
import { TablaHash } from "../estructuras/TablaHash";

export function useTablaHash() {
    const grupos = useAppSelector((state) => state.grupos.grupos);

    return useMemo(() => {
        const tabla = new TablaHash(Math.max(20, grupos.length * 2));
        grupos.forEach((grupo) => tabla.insertar(grupo));
        return tabla;
    }, [grupos]);
}
