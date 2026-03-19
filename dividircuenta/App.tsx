import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { store }       from './src/store';
import { AuthProvider } from './src/context/AuthContext';
import StackNavigator   from './src/navigation/StackNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}