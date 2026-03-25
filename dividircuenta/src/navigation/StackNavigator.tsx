import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import LoginScreen    from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TabsNavigator  from "./TabsNavigator";

export type RootStackParamList = {
    Login:    undefined;
    Register: undefined;
    Tabs:     undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    const { session } = useAuth();

    return (
        <Stack.Navigator
            id="StackNavigator"
            // Si hay sesión activa va directo a Tabs, si no al Login
            initialRouteName={session ? 'Tabs' : 'Login'}
            screenOptions={{ headerShown: true }}
        >
            {session ? (
                // Usuario autenticado — solo ve las Tabs
                <Stack.Screen
                    name="Tabs"
                    component={TabsNavigator}
                    options={{ headerShown: false }}
                />
            ) : (
                // Usuario no autenticado — solo ve Login y Register
                <>
                    <Stack.Screen name="Login"    component={LoginScreen}    options={{ title: 'Iniciar Sesión' }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
                </>
            )}
        </Stack.Navigator>
    );
}