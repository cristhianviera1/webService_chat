const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateGuayaquil = moment().format('YYYY-MM-DD HH:mm');

const Schema = mongoose.Schema;

const NovedadesSchema = new Schema({
    titulo: {
        type: String,
        default: ""
    },
    descripcion: {
        type: String,
        default: ""
    },
    imagen: {
        type: String,
        default: ""
    },
    fechaPublicacion: {
        type: String,
        default: dateGuayaquil
    },
    link: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('novedades', NovedadesSchema);