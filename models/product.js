const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title:  {
        type: String,
        default: ""
    },
    description:  {
        type: String,
        default: ""
    },
    image:  {
        type: String,
        default: ""
    },
    link:  {
        type: String,
        default: ""
    },
    price:  {
        type: String,
        default: ""
    },
    observations:  {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('product', ProductSchema);