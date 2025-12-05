import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { SPACING } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

import AvatarImage from '../../assets/bemvindomascote.png'; 

const ProfileScreen = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState('aluno@edukatu.com');
  const [userName, setUserName] = useState('Aluno');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userToken');
        if (jsonValue) {
          const userData = JSON.parse(jsonValue);
          
          if (userData?.email) {
            setUserEmail(userData.email);
          } else if (userData?.user?.email) {
            setUserEmail(userData.user.email);
          } else if (userData?.data?.email) {
            setUserEmail(userData.data.email);
          }

          if (userData?.name) {
             setUserName(userData.name);
          } else if (userData?.user?.name) {
             setUserName(userData.user.name);
          }
        }
      } catch (e) {
        return Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
      }
    };

    getUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={styles.themeHeader}>
         <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
           <Ionicons 
              name={theme === 'light' ? 'moon' : 'sunny'} 
              size={28} 
              color={colors.iconColor} 
           />
         </TouchableOpacity>
      </View>

      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <Image source={AvatarImage} style={styles.avatar} resizeMode="contain" />
        <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
        <Text style={[styles.email, { color: colors.placeholder }]}>{userEmail}</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBackground }]} onPress={() => {}}>
          <Text style={[styles.menuText, { color: colors.text }]}>Editar Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBackground }]} onPress={() => {}}>
          <Text style={[styles.menuText, { color: colors.text }]}>Meu Histórico</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.cardBackground, borderColor: colors.secondary }]} 
            onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: colors.secondary }]}>SAIR DA CONTA</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeHeader: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.large,
    paddingTop: 40,
    paddingBottom: 10,
  },
  themeButton: {
    padding: SPACING.small,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xLarge,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: SPACING.medium,
    borderRadius: 50,
    backgroundColor: '#EEE',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginBottom: SPACING.small,
  },
  body: {
    flex: 1,
    padding: SPACING.medium,
  },
  menuItem: {
    padding: SPACING.medium,
    borderRadius: SPACING.small,
    marginBottom: SPACING.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
  },
  footer: {
    padding: SPACING.large,
  },
  logoutButton: {
    padding: SPACING.medium,
    borderRadius: SPACING.small,
    alignItems: 'center',
    borderWidth: 1,
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default ProfileScreen;