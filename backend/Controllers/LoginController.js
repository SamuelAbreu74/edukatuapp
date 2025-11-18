const loginModel = require('../Models/LoginModels')
const login = new loginModel()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');



// CONTROLLERS POR MÉTODO

// =-=-=-=-= POST =-=-=-=-=
exports.postLogin = async (req, res) => {
    try {
        

        const userData = req.body
        // Chamando o Model para verificar Email e Senha
        const result = await login.post(userData)


        if(!result){
                return res.status(400).json({message: "Usuário não Encontrado!"})
            }

            // Verificando se a senha está correta
            const checkPassword = await bcrypt.compare(userData.password, result.password)

            if(!checkPassword){
                return res.status(400).json({message: "Senha Inválida!"})
            }

            // =-=-=-=-= Gerando o Token JWT =-=-=-=-=

            // Pegando o JWT_SECRET
            const JWT_SECRET = process.env.JWT_SECRET

            // Chama da função de pegar o Id de acordo com o tipo de usuário (Aluno ou Professor)
            const roleInfo = await login.getRoleIdByUserId(result.id, result.type)

            // Payload (Dados que vão estar dentro do token)
            const payload = {id: result.id, type: result.type}
            if(roleInfo && roleInfo.id){
                payload[roleInfo.key] = roleInfo.id
            }

            // Aqui Gera o Token propriamente dito
            const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '5MIN'})

            return res.status(200).json(token)


    } catch (error) {

        return res.status(500).json({message: "Erro interno no servidor!"})
    }

}