import openai from '../config/open-ai.js'; // Importa o pacote openai
import generate from './generative.js';
import user from "../models/usersModel.js";
import roadMap from '../models/roadMapModel.js';

const UsersController = {
    async criarRoadMap(req, res) {
        // Get the answer from the form and send it to the OpenAI API
        const { queryDescription, userId } = req.body;

        try {
            const roadQuery = await generate(queryDescription); //Generate the roadmap
            const topics = roadQuery.split("\n\n"); //Turn the answer in an array of topics
            const arrayTopics = [];
            for(let i = 0; i < topics.length; i++){ //Fill the array that goes into the DB
                arrayTopics.push({ topic: topics[i], completed: false })
            }
            const userRoadmap = await user.findById(userId);//Find the user of the roadmap
            if(userRoadmap){
                const newRoadMap = await roadMap.create({ user: userId, topics: arrayTopics })//Create the roadmap
                userRoadmap.roadmaps.push(newRoadMap._id);//Add the roadmap to the user in DB
                await userRoadmap.save();//Save the changes 
                res.json({ response: roadQuery, topics: arrayTopics }); // Send the response
                console.log('Roadmap generated successfully'); // Log the generated roadmap
            }else{
                throw "Usuario não existe";
            }
        } catch (error) {
            console.error(error); // Log an error
            res.status(500).send('An error occurred'); // Send an error response
        }
    },

    async criarUsuario(req, res) {
        // Get the answer from the form and send it to the OpenAI API
        const { queryDescription, ...userInfo } = req.body;
        try {
            const roadQuery = await generate(queryDescription);
            const novoUser = await user.create({ ...userInfo, roadmap: roadQuery });
            console.log(novoUser);
            res.json({ message: "Usuario criado com sucesso", Usuario: novoUser }); // Send the response
            console.log('Usuario criado com sucesso'); // Log the generated roadmap
        } catch (error) {
            console.error(error); // Log an error
            res.status(500).send('An error occurred'); // Send an error response
        }
    },

    async listarUsuarios(req, res) {
        try {
            const listaUsers = await user.find({});
            res.status(200).json(listaUsers);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ message: "Erro na requisição" });
        }
    },

    async encontraUsuario(req, res) {
        try {
            const usuarioEncontrado = await user.findById(req.params.id);
            res.status(200).json(usuarioEncontrado);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ message: "Erro na requisição" });
        }
    },

    async encontraRoadmap(req, res) {
        const usuarioId = req.params.id;
        try {
            const usuarioProcurado = await user.findById(usuarioId);
            const roadmap = usuarioProcurado.roadmap;
            res.status(200).json({ roadmap: roadmap });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ message: "Erro na requisição" });
        }
    },

    async login(req, res) {
        const { email, senha } = req.body;
        try {
            const usuario = await user.findOne({ email, password: senha });
            if (!usuario) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            res.status(200).json({ message: "Login successful", data: usuario });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred" });
        }
    }
};

export default UsersController;