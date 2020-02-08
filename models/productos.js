const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductosSchema = new Schema({
    titulo: String,
    descripcion: String,
    imagen: String,
    link: String
});

module.exports = mongoose.model('productos', ProductosSchema);