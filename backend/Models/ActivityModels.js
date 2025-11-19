const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


// CRIANDO A CLASSE E SEUS DIFERENTES MÉTODOS
module.exports = class ActivityModel {

    // =-=-=-=-= GET =-=-=-=-=

    // Método de buscar todas as atividades disponíveis
    async get() {
        try {
            const activities = await prisma.activity.findMany({
                where: {
                    active: true
                },
                omit: {
                    id: true,
                    teacher_id: true,
                }
            })
            return activities
        } catch (error) {
            console.log(error)
            return "Erro interno no Servidor!"
        }
    }



    // Método de buscar as atividades pelo ID de professor do usuário logado
    async getActivity_By_Id(UserData) {
        try {
            if (!UserData) {
                return "Erro ao receber os dados do usuário!"
            }

            const activities = await prisma.activity.findMany({
                where: {
                    teacher_id: UserData.teacher_id
                }
            })

            return activities
        } catch (error) {
            return "Erro interno no Servidor!"
        }
    }


    // =-=-=-=-= POST =-=-=-=-=
    async post(ActivityData, UserData) {
        try {
            const newActivity = await prisma.activity.create({
                data: {
                    title: ActivityData.title,
                    description: ActivityData.description,
                    subject: ActivityData.subject,
                    grade: ActivityData.grade,
                    coins_reward: ActivityData.coins_reward,
                    time: ActivityData.time,
                    difficulty: ActivityData.difficulty,
                    active: ActivityData.active,
                    // Esse Trecho aqui vai ligar a nova atividade a algum professor existente (No caso de acordo com o ID fornecido)
                    teacher: {
                        connect: {
                            id: UserData.teacher_id
                        }
                    },
                    // Cria uma nova questão juntamente com a nova atividade
                    questions: {
                        create: [{
                            question: ActivityData.question,
                            option_a: ActivityData.option_a,
                            option_b: ActivityData.option_b,
                            option_c: ActivityData.option_c,
                            option_d: ActivityData.option_d,
                            option_e: ActivityData.option_e,
                            correct_answer: ActivityData.correct_answer
                        }]
                    }
                }
            })

            return newActivity
        } catch (error) {
            console.log(error)
            return "Erro interno no Servidor!"
        }
    }

    // =-=-=-=-= PUT =-=-=-=-=
    async put() {
        try {

        } catch (error) {

        }
    }


    // =-=-=-=-= DELETE =-=-=-=-=
    async delete(ActivityId) {
        try {
            // Função que Deleta a atividade do banco de dados 
            const activityDeleted = await prisma.activity.delete({
                where:{
                    id: ActivityId
                }
            })
            return activityDeleted

        } catch (error) {
            console.log(error)
            return "Erro inteno no Servidor!"
        }
    }

}