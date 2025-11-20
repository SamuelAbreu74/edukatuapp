const express = require('express');
const router = express.Router();
const {AuthType} = require('../Middlewares/authType.js')

// =-=-=-=-= IMPORTANDO CONTROLLERS =-=-=-=-=
const studentListController = require('../Controllers/StudentListController.js')
const activityController = require('../Controllers/ActivityController.js')



// =-=-=-=-= ROTAS PRIVADAS DE FUNCIONALIDADES =-=-=-=-=

// =-=-=-=-= ALUNOS =-=-=-=-=
router.get('/listar-alunos', AuthType(["PROFESSOR"]), studentListController.getStudents);


// =-=-=-=-= CRUD ATIVIDADES PROFESSOR =-=-=-=-=
router.get('/minhas-atividades', AuthType(["PROFESSOR"]), activityController.getActivityById) // Listar somente as atividades do usuário logado
router.post('/atividades', AuthType(["PROFESSOR"]), activityController.postActivity) // Criar uma nova atividade (Professor)
router.put('/atividades', AuthType(["PROFESSOR"]), activityController.putActivity) // Editar somente sua prória atividade (Professor)
router.delete('/atividades', AuthType(["PROFESSOR"]), activityController.deleteActivity) // Deletar somente sua própria atividade (Professor)

// =-=-=-=-= ATIVIDADES =-=-=-=-=
router.get('/atividades', activityController.getActivity) // Listar todas as atividades



module.exports = router;