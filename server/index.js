const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')
const socket = require('socket.io')
const app = express()
dotenv.config()

app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to mongodb.'))
    .catch((err) => console.log('Could not connect to mongodb: ' + err.message))


app.use('/api/auth/', userRoutes)
app.use('/api/messages', messageRoutes)


//Server
const port = process.env.PORT || 5000
const server = app.listen(port, () => {
    console.log('Listening on port ' + port)
})

const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    }
});
  
global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on('send-msg', (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        io.to(sendUserSocket).emit('msg-receive', data.message);
      }
    });

    socket.on('check-online', (userId) => {
        const currentUser = onlineUsers.get(userId)
        let msg = 'offline'
        if (currentUser) msg = 'online'

        io.to(currentUser).emit('is-online', msg)
    })
});