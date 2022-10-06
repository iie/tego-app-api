const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const conexion = require("../helpers/database");
// const { promisify } = require("util");

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

        const user=req.body.user;
        const  pass  = req.body.pass;

        console.log(user);
        console.log(pass);

        if (!user || !pass) {
            res.status(404).send("ingrese un usuario y contraseña");
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
                        const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                            expiresIn: process.env.JWT_TIEMPO_EXPIRA,
                        });
                        //generamos el token SIN fecha de expiracion
                        //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                        console.log("TOKEN: " + token + " para el USUARIO : " + user);

                        const cookiesOptions = {
                            expires: new Date(
                                Date.now() +
                                process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                            ),
                            httpOnly: true,
                        };
                        // res.cookie("jwt", token, cookiesOptions);
                        // res.status(200).send("¡LOGIN CORRECTO!");
                        res.status(200).json({ auth: true, token });
                    }
                }
            );
        }
    } catch (error) {
        console.log(error);
    }
};

// exports.isAuthenticated = async (req, res, next) => {
//     if (req.cookies.jwt) {
//         try {
//             const decodificada = await promisify(jwt.verify)(
//                 req.cookies.jwt,
//                 process.env.JWT_SECRETO
//             );
//             conexion.query(
//                 "SELECT * FROM users WHERE id = ?",
//                 [decodificada.id],
//                 (error, results) => {
//                     if (!results) {
//                         return next();
//                     }
//                     req.user = results[0];
//                     return next();
//                 }
//             );
//         } catch (error) {
//             console.log(error);
//             return next();
//         }
//     } else {
//         res.redirect("/login");
//     }
// };

exports.logout = (req, res) => {
    res.clearCookie("jwt");
    return res.status(200).send();
};
