// Arquivo: frontend/screens/ActivityRunScreen.js

import React, { useState, useEffect } from 'react';
import { 
    View, Text, TouchableOpacity, StyleSheet, Alert, 
    ActivityIndicator, ScrollView, SafeAreaView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Ícones para deixar bonito
import { useTheme } from '../context/ThemeContext';
import { SPACING } from '../styles/theme';
import { startAttempt, answerQuestion } from '../services/activityService';

const ActivityRunScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { activity } = route.params;

  // ESTADO NOVO: Controla se o aluno já clicou em "Começar"
  const [started, setStarted] = useState(false);

  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Loading inicial (criando tentativa)
  const [answers, setAnswers] = useState({});

  const questionsList = activity.questions || [];
  const currentQuestion = questionsList[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionsList.length - 1;

  // Inicia a tentativa no backend assim que a tela abre (em background)
  useEffect(() => {
    const init = async () => {
      try {
        const result = await startAttempt(activity.id); 
        setAttemptId(result.id || result._id); 
      } catch (error) {
        Alert.alert("Erro", "Não foi possível conectar ao servidor.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSelectOption = async (optionLetter) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionLetter });
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
        { text: "Voltar ao Dashboard", onPress: () => navigation.popToTop() }
      ]);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleQuit = () => {
      Alert.alert(
          "Sair da Atividade?",
          "A atividade constará como incompleta.",
          [
              { text: "Continuar Respondendo", style: "cancel" },
              { text: "Sair", style: "destructive", onPress: () => navigation.popToTop() }
          ]
      );
  };

  // Funções de apoio visual
  const getDifficultyColor = (diff) => {
      if(diff === 'FACIL') return '#4CAF50'; // Verde
      if(diff === 'MEDIO') return '#FF9800'; // Laranja
      return '#F44336'; // Vermelho
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // TELA 1: INTRODUÇÃO (ANTES DE COMEÇAR)
  // essa tlea é para mostrar titulo, desc, matéria e dificuldade, além de breve orientação para
  // realização da atv por parte do aluno
  if (!started) {
      return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.introScroll}>
                
                {/* Cabeçalho */}
                <View style={styles.introHeader}>
                    <MaterialIcons name="school" size={60} color={colors.primary} />
                    <Text style={[styles.introTitle, { color: colors.primary }]}>
                        {activity.title}
                    </Text>
                    <Text style={[styles.introSubject, { color: colors.text }]}>
                        {activity.subject}
                    </Text>
                </View>

                {/* Card de Informações */}
                <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.infoLabel, { color: colors.placeholder }]}>Descrição:</Text>
                    <Text style={[styles.infoText, { color: colors.text }]}>
                        {activity.description || "Sem descrição disponível."}
                    </Text>

                    <View style={styles.rowInfo}>
                        <View style={styles.infoBlock}>
                            <Text style={[styles.infoLabel, { color: colors.placeholder }]}>Dificuldade:</Text>
                            <Text style={{ 
                                fontWeight: 'bold', 
                                color: getDifficultyColor(activity.difficulty) 
                            }}>
                                {activity.difficulty}
                            </Text>
                        </View>
                        <View style={styles.infoBlock}>
                             <Text style={[styles.infoLabel, { color: colors.placeholder }]}>Questões:</Text>
                             <Text style={[styles.infoText, { color: colors.text }]}>
                                 {questionsList.length}
                             </Text>
                        </View>
                        <View style={styles.infoBlock}>
                             <Text style={[styles.infoLabel, { color: colors.placeholder }]}>Tempo:</Text>
                             <Text style={[styles.infoText, { color: colors.text }]}>
                                 {activity.time} min
                             </Text>
                        </View>
                    </View>
                </View>

                {/* Mensagem de Orientação */}
                <View style={styles.guidanceBox}>
                    <MaterialIcons name="lightbulb-outline" size={24} color="#FBC02D" />
                    <Text style={styles.guidanceText}>
                        Responda a atividade com calma. Leia atentamente cada questão antes de selecionar sua resposta. Boa sorte!
                    </Text>
                </View>

                <View style={styles.spacer} /> 

                {/* Botões de Ação */}
                <TouchableOpacity 
                    style={[styles.startButton, { backgroundColor: colors.primary }]}
                    onPress={() => setStarted(true)}
                >
                    <Text style={styles.buttonText}>OK, ENTENDI</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => navigation.popToTop()}
                >
                    <Text style={[styles.cancelText, { color: colors.text }]}>Retornar à tela inicial</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
      );
  }

  //TELA 2: EXIBIÇÃO DAS QUESTÕES
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleQuit} style={styles.closeButton}>
             <MaterialIcons name="close" size={30} color={colors.text} />
          </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={[styles.title, { color: colors.primary }]}>{activity.title}</Text>
        <Text style={[styles.progress, { color: colors.placeholder }]}>
            Questão {currentQuestionIndex + 1} de {questionsList.length}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.questionText, { color: colors.text }]}>
              {currentQuestion.question}
          </Text>
          
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
  
  headerBar: {
      paddingHorizontal: SPACING.medium,
      paddingVertical: 10,
      marginTop: 25, 
      alignItems: 'flex-end', 
  },
  closeButton: {
      padding: 5,
  },

  container: { padding: SPACING.large, flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Estilos da Intro
  introScroll: { 
      flexGrow: 1, 
      padding: SPACING.large, 
      alignItems: 'center',
      justifyContent: 'center' 
  },
  introHeader: { alignItems: 'center', marginBottom: SPACING.large },
  introTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  introSubject: { fontSize: 18, opacity: 0.8 },
  
  infoCard: { 
      width: '100%', padding: SPACING.medium, borderRadius: 12, 
      marginBottom: SPACING.large, elevation: 3 
  },
  infoLabel: { fontSize: 12, marginBottom: 2 },
  infoText: { fontSize: 16, marginBottom: 15 },
  rowInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  infoBlock: { alignItems: 'center' },

  guidanceBox: { 
      flexDirection: 'row', backgroundColor: '#FFF9C4', padding: SPACING.medium, 
      borderRadius: 8, alignItems: 'center', width: '100%', marginBottom: 20
  },
  guidanceText: { marginLeft: 10, flex: 1, color: '#5D4037', fontSize: 14 },

  spacer: { height: 30 },

  startButton: { 
      width: '100%', padding: 18, borderRadius: 10, 
      alignItems: 'center', marginBottom: 15 
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  cancelButton: { padding: 10 },
  cancelText: { fontSize: 16, textDecorationLine: 'underline' },

  // Estilos das Questões
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: SPACING.small },
  progress: { fontSize: 14, marginBottom: SPACING.large },
  card: { 
      padding: SPACING.medium, borderRadius: SPACING.medium, 
      elevation: 2, marginBottom: SPACING.large
  },
  questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: SPACING.large },
  optionButton: { 
    flexDirection: 'row', padding: SPACING.medium, borderWidth: 1, 
    borderRadius: SPACING.small, marginBottom: SPACING.small, alignItems: 'center'
  },
  optionLabel: { fontWeight: 'bold', marginRight: 10, fontSize: 16 },
  optionText: { flex: 1, fontSize: 16 },
  nextButton: { 
    padding: SPACING.medium, borderRadius: SPACING.small, 
    alignItems: 'center', marginTop: SPACING.small 
  },
  nextButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default ActivityRunScreen;