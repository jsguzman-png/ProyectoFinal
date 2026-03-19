import { Text, StyleSheet, Alert } from "react-native";
import { FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { eliminarGrupo } from "../store/slices/gruposSlice";
import ExpenseCard     from "../components/ExpenseCard";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'DetalleGrupo'>;

export default function DetalleGrupoScreen({ route, navigation }: Props) {
    const { grupoId, grupoNombre } = route.params;

    // obtener gastos del store filtrados por grupoId
    const gastos = useAppSelector((state) =>
        state.gastos.gastos.filter((g) => g.grupoId === grupoId)
    );

    const dispatch = useAppDispatch();

    const handleEliminarGrupo = () => {
        Alert.alert('Eliminar grupo', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => {
                    dispatch(eliminarGrupo(grupoId));
                    navigation.goBack();
                },
            },
        ]);
    };

    return (
        <ScreenContainer>
            <Text style={styles.titulo}>{grupoNombre}</Text>

            <FlatList
                data={gastos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ExpenseCard gasto={item} />}
            />

            <CustomButton
                title="+ Agregar Gasto"
                onClick={() => navigation.navigate('AgregarGasto', { grupoId })}
            />
            <CustomButton
                title="Eliminar Grupo"
                onClick={handleEliminarGrupo}
                variant="secondary"
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
});