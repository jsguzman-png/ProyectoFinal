import { useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch } from "../store/slices/hooks"; 
import { agregarGasto } from "../store/slices/groupsSlice"; 

import CustomInput     from "../components/CustomInput";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'AgregarGasto'>;

export default function AgregarGastoScreen({ route, navigation }: Props) {
    const { grupoId } = route.params;

    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');

    const dispatch = useAppDispatch(); // ✅
    const { user } = useAuth();

    const handleGuardar = () => {
        if (!descripcion || !monto) {
            Alert.alert('Error', 'Llena todos los campos');
            return;
        }

        dispatch(
            agregarGasto({
                grupoId,
                descripcion,
                monto: parseFloat(monto),
                pagadoPor: user?.nombre ?? 'Tú',
            })
        );

        navigation.goBack();
    };

    return (
        <ScreenContainer>
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

            <CustomButton title="Guardar Gasto" onClick={handleGuardar} />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    label: { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 6 },
});