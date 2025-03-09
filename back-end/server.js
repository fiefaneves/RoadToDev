import express from 'express'; // Import express
import dotenv from 'dotenv';  // Import dotenv
import routes from './src/routes/usersRoutes.js';
import bodyParser from 'body-parser';
import conectar_db from './src/config/dbConnection.js';
import exibirLinksPorTema  from './src/controllers/linksControllers.js'; // Importa a função exibirLinksPorTema



dotenv.config(); // Load dotenv

const port = process.env.PORT || 3005; // Define port

const conexao = await conectar_db();

conexao.on("error", (erro)=>{
    console.error("erro de conexão", erro)
})
conexao.once("open",()=> {
    console.log("Conexão com o banco de dados feita com sucesso");
} )

const app = express(); // Create express app

routes(app);

app.get('/links/:tema', async (req, res) => {//define uma rota get que tem tema como parametro, async [e o manioulador dessa rota 
    const tema = req.params.tema;//extrai o valor de tema da url da solicitacao
    await exibirLinksPorTema(tema);
    res.send('Links exibidos no console.');
});

app.listen(port, () => { // Start the server
    console.log(`Server is running on port ${port}`); // Log a message
});