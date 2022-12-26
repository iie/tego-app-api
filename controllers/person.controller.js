const { response, request } = require('express');
const { db } = require('../database/connection');

consultarPorRut = async (req = request, res = response) => {

    try{

        const { run } = req.params

        const query =
        'SELECT a.person_id as uid, a.names, a.lastnames, a.run, a.birthdate, b.allergies, b.other_disease, b.medicine_dose, '+
        'GROUP_CONCAT(d.name) as enfermedades, e.weight, e.heigth '+
        'FROM person a '+
        'INNER JOIN general_anamnesis b ON a.person_id = b.person_id  '+
        'INNER JOIN general_anamnesis_has_disease c ON b.general_anamnesis_id = c.general_anamnesis_id '+
        'INNER JOIN disease d ON c.disease_id = d.disease_id  '+
        'INNER JOIN geriatric_medical_anamnesis e ON e.person_id = a.person_id '+
        'WHERE a.run = ?';

        const datos = await db.query(query, {
        replacements: [ run ],
        type: db.QueryTypes.SELECT
        });

        if(datos[0].uid == null){
            return res.status(400).json({
              msg: 'El Rut de usuario es incorrecto'
            })
        }else{
            res.json({
            misDatos: datos
            })
        }

    }catch(error){

        console.log(error);
        res.status(500).json({
            msg: "Error 500"
        })

    }
};

capsulasPorRut = async (req = request, res = response) => {
    try{

        const { run } = req.params

        const query =
        'SELECT pc.person_capsule_id, c.capsule_description, c.capsule_url ' +
        'FROM person_capsule pc JOIN capsule c on pc.capsule_id = c.capsule_id JOIN person p on pc.person_id = p.person_id ' +
        'WHERE p.is_active = 1 AND c.is_active = 1 AND p.run = ?;';

        const capsulas = await db.query(query, {
        replacements: [ run ],
        type: db.QueryTypes.SELECT
        });

        if (capsulas.length === 0){
          return res.status(400).json({
            msg: 'El Rut de usuario es incorrecto'
          })
        }else{
            res.json({
              capsulas: capsulas
            })
        }

    }catch(error){

        console.log(error);
        res.status(500).json({
            msg: "Error 500"
        })

    }
}

module.exports = {
    consultarPorRut, capsulasPorRut
}
