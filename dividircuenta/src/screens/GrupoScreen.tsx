import { FlatList, View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppSelector } from "../store/hooks";
import GroupCard       from "../components/GroupCard";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'ListaGrupos'>;

export default function GruposScreen({ navigation }: Props) {
    const grupos = useAppSelector((state) => state.grupos.grupos);

    return (
        <ScreenContainer>
            <FlatList
                data={grupos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <GroupCard
                        grupo={item}
                        onPress={() => navigation.navigate('DetalleGrupo', {
                            grupoId: item.id,
                            grupoNombre: item.nombre,
                        })}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyEmoji}>👥</Text>
                        <Text style={styles.emptyTitulo}>No tienes grupos aún</Text>
                        <Text style={styles.emptyTexto}>Crea un nuevo grupo para empezar a dividir gastos</Text>
                    </View>
                }
            />
            <CustomButton title="+ Nuevo Grupo" onClick={() => navigation.navigate('CrearGrupo')} />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    empty:       { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
    emptyEmoji:  { fontSize: 56, marginBottom: 12 },
    emptyTitulo: { fontSize: 18, fontWeight: '700', color: '#2e4566', marginBottom: 8 },
    emptyTexto:  { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
});