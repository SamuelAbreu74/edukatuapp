import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

const ProfileScreen = () => { // Posteriormente acho que é melhor ter opções diferentes para a tela de perfil do aluno e prof mas por enquanto é a mesma
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Perfil (Professor e aluno)</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary }
});
export default ProfileScreen;