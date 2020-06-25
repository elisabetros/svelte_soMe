const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId
const auth = require('../middleware/checkToken')
const bcrypt = require('bcryptjs')
const saltRounds = 10;
const formidable = require('formidable')
const detect = require("detect-file-type")
const {v1: uuidv1} = require("uuid")
const path = require("path")
const fs = require("fs") //part of node.js

let jwt = require('jsonwebtoken');
const config = require('../config/jwtKey');

router.get('/users/find/:name', async (req, res) => {
    const userCollection = db.collection('users')
    const { name } = req.params
    try{        
        const users = await userCollection.find({$or:[{'firstname': new RegExp(name,'i')}, {'lastname': new RegExp(name,'i')}]}).toArray()
        users.forEach(user=> {
            delete user.password
        })
        return res.status(200).send({users})
    }catch(err){
        if(err){
            console.log(err); 
            return res.status(500).send({error: err});
        }
    }
})

router.get('/user/:id', async (req, res) => {
    const userCollection = db.collection('users')
    const { id } = req.params
    try{
        const user = await userCollection.findOne({_id: ObjectId(id)})
        delete user.password
        return res.status(200).send({user})
    }catch(err){
        if(err){
            return res.status(500).send({error: err}) }
    }
})

router.post('/user/register', async (req, res) => {
    console.log('signup')
    const userCollection = db.collection('users')
    const { firstname, lastname, email, password, repeatPassword } = req.body
    if(!firstname || !lastname || !password || !email || !repeatPassword){
        return res.status(500).send({error: "Missing fields"})
    }
    if(!/\S+@\S+\.\S+/.test(email)){
        return res.status(500).send({error: 'Email invalid'})
    }
    if(password.length <8){
        return res.status(500).send({error: "Password too short"})
    }
    if(password !== repeatPassword){
        return res.status(500).send({error: "Passwords don't match"})
    }
    const user = await userCollection.findOne({'email': email})
    if(user){
        return res.status(500).send({error: 'User already exists'})
    }
    try{
        bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
            if(error){
                return res.status(500).send({ error: "Couldn't hash password" })
            }
          await  userCollection.insertOne({ 
                firstname,
                lastname,
                email,
                password: hashedPassword,
                isLoggedIn:false
            })
                
            return res.status(200).send({response: 'success'})
                    
        })
    }catch(err){
        if(err){console.log(err); return res.status(500).send({error: 'Could not insert'}); }
    }
 
})

router.put('/user/login', async (req, res) => {
    console.log('login')
    const userCollection = db.collection('users')
    const { email, password } = req.body
    if(!email || !password){
        return res.status(500).send({error: 'Missing fields'})
    }
    if(password<8){
        return res.status(500).send({error: 'Password too short'})
    }
    if(!/\S+@\S+\.\S+/.test(email)){
        return res.status(500).send({error: 'Email invalid'})
    }
    const user = await userCollection.findOne({'email':email})
    if(!user){
        return res.status(500).send({error: 'Email or password wrong'})
    }
    bcrypt.compare(password, user.password, async (error, isSame) => {
        if(error){
            return res.status(500).send({error:'Could not sign in, please try again'})
        }
        if(!isSame){
            return res.status(500).send({error: 'Wrong username or password'})
        }else{
            try{
                // const friend = await userCollection.find({"friends.friendID": user._id.toString }).toArray()
                // return res.send(friend)
                // const userUpdate = await userCollection.findOneAndUpdate({ "_id":ObjectId(user._id)}, {$set:{'isLoggedIn': true}})
                // const friendUpdate = await userCollection.updateMany({ "friends.friendID": user._id }, {$set:{'friends.$.isLoggedIn': true}})
                // console.log({userUpdate, friendUpdate})
                const bulkUpdateOps = [
                    {
                        "updateOne": {
                            "filter": { "_id":ObjectId(user._id) },
                            "update": { "$set": { "isLoggedIn": true} } 
                        }
                    },
                    {
                        "updateMany": {
                            "filter": { "friends.friendID": user._id.toString() },
                            "update": { "$set": { "friends.$.isLoggedIn": true } }
                        }
                    }
                ];
            const result = await userCollection.bulkWrite(bulkUpdateOps)
             console.log(result)       
          
             userInfo = {
                 _id :user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                profilePicture: user.profilePicture,
                isLoggedIn: user.isLoggedIn
             }
             jwt.sign({user: userInfo}, config.secretKey, { expiresIn: '24h' } ,(err, token) => {
                 if(err) {
                   console.log(err) 
                  return res.status(500).send({error: 'Could not create token'})
             } 
             return res.status(200).send({token })
             });
              
           }catch(err){
               if(err){console.log(err); return res.status(500).send({error:'Something went wrong'}); }
           }
        }
    })
})

router.get('/user', auth.checkToken, async (req, res) => {
    //verify the JWT token generated for the user
    const userCollection = db.collection('users')
   const { user } = req.decoded
 if(req.decoded){
     try{
         const userToReturn = await userCollection.findOne({'_id': ObjectId(user._id)})
        //  console.log(userToReturn)
         delete userToReturn.password
         return res.status(200).send({user: userToReturn})
     }catch(err){
         if(err){console.log("message"); 
         return res.status(500).send({error: 'something went wrong'}) }
     }
       
 }
});


router.put('/user/logout', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    console.log('logout')
    const { user } = req.decoded
    try{
        const bulkUpdateOps = [
            {
                "updateOne": {
                    "filter": { "_id":ObjectId(user._id) },
                    "update": { "$set": { "isLoggedIn": false} } 
                }
            },
            {
                "updateMany": {
                    "filter": { "friends.friendID": user._id },
                    "update": { "$set": { "friends.$.isLoggedIn":  false } }
                }
            }
        ];
    const result = await userCollection.bulkWrite(bulkUpdateOps, {"ordered": true, "w": 1})
     console.log(result)       
     return res.status(200).send({response: 'success'})
      
   }catch(err){
       if(err){console.log(err); return res.status(500).send({error:'Something went wrong'}); }
   }

})

router.post('/user/profilePicture', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const form = new formidable.IncomingForm()
    const { user } = req.decoded
    form.parse(req, (err, fields, files) => {
        if(err){return res.send("error in file")}
        
        detect.fromFile(files.picture.path, (err, result) => {
            
            const pictureName = uuidv1()+"."+result.ext
            const allowedImageTypes = ["jpg", "jpeg", "png"]

            if(! allowedImageTypes.includes(result.ext)){
                return res.status(500).send({error:"Only image files allowed"})
            }
            const oldPath = files.picture.path
            const newPath = path.join(__dirname,"..", "pictures", "profilePictures", pictureName)

            fs.rename(oldPath, newPath, async err => {
                if(err){console.log("cannot move file"); return res.status(500).send({error:"Cannot move file"});}
              
                try{
                    const bulkUpdateOps = [
                        {
                            "updateOne": {
                                "filter": { "_id":ObjectId(user._id) },
                                "update": { "$set": { "profilePicture": pictureName} } 
                            }
                        },
                        {
                            "updateMany": {
                                "filter": { "friends.friendID": user._id },
                                "update": { "$set": { "friends.$.profilePicture":  pictureName } }
                            }
                        }
                    ];
                const result = await userCollection.bulkWrite(bulkUpdateOps, {"ordered": true, "w": 1})
                 console.log(result)       
              
                    
                  
               }catch(err){
                   if(err){console.log(err); return res.status(500).send({error:'Something went wrong'}); }
               }
                    user.profilePicture = pictureName
                    jwt.sign({user}, config.secretKey, { expiresIn: '12h' } ,(err, token) => {
                        if(err) {
                        console.log(err) 
                        return res.status(500).send({error: 'Could not create token'})
                        } 
                        return res.send({token, pictureName})
                    })
               
            })
        })
    })
})

router.delete('/user/profilePicture', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { user } = req.decoded
    userCollection.findOneAndUpdate({_id:ObjectId(user._id)}, {$unset:{'profilePicture': ''}}, (err, dbResponse) => {
        if(err){
            return res.status(500).send('Something went wrong, please try again')
        }
        console.log(dbResponse)
        delete user.profilePicture
                jwt.sign({user}, config.secretKey, { expiresIn: '24h' } ,(err, token) => {
                    if(err) {
                      console.log(err) 
                     return res.status(500).send({error: 'Could not create token'})
                } 
            return res.send({token, dbResponse})
            })
        })
})

router.put('/user/update', auth.checkToken, async (req, res) => {
    console.log('update')
    let { newFirstname, newEmail, newLastname } = req.body
    const { user } = req.decoded
    if(!newFirstname){
        newFirstname = user.firstname
    }
    if(!newLastname){
        newLastname = user.lastname
    }
    if(!newEmail){
        newEmail = user.email
    }
    const userCollection = db.collection('users')
    await userCollection.findOneAndUpdate({_id: ObjectId(user._id)}, {$set:{
            firstname:newFirstname, 
            lastname: newLastname,
            email: newEmail }}, (err, dbResponse) => {
                if(err){
                    console.log(err); 
                    return res.status(500).send({error: 'Something went wrong, please try again'})
                }
                user.firstname = newFirstname
                user.lastname = newLastname
                user.email = newEmail
                jwt.sign({user}, config.secretKey, { expiresIn: '24h' } ,(err, token) => {
                    if(err) {
                      console.log(err) 
                     return res.status(500).send({error: 'Could not create token'})
                } 
            return res.send({token, dbResponse})
            })
        })
})

router.delete('/user', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { user } = req.decoded
    await  userCollection.deleteOne({_id: ObjectId(user._id)}, (err, dbResponse) => {
        if(err){
            console.log(err); 
            return res.status(500).send({error: 'Something went wrong, please try again'})
        }
        // console.log(user)
        return res.status(200).send({response: dbResponse})
    })
})

router.put('/user/friendRequest', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { user } = req.decoded
    const { friendID } = req.body
    if(!friendID){
        return res.status(500).send({error: 'Missing ID'})
    }
    const friend =  await userCollection.findOne({'_id': ObjectId(friendID)})
           const bulkUpdateOps = [
            {
                "updateOne": {
                    "filter": { "_id":ObjectId(user._id) },
                    "update": { "$push": { "friendRequests": {'friendID': friendID, firstname: friend.firstname, lastname: friend.lastname} } } 
                }
            },
            {
                "updateOne": {
                    "filter": { "_id": ObjectId(friend._id) },
                    "update": { "$push": { "notifications.friendRequests":  {'friendID': user._id, firstname: user.firstname, lastname: user.lastname} } }
                }
            }
        ];
        
      await userCollection.bulkWrite(bulkUpdateOps, {"ordered": true, "w": 1}, (err, result) => {
            if(err){console.log(err); return res.status(500).send({error:err});}
            return res.status(200).send({result})
        })
})

router.delete('/user/declineFriendRequest', auth.checkToken, async (req, res) => {
    console.log('decline request')
    const { user } = req.decoded
    const { friendID } = req.body
    if(!friendID){
        return res.status(500).send({error: 'Missing ID'})
    }
    const friend =  await userCollection.findOne({'_id': ObjectId(friendID)})
    try{
        const bulkUpdateOps = [
            {
                "updateOne": {
                    "filter": { "_id":ObjectId(friend._id) },
                    "update": { "$pull": { "friendRequests": {'friendID': user._id} } } 
                }
            },
            {  
                 "updateOne": {
                    "filter": { "_id":ObjectId(friend._id) },
                    "update": { "$push": { "notifications.notification": { 'message': `${user.firstname} ${user.lastname} declined your friend request`, 'seen': 0 } } } 
            }
           },
            {
                "updateOne": {
                    "filter": { "_id": ObjectId(user._id)  },
                    "update": { "$pull": { "notifications.friendRequests":  {'friendID': friend._id, firstname: friend.firstname, lastname: friend.lastname} } }
                }
            }
        ];
        
      await userCollection.bulkWrite(bulkUpdateOps, {"ordered": true, "w": 1})
      return res.status(200).send({response:'friend request declined'})
        
    }catch(err){
        if(err){console.log(err); 
        return res.status(500).send({error: 'something went wrong please try again'})
    }
    }
})
router.delete('/user/friendRequest', auth.checkToken, async (req, res) => {
    console.log('cancel friend request')
    const userCollection = db.collection('users')
    const { user } = req.decoded
    const { friendID } = req.body
    if(!friendID){
        return res.status(500).send({error: 'Missing ID'})
    }
    const friend =  await userCollection.findOne({'_id': ObjectId(friendID)})
           const bulkUpdateOps = [
            {
                "updateOne": {
                    "filter": { "_id":ObjectId(user._id) },
                    "update": { "$pull": { "friendRequests": {'friendID': friendID, firstname: friend.firstname, lastname: friend.lastname} } } 
                }
            },
            {
                "updateOne": {
                    "filter": { "_id": ObjectId(friend._id) },
                    "update": { "$pull": { "notifications.friendRequests":  {'friendID': user._id, firstname: user.firstname, lastname: user.lastname} } }
                }
            }
        ];
        
      await userCollection.bulkWrite(bulkUpdateOps, {"ordered": true, "w": 1}, (err, result) => {
            if(err){console.log(err); return res.status(500).send({error:err});}
            return res.status(200).send({result})
        })
})

router.put('/user/friend', auth.checkToken, async (req, res) => {
    console.log('add friend')
    const userCollection = db.collection('users')
    const { user } = req.decoded
    const { friendID } = req.body
    if(!friendID){
        return res.status(500).send({error: 'Missing ID'})
    }
    try{        
        const checkIfAlreadyFriend = await userCollection.find({_id: ObjectId(user._id)}).project({'friends':1}).toArray()
        if(checkIfAlreadyFriend[0].hasOwnProperty('friends')){
            checkIfAlreadyFriend[0].friends.map(friend => {
                console.log(friend.friendID)
                if(friend.friendID === friendID){
                    return res.status(500).send({error: 'Already a friend'})
                }
            }) 
        }
    }catch(err){
        if(err){console.log(err); return res.status(500).send({error: err}); }
    }
    // return res.send({checkIfAlreadyFriend})
    
    const friend =  await userCollection.findOne({'_id': ObjectId(friendID)})
//   return res.send({friend})
       const bulkUpdateOps = [
        {
            "updateOne": {
                "filter": { "_id":ObjectId(user._id) },
                "update": { "$push": { "friends": {'friendID': friendID, firstname: friend.firstname, lastname: friend.lastname, profilePicture: friend.profilePicture, isLoggedIn:friend.isLoggedIn} } } 
            }
        },
        {
            "updateOne": {
                "filter": { "_id":ObjectId(user._id) },
                "update": { "$pull": { "notifications.friendRequests": {'friendID': friendID} } } 
            }
        },
        {
            "updateOne": {
                "filter": { "_id": ObjectId(friend._id) },
                "update": { "$push": { "friends":  {'friendID': user._id, firstname: user.firstname, lastname: user.lastname, profilePicture: user.profilePicture, isLoggedIn:user.isLoggedIn} } }
            }
        },
        {
            "updateOne": {
                "filter": { "_id":ObjectId(friend._id) },
                "update": { "$pull": { "friendRequests": {'friendID': user._id} } } 
            }
        },
        {
            "updateOne": {
                "filter": { "_id":ObjectId(friend._id) },
                "update": { "$push": { "notifications.notification": { 'message': `${user.firstname} ${user.lastname} accepted your friend request`, 'seen': 0 } } } 
            }
        },
    ];
    
  await userCollection.bulkWrite(bulkUpdateOps, {"ordered": true, "w": 1}, (err, result) => {
        if(err){console.log(err); return res.status(500).send({error:err});}
        return res.status(200).send({result})
    })
})

router.delete('/user/friend', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { user } = req.decoded
    const { friendID } = req.body
    if(!friendID){
        return res.status(500).send({error: 'Missing ID'})
    }
  const friend =  await userCollection.findOne({'_id': ObjectId(friendID)})
//   return res.send({friend})
       const bulkUpdateOps = [
        {
            "updateOne": {
                "filter": { "_id":ObjectId(user._id) },
                "update": { "$pull": { "friends": {'friendID': friendID} } } 
            }
        },
        {
            "updateOne": {
                "filter": { "_id": ObjectId(friend._id) },
                "update": { "$pull": { "friends":  {'friendID': user._id} } }
            }
        }
    ];
    
  await userCollection.bulkWrite(bulkUpdateOps, {"ordered": true, "w": 1}, (err, result) => {
        if(err){console.log(err); return res.status(500).send({error:err});}
        return res.status(200).send({result})
    })
})

router.post('/user/coverImg', auth.checkToken, (req, res) => {
    const userCollection = db.collection('users')
    const { user } = req.decoded
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if(err){return res.send("error in file")}
        
        if(!files.picture){
            return res.status(500).send({error: 'Image missing'})
        }
        detect.fromFile(files.picture.path, (err, result) => {
            const pictureName = uuidv1()+"."+result.ext
            // console.log(pictureName) // ed671140-69ea-11ea-9ec7-9ff298c14d8c.jpg
            const allowedImageTypes = ["jpg", "jpeg", "png"]
            if(! allowedImageTypes.includes(result.ext)){
                return res.status(500).send({error:"Only image files allowed"})
            }
            const oldPath = files.picture.path
            const newPath = path.join(__dirname,"..", "pictures", "coverPictures", pictureName)
            fs.rename(oldPath, newPath, async err => {
                if(err){console.log("cannot move file"); return;}
                userCollection.findOneAndUpdate({_id:ObjectId(user._id)}, {$set:{'coverPicture': pictureName}}, (err, dbResponse) => {
                    if(err){
                        return res.status(500).send({error:'Something went wrong, please try again'})
                    }
                    
                    return res.status(200).send({response: pictureName})
                })
            })
        })
    })
})


router.put('/user/notifications', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { user } = req.decoded
    try{
        const bulkUpdateOps = [
            {
                "updateMany": {
                    "filter": { "_id": ObjectId(user._id), "notifications.friendRequests.seen" : 0 },
                    "update": { "$set": { "notifications.friendRequests.$.seen": 1 } }
                }
            },
            {
                "updateMany": {
                    "filter": { "_id": ObjectId(user._id), "notifications.notification.seen" : 0 },
                    "update": { "$set": { "notifications.notification.$.seen": 1 } }
                }
            }
        ];        
        await userCollection.bulkWrite(bulkUpdateOps, {"ordered": true, "w": 1})
        return res.send({response: 'notifications seen'})
    }catch(err){
        if(err){
            console.log(err); 
            return res.status(500).send({error: 'Something went wrong'});
        }
    }
})

module.exports = router;