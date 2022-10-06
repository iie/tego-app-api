const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')

const app = express();

//Middleware
//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json());

//seteamos las variables de entorno
dotenv.config({ path: './env/.env' });

//para poder trabajar con las cookies
app.use(cookieParser())

//llamar al router
app.use('/', require('./routes/router'))

//Para eliminar la cache 
// app.use(function(req, res, next) {
//     if (!req.user)
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     next();
// });

app.listen(process.env.APP_PORT, () => {
    console.log(`Listening for requests on port ${process.env.APP_PORT}`)
})