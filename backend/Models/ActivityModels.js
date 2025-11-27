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
                    teacher_id: true
                }
            })
            return activities
        } catch (error) {
            console.log(error)
            return "Erro interno no Servidor!"
        }
    }



    // Método de buscar as atividades pelo ID de professor do usuário logado
    async getActivity_By_Teacher_Id(UserData) {
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

    // Método para buscar a atividade pelo ID da Atividade
    async getActivity_By_Activity_Id(ActivityId){
            if(!ActivityId){
                return "Erro ao receber os dados da atividade!"
            }
            
        try {

            const result = await prisma.activity.findUnique({
                where: {
                    id: ActivityId
                },include:{
                    questions: true
                }
            })

            return result
        } catch (error) {
            console.log(error)
            return "Erro interno no Servidor!"
        }
    }


    // =-=-=-=-= POST =-=-=-=-=
    // Função que Cria uma nova atividade
    async post(ActivityData, UserData) {
        try {
            // Função que mapeia as questões enviadass e guardar na constante
            const questionsToCreate = (ActivityData.questions || []).map(question => ({
                question: question.question,
                option_a: question.option_a,
                option_b: question.option_b,
                option_c: question.option_c,
                option_d: question.option_d,
                option_e: question.option_e,
                correct_answer: question.correct_answer,
                explanation: question.explanation
            }));

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
                        create: questionsToCreate
                    }
                },
                include:{
                    questions: true
                }
            })

            return newActivity
        } catch (error) {
            console.log(error)
            return "Erro interno no Servidor!"
        }
    }

    // =-=-=-=-= PUT =-=-=-=-=
    // Função que Atualiza uma atividade existente
    async put(ActivityData) {
        try {
            // Função que mapeia todas as questões enviadas e guarda na constante
            const questionsToUpdate = (ActivityData.questions || []).map(question => ({
                where: {
                    id: question.id // ID da questão que será atualizada
                },
                data: {
                    // Campos da questão que serão atualizados
                    question: question.question,
                    option_a: question.option_a,
                    option_b: question.option_b,
                    option_c: question.option_c,
                    option_d: question.option_d,
                    option_e: question.option_e,
                    correct_answer: question.correct_answer,
                    explanation: question.explanation, 
                    scores: question.scores 
                }
            }));
            
            // Função que Edita a atividade no Banco de Dados
            const updatedActivity = await prisma.activity.update({
                where: {
                    id: ActivityData.id
                },
                data: {
                    title: ActivityData.title,
                    description: ActivityData.description,
                    subject: ActivityData.subject,
                    grade: ActivityData.grade,
                    coins_reward: ActivityData.coins_reward,
                    time: ActivityData.time,
                    difficulty: ActivityData.difficulty,
                    active: ActivityData.active,

                    questions: {
                        update: questionsToUpdate
                    },   
                },
                include:{
                    questions: true
                }
            })
            return updatedActivity
        } catch (error) {
            console.log(error)
            return "Erro interno no Servidor!"
        }
    }


    // =-=-=-=-= DELETE =-=-=-=-=
    // Função que Deleta uma atividade
    async delete(ActivityId) {
        try {
            // Função que Deleta a atividade do banco de dados 
            const activityDeleted = await prisma.activity.delete({
                where: {
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