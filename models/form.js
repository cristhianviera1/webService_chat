const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateGuayaquil = moment().format('YYYY-MM-DD HH:mm');

const Schema = mongoose.Schema;

const FormSchema = new Schema({
    personFill: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    FillDate: {
        type: String,
        default: dateGuayaquil
    },
    questionOne: {
        type: String,
        default: ""
    },
    questionTwo: {
        type: String,
        default: ""
    },
    questionThree: {
        type: String,
        default: ""
    },
    questionFour: {
        type: String,
        default: ""
    },
    questionFive: {
        type: String,
        default: ""
    },
    questionSix: {
        type: String,
        default: ""
    },
    questionSeven: {
        type: Array,
        default: ""
    }
});

module.exports = mongoose.model('form', FormSchema);