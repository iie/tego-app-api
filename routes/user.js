const express = require('express');
const router = express.Router();
const pool = require('../helpers/database');
const bcrypt = require('bcrypt');

router.get('/users', async function (req, res) {
    try {
        const sqlQuery = 'SELECT * FROM users;';
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message)
    }
});

module.exports = router;