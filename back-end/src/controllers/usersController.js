import generate from './generative.js';
import user from "../models/usersModel.js";
import roadMap from '../models/roadMapModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { exibirLinksPorTema } from './linksController.js';



const UsersController = {
    async criarRoadMap(req, res){
        const { queryDescription, userId, tema } = req.body;
        
        try {
            const roadQuery = await generate(queryDescription);
            const topics = roadQuery.split("\n\n");
            const arrayTopics = [];
            for(let i = 0; i < topics.length; i++){
                arrayTopics.push({ topic: topics[i], completed: false })
            }
            const userRoadmap = await user.findById(userId);
            if(!userRoadmap){
                throw new Error("Usuario não existe");
            }

            const links = await exibirLinksPorTema(tema);
            console.log("Links gerados:", links);

            const roadmapName = `${tema}`;

            const newRoadMap = await roadMap.create({ user: userId, topics: arrayTopics, links, name: `${tema}` })
            userRoadmap.roadmaps.push(newRoadMap._id);
            await userRoadmap.save();
            res.status(201).json({ response: roadQuery, topics: arrayTopics, roadMapId: newRoadMap._id });
            console.log('Roadmap generated successfully');
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error ocurred", error: error.message });
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
            
            const existingEmail = await user.findOne({ email });
            if (existingEmail) return res.status(400).json({ error: "E-mail já cadastrado!" });
        
            const existingUser = await user.findOne({username});
            if(existingUser) return res.status(400).json({message: "Usuário já existe!"});
        
            const existingNumber = await user.findOne({ number });
            if (existingNumber) return res.status(400).json({ error: "Número já cadastrado!" });
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
        
            const newUser = new user({
              name,
              username,
              email,
              number,
              password: hashedPassword,
            });
        
            await newUser.save();
        
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
            const requestedUserId = req.params.id;
            const authUserId = req.user.id;

            if (requestedUserId !== authUserId.toString()) {
                return res.status(403).json({ message: "Acesso não autorizado" });
            }

            const usuarioEncontrado = await user.findById(req.params.id);
            res.status(200).json(usuarioEncontrado);
        } catch(erro){
            console.error(erro)
            res.status(500).json({message: "Erro na requisição"})
        }
    },

    async encontraRoadmap(req, res){
        const roadMapId = req.params.id;
        try {
            const roadMapProcurado = await roadMap.findById(roadMapId);
            res.status(200).json({ roadmap: roadMapProcurado });
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
         
            const usuario = await user.findOne({ email }).select('+password');
            if (!usuario) return res.status(401).json({ message: "Email não encontrado. Faça seu cadastro!" });
            
            const isMatch = await bcrypt.compare(password, usuario.password);
            if (!isMatch) return res.status(401).json({ message: "Senha incorreta!" });

            const token = generateToken(usuario._id);
            res.status(200).json({ message: "Login feito com sucesso!", data: usuario, userId: usuario._id, token });
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
        
            const resetToken = crypto.randomBytes(20).toString("hex");
            usuario.resetPasswordToken = resetToken;
            usuario.resetPasswordExpires = Date.now() + 3600000;
            await usuario.save();

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                to: usuario.email,
                from: process.env.EMAIL_USER,
                subject: 'Redefinição de Senha - Road To Dev',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <h2 style="color: #2563eb;">Olá, ${usuario.name || 'usuário'}!</h2>
                    <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Road To Dev</strong>.</p>
                    <p>Para criar uma nova senha, clique no link abaixo:</p>
                    <p>
                        <a href="https://road-to-dev.vercel.app/mudar-senha/${resetToken}" 
                        style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px;">
                        Redefinir Senha
                        </a>
                    </p>
                    <p>Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanecerá a mesma.</p>
                    <p><strong>Este link expira em 1 hora.</strong></p>
                    <p>Atenciosamente,</p>
                    <p><strong>Equipe Road To Dev.</strong></p>
                    <p style="font-size: 0.9em; color: #666;">
                        Se tiver alguma dúvida, entre em contato conosco pelo e-mail: 
                        <a href="mailto:roadtodev24@gmail.com" style="color: #2563eb;">roadtodev24@gmail.com</a>.
                    </p>
                    </div>
                `,
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
    },

    async listarRoadmaps(req, res) {
        try {
            const userId = req.params.id;
            const usuario = await user.findById(userId).populate('roadmaps');
            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            res.status(200).json({ roadmaps: usuario.roadmaps });
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar roadmaps", error: error.message });
        }
    },

    async editarNomeRoadmap(req, res) {
        const { roadMapId, newName } = req.body;

        try {
            const updatedRoadmap = await roadMap.findByIdAndUpdate(
                roadMapId,
                { name: newName },
                { new: true }
            );

            if (!updatedRoadmap) {
                return res.status(404).json({ message: "Roadmap não encontrado" });
            }

            res.status(200).json({ message: "Nome do roadmap atualizado com sucesso", roadmap: updatedRoadmap });
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar nome do roadmap", error: error.message });
        }
    }
}


export default UsersController;