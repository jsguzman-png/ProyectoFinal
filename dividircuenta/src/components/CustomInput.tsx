import { useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    KeyboardTypeOptions,
    TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type Props = {
    placeholder: string;
    value: string;
    onChange: (text: string) => void;
    typeInput?: "text" | "email" | "password" | "number";
};

export default function CustomInput({ placeholder, value, onChange, typeInput = "text" }: Props) {
    const [isSecureText, setIsSecureText] = useState(typeInput === "password");
    const isPasswordField = typeInput === "password";

    const icon: React.ComponentProps<typeof MaterialIcons>["name"] | undefined =
        typeInput === "email" ? "email" :
        typeInput === "password" ? "lock" : undefined;

    const keyboardType: KeyboardTypeOptions =
        typeInput === "email" ? "email-address" :
        typeInput === "number" ? "numeric" : "default";

    const getError = () => {
        if (value.length === 0) return undefined;
        if (typeInput === "email" && !value.includes("@")) {
            return "Correo inválido";
        }
        if (typeInput === "password" && value.length < 6) {
            return "La contraseña debe tener al menos 6 caracteres";
        }
    };

    const error = getError();

    return (
        <View style={styles.wrapper}>
            <View style={[styles.inputContainer, !!error && styles.inputError]}>
                {icon && (
                    <MaterialIcons
                        name={icon}
                        size={20}
                        color="#777"
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#777"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={isSecureText}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                />
                {isPasswordField && (
                    <TouchableOpacity onPress={() => setIsSecureText(!isSecureText)} style={styles.eyeButton}>
                        <Ionicons
                            name={isSecureText ? "eye" : "eye-off"}
                            size={20}
                            color="#777"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    inputError: {
        borderColor: "red",
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 12,
        fontSize: 16,
    },
    eyeButton: {
        padding: 4,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
});
