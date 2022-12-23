const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { db } = require('../database/connection');


const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        const query =
        'SELECT person_id as uid FROM person WHERE person_id = ? and is_active = 1';

        const usuario = await db.query(query, {
        replacements: [ uid ],
        type: db.QueryTypes.SELECT
        });

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validarJWT
}
