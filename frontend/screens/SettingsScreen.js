import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';
const SettingsScreen = () => (
  <View style={styles.container}><Text style={styles.text}>Tela de Ajustes</Text></View>
);
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary }
});
export default SettingsScreen;