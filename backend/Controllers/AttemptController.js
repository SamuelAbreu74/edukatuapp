const attemptModel = require('../Models/AttemptModels')
const AttemptModel = new attemptModel();

// Controllers por Métodos


// =-=-=-=-= POST =-=-=-=-=
exports.postAttempt = async (req, res) => {
    const data = req.body // student_id, activity_id
    try {
        const newAttempt = await AttemptModel.post(data)
        
       return res.status(201).json({message: "Nova tentativa iniciada com sucesso!", attemptId: newAttempt.id})
    } catch (error) {
       return res.status(500).json({message: "Erro interno no Servidor!"})
    }
}


// =-=-=-=-= PUT =-=-=-=-=
exports.putAttempt = async (req, res) => {
    const attempt_id = req.params.id;
    const {question_id, chosen_option} = req.body // Front passa um Payload com: (question_id, chosen_option)
    
    
    if(!question_id || !chosen_option || !attempt_id){
        console.log(question_id, chosen_option, attempt_id)
        return res.status(400).json({message: "Sem os dados necessários para realizar a operação"})
    }
    
    try {
        
        // Busca a tentativa da atividade atual pelo ID
        const attemptRecord = await AttemptModel.getAttempt_by_Id(attempt_id)
        if(!attemptRecord){
            return res.status(404).json({message: "Tentativa não encontrada!"})
        }
        
        // Array para guardar as alternativas escolhidas
        let currentAnswers = attemptRecord.student_answers;
        
        // "Molde" do objeto que vai ser inserido em cada registro do Array
        const newAnswer = {
            question_id: question_id,
            chosen_option: chosen_option
        }
        
        console.log(newAnswer)
        // Verificando se a questão que o usuario respondeu já existe no Array
        const existingIndex = currentAnswers.findIndex(a => a.question_id === newAnswer.question_id)
        
        // Verificando se o usuário está mudando de alternativa ou se nunca respondeu a questão
        if(existingIndex !== -1){
            currentAnswers[existingIndex] = newAnswer
        }else{
            currentAnswers.push(newAnswer)
        }
        

        // Atualizar o registro no Banco de dados
        const updateAttempt = await AttemptModel.put(attempt_id, currentAnswers)
    
        return res.status(200).json({message: "Resposta registrada com sucesso!! ", attempt: updateAttempt})

    } catch (error) {
        return res.status(500).json({message: "Erro interno no Servidor!"})
    }



}