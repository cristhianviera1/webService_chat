const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    contraseña: String,
    correo: String,
    edad: String,
    genero: String,
    rol: String,
    imagen: String,
    nombre: String,
    online: Boolean
});

module.exports = mongoose.model('usuarios', UsuarioSchema);
