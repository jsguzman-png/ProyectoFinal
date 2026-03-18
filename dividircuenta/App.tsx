import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider }  from './src/context/AuthContext';
import { GroupProvider } from './src/context/GroupContext';
import StackNavigator    from './src/navigation/StackNavigator';

export default function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </GroupProvider>
    </AuthProvider>
  );
}