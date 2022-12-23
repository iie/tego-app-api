const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares');

const router = Router();

router.post('/login',
    [check('run', 'El rut es obligatorio.').not().notEmpty(), validarCampos], login);

module.exports = router;
