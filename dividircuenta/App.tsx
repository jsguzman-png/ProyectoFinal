import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { store }       from './src/store';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import StackNavigator   from './src/navigation/StackNavigator';

// Componente interno que maneja la navegación según la sesión
function AppNavigator() {
  const { session, loading } = useAuth();

  // Mientras Supabase verifica si hay sesión activa, mostrar spinner
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2e4566" />
      </View>
    );
  }

  return <StackNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}