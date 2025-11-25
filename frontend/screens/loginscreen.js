//Tela de Login

//adicionado alguns comentários sei lá

import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    SafeAreaView,
    Image,
    // Componentes adicionados para o teclado
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { COLORS, SPACING } from '../styles/theme'; 
import LogoImage from '../../assets/bemvindomascote.png'; // Logo da tela de login aqui viusss

import { API_URL } from '../config/api';

const LoginScreen = ({ navigation }) => {
  const [userType, setUserType] = useState('student'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Atenção', 'Por favor, preencha e-mail e senha.');
        return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
        console.log(`Tentando logar em: ${API_URL}/login`);

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                type: userType === 'student' ? 'ALUNO' : 'PROFESSOR'
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login realizado:', data);

            await AsyncStorage.setItem('userToken', data);

            if (userType === 'student') {
                navigation.replace('AlunoApp');
            } else {
                navigation.replace('ProfessorApp');
            }
        } else {
            Alert.alert('Erro', data.message || 'Login falhou.');
        }

    } catch (error) {
        console.error(error);
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique se o Back-end está rodando.');
    } finally {
        setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log("Usuário clicou em 'Esqueceu a senha'");
    // adicionar posteriormente: navigation.navigate('ForgotPasswordScreen');
    Alert.alert('Redefinir Senha', 'Contate a secretaria.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardViewContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            
            {/* --- AGRUPANDO A LOGO E O NOME EDUKATU AQUI --- */}
            {/* 1. Área do Logo: um Container (View) que agrupa a Imagem e o Texto */}
            <View style={styles.logoContainer}>
              <Image 
                source={LogoImage} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
              <Text style={styles.logoText}>EDU KATÚ</Text> 
            </View>
            {/* --- FIM DA MUDANÇA AQUI!!! Sim foi eu welbersued --- */}


            {/* 2. Seleção de Perfil (ALUNO / PROFESSOR) */}
            <View style={styles.selectorContainer}>
              <TouchableOpacity
                style={[styles.selectorButton, userType === 'student' && styles.selectorActive]}
                onPress={() => setUserType('student')}
              >
                <Text style={[styles.selectorText, userType === 'student' && styles.textActive]}>ALUNO</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.selectorButton, userType === 'teacher' && styles.selectorActive]}
                onPress={() => setUserType('teacher')}
              >
                <Text style={[styles.selectorText, userType === 'teacher' && styles.textActive]}>PROFESSOR</Text>
              </TouchableOpacity>
            </View>

            {/* 3. Campos de Formulário pra preencher */}
            <TextInput
              style={styles.input}
              placeholder={userType === 'student' ? "Matrícula ou Email" : "Email do Professor"}
              placeholderTextColor={COLORS.textSecondary}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={COLORS.textSecondary}
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />

            {/* 4. Botão Principal (Login) */}
            <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                disabled={loading}
            >
              {loading ? (
                  <ActivityIndicator color={COLORS.background} />
              ) : (
                  <Text style={styles.loginButtonText}>ENTRAR</Text>
              )}
            </TouchableOpacity>

            {/* 5. Link de Redefinição de Senha */}
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.registerText}>Esqueceu sua senha? Clique aqui para redefinir</Text>
            </TouchableOpacity>
            
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// --- Estilos da Tela de Login ---
const styles = StyleSheet.create({
  keyboardViewContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1, 
    alignItems: 'center',
    justifyContent: 'center', 
    padding: SPACING.xLarge,
  },
  logoContainer: {
    alignItems: 'center', 
    marginBottom: SPACING.xLarge, 
  },
  logoImage: { 
    width: 250, 
    height: 220, 
    marginBottom: SPACING.small, 
  },
  logoText: { 
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary, 
  },
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 50,
    marginBottom: SPACING.large,
    width: '100%',
  },
  selectorButton: {
    flex: 1,
    paddingVertical: SPACING.medium,
    borderRadius: 50,
    alignItems: 'center',
  },
  selectorActive: {
    backgroundColor: COLORS.primary, 
  },
  selectorText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  textActive: {
    color: COLORS.background, 
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: SPACING.small,
    paddingHorizontal: SPACING.medium,
    marginBottom: SPACING.medium,
    color: COLORS.textPrimary,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary, 
    borderRadius: SPACING.small,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.medium,
    marginBottom: SPACING.large,
  },
  loginButtonText: {
    color: COLORS.background, 
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: COLORS.secondary, 
    fontWeight: '600',
  }
});

export default LoginScreen;