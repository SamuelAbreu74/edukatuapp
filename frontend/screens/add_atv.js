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
import { COLORS, SPACING } from '../styles/theme';
import { API_URL } from '../config/api'; 

const CreateActivityScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState('MEDIO'); 

    // Adicionado campo de descrição (Opcional no front, mas bom ter)
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

        // Mapeia o índice (0, 1, 2, 3) para a letra (A, B, C, D) se necessário
       
        
        const activityPayload = {
            title: title,
            description: description || "Atividade criada pelo App", // Campo obrigatório
            subject: subject,
            grade: "Série Padrão", // Campo que estava faltando
            coins_reward: 10,
            time: 30, // Campo obrigatório (tempo em minutos)
            difficulty: difficulty,
            active: true,
            questions: [
                {
                    question: question,
                    option_a: optionA,
                    option_b: optionB,
                    option_c: optionC,
                    option_d: optionD,
                    option_e: "N/A", // Backend pede opção E? 
                    correct_answer: correctOption, // Ex: "Alternativa A"
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
            
            // --- ROTA CORRIGIDA PARA /atividades ---
            const response = await fetch(`${API_URL}/atividades`, { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(activityPayload),
            });

            const textResponse = await response.text(); // Lê como texto para evitar erro de JSON
            
            if (response.ok) {
                Alert.alert('Sucesso', 'Atividade criada com sucesso!');
                navigation.goBack(); 
            } else {
                // Tenta converter o erro para JSON, se não der, mostra o texto
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
                difficulty === value && styles.diffButtonSelected,
                value === 'FACIL' && difficulty === value && { backgroundColor: '#4CAF50' },
                value === 'MEDIO' && difficulty === value && { backgroundColor: '#FFC107' },
                value === 'DIFICIL' && difficulty === value && { backgroundColor: '#F44336' },
            ]}
            onPress={() => setDifficulty(value)}
        >
            <Text style={[
                styles.diffText, 
                difficulty === value && styles.diffTextSelected
            ]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerTitle}>Nova Atividade</Text>
            
            <View style={styles.section}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Equações de 1º Grau"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Breve descrição..."
                    value={description}
                    onChangeText={setDescription}
                />

                <Text style={styles.label}>Matéria</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Matemática"
                    value={subject}
                    onChangeText={setSubject}
                />

                <Text style={styles.label}>Dificuldade</Text>
                <View style={styles.row}>
                    <DifficultyButton label="Fácil" value="FACIL" />
                    <DifficultyButton label="Médio" value="MEDIO" />
                    <DifficultyButton label="Difícil" value="DIFICIL" />
                </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Questão</Text>
            
            <Text style={styles.label}>Enunciado:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite a pergunta aqui..."
                multiline
                numberOfLines={3}
                value={question}
                onChangeText={setQuestion}
            />

            <Text style={styles.label}>Alternativas (Toque na letra correta):</Text>
            
            {/* Opção A */}
            <View style={styles.optionContainer}>
                <TouchableOpacity 
                    style={[styles.radioCircle, correctOption === optionA && styles.selectedRadio]} 
                    onPress={() => setCorrectOption(optionA)} // Salva o TEXTO da opção como correta
                >
                    <Text style={styles.radioText}>A</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.inputOption}
                    placeholder="Resposta A"
                    value={optionA}
                    onChangeText={setOptionA}
                />
            </View>

            {/* Opção B */}
            <View style={styles.optionContainer}>
                <TouchableOpacity 
                    style={[styles.radioCircle, correctOption === optionB && styles.selectedRadio]} 
                    onPress={() => setCorrectOption(optionB)}
                >
                    <Text style={styles.radioText}>B</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.inputOption}
                    placeholder="Resposta B"
                    value={optionB}
                    onChangeText={setOptionB}
                />
            </View>

            {/* Opção C */}
            <View style={styles.optionContainer}>
                <TouchableOpacity 
                    style={[styles.radioCircle, correctOption === optionC && styles.selectedRadio]} 
                    onPress={() => setCorrectOption(optionC)}
                >
                    <Text style={styles.radioText}>C</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.inputOption}
                    placeholder="Resposta C"
                    value={optionC}
                    onChangeText={setOptionC}
                />
            </View>

            {/* Opção D */}
            <View style={styles.optionContainer}>
                <TouchableOpacity 
                    style={[styles.radioCircle, correctOption === optionD && styles.selectedRadio]} 
                    onPress={() => setCorrectOption(optionD)}
                >
                    <Text style={styles.radioText}>D</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.inputOption}
                    placeholder="Resposta D"
                    value={optionD}
                    onChangeText={setOptionD}
                />
            </View>

            <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleCreateActivity}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.saveButtonText}>CRIAR ATIVIDADE</Text>
                )}
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: SPACING.large,
        backgroundColor: '#F5F5F5',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.large,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.medium,
    },
    section: {
        marginBottom: SPACING.large,
    },
    divider: {
        height: 1,
        backgroundColor: '#DDD',
        marginVertical: SPACING.large,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#FFF',
        borderColor: '#DDD',
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
        borderColor: '#DDD',
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    diffButtonSelected: {
        borderColor: 'transparent',
    },
    diffText: {
        fontSize: 14,
        color: '#666',
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
        backgroundColor: '#FFF',
        borderColor: '#DDD',
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
        borderColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.small,
        backgroundColor: '#FFF',
    },
    selectedRadio: {
        backgroundColor: COLORS.success || '#4CAF50',
        borderColor: COLORS.success || '#4CAF50',
    },
    radioText: {
        fontWeight: 'bold',
        color: '#555',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.large,
        borderRadius: SPACING.small,
        alignItems: 'center',
        marginTop: SPACING.large,
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default CreateActivityScreen;