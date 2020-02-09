const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateGuayaquil = moment().format('YYYY-MM-DD HH:mm');

const Schema = mongoose.Schema;

const NovedadesSchema = new Schema({
    titulo: String,
    descripcion: String,
    imagen: String,
    fechaPublicacion: {
        type: String,
        default: dateGuayaquil
    },
    link: String
});

module.exports = mongoose.model('novedades', NovedadesSchema);