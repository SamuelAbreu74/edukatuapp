import React from 'react';
import AppNavigator from './frontend/navigation/AppNavigator';
import { ThemeProvider } from './frontend/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}