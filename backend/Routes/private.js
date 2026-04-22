const express = require('express');
const router = express.Router();
const {AuthType} = require('../Middlewares/authType.js')

// =-=-=-=-= IMPORTANDO CONTROLLERS =-=-=-=-=

const studentListController = require('../Controllers/StudentListController.js')
const activityController = require('../Controllers/ActivityController.js')
const attemptController = require('../Controllers/AttemptController.js')
const registerController = require('../Controllers/RegisterController.js')
const usersController = require('../Controllers/UsersController.js')

// =-=-=-=-= ROTAS PRIVADAS DE FUNCIONALIDADES =-=-=-=-=

// =-=-=-=-= CRUD USUÁRIOS =-=-=-=-=

/**
  *  @swagger
  /usuarios:
  *    get:
  *        summary:  Listar  todos  os  usuários
  *        tags:  [Usuários Administrador]
  *        security:
  *            -  bearerAuth:  []  
  *        responses:
  *            200:
  *                description:  Lista  de  usuários  retornada  com  sucesso
  *    post:
  *        summary:  Criar  um  novo  usuário
  *        tags:  [Usuários Administrador]
  *        security:
  *            -  bearerAuth:  []  
  *        requestBody:
  *            required:  true
  *            content:
  *                application/json:
  *                    schema:
  *                        type:  object
  *                        properties:
  *                            name:
  *                                type:  string
  *                            email:
  *                                type:  string
  *                            password:
  *                                type:  string
  *                            role:
  *                                type:  string
  *                                enum:  [ADMINISTRADOR,  PROFESSOR,  ALUNO]
  *        responses:
  *            201:
  *                description:  Usuário  criado
  *    put:
  *        summary:  Editar  um  usuário
  *        tags:  [Usuários Administrador]
  *        security:
  *            -  bearerAuth:  []  
  *        responses:
  *            200:
  *                description:  Usuário  atualizado
  *    delete:
  *        summary:  Deletar  um  usuário
  *        tags:  [Usuários Administrador]
  *        security:
  *            -  bearerAuth:  []  
  *        responses:
  *            200:
  *                description:  Usuário  removido
  */
router.get('/usuarios', AuthType(["ADMINISTRADOR"]), usersController.getUsers) // ROTA PARA LISTAR TODOS OS USUÁRIOS
router.post('/usuarios', AuthType(["ADMINISTRADOR"]), registerController.postRegister) // ROTA PARA CRIA UM NOVO USUÁRIO
router.put('/usuarios', AuthType(["ADMINISTRADOR"]), usersController.putUser) // ROTA PARA EDITAR UM USUÁRIO
router.delete('/usuarios', AuthType(["ADMINISTRADOR"]), usersController.deleteUser) // ROTA PARA DELETAR UM USUÁRIO


// =-=-=-=-= CRUD ALUNOS =-=-=-=-=
/**
  *  @swagger
  /listar-alunos:
  *    get:
  *        summary:  Listar  todos  os  alunos
  *        tags:  [Alunos]
  *        security:
  *            -  bearerAuth:  []  
  *        responses:
  *            200:
  *                description:  Sucesso
  *
  /minhas-atividades:
  *    get:
  *        summary:  Listar  atividades  do  professor  logado
  *        tags:  [Atividades  Professor]
  *        security:
  *            -  bearerAuth:  []  
  *        responses:
  *            200:
  *                description:  Lista  de  atividades
  *
  /atividades:
  *    get:
  *        summary:  Listar  todas  as  atividades geral
  *        tags:  [Atividades]
  *        responses:
  *            200:
  *                description:  Sucesso
  *    post:
  *        summary:  Criar  nova  atividade
  *        tags:  [Atividades  Professor]
  *        security:
  *            -  bearerAuth:  []  
  *        responses:
  *            201:
  *                description:  Atividade  criada
  *    put:
  *        summary:  Editar  atividade  própria
  *        tags:  [Atividades  Professor]
  *        security:
  *            -  bearerAuth:  []  
  *        responses:
  *            200:
  *                description:  Editado
  *    delete:
  *        summary:  Deletar  atividade  própria
  *        tags:  [Atividades  Professor]
  *        security:
  *            -  bearerAuth:  []  
  *        responses:
  *            200:
  *                description:  Deletado
  */
router.get('/listar-alunos', AuthType(["PROFESSOR", "ADMINISTRADOR"]), studentListController.getStudents);

// =-=-=-=-= CRUD ATIVIDADES PROFESSOR =-=-=-=-=
router.get('/minhas-atividades', AuthType(["PROFESSOR"]), activityController.getActivityByTeacherId) // Listar somente as atividades do usuário logado
router.post('/atividades', AuthType(["PROFESSOR"]), activityController.postActivity) // Criar uma nova atividade (Professor)
router.put('/atividades', AuthType(["PROFESSOR"]), activityController.putActivity) // Editar somente sua prória atividade (Professor)
router.delete('/atividades', AuthType(["PROFESSOR"]), activityController.deleteActivity) // Deletar somente sua própria atividade (Professor)

// =-=-=-=-= CRUD ATIVIDADES ALUNOS =-=-=-=-=
router.get('/atividades', activityController.getActivity) // Listar todas as atividades

// =-=-=-=-= TENTATIVAS =-=-=-=-=
/**
  *  @swagger
   /atividades/tentativa:
  *     post:
  *         summary:  Criar  novo  registro  de  tentativa
  *         tags:  [Tentativas]
  *         security:
  *             -  bearerAuth:  []  
  *         responses:
  *             201:
  *                 description:  Tentativa  iniciada
  * 
   /atividades/{id}/tentativa:
  *     put:
  *         summary:  Atualizar  progresso  da  tentativa
  *         tags:  [Tentativas]
  *         security:
  *             -  bearerAuth:  []  
  *         parameters:
  *                 in:  path
  *                 name:  id
  *                 required:  true
  *                 schema:
  *                     type:  string
  *         responses:
  *             200:
  *                 description:  Progresso  salvo
  * 
   /{id}/historico-de-tentativas:
  *     get:
  *         summary:  Listar  histórico  de  tentativas  do  aluno
  *         tags:  [Tentativas]
  *         security:
  *             -  bearerAuth:  []  
  *         parameters:
  *                 in:  path
  *                 name:  id
  *                 required:  true
  *                 schema:
  *                     type:  string
  *         responses:
  *             200:
  *                 description:  Histórico  retornado
  */
router.post('/atividades/tentativa', AuthType(["ALUNO"]), attemptController.postAttempt) // Cria um novo registro de tentativa que será atualizado enquanto a atividade é feita 
router.put('/atividades/:id/tentativa', AuthType(["ALUNO"]), attemptController.putAttempt) // Atualiza o registro da tentativa que foi criada baseado no ID que é passado pelo parêmetro
router.get('/:id/historico-de-tentativas', AuthType(["ALUNO"]), attemptController.getAll_By_Student_Id) // Lista todo o histórico de tentativas realizado pelo aluno que o ID se refere
module.exports = router;