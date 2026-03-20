import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GruposScreen       from "../screens/GrupoScreen";
import DetalleGrupoScreen from "../screens/DetalleGrupoScreen";

import CrearGrupoScreen   from "../screens/CrearGrupoScreen";
import AgregarGastoScreen from "../screens/AgregarGastoScreen";
import SaldosScreen       from "../screens/SaldosScreen";
import EditarGrupoScreen  from "../screens/EditarGrupoScreen";
import PerfilScreen       from "../screens/PerfilScreen";
import EditarGastoScreen from "../screens/EditarGastoScreen";

export type TabsParamList = {
    Grupos: undefined;
    Perfil: undefined;
};

export type GruposStackParamList = {
    ListaGrupos:  undefined;
    DetalleGrupo: { grupoId: string; grupoNombre: string };
    CrearGrupo:   undefined;
    AgregarGasto: { grupoId: string };
    EditarGasto:{gastoId: string; grupoId: string};
    Saldos:       { grupoId: string };
    EditarGrupo:  { grupoId: string };
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
            <Stack.Screen name="EditarGasto" component={EditarGastoScreen} options={{ title: 'Editar Gasto' }} />
            <Stack.Screen name="Saldos"       component={SaldosScreen}       options={{ title: 'Saldos' }} />
            <Stack.Screen name="EditarGrupo"  component={EditarGrupoScreen}  options={{ title: 'Editar Grupo' }} />
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