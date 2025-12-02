import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Seus imports de telas
import LoginScreen from '../screens/loginscreen'; 
import AlunoTabNavigator from './AlunoTabNavigator';
import ProfessorTabNavigator from './ProfessorTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AlunoApp" component={AlunoTabNavigator} />
        <Stack.Screen name="ProfessorApp" component={ProfessorTabNavigator} />
        <Stack.Screen name="Ajustes" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;