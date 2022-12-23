const { request, response } = require('express');
const { db } = require('../database/connection');
const { generarJWT } = require('../helpers/generar-jwt')

login = async (req = request, res = response) => {

    try{

        const { run } = req.body

        const query =
        'SELECT person_id as uid, run, is_active FROM person WHERE run = ? and is_active = 1;';

        const paciente = await db.query(query, {
        replacements: [ run ],
        type: db.QueryTypes.SELECT
        });

        //Verificar si el rut existe
        if (paciente.length === 0){

            return res.status(400).json({
                msg: 'El Rut de usuario es incorrecto'
            })

        }else{

          console.log(paciente[0].uid)

          //Generar el JWT
          const token = await generarJWT(run);

          res.json({
              paciente, token
          })

        }

    }catch(error){

        console.log(error);
        res.status(500).json({
            msg: "Error 500"
        })

    }
}

module.exports = { login }
