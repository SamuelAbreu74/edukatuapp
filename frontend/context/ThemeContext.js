import React, { createContext, useState, useContext } from 'react';

export const THEME = {
  light: {
    name: 'light',
    background: '#FFFFFF',
    text: '#333333',
    primary: '#5C2F98',
    secondary: '#FF4D4D',
    inputBackground: '#FFFFFF',
    inputBorder: '#CCCCCC',
    placeholder: '#666666',
    buttonText: '#FFFFFF',
    selectorInactive: '#EBEBEB',
    cardBackground: '#F3F3F3',
    iconColor: '#333333', 
  },
  dark: {
    name: 'dark',
    background: '#121212',
    text: '#E0E0E0',
    primary: '#7D4F98',
    secondary: '#FF4D4D',
    inputBackground: '#1E1E1E',
    inputBorder: '#444444',
    placeholder: '#AAAAAA',
    buttonText: '#FFFFFF',
    selectorInactive: '#333333',
    cardBackground: '#1E1E1E',
    iconColor: '#E0E0E0',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const colors = THEME[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);