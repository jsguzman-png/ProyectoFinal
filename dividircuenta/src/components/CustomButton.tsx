import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
    title: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    color?: string; // color personalizado de fondo
};

export default function CustomButton({ title, onClick, variant = 'primary', color }: Props) {
    const styles = getStyles(variant, color);

    return (
        <TouchableOpacity style={styles.container} onPress={onClick}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const getStyles = (variant: 'primary' | 'secondary', color?: string) =>
    StyleSheet.create({
        container: {
            paddingVertical: 15,
            alignItems: 'center',
            width: '100%',
            backgroundColor: variant === 'secondary' ? 'white' : (color ?? '#2e4566'),
            borderRadius: 8,
            borderWidth: 1,
            borderColor: variant === 'secondary' ? '#ccc' : (color ?? '#2e4566'),
            marginBottom: 12,
        },
        text: {
            color: variant === 'secondary' ? '#2e4566' : 'white',
            fontSize: 16,
            fontWeight: '500',
        },
    });