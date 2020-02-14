const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    password: String,
    correo: String,
    edad:  {
        type: String,
        default: ""
    },
    genero:  {
        type: String,
        default: ""
    },
    rol:  {
        type: String,
        default: ""
    },
    imagen:  {
        type: String,
        default: ""
    },
    nombre:  {
        type: String,
        default: ""
    },
    online: Boolean
});

module.exports = mongoose.model('usuarios', UsuarioSchema);
