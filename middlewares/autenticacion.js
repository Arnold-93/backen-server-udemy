//generamos token
var jwt = require('jsonwebtoken');
//exportamos el SEED para el tocken creado en config.js
var SEED = require('../config/config').SEED;





//======================================
//Verificar tocken
//======================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            let retorno =
                res.status(401).json({
                    ok: false,
                    mensaje: 'Token incorrecto',
                    errors: err
                });
            return retorno;
        }
        //obeteniendo informacion del usuario 
        //para luedo mostrarlo en el requies = req = respuesta de la peticion en postman
        req.usuario = decoded.usuario
        next();
    });

}