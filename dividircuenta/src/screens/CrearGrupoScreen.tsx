
import { useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useGroup } from "../context/GroupContext";
import CustomInput     from "../components/CustomInput";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'CrearGrupo'>;

export default function CrearGrupoScreen({ navigation }: Props) {
    const [nombre, setNombre] = useState('');
    const [emoji, setEmoji]   = useState('🏖️');

    const { crearGrupo } = useGroup();

    const handleCrear = () => {
        if (!nombre) {
            Alert.alert('Error', 'Escribe un nombre para el grupo');
            return;
        }
        crearGrupo(nombre, emoji);
        navigation.goBack();
    };

    return (
        <ScreenContainer>
            <Text style={styles.label}>Nombre del grupo</Text>
            <CustomInput placeholder="Ej: Viaje a Copán" value={nombre} onChange={setNombre} />

            <Text style={styles.label}>Emoji</Text>
            <CustomInput placeholder="🏖️" value={emoji} onChange={setEmoji} />

            <CustomButton title="Crear Grupo" onClick={handleCrear} />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    label: { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 6 },
});