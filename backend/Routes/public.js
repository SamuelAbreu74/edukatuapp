const express = require('express')

// =-=-=-=-= IMPORTANDO CONTROLLERS =-=-=-=-=
const loginController = require('../Controllers/LoginController');

const router = express.Router();



// =-=-=-=-= LOGIN =-=-=-=-=
router.post('/login', loginController.postLogin) // ROTA PARA FAZER O LOGIN

// =-=-=-=-= REFRESH =-=-=-=-=
router.post('/refresh', loginController.postRefresh)

router.get('/', (req, res) => {
    res.send("Home Page")
})


module.exports = router;