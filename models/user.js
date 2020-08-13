const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    password: String,
    email: String,
    age:  {
        type: String,
        default: ""
    },
    gender:  {
        type: String,
        default: ""
    },
    rol:  {
        type: String,
        default: ""
    },
    image:  {
        type: String,
        default: ""
    },
    name:  {
        type: String,
        default: ""
    },
    online: Boolean,
    status: {
        type: Boolean,
        default:  true
    }
});

module.exports = mongoose.model('user', UserSchema);
