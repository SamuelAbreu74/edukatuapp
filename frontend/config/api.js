// Arquivo: frontend/config/api.js para conseguir pegar IP da máquina automaticamente
import Constants from 'expo-constants';

// Esta lógica pega o IP da máquina onde o Expo está rodando
const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
const localhost = debuggerHost?.split(':')[0] || 'localhost';

export const API_URL = `http://${localhost}:3000`;

// Para ver no console qual IP ele pegou
console.log(`🔌 API configurada para conectar em: ${API_URL}`);