import { View, Text, StyleSheet } from "react-native";
import { Gasto } from "../context/GroupContext";

type Props = {
    gasto: Gasto;
};

export default function ExpenseCard({ gasto }: Props) {
    return (
        <View style={styles.card}>
            <View>
                <Text style={styles.descripcion}>{gasto.descripcion}</Text>
                <Text style={styles.pagadoPor}>Pagó: {gasto.pagadoPor}</Text>
            </View>
            <Text style={styles.monto}>L {gasto.monto.toFixed(2)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 10 },
    descripcion: { fontSize: 16, fontWeight: '600' },
    pagadoPor:   { fontSize: 13, color: '#888', marginTop: 2 },
    monto:       { fontSize: 16, fontWeight: 'bold', color: '#2e4566' },
});