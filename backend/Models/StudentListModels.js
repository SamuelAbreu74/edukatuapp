const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = class StudentList{

    // =-=-=-=-= GET =-=-=-=-=

    
    async get(){
        try {
            const students = await prisma.student.findMany({
                omit:{
                        user_id: true
                    },
                include:{   
                    user: {
                        omit:{
                            password: true
                        }
                    }
                }
            })
            return students
            
        } catch (error) {
            console.log(error)
            return "Erro interno no Servidor!"
        }
    }
}
