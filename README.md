# 📚 EDUKATU APP

## App de Gamificação para Educação

[![GitHub Stars](https://img.shields.io/github/stars/welbersued/edukatuapp?style=social)](https://github.com/welbersued/edukatuapp/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/welbersued/edukatuapp?style=social)](https://github.com/welbersued/edukatuapp/network/members)


O **Edu Katú** é um projeto feito para a cadeira de Desenvolvimento para Dispositivos Móveis em **gamificação educacional**, transformando a experiência de aprendizado tradicional em uma jornada interativa e recompensadora. Nosso objetivo é aumentar o engajamento e a retenção de conhecimento para melhorar cada vez mais a experiência de alunos com seus estudos diários.

---

## ✨ Recursos

O aplicativo oferece uma experiência completa de aprendizado gamificado:

* **Módulos de Lições Interativas:** Conteúdo educativo dividido em pequenas lições (microlearning) e quizzes de múltipla escolha.
* **Sistema de Pontuação e Nível:** Os usuários ganham XP (Pontos de Experiência) ao completar lições e sobem de nível, desbloqueando novo conteúdo e conquistas.
* **Ranking Global e Amigos:** Competição saudável através de rankings diários e semanais, incentivando a consistência no estudo.

* **Interface Intuitiva:** Design otimizado para dispositivos móveis, garantindo facilidade de uso e foco no conteúdo.

---

## 🛠️ Tecnologias Utilizadas

O Edu Katú segue um modelo de arquitetura *full-stack* moderno, dividido em frontend e backend.

| Camada | Tecnologia Principal | Linguagem | Bibliotecas Chave |
| :--- | :--- | :--- | :--- |
| **Frontend** | **React Native** + **Expo** | JavaScript/TypeScript | React Navigation, Redux (ou Context API) |
| **Backend** | **Node.js** + **Express.js** | JavaScript | ORM Prisma (para MongoDB), Autenticação JWT |
| **Banco de Dados** | **MongoDB** (assumido) | N/A | Armazenamento de usuários, lições, pontuações, rankings, etc. |

---

## 🚀 Guia de Instalação e Execução Local

Siga os passos abaixo para ter o Edu Katú rodando em sua máquina.

### Pré-requisitos

Certifique-se de ter instalado:

* **Node.js** (v18+)
* **npm** ou **Yarn**
* **Expo CLI** (se ainda não tiver: `npm install -g expo-cli`)
* Um ambiente de desenvolvimento MongoDB (local ou Atlas).

### 1. Configuração do Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/welbersued/edukatuapp.git](https://github.com/welbersued/edukatuapp.git)
    cd edukatuapp
    ```
2.  Crie um arquivo `.env` na pasta **raiz** e na pasta **`backend/`** e adicione suas variáveis de ambiente:
    ```
    # Exemplo para o arquivo .env do Backend
    PORT=3000
    MONGO_URI=mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/edukatu
    JWT_SECRET=sua-chave-secreta
    ```

### 2. Executando o Backend (API)

O backend é responsável por gerenciar dados, autenticação e a lógica de gamificação.

```bash
# Navegue para o diretório do backend
cd backend

# Instale as dependências
npm install # ou yarn install

# Inicie o servidor
npm run dev # ou npm start, dependendo do seu script
```

## Autores

- [@Samuel Abreu](https://www.github.com/SamuelAbreu74)
- [@Welber Sued](https://www.github.com/welbersued)
- [@Victor Emanuel](https://www.github.com/victorekmaus145)
- [@Lívia Mel](https://www.github.com/liviamelmachado)
- [@Juliel Nascimento](https://www.github.com/)

