const express = require('express');
const router = express.Router();
const {AuthType} = require('../Middlewares/authType.js')

// =-=-=-=-= IMPORTANDO CONTROLLERS =-=-=-=-=
const studentListController = require('../Controllers/StudentListController.js')
const activityController = require('../Controllers/ActivityController.js')
const attemptController = require('../Controllers/AttemptController.js')
const loginController = require('../Controllers/LoginController.js')


// =-=-=-=-= ROTAS PRIVADAS DE FUNCIONALIDADES =-=-=-=-=

// =-=-=-=-= CRUD ALUNOS =-=-=-=-=
router.get('/listar-alunos', AuthType(["PROFESSOR"]), studentListController.getStudents);

// =-=-=-=-= CRUD ATIVIDADES PROFESSOR =-=-=-=-=
router.get('/minhas-atividades', AuthType(["PROFESSOR"]), activityController.getActivityByTeacherId) // Listar somente as atividades do usuário logado
router.post('/atividades', AuthType(["PROFESSOR"]), activityController.postActivity) // Criar uma nova atividade (Professor)
router.put('/atividades', AuthType(["PROFESSOR"]), activityController.putActivity) // Editar somente sua prória atividade (Professor)
router.delete('/atividades', AuthType(["PROFESSOR"]), activityController.deleteActivity) // Deletar somente sua própria atividade (Professor)

// =-=-=-=-= CRUD ATIVIDADES ALUNOS =-=-=-=-=
router.get('/atividades', activityController.getActivity) // Listar todas as atividades

// =-=-=-=-= TENTATIVAS =-=-=-=-=
router.post('/atividades/tentativa', AuthType(["ALUNO"]), attemptController.postAttempt) // Cria um novo registro de tentativa que será atualizado enquanto a atividade é feita 
router.put('/atividades/:id/tentativa', AuthType(["ALUNO"]), attemptController.putAttempt) // Atualiza o registro da tentativa que foi criada baseado no ID que é passado pelo parêmetro
router.get('/:id/historico-de-tentativas', AuthType(["ALUNO"]), attemptController.getAll_By_Student_Id) // Lista todo o histórico de tentativas realizado pelo aluno que o ID se refere
module.exports = router;