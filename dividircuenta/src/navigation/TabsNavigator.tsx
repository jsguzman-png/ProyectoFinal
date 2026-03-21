import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GruposScreen       from "../screens/GrupoScreen";
import DetalleGrupoScreen from "../screens/DetalleGrupoScreen";
import CrearGrupoScreen   from "../screens/CrearGrupoScreen";
import AgregarGastoScreen from "../screens/AgregarGastoScreen";
import PerfilScreen       from "../screens/PerfilScreen";

export type TabsParamList = {
    Grupos: undefined;
    Perfil: undefined;
};

export type GruposStackParamList = {
    ListaGrupos:  undefined;
    DetalleGrupo: { grupoId: string; grupoNombre: string };
    CrearGrupo:   undefined;
    AgregarGasto: { grupoId: string };
    EditarGrupo: { grupoId: string };
};

const Tab   = createBottomTabNavigator<TabsParamList>();
const Stack = createNativeStackNavigator<GruposStackParamList>();

function GruposStack() {
    return (
        <Stack.Navigator id="GruposStack">
            <Stack.Screen name="ListaGrupos"  component={GruposScreen}       options={{ title: 'Mis Grupos' }} />
            <Stack.Screen name="DetalleGrupo" component={DetalleGrupoScreen} options={{ title: 'Detalle del Grupo' }} />
            <Stack.Screen name="CrearGrupo"   component={CrearGrupoScreen}   options={{ title: 'Nuevo Grupo' }} />
            <Stack.Screen name="AgregarGasto" component={AgregarGastoScreen} options={{ title: 'Agregar Gasto' }} />
        </Stack.Navigator>
    );
}

export default function TabsNavigator() {
    return (
        <Tab.Navigator id="TabsNavigator">
            <Tab.Screen name="Grupos" component={GruposStack} options={{ headerShown: false }} />
            <Tab.Screen name="Perfil" component={PerfilScreen} />
        </Tab.Navigator>
    );
}