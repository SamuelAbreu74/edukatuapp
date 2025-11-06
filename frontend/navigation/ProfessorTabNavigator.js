
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/theme';

//  5 telas do Professor
import DashboardScreen from '../screens/dashboard'; 
import SubjectsScreen from '../screens/SubjectsScreen';
import AddActivityScreen from '../screens/add_atv'; 
import ProfileScreen from '../screens/ProfileScreen';
import RankingScreen from '../screens/RankingScreen';
const Tab = createBottomTabNavigator();

const ProfessorTabNavigator = () => {
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
          } else if (route.name === 'Matérias') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Adicionar') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            return <Ionicons name={iconName} size={size * 1.3} color={color} />;
          } else if (route.name === 'Ranking') { //rank visivel pro prof
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Perfil') { // alterar perfil
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Matérias" component={SubjectsScreen} />
      <Tab.Screen name="Adicionar" component={AddActivityScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default ProfessorTabNavigator;