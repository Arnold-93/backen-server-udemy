var express = require('express');
var bcrypt = require('bcryptjs')

//importamos la autenticacion osea el token
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//importamos  el modelo de usuario (usuario.js)
var Usuario = require('../models/usuario')

//======================================
//Obtener todos los usuarios
//url: http://localhost:3000/usuario GET
//======================================
app.get('/', (req, res, next) => {
    //definimos la querin de busqueda
    //le decimos que solo nos de como respuestaa los "nombre email img role"
    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    let retorno =
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando usuario'
                        });
                    return retorno;
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                })
            })


});


//======================================
//Crear un nuevo usuario  
//url: http://localhost:3000/usuario POST
//======================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    // creamos un nuevo areglo que registraremos en mongodb
    var usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        //encriptamos la contraseña
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role

    });
    //mandamos el arreglo que va tener 2 rutas el error y el usuarioguardado
    usuario.save((err, usuarioGuardado) => {
        //si ocurre un error va mandar esta excepcion
        if (err) {
            let retorno =
                res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear usuario',
                    errors: err
                });
            return retorno;
        }
        //si todo va correcto mandamos la excepcion 201 con el cuerpo que se registro
        res.status(201).json({
            ok: true,
            body: usuarioGuardado,
            //para sabe que usuario hiso la peticions es decir
            //optenemos un token atraves de un usuario al utilizar el toquen en los servicios
            //que requieren el toquen nos mostrara la informacion del usuario que hiso la peticion
            usuarioToken: req.usuario
        });
    })

});

//======================================
//Actualizar usuario  por id
//url: http://localhost:3000/usuario/5efb728682bc262a2bb52127  PUT
//======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //verificamos que exista el id
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            let retorno =
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            return retorno;
        }
        if (!usuario) {
            let retorno =
                res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id' + id + 'no existe',
                    errors: { message: 'No existe un usuario con ese id' }
                });
            return retorno;
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                let retorno =
                    res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                return retorno;
            }

            usuarioGuardado.password = ':)'
            res.status(200).json({
                ok: true,
                body: usuarioGuardado
            });
        })


    })

})

//======================================
//Borrar un  usuario  por id
//url: http://localhost:3000/usuario/5efb728682bc262a2bb52127  DELETE
//======================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            let retorno =
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar usuario',
                    errors: err
                });
            return retorno;
        }
        //Opcional
        if (!usuarioBorrado) {
            let retorno =
                res.status(400).json({
                    ok: false,
                    mensaje: 'No existe usuario',
                    errors: { message: 'No existe un usuario con ese id' }
                });
            return retorno;
        }

        res.status(200).json({
            ok: true,
            body: usuarioBorrado
        });
    })
})

module.exports = app;