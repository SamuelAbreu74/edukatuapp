// Arquivo: frontend/screens/DashboardScreen.js

import React, { useState, useEffect, useMemo } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    ScrollView, 
    TouchableOpacity, 
    FlatList,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING } from '../styles/theme';
import { API_URL } from '../config/api';

const DashboardScreen = ({ navigation }) => {
    const { colors, theme } = useTheme();
    
    const [activitiesList, setActivitiesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Usuário');
    const [userType, setUserType] = useState('ALUNO'); 

    const subjectsList = useMemo(() => {
        const grouped = {};
        
        activitiesList.forEach(act => {
            const mat = act.subject || 'Geral';
            if (!grouped[mat]) {
                grouped[mat] = { 
                    id: mat, 
                    name: mat, 
                    professor: userName, 
                    count: 0, 
                    status: 'em_dia' 
                };
            }
            grouped[mat].count += 1;
        });

        return Object.values(grouped);
    }, [activitiesList, userName]);

    // Função para determinar a cor do card da matéria baseado no status
    const getSubjectColor = (status) => {
        const isDark = theme === 'dark';
        if (status === 'pendente') return isDark ? '#B71C1C' : '#F44336';
        if (status === 'alerta') return isDark ? '#E65100' : '#FF9800';
        return isDark ? '#1B5E20' : '#4CAF50'; 
    };

    // Busca os dados iniciais e as atividades conforme o tipo de usuário
    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawToken = await AsyncStorage.getItem('userToken');
                if (!rawToken) return;

                let token = rawToken;
                let type = 'ALUNO';

                // Tenta parsear o token e extrair dados do usuário se disponíveis
                try {
                    const parsed = JSON.parse(rawToken);
                    token = parsed.token || parsed; 
                    
                    // Identifica nome e tipo para personalizar a UI
                    if (parsed.name) setUserName(parsed.name);
                    else if (parsed.user?.name) setUserName(parsed.user.name);

                    // Verifica o tipo salvo ou tenta decodificar
                    const savedType = parsed.type || parsed.user?.type;
                    if (savedType) {
                        type = savedType.toUpperCase();
                        setUserType(type);
                    }
                } catch (e) {
                    console.log("Erro ao ler dados locais, seguindo com padrão.");
                }

                // Define a rota baseada no tipo de usuário (de acordo com o backend)
                // Aluno vê todas (/atividades), Professor vê as dele (/minhas-atividades)
                const endpoint = type === 'PROFESSOR' ? '/minhas-atividades' : '/atividades';
                
                console.log(`Buscando atividades em: ${endpoint} para usuário ${type}`);

                const response = await fetch(`${API_URL}${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();

                if (response.ok) {
                    // O backend retorna chaves diferentes dependendo da rota
                    // /atividades -> data.activities
                    // /minhas-atividades -> data.activities_by_id
                    const lista = data.activities || data.activities_by_id || [];
                    setActivitiesList(lista);
                } else {
                    console.log("Aviso do backend:", data.message);
                }

            } catch (error) {
                console.error("Erro na requisição do dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        // Recarrega sempre que a tela ganha foco (útil ao voltar da criação de atividade)
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation]);

    const renderActivityItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.recentActivityCard, { backgroundColor: colors.cardBackground }]}
            onPress={() => {
                // Futura edit: Se for professor, navega para edição. Se for aluno, para responder.
                if (userType === 'PROFESSOR') {
                    navigation.navigate('EditActivity', { activityData: item });
                } else {
                    console.log("Responder atividade:", item.id);
                }
            }}
        >
            <Text 
                style={[styles.recentActivityTitle, { color: colors.text }]} 
                numberOfLines={2}
            >
                {item.title}
            </Text>
            <Text style={[styles.recentActivityProfessor, { color: colors.placeholder }]}>
                {/* Se for aluno, seria legal mostrar o nome do prof, mas por enquanto deixa de matéria */}
                {item.subject}
            </Text>
        </TouchableOpacity>
    );

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

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <View style={styles.header}>
                    <Text style={[styles.headerGreeting, { color: colors.primary }]}>Olá, {userName}!</Text>
                    <View style={styles.coinsContainer}>
                        <Text style={[styles.coinsAmount, { color: colors.secondary }]}>0</Text>
                        <MaterialIcons name="monetization-on" size={24} color={colors.secondary} />
                        <TouchableOpacity onPress={() => navigation.navigate('Ajustes')}>
                            <MaterialIcons name="settings" size={24} color={colors.text} style={{ marginLeft: SPACING.medium }} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {userType === 'PROFESSOR' ? 'SUAS ATIVIDADES' : 'ATIVIDADES RECENTES'}
                </Text>
                
                {loading ? (
                    <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={activitiesList}
                        renderItem={renderActivityItem}
                        keyExtractor={item => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.recentActivitiesList}
                        ListEmptyComponent={
                            <Text style={{ color: colors.placeholder, marginLeft: 10, fontStyle: 'italic' }}>
                                {userType === 'PROFESSOR' 
                                    ? 'Você ainda não criou atividades.' 
                                    : 'Nenhuma atividade disponível no momento.'}
                            </Text>
                        }
                    />
                )}

                <Text style={[styles.sectionTitle, { color: colors.text }]}>MATÉRIAS</Text>
                <FlatList
                    data={subjectsList}
                    renderItem={renderSubject}
                    keyExtractor={item => item.id}
                    scrollEnabled={false} 
                    contentContainerStyle={styles.subjectsList}
                    ListEmptyComponent={
                        <Text style={{ color: colors.placeholder, marginLeft: 10 }}>
                            Nenhuma matéria cadastrada.
                        </Text>
                    }
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
        minHeight: 120, // Garante altura mínima pra nao ficar feio
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
        fontSize: 14,
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