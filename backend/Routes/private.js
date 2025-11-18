const express = require('express');
const router = express.Router();
const {AuthType} = require('../Middlewares/authType.js')

// =-=-=-=-= IMPORTANDO CONTROLLERS =-=-=-=-=
const studentListController = require('../Controllers/StudentListController.js')
const activityController = require('../Controllers/ActivityController.js')



// =-=-=-=-= ROTAS PRIVADAS DE FUNCIONALIDADES =-=-=-=-=

// =-=-=-=-= ALUNOS =-=-=-=-=
router.get('/listar-alunos', AuthType(["PROFESSOR"]), studentListController.getStudents);


// =-=-=-=-= ATIVIDADES =-=-=-=-=
router.get('/atividades', activityController.getActivity) // Listar todas as atividades
router.post('/atividades', AuthType(["PROFESSOR"]), activityController.postActivity) // Criar uma nova atividade (Professor)
router.put('/atividades', AuthType(["PROFESSOR"])) // Atualizar somente sua prória atividade (Professor)
router.delete('/atividades', AuthType(["PROFESSOR"])) // Deletar somente sua própria atividade




module.exports = router;

