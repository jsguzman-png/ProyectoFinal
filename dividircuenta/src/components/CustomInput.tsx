import { useState } from "react";
import { View, TextInput, Text, StyleSheet, KeyboardTypeOptions } from "react-native";

type Props = {
    placeholder: string;
    value: string;
    onChange: (text: string) => void;
    typeInput?: 'text' | 'email' | 'password' | 'number';
};

export default function CustomInput({ placeholder, value, onChange, typeInput = 'text' }: Props) {
    const [isSecure, setIsSecure] = useState(typeInput === 'password');

    const keyboardType: KeyboardTypeOptions =
        typeInput === 'email'  ? 'email-address' :
        typeInput === 'number' ? 'numeric'       : 'default';

    const getError = () => {
        if (typeInput === 'email' && value.length > 0 && !value.includes('@'))
            return 'Correo inválido';
        if (typeInput === 'password' && value.length > 0 && value.length < 6)
            return 'La contraseña debe tener al menos 6 caracteres';
    };

    const error = getError();

    return (
        <View style={styles.wrapper}>
            <View style={[styles.inputContainer, !!error && styles.inputError]}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={isSecure}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper:        { marginBottom: 12 },
    inputContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12 },
    input:          { padding: 12, fontSize: 16 },
    inputError:     { borderColor: 'red' },
    errorText:      { color: 'red', fontSize: 12, marginTop: 4 },
});