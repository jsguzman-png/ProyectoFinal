import { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { editarMiembros, editarGrupo } from "../store/slices/gruposSlice";
import CustomInput     from "../components/CustomInput";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'EditarGrupo'>;

export default function EditarGrupoScreen({ route, navigation }: Props) {
    const { grupoId } = route.params;

    const grupo = useAppSelector((state) =>
        state.grupos.grupos.find((g) => g.id === grupoId)
    );

    const [nombre, setNombre]        = useState(grupo?.nombre ?? '');
    const [emoji, setEmoji]          = useState(grupo?.emoji ?? '');
    const [miembros, setMiembros]    = useState<string[]>(grupo?.miembros ?? []);
    const [miembroInput, setMiembro] = useState('');

    const dispatch = useAppDispatch();

    const handleAgregarMiembro = () => {
        const trimmed = miembroInput.trim();
        if (!trimmed) return;
        if (miembros.includes(trimmed)) {
            Alert.alert('Error', 'Ese miembro ya está en el grupo');
            return;
        }
        setMiembros([...miembros, trimmed]);
        setMiembro('');
    };

    const handleEliminarMiembro = (nombre: string) => {
        if (miembros.length <= 1) {
            Alert.alert('Error', 'El grupo debe tener al menos un miembro');
            return;
        }
        Alert.alert('Eliminar miembro', `¿Eliminar a "${nombre}" del grupo?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => setMiembros(miembros.filter((m) => m !== nombre)),
            },
        ]);
    };

    const handleGuardar = () => {
        if (!nombre.trim()) {
            Alert.alert('Error', 'El grupo necesita un nombre');
            return;
        }
        // actualizar nombre y emoji
        dispatch(editarGrupo({ id: grupoId, nombre: nombre.trim(), emoji: emoji.trim() || '🏖️' }));
        // actualizar miembros
        dispatch(editarMiembros({ grupoId, miembros }));
        navigation.goBack();
    };

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Nombre del grupo */}
                <Text style={styles.label}>Nombre del grupo</Text>
                <CustomInput
                    placeholder="Nombre del grupo"
                    value={nombre}
                    onChange={setNombre}
                />

                {/* Emoji */}
                <Text style={styles.label}>Emoji</Text>
                <CustomInput
                    placeholder="🏖️"
                    value={emoji}
                    onChange={setEmoji}
                />

                {/* Agregar miembro */}
                <Text style={styles.label}>Agregar miembro</Text>
                <View style={styles.inputRow}>
                    <View style={{ flex: 1 }}>
                        <CustomInput
                            placeholder="Nombre del miembro"
                            value={miembroInput}
                            onChange={setMiembro}
                        />
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={handleAgregarMiembro}>
                        <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Lista de miembros */}
                <Text style={styles.label}>Miembros actuales</Text>
                {miembros.map((m) => (
                    <View key={m} style={styles.miembroCard}>
                        <Text style={styles.miembroNombre}>{m}</Text>
                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => handleEliminarMiembro(m)}
                        >
                            <Text style={styles.deleteText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <CustomButton title="Guardar cambios" onClick={handleGuardar} />
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    label:         { fontSize: 14, fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
    inputRow:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
    addBtn:        { backgroundColor: '#2e4566', borderRadius: 8, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    addBtnText:    { color: '#fff', fontSize: 24, fontWeight: '300' },
    miembroCard:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 8 },
    miembroNombre: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
    deleteBtn:     { padding: 4 },
    deleteText:    { fontSize: 15, color: '#b71c1c', fontWeight: '700' },
});