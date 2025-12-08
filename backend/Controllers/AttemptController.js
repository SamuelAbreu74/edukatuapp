const attemptModel = require('../Models/AttemptModels')
const AttemptModel = new attemptModel();

const activityModel = require('../Models/ActivityModels')
const ActivityModel = new activityModel()

// Controllers por Métodos

// =-=-=-=-= GET =-=-=-=-=
exports.getAll_By_Student_Id = async (req, res) => {
    try {
        const student_id = req.params.id 
        const attemptsHistory =  await AttemptModel.getAttempt_by_Student_Id(student_id)

        if(!student_id){
            res.status(400).json({message: "Sem os dados necessários para realizar a operação"})
        }

        if(attemptsHistory.length <= 0){
            return res.status(200).json({message: "Você ainda não realizou nenhuma tentativa de atividade!"})
        }

        return res.status(200).json({message: "Histórico de Tentativas Listado com Sucesso!", history: attemptsHistory})
        
    } catch (error) {
        return res.status(500).json({message: "Erro interno no Servidor!"})
    }
} 

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
        // Busca a tentativa da atividade atual pelo ID e verifica se ela existe
        const attemptRecord = await AttemptModel.getAttempt_by_Id(attempt_id)
        if(!attemptRecord){
            return res.status(404).json({message: "Tentativa não encontrada!"})
        }

        // Verifica se a tentativa já está completa
        if(attemptRecord.is_completed != false){
            return res.status(200).json({message: "Está tentativa já foi finalizada!"})
        }
        
        // Array para guardar as alternativas escolhidas
        let currentAnswers = attemptRecord.student_answers;
        
        // "Molde" do objeto que vai ser inserido em cada registro do Array
        const newAnswer = {
            question_id: question_id,
            chosen_option: chosen_option
        }
        
        // console.log(newAnswer)
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
        

        // =-=-=-=-= Lógica Completar Tentativa =-=-=-=-=
        const student_answers = updateAttempt.student_answers // Guardar o último estado da lista de questões
        const total_questions = updateAttempt.total_questions // Total de questões da atividade
        const questions_counter = student_answers.length // Valor em inteiro de quantas questões tem respondidas dentro da lista de questões
        
    
        // =-=-=-=-=-=-=-=-=-= Lógica Cálculo Pontos =-=-=-=-=-=-=-=-=-=
        
        // Lógica para pegar somente as alternativas corretas da atividade
        const activity_id = updateAttempt.activity_id
        const activity_questions = await ActivityModel.getActivity_By_Activity_Id(activity_id)

        const questions = activity_questions.questions

        const correct_answers = questions.map(q => q.correct_answer) // Alternativas Corretas
        console.log(correct_answers)

        // Lógica para pegar as alternativas escolhidas pelo aluno
        const student_chosen_options = student_answers.map(a => a.chosen_option) // Alternativas escolhidas pelo Aluno
        console.log(student_chosen_options)

        let scores = 0
        for( let i = 0; i < correct_answers.length; i++){
            
            if(correct_answers[i] != student_chosen_options[i]){
                console.log("Resposta incorreta!")
            }else{
                scores++
                console.log("Resposta Correta!")
            }
        }
        
        // Saber se a atividade terminou
        if(questions_counter === total_questions){
            const is_completed = true
            const lastQuestionUpdate = await AttemptModel.put(attempt_id, currentAnswers, is_completed, scores) // Faz a última alteração na tentativa atual e retorna todos os dados com is_completed == TRUE e com a pontuação obtida 

            return res.status(200).json({message: "Última resposta registrada com sucesso!! ", attempt: lastQuestionUpdate})
        }
        return res.status(200).json({message: "Resposta registrada com sucesso!! ", attempt: updateAttempt})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Erro interno no Servidor!"})
    }
}
