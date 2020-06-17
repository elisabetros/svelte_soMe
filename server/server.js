const express = require('express')
const app = express()

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

const port = process.env.PORT || 80

app.listen(port, (err) => {
    if(err){console.log("server couldn't connect");return;}
    console.log('server running on port', port)
})