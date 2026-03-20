import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Gasto } from "../types";

type Props = {
    gasto: Gasto;
    onPress: () => void; // navega a EditarGasto
};

export default function ExpenseCard({ gasto, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.info}>
                <Text style={styles.descripcion}>{gasto.descripcion}</Text>
                <Text style={styles.pagadoPor}>Pagó: {gasto.pagadoPor}</Text>
            </View>
            <View style={styles.right}>
                <Text style={styles.monto}>L {gasto.monto.toFixed(2)}</Text>
                <Text style={styles.editar}>✏️</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 8 },
    info:        { flex: 1 },
    descripcion: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
    pagadoPor:   { fontSize: 13, color: '#888', marginTop: 2 },
    right:       { alignItems: 'flex-end', gap: 4 },
    monto:       { fontSize: 15, fontWeight: 'bold', color: '#2e4566' },
    editar:      { fontSize: 14 },
});