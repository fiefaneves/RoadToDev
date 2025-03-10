import cors from 'cors'; // Import cors
import express from 'express'
import UsersController from '../controllers/usersController.js';
import linksRoadMap from '../controllers/linksControllers.js';

const routes = (app) => {

    app.use(express.json());
    app.use(cors()); // Enable cors 
    app.use(express.urlencoded({ extended: false }));

    app.post('/generate', UsersController.criarRoadMap);
    app.post("/user", UsersController.criarUsuario);
    app.post("/login", UsersController.login);
    app.post("/esqueci-senha", UsersController.forgotPassword);
    app.post("/mudar-senha/:resetToken", UsersController.resetPassword);

    app.get("/user/:id/roadmap", UsersController.encontraRoadmap);
    app.get("/user/:id", UsersController.encontraUsuario);
    app.get("/users", UsersController.listarUsuarios);
    app.get('/links/:tema', linksRoadMap);

}

export default routes;