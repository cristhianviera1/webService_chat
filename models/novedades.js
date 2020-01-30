const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NovedadesSchema = new Schema({
    titulo: String,
    descripcion: String,
    imagen: String,
    fechaPublicacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('novedades', NovedadesSchema);