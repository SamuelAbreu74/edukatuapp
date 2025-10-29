//Tela de Login
import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    SafeAreaView,
    Image 
} from 'react-native';
import { COLORS, SPACING } from '../styles/theme'; 
import LogoImage from '../../assets/bemvindomascote.png'; // Logo da tela de login aqui viusss

const LoginScreen = ({ navigation }) => {
  const [userType, setUserType] = useState('student'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(`Tentativa de Login como ${userType === 'student' ? 'ALUNO' : 'PROFESSOR'}`);
    navigation.navigate('Dashboard'); 
  };

  const handleForgotPassword = () => {
    console.log("Usuário clicou em 'Esqueceu a senha'");
    // adicionar posteriormente: navigation.navigate('ForgotPasswordScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- AGRUPANDO A LOGO E O NOME EDUKATU AQUI --- */}
        {/* 1. Área do Logo: um Container (View) que agrupa a Imagem e o Texto */}
        <View style={styles.logoContainer}>
          <Image 
            source={LogoImage} 
            style={styles.logoImage} // Estilo renomeado para a imagem
            resizeMode="contain" 
          />
          <Text style={styles.logoText}>EDU KATÚ</Text> 
        </View>
        {/* --- FIM DA MUDANÇA AQUI!!! Sim foi eu welbersued --- */}


        {/* 2. Seleção de Perfil (ALUNO / PROFESSOR) - Falta ver como fica o de admin, pois não pode ficar visível igual */}
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>ENTRAR</Text>
        </TouchableOpacity>

        {/* 5. Link de Redefinição de Senha */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.registerText}>Esqueceu sua senha? Clique aqui para redefinir</Text>
        </TouchableOpacity>
      
      </View>
    </SafeAreaView>
  );
};

// --- Estilos da Tela de Login ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.xLarge,
  },

  
  logoContainer: {
    alignItems: 'center', // Centraliza a imagem e o texto
    marginBottom: SPACING.xLarge, // Mantém o espaçamento principal
  },
  logoImage: { // Parametros da imagem)
    width: 250, 
    height: 220, 
    marginBottom: SPACING.small, // Espaço entre a imagem e o texto
  },
  logoText: { 
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary, // Cor Roxa
  },
 
  
  // Seletor Aluno/Professor
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
    backgroundColor: COLORS.primary, // Roxo Principal
  },
  selectorText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  textActive: {
    color: COLORS.background, // Branco
  },

  // Inputs
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

  // Botão Login
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary, // Roxo Principal
    borderRadius: SPACING.small,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.medium,
    marginBottom: SPACING.large,
  },
  loginButtonText: {
    color: COLORS.background, // Branco
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: COLORS.secondary, // Laranja/Fúcsia para links
    fontWeight: '600',
  }
});

export default LoginScreen;