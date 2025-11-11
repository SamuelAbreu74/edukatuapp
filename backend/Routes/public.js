const express = require('express')

// =-=-=-=-= IMPORTANDO CONTROLLERS =-=-=-=-=
const loginController = require('../Controllers/LoginController');
const registerController = require('../Controllers/RegisterController')

const router = express.Router();



// =-=-=-=-= CADASTRO/REGISTER =-=-=-=-=
router.post('/cadastro', registerController.postRegister) // ROTA PARA CRIA UM NOVO USUÁRIO


// =-=-=-=-= LOGIN =-=-=-=-=
router.post('/login', loginController.postLogin) // ROTA PARA FAZER O LOGIN


module.exports = router;