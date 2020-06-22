const port = process.env.PORT || 80


const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);

const MongoClient = require('mongodb').MongoClient

// ############################

const url = 'mongodb://localhost:27017'
const dbName ='clonebook'
global.db = ''

// Connecting to server
MongoClient.connect(url, { useUnifiedTopology: true } ,(err, client) => {
    if(err){
        console.log('error'); 
        return;
    }
    console.log('connected to mongo')
    db = client.db(dbName)
})



app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ############################
let users = {};
io.on('connection', socket => {
    // console.log('new user')
    socket.on('private-chat', data => {
        socket.id = data;
        users[socket.id] = socket;
    })
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    // socket.emit('chat-message', 'Hello world')
    socket.on('send-chat-message', message => {
        // console.log(message)
       socket.broadcast.emit('chat-message',{message: message, name: users[socket.id]})
    })
    socket.on('disconnect', () => {
        // console.log(message)
       socket.broadcast.emit('user-disconnected', users[socket.id])
       delete users[socket.id]
    })
})


// ############################

let cors = require('cors');
const allowedOrigins = ['http://localhost:5000', 'http://localhost:80' ,'https://www.valsdottir.net', 'https://valsdottir.net'];
app.use(cors())

//  app.use(cors({ 
//     credentials:true,
//     origin: function(origin, callback){
//         // allow requests with no origin 
//         // (like mobile apps or curl requests)
//       if(!origin) return callback(null, true);
//       if(allowedOrigins.indexOf(origin) === -1){
//         var msg = 'The CORS policy for this site does not ' +
//                   'allow access from the specified Origin.';
//                   return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     }
// }));

app.use('/userImg',express.static(__dirname + '/pictures/profilePictures'));
app.use('/postImg',express.static(__dirname + '/pictures/postPictures'));
app.use('/coverImg',express.static(__dirname + '/pictures/coverPictures'));

// ############################

const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')

app.use(userRoute)
app.use(postRoute)

// ############################

process.on("uncaughtException", (err, data) => {
    if(err){
        console.log("critical error, yet system keeps running")
        console.log(data)
        return;
    }
})

// ############################


server.listen(port, (err) => {
    if(err){console.log("server couldn't connect");return;}
    console.log('server running on port', port)
})