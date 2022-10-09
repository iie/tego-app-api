const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const conexion = require("../helpers/database");
const { promisify } = require("util");

exports.register = async (req, res) => {
    try {
        const { user, name, pass } = req.body;
        const passHash = await bcryptjs.hash(pass, 8);
        //console.log(passHash)
        conexion.query(
            "INSERT INTO users SET ?",
            { user: user, name: name, pass: passHash },
            (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.status(201).send(req.body);
                }
            }
        );
    } catch (e) {
        console.log(e);
        res.status(500).send("There was a problem registering your user");
    }
};

exports.login = async (req, res) => {
    try {

        const user = req.body.user;
        const pass = req.body.pass;

        console.log(user);
        console.log(pass);

        if (!user || !pass) {
            res.status(401).send("Ingrese un usuario y contraseña");
        } else {
            conexion.query(
                "SELECT * FROM users WHERE user = ?",
                [user],
                async (error, results) => {
                    if (
                        results.length == 0 ||
                        !(await bcryptjs.compare(pass, results[0].pass))
                    ) {
                        res.status(500).send("Usuario y/o Password incorrectas");
                    } else {
                        //inicio de sesión OK
                        const id = results[0].id;

                        //generamos el token
                        const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                            expiresIn: process.env.JWT_TIEMPO_EXPIRA,
                        });

                        console.log("TOKEN: " + token + " para el USUARIO : " + user);
                        res.status(200).json({ auth: true, token });
                    }
                }
            );
        }
    } catch (error) {
        res.status(500).send('Hubo un problema en el inicio de sesión');
        console.log(error);
    }
};

exports.isAuthenticated = async (req, res) => {
    console.log(req.body);
    console.log(res.body);
    if (req.body.token) {
        console.log('avios');
        try {
            const decodificada = await promisify(jwt.verify)(
                req.body.token,
                process.env.JWT_SECRETO
            );
            conexion.query(
                "SELECT * FROM users WHERE id = ?",
                [decodificada.id],
                (error, results) => {
                    console.log('resultaods');
                    console.log(results);
                    if (!results) {
                        res.status(403).send();
                    }
                    res.status(200).send();
                }
            );
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(404).send();
    }
};

// exports.logout = (req, res) => {
//     res.clearCookie("jwt");
//     return res.status(200).send();
// };
