/**
 * @param {string["ALUNO", "PROFESSOR", "ADMINISTRATOR"]} AcessTypes - Array de strings com os tipos de usuário permitidos.
 */

const AuthType = (AcessTypes) => {
    return (req, res, next) => {

        
        // =-=-=-=-= VERIFICAR SE O USUÁRIO ESTÁ AUTENTICADO =-=-=-=-=
        if(!req.user || !req.user.type){
            return res.status(401).json({message: "Acesso Negado! Usuário não autenticado."})
        }
        try {
            // Extrai o tipo do usuário 
            const UserType= req.user.type;
            
            // 2. Verificar se o tipo de usuário está na lista de tipos permitidos
            if(!AcessTypes.includes(UserType)){
                // Se o tipo do usuário não estiver dentro do tipo permitido o acesso dele é negado!
                return res.status(403).json({message: "Acesso Negado! Você não tem permissão para utilizar esse recurso." })
            }
            // 3. Usuário autorizado, chama o próximo middleware/função da rota
            return next()
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: "Erro Interno no Servidor"})
        }
    }
}

module.exports = {AuthType};
