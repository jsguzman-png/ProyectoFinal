import { Text, StyleSheet, Alert } from "react-native";

import { useAuth }     from "../context/AuthContext";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

const PerfilScreen = ({ navigation }: any) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert('Cerrar sesión', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', onPress: () => { logout(); navigation.replace('Login'); } },
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