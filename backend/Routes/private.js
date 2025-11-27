const express = require('express');
const router = express.Router();
const {AuthType} = require('../Middlewares/authType.js')

// =-=-=-=-= IMPORTANDO CONTROLLERS =-=-=-=-=
const studentListController = require('../Controllers/StudentListController.js')
const activityController = require('../Controllers/ActivityController.js')
const attemptController = require('../Controllers/AttemptController.js')


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
router.post('/atividades/tentativa', AuthType(["ALUNO"]), attemptController.postAttempt) // Cria um novo registro de tentativa que será atualizado enquanto a atividade é feita 
router.put('/atividades/:id/tentativa', AuthType(["ALUNO"]), attemptController.putAttempt)

module.exports = router;