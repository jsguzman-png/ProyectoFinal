import { Grupo } from "../types";

export class TablaHash {

    private tamaño: number;
    private tabla: Grupo[][];

    constructor(tamaño = 20) {
        this.tamaño = Math.max(1, tamaño);
        this.tabla = Array.from(
            { length: this.tamaño },
            () => []
        );
    }

    private hash(id: string): number {

        let suma = 0;

        for (let i = 0; i < id.length; i++) {
            suma += id.charCodeAt(i);
        }

        return suma % this.tamaño;
    }

    insertar(grupo: Grupo): void {

        const indice = this.hash(grupo.id);

        const bucket = this.tabla[indice];

        const existe = bucket.find(
            g => g.id === grupo.id
        );

        if (!existe) {
            bucket.push(grupo);
        }
    }

    buscar(id: string): Grupo | undefined {

        const indice = this.hash(id);

        return this.tabla[indice].find(
            g => g.id === id
        );
    }

    eliminar(id: string): void {

        const indice = this.hash(id);

        this.tabla[indice] =
            this.tabla[indice].filter(
                g => g.id !== id
            );
    }
}