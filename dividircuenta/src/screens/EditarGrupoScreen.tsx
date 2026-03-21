import { useState } from "react";
import { Text, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppDispatch, useAppSelector } from "../store/slices/hooks";
import { agregarMiembro, eliminarMiembro } from "../store/slices/groupsSlice";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, "EditarGrupo">;

export default function EditarGrupoScreen({ route }: Props) {
  const { grupoId } = route.params;

  const dispatch = useAppDispatch();

  const grupo = useAppSelector(state =>
    state.group.grupos.find(g => g.id === grupoId)
  );

  const [nuevoMiembro, setNuevoMiembro] = useState("");

  if (!grupo) return null;

  const handleAgregar = () => {
    if (!nuevoMiembro.trim()) return;

    dispatch(
      agregarMiembro({
        grupoId,
        miembro: nuevoMiembro,
      })
    );

    setNuevoMiembro("");
  };

  const handleEliminar = (miembro: string) => {
    dispatch(
      eliminarMiembro({
        grupoId,
        miembro,
      })
    );
  };

  return (
    <ScreenContainer>
      <Text>Miembros</Text>

      <FlatList
        data={grupo.miembros}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CustomButton
            title={`❌ ${item}`}
            onClick={() => handleEliminar(item)}
          />
        )}
      />

      <CustomInput
        placeholder="Nuevo miembro"
        value={nuevoMiembro}
        onChange={setNuevoMiembro}
      />

      <CustomButton title="Agregar" onClick={handleAgregar} />
    </ScreenContainer>
  );
}