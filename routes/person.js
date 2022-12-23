const { Router } = require('express');
const router = Router();
const { consultarPorRut, capsulasPorRut } = require('../controllers/person.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

router.get('/:run', [validarJWT] , consultarPorRut);
router.get('/capsulas/:run', [validarJWT] , capsulasPorRut);

module.exports = router;
