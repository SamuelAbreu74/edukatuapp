const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


// CRIANDO A CLASSE E SEUS DIFERENTES MÉTODOS
module.exports = class ActivityModel {

    // =-=-=-=-= GET =-=-=-=-=
    async get() {
        try {
            const activities = await prisma.activity.findMany({
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
    async delete() {
        try {

        } catch (error) {

        }
    }

}