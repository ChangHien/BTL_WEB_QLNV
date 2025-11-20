import express from 'express';
import homeController from '../controllers/homeController.js';

const router = express.Router()

const initWebRoutes = (app) => {
    router.get('/', homeController.handleHeloword);
    router.get('/', (req, res) => {
        return res.send("Hello world");
    });

    return app.use('/', router);
}

export default initWebRoutes;