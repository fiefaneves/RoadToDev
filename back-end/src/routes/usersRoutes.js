import cors from 'cors'; // Import cors
import  generate  from '../controllers/generative.js'; // Import controller functions
import express from 'express'
import user from '../models/usersModel.js';
import UsersController from '../controllers/usersController.js';

const routes = (app) => {

    app.use(cors()); // Enable cors 
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.post('/generate', UsersController.criarRoadMap);
}

export default routes;