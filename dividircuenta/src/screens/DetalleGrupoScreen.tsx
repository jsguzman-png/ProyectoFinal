import { useEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { eliminarGrupoAsync } from "../store/slices/gruposSlice";
import { fetchGastos } from "../store/slices/gastosSlice";
import ExpenseCard     from "../components/ExpenseCard";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'DetalleGrupo'>;

export default function DetalleGrupoScreen({ route, navigation }: Props) {
    const { grupoId, grupoNombre } = route.params;

    const dispatch = useAppDispatch();

    const gastos  = useAppSelector((state) =>
        state.gastos.gastos.filter((g) => g.grupoId === grupoId)
    );
    const grupo   = useAppSelector((state) =>
        state.grupos.grupos.find((g) => g.id === grupoId)
    );
    const loading = useAppSelector((state) => state.gastos.loading);

    // Cargar gastos desde Supabase al entrar a la pantalla
    useEffect(() => {
        dispatch(fetchGastos(grupoId));
    }, [grupoId]);

    const handleEliminarGrupo = () => {
        Alert.alert('Eliminar grupo', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await dispatch(eliminarGrupoAsync(grupoId)).unwrap();
                        navigation.goBack();
                    } catch {
                        Alert.alert('Error', 'No se pudo eliminar el grupo');
                    }
                },
            },
        ]);
    };

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.titulo}>{grupoNombre}</Text>

                {/* Miembros */}
                {grupo && grupo.miembros.length > 0 && (
                    <View style={styles.seccion}>
                        <Text style={styles.sectionLabel}>Miembros</Text>
                        <View style={styles.miembrosRow}>
                            {grupo.miembros.map((m) => (
                                <View key={m} style={styles.chip}>
                                    <Text style={styles.chipText}>{m}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Gastos */}
                <Text style={styles.sectionLabel}>Gastos</Text>
                {loading ? (
                    <ActivityIndicator size="small" color="#2e4566" style={{ marginVertical: 16 }} />
                ) : gastos.length === 0 ? (
                    <Text style={styles.sinGastos}>Sin gastos aún</Text>
                ) : (
                    gastos.map((item) => (
                        <ExpenseCard
                            key={item.id}
                            gasto={item}
                            onPress={() => navigation.navigate('EditarGasto', {
                                gastoId: item.id,
                                grupoId,
                            })}
                        />
                    ))
                )}

                <CustomButton
                    title="+ Agregar Gasto"
                    onClick={() => navigation.navigate('AgregarGasto', { grupoId })}
                    color="#2e4566"
                />
                <CustomButton
                    title="Ver Saldos 💰"
                    onClick={() => navigation.navigate('Saldos', { grupoId })}
                    color="#243348"
                />
                <CustomButton
                    title="Editar Miembros 👥"
                    onClick={() => navigation.navigate('EditarGrupo', { grupoId })}
                    color="#0f1a2e"
                />
                <CustomButton
                    title="Eliminar Grupo"
                    onClick={handleEliminarGrupo}
                    color="#b71c1c"
                />
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    titulo:       { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    seccion:      { marginBottom: 20 },
    sectionLabel: { fontSize: 13, fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
    miembrosRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip:         { backgroundColor: '#e8edf5', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
    chipText:     { fontSize: 14, color: '#2e4566', fontWeight: '600' },
    sinGastos:    { fontSize: 14, color: '#888', marginBottom: 16 },
});