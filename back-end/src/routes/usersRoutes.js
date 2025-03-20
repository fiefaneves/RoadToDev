import cors from 'cors'; // Import cors
import express from 'express'
import UsersController from '../controllers/usersController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const routes = (app) => {

    app.use(express.json());
    app.use(cors()); // Enable cors 
    app.use(express.urlencoded({ extended: false }));

    app.post('/generate', UsersController.criarRoadMap);
    app.post("/user", UsersController.criarUsuario);
    app.post("/login", UsersController.login);
    app.post("/esqueci-senha", UsersController.forgotPassword);
    app.post("/mudar-senha/:resetToken", UsersController.resetPassword);

    
    app.get("/user/roadmap/:id/progresso", authMiddleware, UsersController.encontraProgressoRoadmap);
    app.get("/user/:id/roadmap", authMiddleware, UsersController.encontraRoadmap);
    app.get("/user/:id", authMiddleware, UsersController.encontraUsuario);
    app.get("/users", authMiddleware, UsersController.listarUsuarios);
    
    app.put("/user/roadmap/:roadMapId/atualizar-progresso", authMiddleware, UsersController.atualizarProgresso);
  
    app.delete("/user/roadmap/:id", authMiddleware, UsersController.deleteRoadMap);
  }

export default routes;