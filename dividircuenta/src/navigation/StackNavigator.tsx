import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen    from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TabsNavigator  from "./TabsNavigator";
import EditarGrupoScreen from "../screens/EditarGrupoScreen";

export type RootStackParamList = {
    Login:    undefined;
    Register: undefined;
    Tabs:     undefined;
    EditarGrupo: { grupoId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    return (
        <Stack.Navigator id="StackNavigator" initialRouteName="Login" screenOptions={{ headerShown: true }}>
            <Stack.Screen name="Login"    component={LoginScreen}    options={{ title: 'Iniciar Sesión' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
            <Stack.Screen name="Tabs"     component={TabsNavigator}  options={{ headerShown: false }} />
            <Stack.Screen name="EditarGrupo" component={EditarGrupoScreen} />
        </Stack.Navigator>
    );
}