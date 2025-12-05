const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


module.exports = class refresh {

    // Métodos da Classe


    async getRoleIdByUserId(userId, userType) {
        try {
            if (!userId || !userType) {
                return "Dados Incorretos!"
            }

            if (userType === 'PROFESSOR') {
                const teacher = await prisma.teacher.findUnique({
                    where: { user_id: userId }
                })
                return teacher ? { key: 'teacher_id', id: teacher.id } : "Dados de Professor não Encontrados!"
            }

            if (userType === 'ALUNO') {
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