const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    users: {
        type: Array
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
},{timestamps: true})
const Messages = mongoose.model('Messages', messageSchema)
module.exports = Messages