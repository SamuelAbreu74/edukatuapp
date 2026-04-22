

const express = require('express')

// =-=-=-=-= IMPORTANDO CONTROLLERS =-=-=-=-=
const loginController = require('../Controllers/LoginController');

const router = express.Router();



/**
 * @swagger
 /login:
 *  post:
 *    summary: Realiza o login do usuário
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Sucesso
 *      401:
 *        description: Credenciais inválidas
 */
// =-=-=-=-= LOGIN =-=-=-=-=
router.post('/login', loginController.postLogin) // ROTA PARA FAZER O LOGIN

// =-=-=-=-= REFRESH =-=-=-=-=
router.post('/refresh', loginController.postRefresh)

router.get('/', (req, res) => {
    res.send("Home Page")
})


module.exports = router;