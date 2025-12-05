
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()


module.exports = class Register {


    // =-=-=-=-= GET =-=-=-=-=
    get() {
        return 'Rota de Cadastro'
    }


    // =-=-=-=-= POST =-=-=-=-=
    async post(user) {
        try {
            const userData = user;
            console.log("Chamando função do prisma!")

            if (userData.type === "ALUNO") {
                const newUser = await prisma.user.create({
                    data: {
                        email: userData.email,
                        password: userData.password,
                        name: userData.name,
                        type: userData.type,

                        students: {
                            create: {
                                grade: userData.grade,
                                class: userData.class
                            }
                        },
                    },
                })
                return { message: "Aluno adicionado com sucesso!", newUser };
            } else if (userData.type === "PROFESSOR") {
                const newUser = await prisma.user.create({
                    data: {
                        email: userData.email,
                        password: userData.password,
                        name: userData.name,
                        type: userData.type,
                        teacher: {
                            create: {
                                main_subject: userData.main_subject
                            }
                        },
                    },
                });
                return { message: "Professor adicionado com sucesso!", newUser }
            } else {
                const newUser = await prisma.user.create({
                    data: {
                        email: userData.email,
                        password: userData.password,
                        name: userData.name,
                        type: userData.type,
                    },
                });
                return { message: "Admministrador adicionado com sucesso!" , newUser}
            }
        } catch (error) {
            console.log(error)
            return "Erro interno no Servidor!"
        }
    }
}