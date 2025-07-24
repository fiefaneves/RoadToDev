import express from 'express'; 
import dotenv from 'dotenv'; 
import routes from './src/routes/usersRoutes.js';
import bodyParser from 'body-parser';
import conectar_db from './src/config/dbConnection.js';
import cors from 'cors';


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

app.use(cors({
      origin: [
        "https://road-to-dev.vercel.app",
        "http://localhost:3000",
        "http://192.168.0.196:3000"
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);



app.listen(port, () => { 
    console.log(`Server is running on port ${port}`);
});