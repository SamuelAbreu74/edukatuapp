// Arquivo: frontend/screens/add_atv.js

import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    Alert,
    ActivityIndicator
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SPACING } from '../styles/theme';
import { API_URL } from '../config/api'; 

const CreateActivityScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState('MEDIO'); 

    const [description, setDescription] = useState('');

    const [question, setQuestion] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    
   
    const [correctOption, setCorrectOption] = useState(null);
    
    const [loading, setLoading] = useState(false);

    const handleCreateActivity = async () => {
        if (!title || !subject || !question || !optionA || !optionB || !correctOption) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);

        const activityPayload = {
            title: title,
            description: description || "Atividade criada pelo App", 
            subject: subject,
            grade: "Série Padrão", 
            coins_reward: 10,
            time: 30, 
            difficulty: difficulty,
            active: true,
            questions: [
                {
                    question: question,
                    option_a: optionA,
                    option_b: optionB,
                    option_c: optionC,
                    option_d: optionD,
                    option_e: "N/A", 
                    correct_answer: correctOption, 
                    explanation: "Sem explicação",
                    scores: 10
                }
            ]
        };

        try {
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                Alert.alert('Sessão Expirada', 'Faça login novamente.');
                setLoading(false);
                return;
            }

            console.log("Enviando para:", `${API_URL}/atividades`);
            console.log("Payload:", JSON.stringify(activityPayload, null, 2));
            
            const response = await fetch(`${API_URL}/atividades`, { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(activityPayload),
            });

            const textResponse = await response.text(); 
            
            if (response.ok) {
                Alert.alert('Sucesso', 'Atividade criada com sucesso!');
                navigation.goBack(); 
            } else {
                try {
                    const data = JSON.parse(textResponse);
                    Alert.alert('Erro', data.message || 'Não foi possível criar.');
                } catch (e) {
                    console.log("Erro bruto:", textResponse);
                    Alert.alert('Erro no Servidor', 'Verifique o console para detalhes.');
                }
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha na conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    const DifficultyButton = ({ label, value }) => (
        <TouchableOpacity 
            style={[
                styles.diffButton, 
                { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground },
                difficulty === value && styles.diffButtonSelected,
                value === 'FACIL' && difficulty === value && { backgroundColor: '#4CAF50' },
                value === 'MEDIO' && difficulty === value && { backgroundColor: '#FFC107' },
                value === 'DIFICIL' && difficulty === value && { backgroundColor: '#F44336' },
            ]}
            onPress={() => setDifficulty(value)}
        >
            <Text style={[
                styles.diffText, 
                { color: colors.text },
                difficulty === value && styles.diffTextSelected
            ]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>Nova Atividade</Text>
            
            <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Título</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                    placeholder="Ex: Equações de 1º Grau"
                    placeholderTextColor={colors.placeholder}
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={[styles.label, { color: colors.text }]}>Descrição</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                    placeholder="Breve descrição..."
                    placeholderTextColor={colors.placeholder}
                    value={description}
                    onChangeText={setDescription}
                />

                <Text style={[styles.label, { color: colors.text }]}>Matéria</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                    placeholder="Ex: Matemática"
                    placeholderTextColor={colors.placeholder}
                    value={subject}
                    onChangeText={setSubject}
                />

                <Text style={[styles.label, { color: colors.text }]}>Dificuldade</Text>
                <View style={styles.row}>
                    <DifficultyButton label="Fácil" value="FACIL" />
                    <DifficultyButton label="Médio" value="MEDIO" />
                    <DifficultyButton label="Difícil" value="DIFICIL" />
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.inputBorder }]} />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Questão</Text>
            
            <Text style={[styles.label, { color: colors.text }]}>Enunciado:</Text>
            <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                placeholder="Digite a pergunta aqui..."
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={3}
                value={question}
                onChangeText={setQuestion}
            />

            <Text style={[styles.label, { color: colors.text }]}>Alternativas (Toque na letra correta):</Text>
            
            <View style={styles.optionContainer}>
                <TouchableOpacity 
                    style={[
                        styles.radioCircle, 
                        { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground },
                        correctOption === optionA && optionA !== '' && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                    ]} 
                    onPress={() => setCorrectOption(optionA)} 
                >
                    <Text style={[styles.radioText, { color: colors.text }]}>A</Text>
                </TouchableOpacity>
                <TextInput
                    style={[styles.inputOption, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                    placeholder="Resposta A"
                    placeholderTextColor={colors.placeholder}
                    value={optionA}
                    onChangeText={setOptionA}
                />
            </View>

            <View style={styles.optionContainer}>
                <TouchableOpacity 
                    style={[
                        styles.radioCircle, 
                        { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground },
                        correctOption === optionB && optionB !== '' && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                    ]} 
                    onPress={() => setCorrectOption(optionB)}
                >
                    <Text style={[styles.radioText, { color: colors.text }]}>B</Text>
                </TouchableOpacity>
                <TextInput
                    style={[styles.inputOption, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                    placeholder="Resposta B"
                    placeholderTextColor={colors.placeholder}
                    value={optionB}
                    onChangeText={setOptionB}
                />
            </View>

            <View style={styles.optionContainer}>
                <TouchableOpacity 
                    style={[
                        styles.radioCircle, 
                        { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground },
                        correctOption === optionC && optionC !== '' && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                    ]} 
                    onPress={() => setCorrectOption(optionC)}
                >
                    <Text style={[styles.radioText, { color: colors.text }]}>C</Text>
                </TouchableOpacity>
                <TextInput
                    style={[styles.inputOption, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                    placeholder="Resposta C"
                    placeholderTextColor={colors.placeholder}
                    value={optionC}
                    onChangeText={setOptionC}
                />
            </View>

            <View style={styles.optionContainer}>
                <TouchableOpacity 
                    style={[
                        styles.radioCircle, 
                        { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground },
                        correctOption === optionD && optionD !== '' && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                    ]} 
                    onPress={() => setCorrectOption(optionD)}
                >
                    <Text style={[styles.radioText, { color: colors.text }]}>D</Text>
                </TouchableOpacity>
                <TextInput
                    style={[styles.inputOption, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                    placeholder="Resposta D"
                    placeholderTextColor={colors.placeholder}
                    value={optionD}
                    onChangeText={setOptionD}
                />
            </View>

            <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]} 
                onPress={handleCreateActivity}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={colors.buttonText} />
                ) : (
                    <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>CRIAR ATIVIDADE</Text>
                )}
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: SPACING.large,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: SPACING.large,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: SPACING.medium,
    },
    section: {
        marginBottom: SPACING.large,
    },
    divider: {
        height: 1,
        marginVertical: SPACING.large,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderRadius: SPACING.small,
        padding: SPACING.medium,
        fontSize: 16,
        marginBottom: SPACING.medium,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.medium,
    },
    diffButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    diffButtonSelected: {
        borderColor: 'transparent',
    },
    diffText: {
        fontSize: 14,
    },
    diffTextSelected: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.small,
    },
    inputOption: {
        flex: 1,
        borderWidth: 1,
        borderRadius: SPACING.small,
        padding: SPACING.medium,
        height: 50,
    },
    radioCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.small,
    },
    selectedRadio: {
        
    },
    radioText: {
        fontWeight: 'bold',
    },
    saveButton: {
        padding: SPACING.large,
        borderRadius: SPACING.small,
        alignItems: 'center',
        marginTop: SPACING.large,
        marginBottom: 40,
    },
    saveButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default CreateActivityScreen;