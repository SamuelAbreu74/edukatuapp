// Arquivo: frontend/screens/HistoryScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SPACING } from '../styles/theme';
import { getStudentHistory } from '../services/activityService';

const HistoryScreen = () => {
  const { colors } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // busca o ID do aluno automaticamente do AsyncStorage
      const data = await getStudentHistory();
      
      const sorted = data.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
      setHistory(sorted);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const date = new Date(item.submitted_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
    
    const percent = item.total_questions > 0 
        ? Math.round((item.score_count / item.total_questions) * 100) 
        : 0;

    return (
      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.headerRow}>
            <Text style={[styles.activityLabel, { color: colors.text }]}>
                Tentativa em: {date}
            </Text>
            <Text style={{ 
                color: item.is_completed ? '#4CAF50' : '#FF9800', 
                fontWeight: 'bold', fontSize: 12 
            }}>
                {item.is_completed ? "CONCLUÍDA" : "EM ANDAMENTO"}
            </Text>
        </View>

        <View style={styles.statsRow}>
            <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>{item.score}</Text>
                <Text style={[styles.statLabel, { color: colors.placeholder }]}>Pontos XP</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                    {item.score_count}/{item.total_questions}
                </Text>
                <Text style={[styles.statLabel, { color: colors.placeholder }]}>Acertos</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.secondary }]}>{percent}%</Text>
                <Text style={[styles.statLabel, { color: colors.placeholder }]}>Aproveitamento</Text>
            </View>
        </View>
      </View>
    );
  };

  if (loading) return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary}/>
      </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Meu Histórico</Text>
        
        {history.length === 0 ? (
            <Text style={{ color: colors.placeholder, textAlign: 'center', marginTop: 50 }}>
                Nenhuma atividade realizada ainda.
            </Text>
        ) : (
            <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: SPACING.medium },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screenTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: SPACING.large },
  card: { 
    padding: SPACING.medium, 
    borderRadius: SPACING.medium, 
    marginBottom: SPACING.medium,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.medium },
  activityLabel: { fontWeight: 'bold', fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12 }
});

export default HistoryScreen;