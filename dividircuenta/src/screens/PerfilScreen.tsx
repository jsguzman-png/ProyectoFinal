import { Text, StyleSheet, Alert } from "react-native";

import { useAuth }        from "../context/AuthContext";
import { useAppDispatch } from "../store/hooks";
import { clearGrupos }    from "../store/slices/gruposSlice";
import { clearGastos }    from "../store/slices/gastosSlice";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

const PerfilScreen = () => {
    const { user, logout } = useAuth();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        Alert.alert('Cerrar sesión', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Salir',
                style: 'destructive',
                onPress: async () => {
                    // 1. Limpiar Redux para que no queden datos del usuario anterior
                    dispatch(clearGrupos());
                    dispatch(clearGastos());

                    // 2. Cerrar sesión en Supabase
                    // El StackNavigator detecta automáticamente que session = null
                    // y redirige solo al Login, sin necesitar navigation.replace
                    await logout();
                },
            },
        ]);
    };

    return (
        <ScreenContainer>
            <Text style={styles.nombre}>{user?.nombre ?? 'Usuario'}</Text>
            <Text style={styles.email}>{user?.email ?? ''}</Text>

            <CustomButton title="Cerrar Sesión" onClick={handleLogout} variant="secondary" />
        </ScreenContainer>
    );
};

export default PerfilScreen;

const styles = StyleSheet.create({
    nombre: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, marginTop: 32 },
    email:  { fontSize: 15, color: '#888', textAlign: 'center', marginBottom: 32 },
});