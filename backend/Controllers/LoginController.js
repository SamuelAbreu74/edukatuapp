const loginModel = require('../Models/LoginModels')
const login = new loginModel()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');



// ROTAS POR MÉTODO

// =-=-=-=-= POST =-=-=-=-=
exports.postLogin = async (req, res) => {
    try {
        

        const userData = req.body
        // Chamando o Model para verificar Email e Senha
        const result = await login.post(userData)


        if(!result){
                return res.status(400).json({message: "Usuário não Encontrado!"})
            }

            console.log("Verificando senha...")
            
            // Verificando se a senha está correta
            console.log(result.password)  
            const checkPassword = await bcrypt.compare(userData.password, result.password)

            if(!checkPassword){
                return res.status(400).json({message: "Senha Inválida!"})
            }
            console.log("Senha verificada!")
            
            // =-=-=-=-= Gerando o Token JWT =-=-=-=-=
            // Pegando o JWT_SECRET
            const JWT_SECRET = process.env.JWT_SECRET

            // Aqui Gera o Token propriamente dito
            const token = jwt.sign({id: result.id, type: result.type}, JWT_SECRET, {expiresIn: '2MIN'})

            return res.status(200).json(token)


    } catch (error) {

        return res.status(500).json({message: "Erro interno no servidor!"})
    }

}