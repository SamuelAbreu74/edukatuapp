// Arquivo: frontend/screens/EditActivityScreen.js

import React, { useState } from 'react';
import { 
    View, Text, StyleSheet, TextInput, TouchableOpacity, 
    ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING } from '../styles/theme';
import { updateActivity, deleteActivity } from '../services/activityService';

const OptionRow = ({ letter, value, onChange, isSelected, onSelect, colors, styles }) => {
    return (
        <View style={styles.optionRow}>
            <TouchableOpacity 
                style={[
                    styles.radioBtn, 
                    { 
                        borderColor: isSelected ? '#4CAF50' : colors.inputBorder,
                        backgroundColor: isSelected ? '#4CAF50' : 'transparent'
                    }
                ]}
                onPress={() => onSelect(letter)}
            >
                <Text style={[styles.radioText, { color: isSelected ? '#FFF' : colors.placeholder }]}>{letter}</Text>
            </TouchableOpacity>
            
            <TextInput 
                style={[styles.inputOption, { backgroundColor: colors.inputBackground, color: colors.text }]} 
                placeholder={`Alternativa ${letter}`}
                placeholderTextColor={colors.placeholder} 
                value={value} 
                onChangeText={onChange} 
            />
        </View>
    );
};

const EditActivityScreen = ({ route, navigation }) => {
    const { colors } = useTheme();
    // aqui Recebe os dados da atividade vindos do Dashboard
    const { activityData } = route.params;

    const [loading, setLoading] = useState(false);
    
    // Estados iniciais preenchidos com os dados da atividade
    const [title, setTitle] = useState(activityData.title);
    const [subject, setSubject] = useState(activityData.subject);
    const [description, setDescription] = useState(activityData.description);
    const [difficulty, setDifficulty] = useState(activityData.difficulty);
    
    // Lista de questões (começa com as que vieram do banco)
    const [questionsList, setQuestionsList] = useState(activityData.questions || []);

    // Estados de edit
    // Controla qual questão está sendo editada no momento (índice do array)
    const [editingIndex, setEditingIndex] = useState(null); 

    // Inputs temporários para edição da questão
    const [qText, setQText] = useState('');
    const [optA, setOptA] = useState('');
    const [optB, setOptB] = useState('');
    const [optC, setOptC] = useState('');
    const [optD, setOptD] = useState('');
    const [correct, setCorrect] = useState('');

    // Carrega uma questão nos inputs para editar
    const handleLoadQuestion = (index) => {
        const q = questionsList[index];
        setEditingIndex(index);
        setQText(q.question);
        setOptA(q.option_a);
        setOptB(q.option_b);
        setOptC(q.option_c);
        setOptD(q.option_d);
        setCorrect(q.correct_answer);
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            question: '',
            option_a: '',
            option_b: '',
            option_c: '',
            option_d: '',
            option_e: 'N/A',
            correct_answer: '',
            explanation: '',
            scores: 10
        };

        const updatedList = [...questionsList, newQuestion];
        setQuestionsList(updatedList);

        setEditingIndex(updatedList.length - 1);
        setQText('');
        setOptA('');
        setOptB('');
        setOptC('');
        setOptD('');
        setCorrect('');
    };

    // Salva as alterações da questão NA LISTA (memória)
    const handleUpdateQuestionInList = () => {
        if (editingIndex === null) return;

        if (!correct) {
            Alert.alert("Atenção", "Selecione qual é a alternativa correta.");
            return;
        }
        
        const updatedList = [...questionsList];
        // Mantém o ID original da questão (IMPORTANTE PRO BACKEND SABER QUAL ATUALIZAR)
        updatedList[editingIndex] = {
            ...updatedList[editingIndex], 
            question: qText,
            option_a: optA,
            option_b: optB,
            option_c: optC,
            option_d: optD,
            correct_answer: correct
        };

        setQuestionsList(updatedList);
        setEditingIndex(null);
    };

    // comunicação com o back

    const handleSaveChanges = async () => {
        if (!title || !subject) {
            Alert.alert("Erro", "Título e Matéria são obrigatórios.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...activityData, // Mantém IDs e teacher_id originais por agora
                title,
                subject,
                description,
                difficulty,
                questions: questionsList
            };

            await updateActivity(payload);
            Alert.alert("Sucesso", "Atividade atualizada com sucesso!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert("Erro", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteActivity = () => {
        Alert.alert(
            "Excluir Atividade",
            "Tem certeza? Essa ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive", 
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await deleteActivity(activityData.id, activityData.teacher_id);
                            Alert.alert("Sucesso", "Atividade excluída.");
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert("Erro", error.message);
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const DifficultyBtn = ({ label, value }) => {
        const isSelected = difficulty === value;
        let bgColor = colors.inputBackground;
        let textColor = colors.placeholder;

        if (isSelected) {
            if (value === 'FACIL') { bgColor = '#4CAF50'; textColor = '#FFF'; }
            if (value === 'MEDIO') { bgColor = '#FFC107'; textColor = '#FFF'; }
            if (value === 'DIFICIL') { bgColor = '#F44336'; textColor = '#FFF'; }
        }

        return (
            <TouchableOpacity 
                style={[styles.diffBtn, { backgroundColor: bgColor, borderColor: isSelected ? 'transparent' : colors.inputBorder }]}
                onPress={() => setDifficulty(value)}
            >
                <Text style={[styles.diffText, { color: textColor, fontWeight: isSelected ? 'bold' : 'normal' }]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
                
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Editar Atividade</Text>
                    <View style={{ width: 28 }} /> 
                </View>

                <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.sectionLabel, { color: colors.primary }]}>Informações Básicas</Text>

                    <Text style={[styles.label, { color: colors.text }]}>Título</Text>
                    <TextInput 
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]} 
                        value={title} 
                        onChangeText={setTitle} 
                        placeholder="Ex: Título da atividade"
                        placeholderTextColor={colors.placeholder}
                    />
                    
                    <Text style={[styles.label, { color: colors.text }]}>Matéria</Text>
                    <TextInput 
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]} 
                        value={subject} 
                        onChangeText={setSubject} 
                        placeholder="Ex: Matéria"
                        placeholderTextColor={colors.placeholder}
                    />

                    <Text style={[styles.label, { color: colors.text }]}>Descrição</Text>
                    <TextInput 
                        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]} 
                        value={description} 
                        onChangeText={setDescription} 
                        placeholder="Descrição..."
                        placeholderTextColor={colors.placeholder}
                    />

                    <Text style={[styles.label, { color: colors.text }]}>Dificuldade</Text>
                    <View style={styles.diffContainer}>
                        <DifficultyBtn label="Fácil" value="FACIL" />
                        <DifficultyBtn label="Médio" value="MEDIO" />
                        <DifficultyBtn label="Difícil" value="DIFICIL" />
                    </View>
                </View>

                <View style={styles.listHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Questões ({questionsList.length})</Text>
                    <Text style={{ color: colors.placeholder, fontSize: 12 }}>Toque para editar</Text>
                </View>

                {questionsList.map((q, index) => {
                    const isEditing = editingIndex === index;
                    return (
                        <View key={q.id || index}>
                            <TouchableOpacity 
                                style={[
                                    styles.questionItem, 
                                    { 
                                        backgroundColor: colors.cardBackground, 
                                        borderColor: isEditing ? colors.primary : 'transparent', 
                                        borderWidth: isEditing ? 2 : 0,
                                        elevation: isEditing ? 0 : 2
                                    }
                                ]}
                                onPress={() => handleLoadQuestion(index)}
                            >
                                <View style={styles.qHeader}>
                                    <View style={[styles.qBadge, { backgroundColor: colors.inputBackground }]}>
                                        <Text style={{ color: colors.text, fontWeight: 'bold' }}>#{index + 1}</Text>
                                    </View>
                                    <MaterialIcons name="edit" size={20} color={colors.placeholder} />
                                </View>
                                <Text style={[styles.qPreview, { color: colors.text }]}>
                                    {q.question ? q.question.substring(0, 40) : "Questão sem texto"}...
                                </Text>
                            </TouchableOpacity>

                            {isEditing && (
                                <View style={[styles.editorPanel, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
                                    <Text style={[styles.label, { color: colors.text, marginTop: 0 }]}>Enunciado</Text>
                                    <TextInput 
                                        style={[styles.input, { height: 80, textAlignVertical: 'top', backgroundColor: colors.inputBackground, color: colors.text }]} 
                                        multiline value={qText} onChangeText={setQText} 
                                    />

                                    <Text style={[styles.label, { color: colors.text, marginBottom: 10 }]}>Alternativas (Toque na letra para marcar a correta)</Text>
                                    
                                    <OptionRow 
                                        letter="A" value={optA} onChange={setOptA} 
                                        isSelected={correct === 'A'} onSelect={setCorrect} 
                                        colors={colors} styles={styles}
                                    />
                                    <OptionRow 
                                        letter="B" value={optB} onChange={setOptB} 
                                        isSelected={correct === 'B'} onSelect={setCorrect} 
                                        colors={colors} styles={styles}
                                    />
                                    <OptionRow 
                                        letter="C" value={optC} onChange={setOptC} 
                                        isSelected={correct === 'C'} onSelect={setCorrect} 
                                        colors={colors} styles={styles}
                                    />
                                    <OptionRow 
                                        letter="D" value={optD} onChange={setOptD} 
                                        isSelected={correct === 'D'} onSelect={setCorrect} 
                                        colors={colors} styles={styles}
                                    />

                                    <TouchableOpacity 
                                        style={[styles.btnConfirm, { backgroundColor: colors.secondary }]} 
                                        onPress={handleUpdateQuestionInList}
                                    >
                                        <MaterialIcons name="check" size={20} color="#FFF" style={{ marginRight: 5 }} />
                                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Confirmar Edição</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}

                <TouchableOpacity 
                    style={[styles.btnAddQuestion, { borderColor: colors.primary }]}
                    onPress={handleAddQuestion}
                >
                    <MaterialIcons name="add-circle-outline" size={24} color={colors.primary} style={{ marginRight: 8 }} />
                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}>ADICIONAR NOVA QUESTÃO</Text>
                </TouchableOpacity>

                <View style={styles.footerButtons}>
                    <TouchableOpacity 
                        style={[styles.mainBtn, { backgroundColor: colors.primary }]} 
                        onPress={handleSaveChanges}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : (
                            <>
                                <MaterialIcons name="save" size={24} color="#FFF" style={{ marginRight: 10 }} />
                                <Text style={styles.btnText}>SALVAR ALTERAÇÕES</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.deleteBtn]} 
                        onPress={handleDeleteActivity}
                        disabled={loading}
                    >
                        <MaterialIcons name="delete-forever" size={24} color="#FF4D4D" style={{ marginRight: 5 }} />
                        <Text style={[styles.btnText, { color: '#FF4D4D' }]}>EXCLUIR ATIVIDADE</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, flexGrow: 1, paddingBottom: 50 },
    
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },

    card: { 
        padding: 15, borderRadius: 16, marginBottom: 20,
        elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }
    },
    sectionLabel: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 15, opacity: 0.8 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginLeft: 2 },
    input: { borderRadius: 12, padding: 12, marginBottom: 15, fontSize: 16 },

    diffContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    diffBtn: { flex: 1, paddingVertical: 12, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
    diffText: { fontSize: 14 },

    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },

    questionItem: { 
        padding: 15, borderRadius: 12, marginBottom: 10, 
        justifyContent: 'center'
    },
    qHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    qBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    qPreview: { fontSize: 15, lineHeight: 22 },

    editorPanel: { 
        padding: 15, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, 
        marginTop: -12, marginBottom: 20, borderTopWidth: 0, borderWidth: 1
    },
    
    optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    radioBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    radioText: { fontWeight: 'bold', fontSize: 16 },
    inputOption: { flex: 1, borderRadius: 8, padding: 10 },

    btnConfirm: { flexDirection: 'row', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
    
    btnAddQuestion: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 10
    },

    footerButtons: { marginTop: 30, gap: 15 },
    mainBtn: { flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 4 },
    deleteBtn: { flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FF4D4D', borderStyle: 'dashed' },
    btnText: { fontWeight: 'bold', fontSize: 16 }
});

export default EditActivityScreen;