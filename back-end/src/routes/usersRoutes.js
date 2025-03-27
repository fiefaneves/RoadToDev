import cors from 'cors';
import  generate  from '../controllers/generative.js';
import express from 'express'
import UsersController from '../controllers/usersController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const routes = (app) => {

    app.use(cors({
      origin: [
        "https://road-to-dev.vercel.app",
        "http://localhost:3000/"
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.post('/generate', UsersController.criarRoadMap);
    app.post("/user", UsersController.criarUsuario);
    app.post("/login", UsersController.login);
    app.post("/esqueci-senha", UsersController.forgotPassword);
    app.post("/mudar-senha", UsersController.resetPassword);

    
    app.get("/user/roadmap/:id/progresso", authMiddleware, UsersController.encontraProgressoRoadmap);
    app.get("/user/:id/roadmap", authMiddleware, UsersController.encontraRoadmap);
    app.get("/user/:id", authMiddleware, UsersController.encontraUsuario);
    app.get("/user/:id/roadmaps", authMiddleware, UsersController.listarRoadmaps);
    app.get("/users", authMiddleware, UsersController.listarUsuarios);
    
    app.put("/user/roadmap/:roadMapId/atualizar-progresso", authMiddleware, UsersController.atualizarProgresso);
    app.put("/user/roadmap/editar-nome", UsersController.editarNomeRoadmap)
  
    app.delete("/user/roadmap/:id", authMiddleware, UsersController.deleteRoadMap);
  }

export default routes;