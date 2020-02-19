const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatListSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'usuarios'
    },
    userToChat: {
        type: Schema.Types.ObjectId, ref: 'usuarios'
    },
    lastMessage: String
});

module.exports = mongoose.model('chatList', ChatListSchema);
