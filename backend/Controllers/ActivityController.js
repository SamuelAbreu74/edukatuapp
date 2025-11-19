const Model = require('../Models/ActivityModels.js')
const ActivityModel = new Model()

// CONTROLLERS POR MÉTODOS


// =-=-=-=-= GET =-=-=-=-=
exports.getActivity = async (req, res) => {
    try {
        const activities = await ActivityModel.get()
        return res.status(200).json({ message: "Atividades Listadas com Sucesso!", activities })

    } catch (error) {
        return res.status(500).json({ message: "Erro interno no Servidor" });
    }
}

// =-=-=-=-= GET por Id =-=-=-=-= (Para pegar somente as atividades que o próprio professor criou)
exports.getActivityById = async (req, res) => {
    try {
        const user_data = req.user;
        const activities_by_id = await ActivityModel.getActivity_By_Id(user_data)

        if (activities_by_id.length == 0) {
            return res.status(200).json({ message: "Você ainda não criou nenhuma atividade!" })
        }
        return res.status(200).json({ message: "Suas Atividades foram Listadas com sucesso!", activities_by_id })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro interno no Servidor!" });
    }
}



// =-=-=-=-= POST =-=-=-=-=
exports.postActivity = async (req, res) => {
    try {
        const newActivityData = req.body
        const UserData = req.user
        // Verifica se existe dados na requisição
        if (!newActivityData || !newActivityData.title || !newActivityData.subject) {
            return res.status(400).json({ message: "Falta de informações no corpo da requisição" })
        }

        const newActivity = await ActivityModel.post(newActivityData, UserData)

        return res.status(201).json({ message: "Nova atividade criada com sucesso!", newActivity })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro interno no Servidor!" })
    }
}

// =-=-=-=-= PUT =-=-=-=-=
exports.putActivity = async (req, res) => {

}

// =-=-=-=-= DELETE =-=-=-=-=
exports.deleteActivity = async (req, res) => {
    try {
        const user_data = req.user;
        // O front deve mandar os dados da atividade pelo corpo de requisição, 
        // poder ser somente o Id da atividade e o Id do professor que está relacionado 
        // com a atividade
        const activity_data = req.body 

        const result = await ActivityModel.delete(activity_data.id);

        // Verificando se existe o ID de professor dentro dos dados recebidos 
        if (!activity_data.teacher_id || !user_data.teacher_id) {
            return res.status(400).json({ message: "Sem dados necessários para realizar essa função" })
        }

        // Verifica se a atividade que vai ser excluida é do usuário que está efetuando a ação
        if (activity_data.teacher_id != user_data.teacher_id) {
            return res.status(401).json({ message: "Só é possível excluir sua próprias atividades!" })
        }


        return res.status(200).json({ message: "Atividade excluida com Sucesso!" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro interno no Servidor!" })
    }
}