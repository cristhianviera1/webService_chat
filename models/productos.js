const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductosSchema = new Schema({
    titulo:  {
        type: String,
        default: ""
    },
    descripcion:  {
        type: String,
        default: ""
    },
    imagen:  {
        type: String,
        default: ""
    },
    link:  {
        type: String,
        default: ""
    },
    precio:  {
        type: String,
        default: ""
    },
    observaciones:  {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('productos', ProductosSchema);