import { Text, FlatList, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppSelector } from "../store/slices/hooks"; 
import ExpenseCard     from "../components/ExpenseCard";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";
import { calcularDeudas } from "../utils/calcularDeudas";

type Props = NativeStackScreenProps<GruposStackParamList, 'DetalleGrupo'>;

export default function DetalleGrupoScreen({ route, navigation }: Props) {
    const { grupoId, grupoNombre } = route.params;

    // obtener grupo
    const grupo = useAppSelector(state =>
        state.group.grupos.find(g => g.id === grupoId)
    );

    // obtener gastos
    const gastos = useAppSelector(state =>
        state.group.gastos.filter(g => g.grupoId === grupoId)
    );

    // calcular deudas
    const balances = grupo
        ? calcularDeudas(grupo.miembros, gastos)
        : {};

    return (
        <ScreenContainer>
            <Text style={styles.titulo}>{grupoNombre}</Text>

            {/* BALANCE */}
            {grupo && (
                <View style={styles.balanceContainer}>
                    <Text style={styles.subtitulo}>Balance</Text>

                    {Object.entries(balances).map(([nombre, balance]) => (
                        <Text key={nombre} style={styles.balanceText}>
                            {nombre}: {balance >= 0 ? "recibe" : "debe"} L {Math.abs(balance).toFixed(2)}
                        </Text>
                    ))}
                </View>
            )}

            {/* LISTA DE GASTOS */}
            <FlatList
                data={gastos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ExpenseCard gasto={item} />}
            />

            {/* BOTONES */}
            <View style={styles.botonesContainer}>
                <CustomButton
                    title="+ Agregar Gasto"
                    onClick={() => navigation.navigate('AgregarGasto', { grupoId })}
                />

                <CustomButton
                    title="Editar Grupo"
                    onClick={() => navigation.navigate('EditarGrupo', { grupoId })}
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },

    subtitulo: { fontSize: 18, fontWeight: '600', marginBottom: 6 },

    balanceContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
    },

    balanceText: {
        fontSize: 14,
        marginBottom: 4,
    },

    botonesContainer: {
        marginTop: 20,
        gap: 10,
    },
});