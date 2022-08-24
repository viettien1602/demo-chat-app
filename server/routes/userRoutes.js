const express = require('express')
const router = express.Router()
const {register, login, getAllUsers, setAvatar} = require('../controllers/userController')

router.post('/register', register)
router.post('/login', login)
router.get('/allusers/:id', getAllUsers)
router.post("/setavatar/:id", setAvatar);

module.exports = router