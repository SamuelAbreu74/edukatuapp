const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.js');
const app = express();

// =-=-=-=-= IMPORTANDO ROTAS =-=-=-=-=
const PublicRouter = require('./Routes/public.js');
const PrivateRouter = require('./Routes/private.js')
const Auth = require('./Middlewares/auth.js')



// Para conseguir utilizar o req.body
app.use(express.json());


// Rotas Públicas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', PublicRouter);
app.use('/', Auth, PrivateRouter);

// Rodando o Server
app.listen(3000, () => {
    console.log("Server Rodando em: http://localhost:3000");
})


