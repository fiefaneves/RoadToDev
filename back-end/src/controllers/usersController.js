// import openai from '../config/open-ai.js'; // Importa o pacote openai
// import readlineSync from 'readline-sync'; // Importa o pacote readline-sync
// import colors from 'colors'; // Importa o pacote colors
import generate from './generative.js';
import user from "../models/usersModel.js";
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UsersController {
    static async criarRoadMap(req, res){
        // Get the answer from the form and send it to the OpenAI API
        const { queryDescription } = req.body;
        
        try {
            const roadQuery = await generate(queryDescription);
            res.json({response: roadQuery}); // Send the response
            console.log('Roadmap generated successfully'); // Log the generated roadmap
        } catch (error) {
            console.error(error); // Log an error
            res.status(500).send('An error occurred'); // Send an error response
        }
    }

    // static async criarUsuario(req, res){
    //     // Get the answer from the form and send it to the OpenAI API
    //     const { queryDescription , ...userInfo} = req.body;
    //     console.log(userInfo)
    //     try {
    //         const roadQuery = await generate(queryDescription);
    //         const novoUser = await user.create({...userInfo, roadmap: roadQuery})
    //         console.log(novoUser)
    //         res.json({ message: "Usuario criado com sucesso", Usuario: novoUser}); // Send the response
    //         console.log('Usuario criado com sucesso'); // Log the generated roadmap
    //     } catch (error) {
    //         console.error(error); // Log an error
    //         res.status(500).send('An error occurred'); // Send an error response
    //     }
    // }

    static async criarUsuario(req, res){
        try {
            const { name, username, email, number, password} = req.body;
        
            // Check if the email already exists
            const existingEmail = await User.findOne({ email });
            if (existingEmail) return res.status(400).json({ error: "Email já cadastrado!" });
        
            // Check if the user already exists
            const existingUser = await User.findOne({username});
            if(existingUser) return res.status(400).json({message: "Usuário já existe!"});
        
            // Check if the number already exists
            const existingNumber = await User.findOne({ number });
            if (existingNumber) return res.status(400).json({ error: "Número já cadastrado!" });
            
            // Hash the password
            const saltRounds = 10; // Hash security 
            const hashedPassword = await bcrypt.hash(password, saltRounds);
        
            // Create a new user
            const newUser = new User({
              name,
              username,
              email,
              number,
              password: hashedPassword,
            });
        
            // Save the user to the database
            await newUser.save();
        
            // Return a success message
            res.status(201).json({ message: "Usuário criado com sucesso!" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao registrar usuário!" });
        }
    }

    static async listarUsuarios(req, res) {
        try{
            const listaUsers = await user.find({});
            res.status(200).json(listaUsers);
        }catch(erro){
            console.error(erro)
            res.status(500).json({message: "Erro na requisição"})
        }
    }

    static async encontraUsuario(req, res) {
        try{
            const usuarioEncontrado = await user.findById(req.params.id);
            res.status(200).json(usuarioEncontrado);
        } catch(erro){
            console.error(erro)
            res.status(500).json({message: "Erro na requisição"})
        }
    }

    static async encontraRoadmap(req, res){
        const usuarioId = req.params.id;
        try{
            const usuarioProcurado = await user.findById(usuarioId);
            const roadmap = usuarioProcurado.roadmap;
            res.status(200).json({ roadmap: roadmap});
        }catch(erro){
            console.error(erro)
            res.status(500).json({message: "Erro na requisição"})
        }
    }

    static async login(req, res){
        const comparePassword = async (password, hashedPassword) => {
            return await bycrypt.compare(password, hashedPassword);
        }

        const generateToken = (userId) => {
            return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
        }

        const {email, senha} = req.body;
        try{
            const usuario = await user.findOne({ email });
            if (!usuario) return res.status(401).json({ message: "Email não encontrado. Faça seu cadastro!" });
            
            const isMatch = await comparePassword(senha, usuario.password);
            if (!isMatch) return res.status(401).json({ message: "Senha incorreta!" });

            const token = generateToken(user._id);
            res.status(200).json({ message: "Login feito com sucesso!", data: usuario.data, token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro na autenticação do usuário." });
        }
    }
};

export default UsersController;