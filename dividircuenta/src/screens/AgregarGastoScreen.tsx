import { useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppDispatch } from "../store/hooks";
import { agregarGasto } from "../store/slices/gastosSlice";
import { useAuth } from "../context/AuthContext";
import { Gasto } from "../types";
import CustomInput     from "../components/CustomInput";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'AgregarGasto'>;

export default function AgregarGastoScreen({ route, navigation }: Props) {
    const { grupoId } = route.params;

    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto]             = useState('');

    // 1. instanciar dispatch para poder invocar actions
    const dispatch = useAppDispatch();
    const { user }  = useAuth();

    const handleGuardar = () => {
        if (!descripcion || !monto) {
            Alert.alert('Error', 'Llena todos los campos');
            return;
        }

        // armar objeto a almacenar
        const nuevoGasto: Gasto = {
            id: Date.now().toString(),
            grupoId,
            descripcion,
            monto: parseFloat(monto),
            pagadoPor: user?.nombre ?? 'Tú',
            creadoEn: new Date().toISOString(),
        };

        // 2. invocar action "agregarGasto" enviando nuevoGasto como payload
        dispatch(agregarGasto(nuevoGasto));
        navigation.goBack();
    };

    return (
        <ScreenContainer>
            <Text style={styles.label}>Descripción</Text>
            <CustomInput placeholder="Ej: Cena en el restaurante" value={descripcion} onChange={setDescripcion} />

            <Text style={styles.label}>Monto (L)</Text>
            <CustomInput placeholder="0.00" value={monto} onChange={setMonto} typeInput="number" />

            <CustomButton title="Guardar Gasto" onClick={handleGuardar} />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    label: { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 6 },
});