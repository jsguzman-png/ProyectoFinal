import { useState } from "react";
import { Text, StyleSheet, Alert, View, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { agregarGasto, limpiarPagos } from "../store/slices/gastosSlice";
import { useAuth } from "../context/AuthContext";
import { Gasto } from "../types";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";
import { resetearSaldado } from "../store/slices/gruposSlice";


type Props = NativeStackScreenProps<GruposStackParamList, 'AgregarGasto'>;

export default function AgregarGastoScreen({ route, navigation }: Props) {
    const { grupoId } = route.params;

    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [pagadoPor, setPagadoPor] = useState('');

    // 1. instanciar dispatch
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    // obtener los miembros del grupo del store
    const grupo = useAppSelector((state) =>
        state.grupos.grupos.find((g) => g.id === grupoId)
    );

    const handleGuardar = () => {
        if (!descripcion || !monto) {
            Alert.alert('Error', 'Llena todos los campos');
            return;
        }
        if (!pagadoPor) {
            Alert.alert('Error', '¿Quién pagó este gasto?');
            return;
        }

        const nuevoGasto: Gasto = {
            id: Date.now().toString(),
            grupoId,
            descripcion,
            monto: parseFloat(monto),
            pagadoPor,
            creadoEn: new Date().toISOString(),
        };

        // limpiar pagos anteriores y resetear saldado al agregar gasto nuevo
        dispatch(limpiarPagos(grupoId));
        dispatch(resetearSaldado(grupoId));
        dispatch(agregarGasto(nuevoGasto));
        navigation.goBack();
    };

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

                {/* Selector de quién pagó */}
                <Text style={styles.label}>¿Quién pagó?</Text>
                {grupo && grupo.miembros.length > 0 ? (
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
                ) : (
                    <Text style={styles.sinMiembros}>No hay miembros en este grupo</Text>
                )}

                <CustomButton title="Guardar Gasto" onClick={handleGuardar} />
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    label: { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 8 },
    miembrosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    chip: { backgroundColor: '#e8edf5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, borderColor: 'transparent' },
    chipActivo: { backgroundColor: '#2e4566', borderColor: '#2e4566' },
    chipText: { fontSize: 14, color: '#2e4566', fontWeight: '600' },
    chipTextoActivo: { color: '#fff' },
    sinMiembros: { fontSize: 14, color: '#888', marginBottom: 16 },
});