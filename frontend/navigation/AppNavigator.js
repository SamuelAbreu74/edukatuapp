// Arquivo: EduKatuApp/frontend/navigation/AppNavigator.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa APENAS as telas que você TEM certeza que existem!
import LoginScreen from '../screens/loginscreen';
import DashboardScreen from '../screens/dashboard';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const isAuthenticated = false; 

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        {/* NENHUMA OUTRA TELA AQUI POR ENQUANTO */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;