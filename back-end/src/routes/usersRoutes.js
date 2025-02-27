import cors from 'cors'; // Import cors
import express from 'express'
import UsersController from '../controllers/usersController.js';

const routes = (app) => {

    app.use(express.json());
    app.use(cors()); // Enable cors 
    app.use(express.urlencoded({ extended: false }));

    app.post('/generate', UsersController.criarRoadMap);
    app.post("/user", UsersController.criarUsuario);
    app.post("/login", UsersController.login);

    app.get("/user/:id/roadmap", UsersController.encontraRoadmap);
    app.get("/user/:id", UsersController.encontraUsuario);
    app.get("/users", UsersController.listarUsuarios);
}

export default routes;