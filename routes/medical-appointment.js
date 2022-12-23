const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { traerCita, definirAsistencia } = require('../controllers/medical-appointment.controller');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares');

router.get('/:run', [validarJWT], traerCita);

router.post('/asistencia',
    [validarJWT, check('respuesta', 'La respuesta es obligatoria.').not().notEmpty(),
    check('run', 'El run es obligatorio.').not().notEmpty(), check('respuesta').isIn([4,9]), validarCampos], definirAsistencia);

module.exports = router;
