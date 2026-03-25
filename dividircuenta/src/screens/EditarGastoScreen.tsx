import { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { editarGastoAsync, eliminarGastoAsync } from "../store/slices/gastosSlice";
import { Gasto } from "../types";
import CustomInput     from "../components/CustomInput";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'EditarGasto'>;

export default function EditarGastoScreen({ route, navigation }: Props) {
    const { gastoId, grupoId } = route.params;

    const gasto = useAppSelector((state) =>
        state.gastos.gastos.find((g) => g.id === gastoId)
    );
    const grupo = useAppSelector((state) =>
        state.grupos.grupos.find((g) => g.id === grupoId)
    );

    const [descripcion, setDescripcion] = useState(gasto?.descripcion ?? '');
    const [monto, setMonto]             = useState(gasto?.monto.toString() ?? '');
    const [pagadoPor, setPagadoPor]     = useState(gasto?.pagadoPor ?? '');
    const [loading, setLoading]         = useState(false);

    const dispatch = useAppDispatch();

    const handleGuardar = async () => {
        if (!descripcion || !monto) {
            Alert.alert('Error', 'Llena todos los campos');
            return;
        }
        if (!pagadoPor) {
            Alert.alert('Error', '¿Quién pagó este gasto?');
            return;
        }

        setLoading(true);
        try {
            const gastoEditado: Gasto = {
                id:           gastoId,
                grupoId,
                descripcion,
                monto:        parseFloat(monto),
                pagadoPor,
                divididoEntre: grupo?.miembros ?? [],
                creadoEn:     gasto?.creadoEn ?? new Date().toISOString(),
            };

            await dispatch(editarGastoAsync(gastoEditado)).unwrap();
            navigation.goBack();
        } catch {
            Alert.alert('Error', 'No se pudo guardar el gasto');
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = () => {
        Alert.alert('Eliminar gasto', `¿Eliminar "${descripcion}"?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    setLoading(true);
                    try {
                        await dispatch(eliminarGastoAsync(gastoId)).unwrap();
                        navigation.goBack();
                    } catch {
                        Alert.alert('Error', 'No se pudo eliminar el gasto');
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    if (!gasto) {
        return (
            <ScreenContainer>
                <Text>Gasto no encontrado</Text>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Descripción</Text>
                <CustomInput
                    placeholder="Ej: Cena en el restaurante"
                    value={descripcion}
                    onChange={setDescripcion}
                />

                <Text style={styles.label}>Monto (L)</Text>
                <CustomInput
                    placeholder="0.00"
                    value={monto}
                    onChange={setMonto}
                    typeInput="number"
                />

                <Text style={styles.label}>¿Quién pagó?</Text>
                {grupo && grupo.miembros.length > 0 && (
                    <View style={styles.miembrosRow}>
                        {grupo.miembros.map((m) => (
                            <TouchableOpacity
                                key={m}
                                style={[styles.chip, pagadoPor === m && styles.chipActivo]}
                                onPress={() => setPagadoPor(m)}
                            >
                                <Text style={[styles.chipText, pagadoPor === m && styles.chipTextoActivo]}>
                                    {m}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {loading
                    ? <ActivityIndicator size="large" color="#2e4566" style={{ marginTop: 16 }} />
                    : <>
                        <CustomButton title="Guardar cambios" onClick={handleGuardar} />
                        <CustomButton title="Eliminar gasto"  onClick={handleEliminar} color="#b71c1c" />
                    </>
                }
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    label:           { fontSize: 14, fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
    miembrosRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    chip:            { backgroundColor: '#e8edf5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, borderColor: 'transparent' },
    chipActivo:      { backgroundColor: '#2e4566', borderColor: '#2e4566' },
    chipText:        { fontSize: 14, color: '#2e4566', fontWeight: '600' },
    chipTextoActivo: { color: '#fff' },
});