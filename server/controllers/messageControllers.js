const Messages = require('../model/messageModel')

async function addMessage(req, res, next) {
    try {
        const {from, to, text} = req.body
        const data = new Messages({
            text,
            users: [from, to],
            sender: from
        })
        const result = await data.save()
        res.status(200).json({status: true, msg: 'Message added successfully'})
    }
    catch(err) {
        res.status(500).json({status: false, msg: err.message})
    }
}

async function getAllMessages(req, res, next) {
    try {
        const {from, to} = req.body
        const messages = await Messages
        .find({users: {$all: [from, to]}})
        .sort({updatedAt: 1})
        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                text: msg.text
            }
        })
        res.status(200).json({
            status: true,
            projectMessages
        })
    }
    catch(err) {
        res.status(500).json({status: false, msg: err.message})
    }
}
module.exports = {addMessage, getAllMessages}