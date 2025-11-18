

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


// =-=-=-=-= Metodo para pegar os id's de acordo com o tipo de usuário =-=-=-=-=
    async getRoleIdByUserId(userId, userType){
        try {
            if (!userId || !userType){
              return "Dados Incorretos!"  
            }  

            if(userType === 'PROFESSOR'){
                const teacher = await prisma.teacher.findUnique({
                    where: { user_id: userId }
                })
                return teacher ? { key: 'teacher_id', id: teacher.id } : "Dados de Professor não Encontrados!"
            }

            if(userType === 'ALUNO'){
                const student = await prisma.student.findUnique({
                    where: { user_id: userId }
                })
                return student ? { key: 'student_id', id: student.id } : "Dados de Aluno não Encontrados!"
            }
            return "Tipo de Usuário Inválido!"

        } catch (error) {
            return "Erro interno no Servidor!"
        } 
    }

}