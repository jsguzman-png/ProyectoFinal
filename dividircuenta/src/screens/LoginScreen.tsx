import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/StackNavigator";
import { useAuth } from "../context/AuthContext";
import CustomInput  from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();

    const handleLogin = () => {
        const ok = login(email, password);
        if (ok) {
            navigation.navigate('Tabs');
        } else {
            Alert.alert('Error', 'Llena todos los campos');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>💸 DividirCuenta</Text>

            <CustomInput placeholder="Correo"     value={email}    onChange={setEmail}    typeInput="email"    />
            <CustomInput placeholder="Contraseña" value={password} onChange={setPassword} typeInput="password" />

            <CustomButton title="Iniciar Sesión"            onClick={handleLogin} />
            <CustomButton title="¿No tienes cuenta? Regístrate" onClick={() => navigation.navigate('Register')} variant="secondary" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    titulo:    { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
});