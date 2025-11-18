const activityModel = require('../Models/ActivityModels.js')
const activityList = new activityModel()

// CONTROLLERS POR MÉTODOS


// =-=-=-=-= GET =-=-=-=-=
exports.getActivity = async (req, res) => {
    try {
        const activities = await activityList.get()
        return res.status(200).json({message: "Atividades Listadas com Sucesso!", activities})

    } catch (error) {
        return res.status(500).json({message: "Erro interno no Servidor"});
    }
}

// =-=-=-=-= POST =-=-=-=-=
exports.postActivity = async (req, res) => {
    try {
        const newActivityData = req.body
        const UserData = req.user
        // Verifica se existe dados na requisição
         if(!newActivityData || !newActivityData.title || !newActivityData.subject){
            return res.status(400).json({message: "Falta de informações no corpo da requisição"})
         }

         const newActivity = await activityList.post(newActivityData, UserData)
         

         return res.status(201).json({message: "Nova atividade criada com sucesso!"}, newActivity)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Erro interno no Servidor!"})
    }
}

// =-=-=-=-= PUT =-=-=-=-=
exports.putActivity = async (req, res) => {

}

// =-=-=-=-= DELETE =-=-=-=-=
exports.deleteActivity = async (req, res) => {

}