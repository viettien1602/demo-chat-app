const express = require('express')
const router = express.Router()
const {addMessage, getAllMessages} = require('../controllers/messageControllers')

router.post('/addmsg', addMessage)
router.post('/getmsg', getAllMessages)


module.exports = router