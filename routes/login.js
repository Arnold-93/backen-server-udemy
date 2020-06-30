//para crear una nueva ruta
var express = require('express');
//necesitamos desincriptar la contraseña
var bcrypt = require('bcryptjs');
//generamos token
var jwt = require('jsonwebtoken');
//exportamos el SEED para el tocken creado en config.js
var SEED = require('../config/config').SEED;


//levantamos el express
var app = express();


//importamos  el modelo de usuario (usuario.js)
var Usuario = require('../models/usuario')

app.post('/', (req, res) => {

    var body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        //validacion general
        if (err) {
            let retorno =
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            return retorno;
        }
        //validacion de correo
        if (!usuarioDB) {
            let retorno =
                res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - email',
                    errors: err
                });
            return retorno;
        }
        //validacion de contraseña
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            let retorno =
                res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - password',
                    errors: err
                });
            return retorno;
        }
        //le decimos que no nos muestra la contraseña en su remplazo una cara feliz
        usuarioDB.password = ':)'
            //generamos nuestro toque que expira en 4 horas
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //4horas

        res.status(200).json({
            ok: true,
            usuarios: usuarioDB,
            id: usuarioDB.id,
            token: token
        })
    })



})



//para poder exportar esta ruta
module.exports = app;