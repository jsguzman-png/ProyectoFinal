import React, { useState } from "react";
import { TextInput, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { GruposStackParamList } from "../navigation/TabsNavigator";
import { useAppDispatch } from "../store/slices/hooks"; 
import { agregarGrupo, agregarMiembro } from "../store/slices/groupsSlice"; 

import CustomButton from "../components/CustomButton";
import ScreenContainer from "../components/ScreenContainer";

type Props = NativeStackScreenProps<GruposStackParamList, "CrearGrupo">;

export default function CrearGrupoScreen({ navigation }: Props) {

  const dispatch = useAppDispatch();

  const [nombre, setNombre] = useState("");
  const [integrantes, setIntegrantes] = useState("");

  const handleCrearGrupo = () => {
    if (!nombre.trim()) return;

    // Crear grupo (solo nombre + emoji como pide tu slice)
    const action = agregarGrupo({
      nombre: nombre,
      emoji: "💰",
    });

    dispatch(action);

    // obtener el ID generado (porque usas Date.now())
    const grupoId = action.payload
      ? Date.now().toString()
      : "";

    // agregar miembros uno por uno
    const lista = integrantes.split(",").map(i => i.trim()).filter(Boolean);

    lista.forEach((miembro) => {
      dispatch(
        agregarMiembro({
          grupoId: grupoId,
          miembro: miembro,
        })
      );
    });

    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <Text>Nombre del grupo</Text>
      <TextInput
        placeholder="Ej: Viaje a la playa"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text>Integrantes (separados por coma)</Text>
      <TextInput
        placeholder="Ej: Juan, Pedro, Ana"
        value={integrantes}
        onChangeText={setIntegrantes}
      />

      <CustomButton title="Crear Grupo" onClick={handleCrearGrupo} />
    </ScreenContainer>
  );
}