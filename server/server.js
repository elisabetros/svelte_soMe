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
global.usersCollection;

// Connecting to server
MongoClient.connect(url, { useUnifiedTopology: true } ,(err, client) => {
    if(err){
        console.log('error'); 
        return;
    }
    console.log('connected to mongo')
    db = client.db(dbName)
    usersCollection = db.collection("users");
})



app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// SOCKET.IO CHAT ############################ 

// let counter = 0;
io.on("connection", (socket) => {
//   counter++;
  // EVERYTIME THE USER CONNECTS - JOIN A ROOM

  // req from user to server (on) --> socket on event name
  socket.on("chatRoom", (userID, contactID) => {
    console.log(`The user is ${userID}, the contact is ${contactID}`);

    if (userID < contactID) {
      socket.join(`${userID}-${contactID}`);
    }
    else {
      socket.join(`${contactID}-${userID}`);
    }
  });

  socket.on("message", async (from, to, message) => {
    console.log(from, to, message);
    let timestamp = Math.round(new Date().getTime() / 1000);

    let toUser = await usersCollection.findOne({ _id: new ObjectID(to) });
    let fromUser = await usersCollection.findOne({ _id: new ObjectID(from) });

    // console.log(toUser);
    // console.log(fromUser);

    try {
        const bulkUpdateOps = [
            {
                "updateOne": {
                    "filter": { "_id":ObjectId(toUser._id), 'friends.friendID': fromUser._id.toString() },
                    "update": {$push: { 'friends.$.chat': message, "notifications.chats": { 'userID': fromUser._id, 'name': fromUser.firstname + " "+ fromUser.lastname, 'timestamp': timestamp}  } }
                }
            },
            {
                "updateOne": {
                    "filter": {  "_id":ObjectId(fromUser._id), 'friends.friendID': toUser._id.toString() },
                    "update": {  $push: { 'friends.$.chat': message, } }
                }
            }
        ];
        const result = await userCollection.bulkWrite(bulkUpdateOps)
    //  { '_id': new ObjectID(toUser._id), 'friends.friendID': String(fromUser._id) },
        // {$push: { 'contacts.$.chat': message, "notifications": { '_id': new ObjectID(), 'type': 'message', 'body': " has sent you a message", 'userID': fromUser._id, 'timestamp': timestamp } } })
    // ({ '_id': new ObjectID(fromUser._id), 'contacts.contactID': String(toUser._id) },
        // { $push: { 'contacts.$.chat': message, }})
    
    } catch (err) {
      return console.log(err, "Something went wrong updating the user collection in the from user");

    }

    let roomName;
    if (toUser._id < fromUser._id) {
      roomName = `${toUser._id}-${fromUser._id}`;
    } else {
      roomName = `${fromUser._id}-${toUser._id}`;
    }

    // EMIT THE EVENT OF A MESSAGE TO THE CLIENT IN THE SPECIFIED ROOM NAME

    io.in(roomName).emit("message", {
      from: fromUser._id,
      message: message,
      timestamp: timestamp,
    });

    // LEAVE THE PRIVATE CHAT ROOM IN THE SOCKET IN THE CLIENT
    socket.on("leaveRoom", (userID, contactID) => {
      let roomName;
      if (contactID < userID) {
        roomName = `${contactID}-${userID}`;
      } else {
        roomName = `${userID}-${contactID}`;
      }

      console.log(`Leaving room ${roomName}`);

      socket.leave(roomName);
    });
  });
});

        // console.log(message, receiver, sender)
        // try{
        //     const receivingUser = await db.collection('users').findOne({_id: ObjectId(receiver)})
        //     const senderUser = await db.collection('users').findOne({_id: ObjectId(sender)})
        //     console.log(receivingUser)
        //     if(receivingUser.isLoggedIn){
        //         getChatSocket(receiver).emit('chat_message',message, sender);
        //     }else{
        //         await db.collection('users').findOneAndUpdate({_id: ObjectId(receiver)}, 
        //         {$push: {'chats': {'fromID': sender, 'from': senderUser.firstname +" "+ senderUser.lastname, 'message': message, 'seen': false}}}, (err, dbRes) => {
        //             if(err){console.log(err); return;}
        //             console.log(dbRes)
        //             getChatSocket(receiver).emit('chat_message',message, sender);
        //         })
        //     }
            
        // }catch(err){
        //     if(err){console.log(err); return; }
        // }
    






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
const postRoute = require('./routes/posts');
const { ObjectID, ObjectId } = require('mongodb');

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