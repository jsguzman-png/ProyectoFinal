import { FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useGroup } from "../context/GroupContext";
import GroupCard       from "../components/GroupCard";
import CustomButton    from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, 'ListaGrupos'>;

export default function GruposScreen({ navigation }: Props) {
    const { grupos } = useGroup();

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