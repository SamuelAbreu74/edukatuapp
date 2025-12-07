const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


module.exports = class User{

    // Métodos

    // =-=-=-=-= GET =-=-=-=-=
    async get(){
        try {

            


            const result = await prisma.user.findMany({
                include:{
                    students: true,
                    teacher: true
                }
            })
    
            if(!result){
                return "Nenhum usuário encontrado!"
            }

            return result;

        } catch (error) {
            return "Erro interno no Servidor!"
        }
    }

    // =-=-=-=-= PUT =-=-=-=-=
    async put(userData, hashPassword){

        try {
            const result = await prisma.user.update({
                where: {
                    id: userData.id
                },
                data:{
                    email: userData.email,
                    password: hashPassword,
                    name: userData.name,
                    type: userData.type,
                    avatar_url: userData.avatar_url,
                    registered: userData.registered,
                    students:{
                        update:{
                            data:{
                                grade: userData.grade,
                                class: userData.class
                            }
                        }
                    }
                }, include:{
                    students: true
                }

            })
            return result

        } catch (error) {
            return "Erro interno no Servidor!"
        }
    }


    // =-=-=-=-= DELETE =-=-=-=-=
    async delete(user_id){
        try {
            const result = prisma.user.delete({
                where: {
                    id: user_id
                }
            })

            return result;
        } catch (error) {
            return "Erro interno no Servidor!"
        }
    }
}