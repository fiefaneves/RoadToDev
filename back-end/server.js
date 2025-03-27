import express from 'express'; 
import dotenv from 'dotenv'; 
import routes from './src/routes/usersRoutes.js';
import bodyParser from 'body-parser';
import conectar_db from './src/config/dbConnection.js';


dotenv.config(); 

const port = process.env.PORT || 3005;

const conexao = await conectar_db();

conexao.on("error", (erro)=>{
    console.error("erro de conexão", erro)
})
conexao.once("open",()=> {
    console.log("Conexão com o banco de dados feita com sucesso");
} )

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended : true }));

routes(app);



app.listen(port, () => { 
    console.log(`Server is running on port ${port}`);
});