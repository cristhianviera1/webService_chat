const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    userIdSend: {
        type: Schema.Types.ObjectId, ref: 'usuarios'
    },
    userIdReceive: {
        type: Schema.Types.ObjectId, ref: 'usuarios'
    },
    imagen: Boolean,
    message: String,
    dateTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('chat', ChatSchema);
