const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateGuayaquil = moment().format('YYYY-MM-DD HH:mm');

const Schema = mongoose.Schema;

const FormularioSchema = new Schema({
    personaLlena: {
        type: Schema.Types.ObjectId, ref: 'usuarios'
    },
    fechaLlena: {
        type: String,
        default: dateGuayaquil
    },
    pregunta1: {
        type: String,
        default: ""
    },
    pregunta2: {
        type: String,
        default: ""
    },
    pregunta3: {
        type: String,
        default: ""
    },
    pregunta4: {
        type: String,
        default: ""
    },
    pregunta5: {
        type: String,
        default: ""
    },
    pregunta6: {
        type: String,
        default: ""
    },
    pregunta7: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('formulario', FormularioSchema);