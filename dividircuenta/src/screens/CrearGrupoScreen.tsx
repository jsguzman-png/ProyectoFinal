import { useState } from "react";
import { Text, StyleSheet, Alert, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppDispatch } from "../store/hooks";
import { agregarGrupoAsync } from "../store/slices/gruposSlice";
import { useAuth } from "../context/AuthContext";
import CustomInput     from "../components/CustomInput";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'CrearGrupo'>;

export default function CrearGrupoScreen({ navigation }: Props) {
    const [nombre, setNombre]        = useState('');
    const [emoji, setEmoji]          = useState('🏖️');
    const [miembroInput, setMiembro] = useState('');
    const [miembros, setMiembros]    = useState<string[]>([]);
    const [loading, setLoading]      = useState(false);

    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const handleAgregarMiembro = () => {
        const trimmed = miembroInput.trim();
        if (!trimmed) return;
        if (miembros.includes(trimmed)) {
            Alert.alert('Error', 'Ese miembro ya fue agregado');
            return;
        }
        setMiembros([...miembros, trimmed]);
        setMiembro('');
    };

    const handleEliminarMiembro = (nombre: string) => {
        setMiembros(miembros.filter((m) => m !== nombre));
    };

    const handleCrear = async () => {
        if (!nombre) {
            Alert.alert('Error', 'Escribe un nombre para el grupo');
            return;
        }
        if (!user?.id) {
            Alert.alert('Error', 'No hay sesión activa');
            return;
        }

        setLoading(true);
        try {
            const todosLosMiembros = [user.nombre ?? 'Tú', ...miembros];

            await dispatch(agregarGrupoAsync({
                grupo: {
                    nombre,
                    emoji,
                    miembros: todosLosMiembros,
                    saldado: false,
                },
                userId: user.id,
            })).unwrap();

            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear el grupo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <Text style={styles.label}>Nombre del grupo</Text>
            <CustomInput placeholder="Ej: Viaje a Copán" value={nombre} onChange={setNombre} />

            <Text style={styles.label}>Emoji</Text>
            <CustomInput placeholder="🏖️" value={emoji} onChange={setEmoji} />

            <Text style={styles.label}>Agregar miembros</Text>
            <View style={styles.miembroRow}>
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

            {miembros.length > 0 && (
                <View style={styles.miembrosContainer}>
                    {miembros.map((m) => (
                        <View key={m} style={styles.chip}>
                            <Text style={styles.chipText}>{m}</Text>
                            <TouchableOpacity onPress={() => handleEliminarMiembro(m)}>
                                <Text style={styles.chipRemove}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <Text style={styles.nota}>* Tú eres agregado automáticamente al grupo</Text>

            {loading
                ? <ActivityIndicator size="large" color="#2e4566" style={{ marginTop: 16 }} />
                : <CustomButton title="Crear Grupo" onClick={handleCrear} />
            }
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    label:             { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 6 },
    miembroRow:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
    addBtn:            { backgroundColor: '#2e4566', borderRadius: 8, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    addBtnText:        { color: '#fff', fontSize: 24, fontWeight: '300' },
    miembrosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    chip:              { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8edf5', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, gap: 8 },
    chipText:          { fontSize: 14, color: '#2e4566', fontWeight: '600' },
    chipRemove:        { fontSize: 14, color: '#2e4566' },
    nota:              { fontSize: 12, color: '#888', marginBottom: 16 },
});