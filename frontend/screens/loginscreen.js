// Arquivo: frontend/screens/LoginScreen.js

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
import { Ionicons } from '@expo/vector-icons'; 
import LogoImage from '../../assets/bemvindomascote.png'; // Logo da tela de login aqui viusss

import { API_URL } from '../config/api';
import { useTheme } from '../context/ThemeContext';

const SPACING = {
  small: 8,
  medium: 16,
  large: 24,
  xLarge: 32,
};

const LoginScreen = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();

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

            await AsyncStorage.setItem('userToken', JSON.stringify(data));

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
      style={[styles.keyboardViewContainer, { backgroundColor: colors.background }]}
    >
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.headerContainer}>
           <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
             <Ionicons 
                name={theme === 'light' ? 'moon' : 'sunny'} 
                size={28} 
                color={colors.iconColor} 
             />
           </TouchableOpacity>
        </View>

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
              <Text style={[styles.logoText, { color: colors.primary }]}>EDU KATÚ</Text> 
            </View>
            {/* --- FIM DA MUDANÇA AQUI!!! Sim foi eu welbersued --- */}


            {/* 2. Seleção de Perfil (ALUNO / PROFESSOR) */}
            <View style={[styles.selectorContainer, { backgroundColor: colors.selectorInactive }]}>
              <TouchableOpacity
                style={[
                    styles.selectorButton, 
                    userType === 'student' && { backgroundColor: colors.primary }
                ]}
                onPress={() => setUserType('student')}
              >
                <Text style={[
                    styles.selectorText, 
                    { color: userType === 'student' ? colors.buttonText : colors.text }
                ]}>ALUNO</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                    styles.selectorButton, 
                    userType === 'teacher' && { backgroundColor: colors.primary }
                ]}
                onPress={() => setUserType('teacher')}
              >
                <Text style={[
                    styles.selectorText, 
                    { color: userType === 'teacher' ? colors.buttonText : colors.text }
                ]}>PROFESSOR</Text>
              </TouchableOpacity>
            </View>

            {/* 3. Campos de Formulário pra preencher */}
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.inputBackground, 
                  borderColor: colors.inputBorder,
                  color: colors.text 
                }
              ]}
              placeholder={userType === 'student' ? "Matrícula ou Email" : "Email do Professor"}
              placeholderTextColor={colors.placeholder}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.inputBackground, 
                  borderColor: colors.inputBorder,
                  color: colors.text 
                }
              ]}
              placeholder="Senha"
              placeholderTextColor={colors.placeholder}
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />

            {/* 4. Botão Principal (Login) */}
            <TouchableOpacity 
                style={[styles.loginButton, { backgroundColor: colors.primary }]} 
                onPress={handleLogin}
                disabled={loading}
            >
              {loading ? (
                  <ActivityIndicator color={colors.buttonText} />
              ) : (
                  <Text style={[styles.loginButtonText, { color: colors.buttonText }]}>ENTRAR</Text>
              )}
            </TouchableOpacity>

            {/* 5. Link de Redefinição de Senha */}
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.registerText, { color: colors.secondary }]}>Esqueceu sua senha? Clique aqui para redefinir</Text>
            </TouchableOpacity>
            
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// --- Estilos da Tela de Login ---
const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.large,
    marginTop: 40,
    marginRight: 10,
    zIndex: 1, 
  },
  themeButton: {
    padding: SPACING.small,
  },
  keyboardViewContainer: {
    flex: 1,
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
  },
  selectorContainer: {
    flexDirection: 'row',
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
  selectorText: {
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: SPACING.small,
    paddingHorizontal: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  loginButton: {
    width: '100%',
    height: 50,
    borderRadius: SPACING.small,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.medium,
    marginBottom: SPACING.large,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    fontWeight: '600',
  }
});

export default LoginScreen;