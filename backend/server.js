const express = require('express');
const app = express();


// Rodando o Server
app.listen(3000, () => {
    console.log("Server Rodando em: http://localhost:3000");
})

// Página Teste
app.get("/", (req , res) => {
    res.send("Hello World!");
})