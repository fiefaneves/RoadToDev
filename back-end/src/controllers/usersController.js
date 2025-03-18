// import openai from '../config/open-ai.js'; // Importa o pacote openai
import generate from './generative.js';
import user from "../models/usersModel.js";
import roadMap from '../models/roadMapModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


const UsersController = {
    async criarRoadMap(req, res){
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
            if(!userRoadmap){
                throw new Error("Usuario não existe");
            }
            const newRoadMap = await roadMap.create({ user: userId, topics: arrayTopics })//Create the roadmap
            userRoadmap.roadmaps.push(newRoadMap._id);//Add the roadmap to the user in DB
            await userRoadmap.save();//Save the changes 
            res.json({ response: roadQuery, topics: arrayTopics }); // Send the response
            console.log('Roadmap generated successfully'); // Log the generated roadmap
            
        } catch (error) {
            console.error(error); // Log an error
            res.status(500).send('An error occurred'); // Send an error response
        }
    },

    async criarUsuario(req, res){
        try {
            const { name, username, email, number, password} = req.body;

            const validateNumber = (number) => {
                const numberRegex = /^(?:\+?55\s?)?(?:\(?\d{2,3}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}$/;
                return numberRegex.test(number);
            };        
            if (!validateNumber(number)) {
                return res.status(400).json({ error: "Número de telefone inválido!" });
            }
            const validatePassword = (password) => {
                const minLength = 8;
                const hasUpperCase = /[A-Z]/.test(password);
                const hasLowerCase = /[a-z]/.test(password);
                const hasNumber = /\d/.test(password);
                const hasSpecialChar = /[\W_]/.test(password);
                if (password.length < minLength) return "A senha deve ter no mínimo 8 caracteres!";
                if (!hasUpperCase) return "A senha deve ter no mínimo uma letra maiúscula!";
                if (!hasLowerCase) return "A senha deve ter no mínimo uma letra minúscula!";
                if (!hasNumber) return "A senha deve ter no mínimo um número!";
                if (!hasSpecialChar) return "A senha deve ter no mínimo um caractere especial!";
                return true;
            }
            const passwordError = validatePassword(password);
            if (passwordError !== true) return res.status(400).json({ error: passwordError });
            
            // Check if the email already exists
            const existingEmail = await user.findOne({ email });
            if (existingEmail) return res.status(400).json({ error: "E-mail já cadastrado!" });
        
            // Check if the user already exists
            const existingUser = await user.findOne({username});
            if(existingUser) return res.status(400).json({message: "Usuário já existe!"});
        
            // Check if the number already exists
            const existingNumber = await user.findOne({ number });
            if (existingNumber) return res.status(400).json({ error: "Número já cadastrado!" });
            
            // Hash the password
            const saltRounds = 10; // Hash security 
            const hashedPassword = await bcrypt.hash(password, saltRounds);
        
            // Create a new user
            const newUser = new user({
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
            res.status(500).json({ message: "Erro ao registrar usuário!", error: error.message });
        }
    },

    async listarUsuarios(req, res) {
        try{
            const listaUsers = await user.find({});
            res.status(200).json(listaUsers);
        }catch(erro){
            console.error(erro)
            res.status(500).json({message: "Erro na requisição"})
        }
    },

    async encontraUsuario(req, res) {
        try{
            const usuarioEncontrado = await user.findById(req.params.id);
            res.status(200).json(usuarioEncontrado);
        } catch(erro){
            console.error(erro)
            res.status(500).json({message: "Erro na requisição"})
        }
    },

    async encontraRoadmap(req, res){
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

    async login(req, res){
        const generateToken = (userId) => {
            return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
        }

        const {email, password} = req.body;
        try{

            //if (!email || !senha) return res.status(400).json({ message: "Preencha todos os campos!" });
            //const usuario = await user.findOne({ email });
            
            const usuario = await user.findOne({ email }).select('+password');
            if (!usuario) return res.status(401).json({ message: "Email não encontrado. Faça seu cadastro!" });
            
            const isMatch = await bcrypt.compare(password, usuario.password);
            if (!isMatch) return res.status(401).json({ message: "Senha incorreta!" });

            const token = generateToken(usuario._id);
            res.status(200).json({ message: "Login feito com sucesso!", data: usuario, token });
        } catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ message: "Erro na autenticação do usuário.", error: error.message });
        }
    },

    async forgotPassword(req, res){
        const { email } = req.body;
        try {
            const usuario = await user.findOne({ email });
            if (!usuario) return res.status(400).json({ message: "Email não encontrado!" });
        
            // Gera um token temporário para resetar a senha
            const resetToken = crypto.randomBytes(20).toString("hex");
            usuario.resetPasswordToken = resetToken;
            usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora de validade
            await usuario.save();

            // Configurações para envio de email
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER, // email de envio
                    pass: process.env.EMAIL_PASS, // senha do email de envio
                },
            });

            // Enviar email
            const mailOptions = {
                to: usuario.email,
                from: process.env.EMAIL_USER,
                subject: 'Redefinição de Senha',
                text: `Você solicitou a redefinição de senha. Acesse o link abaixo para criar uma nova senha:
                http://localhost:3000/mudar-senha/${resetToken}
                Esse link expira em 1 hora.`,
            };

            await transporter.sendMail(mailOptions);
            res.json({ message: "E-mail de recuperação enviado!" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao processar solicitação!", error: error.message });
        }
    },
    
    async resetPassword(req, res){
        const { token, newPassword } = req.body;

        try {
            const usuario = await user.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            });

            if (!usuario) return res.status(400).json({ message: "Token inválido ou expirado!" });

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            usuario.password = hashedPassword;
            usuario.resetPasswordToken = undefined;
            usuario.resetPasswordExpires = undefined;
            await usuario.save();

            res.json({ message: "Senha redefinida com sucesso" });
        } catch (error) {
            res.status(500).json({ message: "Erro ao redefinir senha", error: error.message });
        }
    },

    async atualizarProgresso(req, res) {
        const roadMapId = req.params.roadMapId;
        const topics = req.body.topics;

        try{
            let aux = 0;
            for(let i = 0; i < topics.length; i++){
                if(topics[i].completed === true){
                    aux++;
                }
            }
            const progress = 100 * (aux / topics.length);
            const updateInfo = { progress: progress, topics: topics }
            console.log(updateInfo);
            console.log(roadMapId);
            const roadMapReturn = await roadMap.findByIdAndUpdate(roadMapId, updateInfo);
            console.log(roadMapReturn);
            if (!roadMapReturn) {
                return res.status(404).json({ message: "RoadMap não encontrado" });
            }
            res.status(200).json({message: "Progresso atualizado"})
        }catch(erro){
            res.status(500).json({message: "Falha na atualização do progresso", erro: erro.message })
        }

    },

    async encontraProgressoRoadmap(req, res){
        const roadMapId = req.params.id;

        try{
            const roadMapReturn = await roadMap.findById(roadMapId);
            if(!roadMapReturn){
                return res.status(400).json({message: "Roadmap não encotrado"})
            }
            res.status(200).json({ progress: roadMapReturn.progress });
        }catch(error){
            res.status(500).json({ message: "erro ao retornar progresso", erro: error.message })
        }
    },

    async deleteRoadMap(req, res){
        const roadMapId = req.params.id;

        try{
            const deletedRoad = await roadMap.findById(roadMapId);
            if(!deletedRoad){
                return res.status(400).json({message: "Roadmap não encontrado"})
            }
            const userIdRoadMap = deletedRoad.user; 
            const userRoadMap = await user.findById(userIdRoadMap);
            if(!userRoadMap){
                return res.status(400).json({message: "Usuario não encontrado"})
            }

            await roadMap.findByIdAndDelete(roadMapId);

            userRoadMap.roadmaps = userRoadMap.roadmaps.filter( id => { return id.toString() !== roadMapId.toString() })
            await userRoadMap.save()
            res.status(200).json({ message: "Roadmap deletado com sucesso "})
        }catch(error){
            res.status(500).json({message: "Problema ao deletar roadmap", erro: error.message })
        }
    }

};

export default UsersController;