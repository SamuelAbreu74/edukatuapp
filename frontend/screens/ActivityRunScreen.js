// Arquivo: frontend/screens/ActivityRunScreen.js

import React, { useState, useEffect } from 'react';
import { 
    View, Text, TouchableOpacity, StyleSheet, Alert, 
    ActivityIndicator, ScrollView, SafeAreaView 
} from 'react-native';
import { useTheme } from '../context/ThemeContext'; 
import { SPACING } from '../styles/theme'; 
import { startAttempt, answerQuestion } from '../services/activityService';

const ActivityRunScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { activity } = route.params; // Recebe a atividade do Dashboard

  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // Guarda as respostas locais


  const questionsList = activity.questions || [];
  const currentQuestion = questionsList[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionsList.length - 1;

  useEffect(() => {
    const init = async () => {
      try {
        const result = await startAttempt(activity.id); 
        setAttemptId(result.id || result._id); 
      } catch (error) {
        Alert.alert("Erro", "Não foi possível iniciar a atividade. Verifique sua conexão.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSelectOption = async (optionLetter) => {
    // 1. Feedback visual imediato
    setAnswers({ ...answers, [currentQuestion.id]: optionLetter });

    // 2. Envia pro backend em segundo plano
    if (attemptId) {
      try {
        await answerQuestion(attemptId, currentQuestion.id, optionLetter);
      } catch (error) {
        console.log("Erro silencioso ao salvar: ", error);
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      Alert.alert("Concluído!", "Atividade finalizada com sucesso.", [
        { text: "Voltar ao Dashboard", onPress: () => navigation.goBack() }
      ]);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Se não houver questões
  if (!currentQuestion) {
     return (
         <View style={[styles.center, { backgroundColor: colors.background }]}>
             <Text style={{ color: colors.text }}>Erro: Atividade sem questões.</Text>
         </View>
     );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Cabeçalho da Atividade */}
        <Text style={[styles.title, { color: colors.primary }]}>{activity.title}</Text>
        <Text style={[styles.progress, { color: colors.placeholder }]}>
            Questão {currentQuestionIndex + 1} de {questionsList.length}
        </Text>

        {/* Card da Pergunta */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.questionText, { color: colors.text }]}>
              {currentQuestion.question}
          </Text>
          
          {/* Opções (A, B, C, D, E) */}
          {['A', 'B', 'C', 'D', 'E'].map((letter) => {
             const optionText = currentQuestion[`option_${letter.toLowerCase()}`];
             if (!optionText) return null;

             const isSelected = answers[currentQuestion.id] === letter;

             return (
               <TouchableOpacity 
                 key={letter}
                 style={[
                    styles.optionButton, 
                    { 
                        borderColor: colors.inputBorder,
                        backgroundColor: isSelected ? colors.primary : 'transparent' 
                    }
                 ]}
                 onPress={() => handleSelectOption(letter)}
               >
                 <Text style={[
                     styles.optionLabel, 
                     { color: isSelected ? '#FFF' : colors.primary }
                 ]}>
                    {letter}.
                 </Text>
                 <Text style={[
                     styles.optionText, 
                     { color: isSelected ? '#FFF' : colors.text }
                 ]}>
                    {optionText}
                 </Text>
               </TouchableOpacity>
             );
          })}
        </View>

        <TouchableOpacity 
            style={[styles.nextButton, { backgroundColor: colors.secondary }]} 
            onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
              {isLastQuestion ? "FINALIZAR" : "PRÓXIMA QUESTÃO"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: SPACING.large, flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: SPACING.small },
  progress: { fontSize: 14, marginBottom: SPACING.large },
  card: { 
      padding: SPACING.medium, 
      borderRadius: SPACING.medium, 
      elevation: 2,
      marginBottom: SPACING.large
  },
  questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: SPACING.large },
  optionButton: { 
    flexDirection: 'row', 
    padding: SPACING.medium, 
    borderWidth: 1, 
    borderRadius: SPACING.small, 
    marginBottom: SPACING.small,
    alignItems: 'center'
  },
  optionLabel: { fontWeight: 'bold', marginRight: 10, fontSize: 16 },
  optionText: { flex: 1, fontSize: 16 },
  nextButton: { 
    padding: SPACING.medium, 
    borderRadius: SPACING.small, 
    alignItems: 'center',
    marginTop: SPACING.small 
  },
  nextButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default ActivityRunScreen;