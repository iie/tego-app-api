const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares');
const ratelimit = require("express-rate-limit");

const router = Router();
const limitaPeticiones = ratelimit({
    windowMs: 10 * 60 * 1000, // 10 minutos 
    max: 15,              // 15 intentos dentro de los 10 minutos
    message: { msg: 'Demasiados intentos, por favor intente mas tarde'},
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
})
router.post('/login',
    [check('run', 'El rut es obligatorio.').not().notEmpty(), validarCampos, limitaPeticiones], login);

module.exports = router;
