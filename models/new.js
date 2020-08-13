const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateGuayaquil = moment().format('YYYY-MM-DD HH:mm');

const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    title: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    publicationDate: {
        type: String,
        default: dateGuayaquil
    },
    link: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('news', NewsSchema);