import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginscreen';
import AlunoTabNavigator from './AlunoTabNavigator';
import ProfessorTabNavigator from './ProfessorTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const isAuthenticated = false; 

  return (
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AlunoApp" component={AlunoTabNavigator} />
        <Stack.Screen name="ProfessorApp" component={ProfessorTabNavigator} />
        <Stack.Screen name="Ajustes" component={SettingsScreen} />
      </Stack.Navigator>
  
  );
}

export default AppNavigator;