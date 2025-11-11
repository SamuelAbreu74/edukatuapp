

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

module.exports = class Login{

// Aqui vai ter todos os métodos necessários para o Login

// =-=-=-=-= GET =-=-=-=-=
    get(){
        return 'método login.get()'
    }


// =-=-=-=-= POST =-=-=-=-=
    async post(userData){
        try {
            console.log("Verificando email...")
            // Verificando se o Email existe no Banco
            const login = await prisma.user.findUnique({
                where: {email: userData.email}
            })
            return login
        } catch (error) {
            return "Erro interno do servidor!"
        }
    }
}