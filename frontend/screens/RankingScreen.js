// Arquivo: frontend/screens/RankingScreen.js

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

const RankingScreen = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Ícone de Troféu */}
        <MaterialIcons name="emoji-events" size={80} color={colors.placeholder} />
        
        <Text style={[styles.text, { color: colors.text }]}>Ranking Geral</Text>
        <Text style={[styles.subtext, { color: colors.placeholder }]}>
          Em breve você verá quem está liderando o placar! 
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtext: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default RankingScreen;