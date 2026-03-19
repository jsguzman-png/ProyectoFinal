import { FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppSelector } from "../store/hooks";
import GroupCard       from "../components/GroupCard";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'ListaGrupos'>;

export default function GruposScreen({ navigation }: Props) {
    // obtener grupos del store (estado global con Redux)
    const grupos = useAppSelector((state) => state.grupos.grupos);

    return (
        <ScreenContainer>
            <FlatList
                data={grupos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <GroupCard
                        grupo={item}
                        onPress={() => navigation.navigate('DetalleGrupo', {
                            grupoId: item.id,
                            grupoNombre: item.nombre,
                        })}
                    />
                )}
            />
            <CustomButton title="+ Nuevo Grupo" onClick={() => navigation.navigate('CrearGrupo')} />
        </ScreenContainer>
    );
}