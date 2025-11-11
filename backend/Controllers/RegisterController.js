const bcrypt = require('bcrypt');

const registerModel = require('../Models/RegisterModels');

// ROTAS POR MÉTODO

// =-=-=-=-= POST =-=-=-=-=
exports.postRegister = async (req, res) => {

    try {
     
        const data = req.body;

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(data.password, salt)

        const userData = {
            email: data.email,
            password: hashPassword,
            name: data.name,
            type: data.type,
            avatar_url: data.avatar_url,
            grade: data.grade,
            class: data.class,
            main_subject: data.main_subject
        }

        const register = new registerModel();

        const result = await register.post(userData);
       
        return res.status(200).json(result);


    } catch (error) {
        return res.status(500).json({message: 'Erro interno do servidor!!'});
    }
}


