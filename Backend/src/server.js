import express from 'express';
import configureViewEngine from './config/viewEngine.js';
import initWebRoutes from './routes/web.js';
import 'dotenv/config';
import bodyParser from 'body-parser';



const app = express();


//config view engine
configureViewEngine(app);

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//init web routes
initWebRoutes(app);

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}` + PORT);
})