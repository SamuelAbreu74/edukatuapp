const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path'); 

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EDUKATUAPP ROTAS',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [
    path.join(__dirname, 'Routes/*.js') 
  ], 
};



const specs = swaggerJsdoc(options);
module.exports = specs;