const jwt = require('jsonwebtoken')

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET


const Auth = (req, res, next)=> {
    // Pegar o Token no Headers
    const AccessToken = req.headers.authorization
    // Se o não tiver token, acesso negado!
    if(!AccessToken){
        return res.status(401).json({message: "Acesso Negado!"})
    }
    try {
        // tirar o bearer do token com replace()
        const Access_Token_Decoded = jwt.verify(AccessToken.replace("Bearer ", ""), JWT_ACCESS_TOKEN_SECRET);

        // Anexar os dados do usuário ao objeto req
        // Isso passa o 'type' para o AuthType
        req.user = Access_Token_Decoded
        return next()
    } catch (error) {
        console.log(error)
        
        return res.status(401).json({message: "Token Inválido"});
    }
}

module.exports =  Auth