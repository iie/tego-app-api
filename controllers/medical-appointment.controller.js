const { response, request } = require('express');
const { db } = require('../database/connection');
const now = require('moment');

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
                   
        }else if(citaMedica[0].cons_appo_date < now().format('YYYY-MM-DD')){ //Comparacion Fecha de la cita con la fecha actual
            return res.status(400).json({
                msg: 'No hay citas disponibles'
              })
        
        }else if(citaMedica[0].cons_appo_date === now().format('YYYY-MM-DD') && citaMedica[0].cons_appo_start <= now().format('HH:mm:ss')) //Comparacion de la hora de la cita con la hora actual
        {
            return res.status(400).json({
                msg: 'No hay citas disponibles'
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
        
        //validar status_id de la persona mediante el run       
        
        const validacionStatus = await validarStatusPersona(run);

        if(validacionStatus == undefined){
            return res.status(400).json({
                msg: 'El Rut de usuario es incorrecto'
              })
        }else if(!validacionStatus){
            return res.status(400).json({
                msg: 'El usuario ya realizo una accion'
              })
        }
        

        const query = 'UPDATE person SET status_id = ? WHERE run = ? ;';

        const asistencia = await db.query(query, {
        replacements: [ respuesta, run ],
        type: db.QueryTypes.UPDATE
        });
        
        respuesta === 9 
        ? res.json({respuesta: 'Se confirmó su atencion medica'}) 
        : res.json({respuesta: 'Se rechazó la atencion medica'}) 

    }catch(error){

        console.log(error);
        res.status(500).json({
            msg: "Error 500"
        })

    }
}

validarStatusPersona = async (run) =>{
    
    const query = 'select status_id from person where run = ?'
    try{
        
        const statusPersona = await db.query(query,{
            replacements: [run],
            type: db.QueryTypes.SELECT
        });
         
        if(statusPersona.length === 0){
            return undefined;

        }else if(statusPersona[0].status_id === 4 || statusPersona[0].status_id === 9 ) return false;
    
        return true;
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: "Error 500"
        })
    }
}

module.exports = { traerCita, definirAsistencia }
