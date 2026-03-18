import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
    title: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
};

export default function CustomButton({ title, onClick, variant = 'primary' }: Props) {
    const styles = getStyles(variant);

    return (
        <TouchableOpacity style={styles.container} onPress={onClick}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const getStyles = (variant: 'primary' | 'secondary') =>
    StyleSheet.create({
        container: {
            paddingVertical: 15,
            alignItems: 'center',
            width: '100%',
            backgroundColor: variant === 'primary' ? '#2e4566' : 'white',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: variant === 'primary' ? '#2e4566' : '#ccc',
            marginBottom: 12,
        },
        text: {
            color: variant === 'primary' ? 'white' : '#2e4566',
            fontSize: 16,
            fontWeight: '500',
        },
    });