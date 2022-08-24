const Users = require('../model/userModel')
const bcrypt = require('bcrypt')


async function register(req, res, next) {
    try {
        const {username, password, email} = req.body
        const usernameCheck = await Users.findOne({username})
        if (usernameCheck) 
            return res.status(400).json({msg: 'Username is already used', status: false})
        const emailCheck = await Users.findOne({email})
        if (emailCheck) 
            return res.status(400).json({msg: 'Email is already used', status: false})
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new Users({
            username,
            email,
            password: hashedPassword
        })
        const result = await user.save()
        delete result.password
        res.status(200).json({
            status: true,
            user: result
        })
    }
    catch(err) {
        res.status(500).send(err.message)
    }
}

async function login(req, res, next) {
    try {
        const {username, password} = req.body
        const user = await Users.findOne({username})
        if (!user) 
            return res.status(401).json({msg: 'Username does not exist', status: false})
        if (!(await bcrypt.compare(password, user.password)))
            return res.status(401).json({msg: 'Password is incorrect', status: false})
        delete user.password
        res.status(200).json({
        status: true,
        user
        })
    }
    catch(err) {
        res.status(500).send(err.message)
    }
}

async function getAllUsers(req, res, next) {
    try {
        const users = await Users
        .find({_id: {$ne:req.params.id}})
        .select({email: 1, username: 1, avatarImage: 1, _id: 1})
        return res.status(200).json({
            status: true,
            users
        })
    }
    catch(err) {
        res.status(500).send(err.message)
    }
}

async function setAvatar(req, res, next) {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await Users.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };
  
module.exports = {register, login, getAllUsers, setAvatar}