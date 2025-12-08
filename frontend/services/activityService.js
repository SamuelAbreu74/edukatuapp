// Arquivo: frontend/services/activityService.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

// Função auxiliar para pegar os dados salvos no Login
const getUserData = async () => {
  try {
    const rawToken = await AsyncStorage.getItem('userToken');
    if (!rawToken) return null;
    
    const parsed = JSON.parse(rawToken);
    
    // Ajuste aqui conforme o retorno exato do seu backend no Login
    // Geralmente o ID está em parsed.user.id ou parsed.id
    // O Token está em parsed.AccessToken
    const token = parsed.AccessToken || parsed.token;
    
    // Tenta achar o ID do aluno em vários lugares possíveis do objeto
    const studentId = parsed.id || (parsed.user && parsed.user.id) || (parsed.user && parsed.user._id);

    return { token, studentId };
  } catch (error) {
    console.error("Erro ao recuperar dados do usuário", error);
    return null;
  }
};

export const startAttempt = async (activityId) => {
  const userData = await getUserData();
  if (!userData || !userData.studentId) throw new Error("Usuário não identificado");

  const response = await fetch(`${API_URL}/atividades/tentativa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.token}`
    },
    body: JSON.stringify({
      student_id: userData.studentId,
      activity_id: activityId
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao iniciar tentativa");
  
  return data; //retorna o objeto da tentativa com o ID
};

export const answerQuestion = async (attemptId, questionId, chosenOption) => {
  const userData = await getUserData();
  
  const response = await fetch(`${API_URL}/atividades/${attemptId}/tentativa`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.token}`
    },
    body: JSON.stringify({
      question_id: questionId,
      chosen_option: chosenOption
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error("Erro ao salvar resposta");
  return data;
};

export const getStudentHistory = async () => {
  const userData = await getUserData();
  if (!userData || !userData.studentId) throw new Error("Usuário não identificado");

  const response = await fetch(`${API_URL}/atividades/${userData.studentId}/tentativa`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userData.token}`
    }
  });

  const data = await response.json();
  // A rota retorna { history: [...] }
  return data.history || [];
};