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
    pregunta1: String,
    pregunta2: String,
    pregunta3: String,
    pregunta4: String,
    pregunta5: String,
    pregunta6: String,
    pregunta7: String
});

module.exports = mongoose.model('formulario', FormularioSchema);