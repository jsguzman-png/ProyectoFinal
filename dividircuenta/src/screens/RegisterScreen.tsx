import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/StackNavigator";
import { useAuth } from "../context/AuthContext";
import CustomInput  from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
    const [nombre, setNombre]     = useState('');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');

    const { register } = useAuth();

    const handleRegister = async () => {
    Alert.alert('Debug', `Registrando: ${nombre} | ${email} | ${password}`);
    
    if (!nombre || !email || !password) {
        Alert.alert('Error', 'Llena todos los campos');
        return;
    }

    const ok = await register(nombre, email, password);
    if (!ok) {
        Alert.alert('Error', 'No se pudo registrar');
    }
};

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>💸 DividirCuenta</Text>

            <CustomInput placeholder="Nombre"     value={nombre}   onChange={setNombre}   typeInput="text"     />
            <CustomInput placeholder="Correo"     value={email}    onChange={setEmail}    typeInput="email"    />
            <CustomInput placeholder="Contraseña" value={password} onChange={setPassword} typeInput="password" />

            <CustomButton title="Registrarme"              onClick={handleRegister} />
            <CustomButton title="¿Ya tienes cuenta? Entra" onClick={() => navigation.navigate('Login')} variant="secondary" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    titulo:    { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
});