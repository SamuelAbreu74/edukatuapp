const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


// Criando a Classe e seus métodos
module.exports = class AttemptModel {


    // =-=-=-=-= GET =-=-=-=-=
    async getAttempt_by_Id(attemptId) {
        try {
            const result = await prisma.attempt.findUnique({
                where: {
                    id: attemptId
                }, select: {
                    id: true, student_answers: true, is_completed: true
                }
            })
            return result
        } catch (error) {
            return "Erro interno no Servidor!"
        }
    }


    // =-=-=-=-= POST =-=-=-=-= (Para o enviar as respostas da atividade feita pelo aluno)
    async post(data) {
        try {
            const result = await prisma.attempt.create({
                data: {
                    student_id: data.student_id,
                    activity_id: data.activity_id,
                    // Inicializa o array respostas
                    student_answers: [],
                    total_questions: 10
                }
            })

            return result

        } catch (error) {
            return "Erro interno no Servidor!"
        }
    }

    // =-=-=-=-= PUT =-=-=-=-= 
    async put(attemptId, currentAnswers, is_completed, scores) {
        try {
            const result = await prisma.attempt.update({
                where: {
                    id: attemptId
                },
                data: {
                    student_answers: currentAnswers,
                    is_completed: is_completed,
                    score: scores
                }
            })
            return result

        } catch (error) {
            return "Erro interno no Servidor!"
        }

    }

}