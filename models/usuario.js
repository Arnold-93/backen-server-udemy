//importamos 
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var schema = mongoose.Schema;

//Roles validos para agregar al campo role
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new schema({

    //declaramos los tipos de datos de la misma forma que en mongoDB 
    //tambien se agregaron un series de validaciones
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'El contraseña es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
});
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' })
    //para exportarlo
module.exports = mongoose.model('Usuario', usuarioSchema);