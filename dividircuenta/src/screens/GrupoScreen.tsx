import { useEffect } from "react";
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchGrupos } from "../store/slices/gruposSlice";
import { useAuth } from "../context/AuthContext";
import GroupCard       from "../components/GroupCard";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'ListaGrupos'>;

export default function GruposScreen({ navigation }: Props) {
    const dispatch   = useAppDispatch();
    const { user }   = useAuth();
    const grupos     = useAppSelector((state) => state.grupos.grupos);
    const loading    = useAppSelector((state) => state.grupos.loading);

    // Cargar grupos desde Supabase al montar la pantalla
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchGrupos(user.id));
        }
    }, [user?.id]);

    if (loading) {
        return (
            <ScreenContainer>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2e4566" />
                    <Text style={styles.loadingText}>Cargando grupos...</Text>
                </View>
            </ScreenContainer>
        );
    }

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
    empty:            { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
    emptyEmoji:       { fontSize: 56, marginBottom: 12 },
    emptyTitulo:      { fontSize: 18, fontWeight: '700', color: '#2e4566', marginBottom: 8 },
    emptyTexto:       { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText:      { fontSize: 14, color: '#888' },
});