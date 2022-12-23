const express = require('express');
const cors = require('cors');
const { db } = require('../database/connection');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.personPath = '/api/person';
        this.authPath = '/api/auth';
        this.citaPath = '/api/cita';

        //Conectar BD
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de la app
        this.routes();

    }

    async conectarDB(){

        try{
            await db.authenticate();
            console.log('Base de datos conectada');

        }catch(error){
            console.log(error)
            throw new Error('Error a la hora de iniciar la base de datos');
        }

    }

    middlewares(){

        //CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio público test
        this.app.use( express.static('public') );
    }

    routes(){

        this.app.use( this.authPath, require('../routes/auth'))
        this.app.use( this.citaPath, require('../routes/medical-appointment'))
        this.app.use( this.personPath, require('../routes/person'))

    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto: ', this.port);
        });
    }
}

module.exports = Server;
