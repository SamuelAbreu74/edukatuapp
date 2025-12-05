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

    // Adicionado campo de descrição (Opcional no front, mas bom ter)
    const [description, setDescription] = useState('');

    const [questionsList, setQuestionsList] = useState([]);

    const [question, setQuestion] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    
    const [correctOption, setCorrectOption] = useState(null);
    
    const [loading, setLoading] = useState(false);

    const isHeaderLocked = questionsList.length > 0;

    const handleAddQuestion = () => {
        if (!question || !optionA || !optionB || !correctOption) {
            Alert.alert('Atenção', 'Preencha o enunciado, pelo menos 2 alternativas e marque a correta.');
            return;
        }

        const newQuestion = {
            question: question,
            option_a: optionA,
            option_b: optionB,
            option_c: optionC,
            option_d: optionD,
            option_e: "N/A", 
            correct_answer: correctOption, 
            explanation: "Sem explicação",
            scores: 10
        };

        setQuestionsList([...questionsList, newQuestion]);

        setQuestion('');
        setOptionA('');
        setOptionB('');
        setOptionC('');
        setOptionD('');
        setCorrectOption(null);

        Alert.alert('Sucesso', 'Questão adicionada à lista! Adicione mais ou clique em Finalizar.');
    };

    const handleCreateActivity = async () => {
        if (!title || !subject) {
            Alert.alert('Atenção', 'Preencha o Título e a Matéria da atividade.');
            return;
        }

        if (questionsList.length === 0) {
            Alert.alert('Atenção', 'Adicione pelo menos uma questão clicando em "Adicionar Questão".');
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
            questions: questionsList 
        };

        try {
            const rawToken = await AsyncStorage.getItem('userToken');
            let token = rawToken;

            if (rawToken) {
                try {
                    const parsed = JSON.parse(rawToken);
                    token = parsed.AccessToken || parsed; 
                } catch (e) {
                }
            }

            if (!token) {
                Alert.alert('Sessão Expirada', 'Faça login novamente.');
                setLoading(false);
                return;
            }

            console.log("Enviando para:", `${API_URL}/atividades`);
            
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
                setTitle('');
                setSubject('');
                setDescription('');
                setDifficulty('MEDIO');
                setQuestionsList([]);
                setQuestion('');
                setOptionA('');
                setOptionB('');
                setOptionC('');
                setOptionD('');
                setCorrectOption(null);

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
                { borderColor: colors.inputBorder, backgroundColor: isHeaderLocked ? '#E0E0E0' : colors.inputBackground },
                difficulty === value && styles.diffButtonSelected,
                value === 'FACIL' && difficulty === value && { backgroundColor: isHeaderLocked ? '#81C784' : '#4CAF50' },
                value === 'MEDIO' && difficulty === value && { backgroundColor: isHeaderLocked ? '#FFD54F' : '#FFC107' },
                value === 'DIFICIL' && difficulty === value && { backgroundColor: isHeaderLocked ? '#E57373' : '#F44336' },
            ]}
            onPress={() => !isHeaderLocked && setDifficulty(value)}
            disabled={isHeaderLocked}
        >
            <Text style={[
                styles.diffText, 
                { color: isHeaderLocked ? '#888' : colors.text },
                difficulty === value && styles.diffTextSelected
            ]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>Nova Atividade</Text>
            
            <View style={[styles.section, isHeaderLocked && { opacity: 0.6 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Título {isHeaderLocked && '(Já preenchido)'}</Text>
                <TextInput
                    style={[
                        styles.input, 
                        { 
                            backgroundColor: isHeaderLocked ? '#333' : colors.inputBackground, 
                            borderColor: colors.inputBorder, 
                            color: isHeaderLocked ? '#AAA' : colors.text 
                        }
                    ]}
                    placeholder="Ex: Equações de 1º Grau"
                    placeholderTextColor={colors.placeholder}
                    value={title}
                    onChangeText={setTitle}
                    editable={!isHeaderLocked}
                />

                <Text style={[styles.label, { color: colors.text }]}>Descrição</Text>
                <TextInput
                    style={[
                        styles.input, 
                        { 
                            backgroundColor: isHeaderLocked ? '#333' : colors.inputBackground, 
                            borderColor: colors.inputBorder, 
                            color: isHeaderLocked ? '#AAA' : colors.text 
                        }
                    ]}
                    placeholder="Breve descrição..."
                    placeholderTextColor={colors.placeholder}
                    value={description}
                    onChangeText={setDescription}
                    editable={!isHeaderLocked}
                />

                <Text style={[styles.label, { color: colors.text }]}>Matéria</Text>
                <TextInput
                    style={[
                        styles.input, 
                        { 
                            backgroundColor: isHeaderLocked ? '#333' : colors.inputBackground, 
                            borderColor: colors.inputBorder, 
                            color: isHeaderLocked ? '#AAA' : colors.text 
                        }
                    ]}
                    placeholder="Ex: Matemática"
                    placeholderTextColor={colors.placeholder}
                    value={subject}
                    onChangeText={setSubject}
                    editable={!isHeaderLocked}
                />

                <Text style={[styles.label, { color: colors.text }]}>Dificuldade</Text>
                <View style={styles.row}>
                    <DifficultyButton label="Fácil" value="FACIL" />
                    <DifficultyButton label="Médio" value="MEDIO" />
                    <DifficultyButton label="Difícil" value="DIFICIL" />
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.inputBorder }]} />

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Nova Questão</Text>
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{questionsList.length} Salva(s)</Text>
            </View>
            
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
                        correctOption === 'A' && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                    ]} 
                    onPress={() => setCorrectOption('A')} 
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
                        correctOption === 'B' && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                    ]} 
                    onPress={() => setCorrectOption('B')}
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
                        correctOption === 'C' && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                    ]} 
                    onPress={() => setCorrectOption('C')}
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
                        correctOption === 'D' && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                    ]} 
                    onPress={() => setCorrectOption('D')}
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
                style={[styles.saveButton, { backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.primary, marginTop: 10, marginBottom: 10 }]} 
                onPress={handleAddQuestion}
            >
                <Text style={[styles.saveButtonText, { color: colors.primary, fontSize: 16 }]}>+ ADICIONAR QUESTÃO</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]} 
                onPress={handleCreateActivity}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={colors.buttonText} />
                ) : (
                    <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>FINALIZAR E CRIAR</Text>
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
        marginBottom: 20,
    },
    saveButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default CreateActivityScreen;