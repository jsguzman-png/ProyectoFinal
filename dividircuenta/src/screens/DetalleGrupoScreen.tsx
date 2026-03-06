
import { Text, FlatList, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useGroup } from "../context/GroupContext";
import ExpenseCard     from "../components/ExpenseCard";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'DetalleGrupo'>;

export default function DetalleGrupoScreen({ route, navigation }: Props) {
    const { grupoId, grupoNombre } = route.params;
    const { getGastosPorGrupo } = useGroup();

    const gastos = getGastosPorGrupo(grupoId);

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
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
});