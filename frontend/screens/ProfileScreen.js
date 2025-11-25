import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { COLORS, SPACING } from '../styles/theme';

import AvatarImage from '../../assets/bemvindomascote.png'; 

const ProfileScreen = ({ navigation }) => {

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: () => {
            // Reseta o histórico e volta para o Login
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
    <View style={styles.container}>
      
      {/* Cabeçalho do Perfil */}
      <View style={styles.header}>
        <Image source={AvatarImage} style={styles.avatar} resizeMode="contain" />
        <Text style={styles.name}>Usuário Teste</Text>
        <Text style={styles.email}>aluno@edukatu.com</Text>
      </View>

      {/* Lista de Opções (Sem Configurações) */}
      <View style={styles.body}>
        <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Editar Perfil")}>
          <Text style={styles.menuText}>Editar Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Histórico")}>
          <Text style={styles.menuText}>Meu Histórico</Text>
        </TouchableOpacity>
      </View>

      {/* Botão de Logout */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>SAIR DA CONTA</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xLarge,
    backgroundColor: COLORS.background,
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
    color: COLORS.textPrimary,
  },
  email: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.small,
  },
  body: {
    flex: 1,
    padding: SPACING.medium,
  },
  menuItem: {
    backgroundColor: COLORS.background,
    padding: SPACING.medium,
    borderRadius: SPACING.small,
    marginBottom: SPACING.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  footer: {
    padding: SPACING.large,
  },
  logoutButton: {
    backgroundColor: '#FFF',
    padding: SPACING.medium,
    borderRadius: SPACING.small,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4D4D', 
  },
  logoutText: {
    color: '#FF4D4D',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default ProfileScreen;