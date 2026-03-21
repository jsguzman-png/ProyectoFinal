import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { store }       from "./src/store/store";
import { AuthProvider } from "./src/context/AuthContext";
import StackNavigator  from "./src/navigation/StackNavigator";

export default function App() {
  return (
   <Provider store={store}>
  <SafeAreaProvider>
    <AuthProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </AuthProvider>
  </SafeAreaProvider>
</Provider>
  );
}
