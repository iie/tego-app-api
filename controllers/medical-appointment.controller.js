const { response, request } = require('express');
const { db } = require('../database/connection');

traerCita = async (req = request, res = response) => {

    try{

        const { run } = req.params

        const query =
            'SELECT b.cons_appo_date, b.cons_appo_start, a.names as names_pacient, a.lastnames as last_names_pacient, b.cons_appo_description,'+
            'b.cons_appo_place, c.names as name_professional, c.lastnames as last_names_professional '+
            'FROM person a '+
            'INNER JOIN consultation_appointment b ON a.person_id = b.person_id '+
            'INNER JOIN user c ON b.professional_id = c.user_id '+
            'WHERE a.run = ? and b.is_active = 1 '+
            'order by b.cons_appo_date DESC '+
            'limit 1;';

        const citaMedica = await db.query(query, {
        replacements: [ run ],
        type: db.QueryTypes.SELECT
        });

        if (citaMedica.length === 0){
          return res.status(400).json({
            msg: 'El Rut de usuario es incorrecto'
          })
        }else{
            res.json({
            cita: citaMedica
            })
        }

    }catch(error){

        console.log(error);
        res.status(500).json({
            msg: "Error 500"
        })

    }
}

definirAsistencia = async (req = request, res = response) => {

    try{

        const { respuesta, run } = req.body

        const query = 'UPDATE person SET status_id = ? WHERE run = ? ;';

        const asistencia = await db.query(query, {
        replacements: [ respuesta, run ],
        type: db.QueryTypes.UPDATE
        });

        res.json({
            respuesta: 'Se ha actualizado la asistencia.'
        })

    }catch(error){

        console.log(error);
        res.status(500).json({
            msg: "Error 500"
        })

    }
}


module.exports = { traerCita, definirAsistencia }
