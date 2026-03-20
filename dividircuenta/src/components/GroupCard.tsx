import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Grupo } from "../types";

type Props = {
    grupo: Grupo;
    onPress: () => void;
};

export default function GroupCard({ grupo, onPress }: Props) {
    return (
        <TouchableOpacity
            style={[styles.card, grupo.saldado && styles.cardSaldado]}
            onPress={onPress}
        >
            <Text style={styles.emoji}>{grupo.emoji}</Text>
            <View style={styles.info}>
                <Text style={[styles.nombre, grupo.saldado && styles.nombreSaldado]}>
                    {grupo.nombre}
                </Text>
                <Text style={styles.miembros}>{grupo.miembros.length} miembros</Text>
            </View>

            {/* badge saldado */}
            {grupo.saldado && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>✅ Saldado</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card:           { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 10, gap: 12 },
    cardSaldado:    { backgroundColor: '#f1f8e9', borderWidth: 1, borderColor: '#a5d6a7' },
    info:           { flex: 1 },
    nombre:         { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
    nombreSaldado:  { color: '#2e7d32' },
    miembros:       { fontSize: 13, color: '#888', marginTop: 2 },
    badge:          { backgroundColor: '#c8e6c9', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText:      { fontSize: 12, color: '#2e7d32', fontWeight: '700' },
    emoji:          { fontSize: 28 },
});