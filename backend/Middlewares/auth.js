const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET


const Auth = (req, res, next)=> {
    // Pegar o Token no Headers
    const token = req.headers.authorization 
    
    // Se o não tiver token, acesso negado!
    if(!token){
        return res.status(401).json({message: "Acesso Negado!"})
    }

    try {
        // tirar o bearer do token com replace()
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);

        // Anexar os dados do usuário ao objeto req
        // Isso passa o 'type' para o AuthType
        req.user = decoded

        return next()
    } catch (error) {
        return res.status(401).json({message: "Token Inválido"});
    }




}

module.exports =  Auth