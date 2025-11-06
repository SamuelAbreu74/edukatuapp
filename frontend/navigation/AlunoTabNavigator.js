
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/theme';

// Aq importa as telas do Aluno
import DashboardScreen from '../screens/dashboard'; 
import StoreScreen from '../screens/StoreScreen';
import RankingScreen from '../screens/RankingScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AlunoTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Início') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Loja') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Ranking') {
        iconName = focused ? 'trophy' : 'trophy-outline';
      } else if (route.name === 'Perfil') { // 4ª aba (nova)
        iconName = focused ? 'person' : 'person-outline';
      }
      return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Loja" component={StoreScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AlunoTabNavigator;