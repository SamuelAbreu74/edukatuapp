const loginModel = require('../Models/LoginModels')
const login = new loginModel()
const refreshModel = require('../Models/RefreshModels')
const refresh = new refreshModel()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

// CONTROLLERS POR MÉTODO

// =-=-=-=-= POST =-=-=-=-=

// Variável que vai armazenar os refreshTokens (TEMPORÁRIO TEM QUE SER ARMAZENADO NO FRONT VIA COOKIES DEPOIS)
let refreshTokens = []

exports.postLogin = async (req, res) => {
    try {
        const userData = req.body
        // Chamando o Model para verificar Email e Senha
        const result = await login.post(userData)

        if (!result) {
            return res.status(400).json({ message: "Usuário não Encontrado!" })
        }

        // Verificando se a senha está correta
        console.log(await bcrypt.compare(userData.password, result.password))
        const checkPassword = await bcrypt.compare(userData.password, result.password)

        if (!checkPassword) {
            return res.status(400).json({ message: "Senha Inválida!" })
        }

        // =-=-=-=-= Gerando os Tokens JWT =-=-=-=-=

        // Pegando os dois JWT_SECRETS
        const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET
        const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET

        // Chama da função de pegar o Id de acordo com o tipo de usuário (Aluno ou Professor)
        const roleInfo = await login.getRoleIdByUserId(result.id, result.type)

        // Payload (Dados que vão estar dentro do token)
        const payload = { id: result.id, type: result.type }
        if (roleInfo && roleInfo.id) {
            payload[roleInfo.key] = roleInfo.id
        }

        // Aqui Gera o AccessToken 
        const AccessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '7D' })
        // Aqui Gera o RefreshToken 
        const RefreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30MIN' })

        refreshTokens.push(RefreshToken)
        
        // Retornando os tokens e também dados básicos do usuário para o front salvar
        return res.status(200).json({ 
            AccessToken, 
            RefreshToken,
            user: {
                id: result.id,
                name: result.name,
                type: result.type,
                // Retorna student_id ou teacher_id se existir
                ...(roleInfo && roleInfo.id ? { [roleInfo.key]: roleInfo.id } : {})
            }
        })

    } catch (error) {
        // CONSOLE.LOG PRA ENTENDER PQ APARECE ERRO INTERNO NO SERVIDOR NESSA BOMBA
        console.error("ERRO DETALHADO NO LOGIN:", error); 
        return res.status(500).json({ message: "Erro interno no servidor!" })
    }
}

// =-=-=-=-= REFRESH =-=-=-=-=

exports.postRefresh = async (req, res) => {
    const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET
    const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET
    
    try {
        const refreshToken = req.body.RefreshToken
        if (!refreshToken) {
            return res.status(400).json({ message: "Sem o token necessário" })
        }
        
        const userData = jwt.verify(refreshToken, REFRESH_SECRET)

        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ message: "Token inexistente" })
        }

        const roleInfo = await refresh.getRoleIdByUserId(userData.id, userData.type)

        const payload = {
            id: userData.id,
            type: userData.type,
        }
        if(roleInfo && roleInfo.id) {
            payload[roleInfo.key] = roleInfo.id
        }
        
        const newAccessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '7D' })

        return res.status(200).json({AccessToken: newAccessToken})
    }
    catch (error) {
        console.error("ERRO DETALHADO NO REFRESH:", error);
        return res.status(500).json({ message: "Erro interno no Servidor!" })
    }
}