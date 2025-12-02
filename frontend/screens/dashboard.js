// Arquivo: frontend/screens/DashboardScreen.js

import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    ScrollView, 
    TouchableOpacity, 
    FlatList 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING } from '../styles/theme';

// Dados de Exemplo (Hardcoded)
const DUMMY_ACTIVITIES = [
    { id: '1', title: 'Quiz de Português', professor: 'Prof. Du' },
    { id: '2', title: 'Matemática Básica', professor: 'Prof. Pedro' },
    { id: '3', title: 'História do Ceará', professor: 'Prof. David' },
];

// --- MUDANÇA AQUI: DADOS MOCADOS ---
// Trocamos o campo "color" pelo campo "status"
const DUMMY_SUBJECTS = [
    // Status 'em_dia' = Todas as atividades cumpridas
    { id: 'a', name: 'Português', professor: 'Du', count: 5, status: 'em_dia' }, 
    // Status 'alerta' = Atividades perto do prazo
    { id: 'b', name: 'Matemática', professor: 'Pedro', count: 8, status: 'alerta' }, 
    // Status 'pendente' = Tarefas pendentes
    { id: 'c', name: 'História', professor: 'David', count: 3, status: 'pendente' }, 
    // "Ciências" agora também segue a regra (não mais Roxo)
    { id: 'd', name: 'Ciências', professor: 'Luna', count: 4, status: 'em_dia' }, 
];
// --- FIM DA MUDANÇA ---

const DashboardScreen = ({ navigation }) => {
    const { colors, theme } = useTheme();

    // cor de acordo com a situação de aluno
    const getSubjectColor = (status) => {
        const isDark = theme === 'dark';

        if (status === 'pendente') {
            return isDark ? '#B71C1C' : '#F44336'; // Vermelho
        }
        if (status === 'alerta') {
            return isDark ? '#E65100' : '#FF9800'; // Laranja
        }
        // O padrão (status 'em_dia') é Verde
        return isDark ? '#1B5E20' : '#4CAF50'; 
    };
    // --- FIM DA NOVA FUNÇÃO ---

    const renderRecentActivity = ({ item }) => (
        <TouchableOpacity style={[styles.recentActivityCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.recentActivityTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.recentActivityProfessor, { color: colors.placeholder }]}>{item.professor}</Text>
        </TouchableOpacity>
    );

    // --- MUDANÇA AQUI: RENDERIZAÇÃO DAS MATÉRIAS ---
    // O 'backgroundColor' agora chama a função getSubjectColor
    const renderSubject = ({ item }) => (
        <TouchableOpacity 
            style={[styles.subjectCard, { backgroundColor: getSubjectColor(item.status) }]}
        >
            <View>
                <Text style={styles.subjectName}>{item.name}</Text>
                <Text style={styles.subjectProfessor}>Prof. {item.professor}</Text>
            </View>
            <View style={styles.activityCountContainer}>
                <Text style={styles.activityCount}>{item.count}</Text>
                <Text style={styles.activityCountLabel}>ATIVIDADES</Text>
            </View>
        </TouchableOpacity>
    );
    // --- FIM DA MUDANÇA ---

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <View style={styles.header}>
                    <Text style={[styles.headerGreeting, { color: colors.primary }]}>Olá, Welber!</Text>
                    <View style={styles.coinsContainer}>
                        <Text style={[styles.coinsAmount, { color: colors.secondary }]}>0</Text>
                        <MaterialIcons name="monetization-on" size={24} color={colors.secondary} />
                    <TouchableOpacity onPress={() => navigation.navigate('Ajustes')}>
                        <MaterialIcons name="settings" size={24} color={colors.text} style={{ marginLeft: SPACING.medium }} />
                    </TouchableOpacity>
                    
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>ATIVIDADES RECENTES</Text>
                <FlatList
                    data={DUMMY_ACTIVITIES}
                    renderItem={renderRecentActivity}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recentActivitiesList}
                />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>MATÉRIAS</Text>
                <FlatList
                    data={DUMMY_SUBJECTS}
                    renderItem={renderSubject}
                    keyExtractor={item => item.id}
                    scrollEnabled={false} 
                    contentContainerStyle={styles.subjectsList}
                />

            </ScrollView>
        </SafeAreaView>
    );
};

// --- Estilos do Dashboard (Sem alteração) ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContainer: {
        padding: SPACING.medium,
        paddingTop: SPACING.xLarge,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.large,
    },
    headerGreeting: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    coinsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinsAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: SPACING.small,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: SPACING.medium,
        marginBottom: SPACING.medium,
        marginLeft: SPACING.small,
    },
    recentActivitiesList: {
        paddingHorizontal: SPACING.small,
    },
    recentActivityCard: {
        padding: SPACING.medium,
        borderRadius: SPACING.small,
        width: 150,
        height: 100,
        marginRight: SPACING.medium,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    recentActivityTitle: {
        fontWeight: '600',
    },
    recentActivityProfessor: {
        fontSize: 12,
    },
    subjectsList: {
        marginTop: SPACING.small,
    },
    subjectCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.large,
        borderRadius: SPACING.medium,
        marginBottom: SPACING.medium,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
    },
    subjectName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF', 
    },
    subjectProfessor: {
        fontSize: 14,
        color: '#FFFFFF', 
        opacity: 0.8,
    },
    activityCountContainer: {
        alignItems: 'flex-end',
    },
    activityCount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF', 
    },
    activityCountLabel: {
        fontSize: 10,
        color: '#FFFFFF', 
        opacity: 0.7,
    }
});

export default DashboardScreen;