import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Grupo } from "../types";

type Props = {
    grupo: Grupo;
    onPress: () => void;
};

export default function GroupCard({ grupo, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.emoji}>{grupo.emoji}</Text>
            <View>
                <Text style={styles.nombre}>{grupo.nombre}</Text>
                <Text style={styles.miembros}>{grupo.miembros.length} miembros</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 10, gap: 12 },
    emoji:    { fontSize: 28 },
    nombre:   { fontSize: 16, fontWeight: '600' },
    miembros: { fontSize: 13, color: '#888', marginTop: 2 },
});