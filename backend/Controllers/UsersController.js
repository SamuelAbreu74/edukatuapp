const userModel = require('../Models/UsersModels')
const user = new userModel()
const bcrypt = require('bcrypt')



exports.getUsers = async (req, res) => {
    try {
        const users = await user.get()

        if(!users){
            return req.status(403).json({message: "Nenhum usuário encontrado!"})
        }

        return res.status(200).json({message: "Usuários Listados com sucesso!", users})

    } catch (error) {
        return res.status(500).json({message: "Erro interno no Servidor!"})
    }
}

exports.putUser = async (req, res) => {
    const new_data = req.body 
    
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(new_data.password, salt)


        const user_updated = await user.put(new_data, hashPassword)

        return res.status(200).json({message: "Usuários atualizado com sucesso!", user_updated})
         
    } catch (error) {
        return res.status(500).json({message: "Erro interno no Servidor!"})
    }
}


exports.deleteUser = async (req, res) => {
    const user_id = req.body.id
    try {
        const user_deleted = await user.delete(user_id)
        
        return res.status(200).json({message: "Usuário removido com sucesso!", user_deleted})

    } catch (error) {
        return res.status(500).json({message: "Erro interno no Servidor!"})
    }
}