// Arquivo: EduKatuApp/App.js (NA RAIZ)
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// Stack principal)
import AppNavigator from './frontend/navigation/AppNavigator'; 

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}