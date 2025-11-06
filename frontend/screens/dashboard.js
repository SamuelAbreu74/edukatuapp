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
import { COLORS, SPACING } from '../styles/theme';
import { MaterialIcons } from '@expo/vector-icons';


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

    // cor de acordo com a situação de aluno
    const getSubjectColor = (status) => {
        if (status === 'pendente') {
            return COLORS.error; // Vermelho
        }
        if (status === 'alerta') {
            return COLORS.warning; // Amarelo/Laranja
        }
        // O padrão (status 'em_dia') é Verde
        return COLORS.success; 
    };
    // --- FIM DA NOVA FUNÇÃO ---

    const renderRecentActivity = ({ item }) => (
        <TouchableOpacity style={styles.recentActivityCard}>
            <Text style={styles.recentActivityTitle}>{item.title}</Text>
            <Text style={styles.recentActivityProfessor}>{item.professor}</Text>
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
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <View style={styles.header}>
                    <Text style={styles.headerGreeting}>Olá, Welber!</Text>
                    <View style={styles.coinsContainer}>
                        <Text style={styles.coinsAmount}>0</Text>
                        <MaterialIcons name="monetization-on" size={24} color={COLORS.warning} />
                    <TouchableOpacity onPress={() => navigation.navigate('Ajustes')}>
                        <MaterialIcons name="settings" size={24} color={COLORS.textPrimary} style={{ marginLeft: SPACING.medium }} />
                    </TouchableOpacity>
                    
                    </View>
                </View>

                <Text style={styles.sectionTitle}>ATIVIDADES RECENTES</Text>
                <FlatList
                    data={DUMMY_ACTIVITIES}
                    renderItem={renderRecentActivity}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recentActivitiesList}
                />

                <Text style={styles.sectionTitle}>MATÉRIAS</Text>
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
        backgroundColor: COLORS.background,
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
        color: COLORS.primary,
    },
    coinsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinsAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginRight: SPACING.small,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: SPACING.medium,
        marginBottom: SPACING.medium,
        marginLeft: SPACING.small,
    },
    recentActivitiesList: {
        paddingHorizontal: SPACING.small,
    },
    recentActivityCard: {
        backgroundColor: '#F3F3F3',
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
        color: COLORS.textPrimary,
    },
    recentActivityProfessor: {
        fontSize: 12,
        color: COLORS.textSecondary,
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
        color: COLORS.background, 
    },
    subjectProfessor: {
        fontSize: 14,
        color: COLORS.background,
        opacity: 0.8,
    },
    activityCountContainer: {
        alignItems: 'flex-end',
    },
    activityCount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.background,
    },
    activityCountLabel: {
        fontSize: 10,
        color: COLORS.background,
        opacity: 0.7,
    }
});

export default DashboardScreen;