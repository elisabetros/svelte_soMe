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

router.get('/user/:id', async (req, res) => {
    const userCollection = db.collection('users')
    const { id } = req.params
    try{
        const user = await userCollection.findOne({_id: ObjectId(id)})
        return res.status(200).send({user})
    }catch(err){
        if(err){
            return res.status(500).send({error: err}) }
    }
})

router.post('/user/register', async (req, res) => {
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

    bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
        if(error){
            return res.status(500).send({ error: "Couldn't hash password" })
        }
        userCollection.insertOne({ 
            firstname,
            lastname,
            email,
            password: hashedPassword,
            isLoggedIn:false
        }, function(err, result) {
            if(err){
                console.log(err);
                 return res.status(500).send({error: 'Could not insert'});
                }
           return res.status(200).send(result.insertedId)
        })           
    })
})

router.post('/user/login', async (req, res) => {
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
            userCollection.findOneAndUpdate({_id:user._id}, {$set:{isLoggedIn:true}}, (err, response) => {
                if(err){
                    console.log(err); 
                    return res.status(500).send({error: 'Login failed'})
                }
                delete user.password
                jwt.sign({user}, config.secretKey, { expiresIn: '24h' } ,(err, token) => {
                    if(err) {
                      console.log(err) 
                     return res.status(500).send({error: 'Could not create token'})
                } 
                return res.status(200).send({token })
                });
            })
        }
    })
})

router.get('/user', auth.checkToken, (req, res) => {
    //verify the JWT token generated for the user
    const userCollection = db.collection('users')
   const { user } = req.decoded
 if(req.decoded){
   userCollection.findOne({'_id': ObjectId(user._id)}, (err, dbResponse) => {
         if(err){console.log(err); return;}
        //  console.log(dbResponse)
         return res.status(200).send({user: dbResponse})
     })
 }
});




router.put('/user/logout', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    console.log('logout')
    const { user } = req.decoded
    console.log(user._id)
   userCollection.findOneAndUpdate({_id: ObjectId(user._id)}, {$set:{isLoggedIn:false}}, (err, dbResponse) => {
            if(err){console.log(err); return res.status(200).send({error: err});}
            console.log(dbResponse)
            return res.status(200).send({response: 'success'})
        })
})

router.post('/user/profilePicture', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const form = new formidable.IncomingForm()
    const { user } = req.decoded

    const userToUpdate = await userCollection.findOne({_id: ObjectId(user._id)})
    // if(userToUpdate.hasOwnProperty('profilePicture')){
    //     fs.unlinkSync(user.profilePicture)
    // }
    form.parse(req, (err, fields, files) => {
        if(err){return res.send("error in file")}
        
        detect.fromFile(files.picture.path, (err, result) => {
            // console.log(result.ext)
            const pictureName = uuidv1()+"."+result.ext
            // console.log(pictureName) // ed671140-69ea-11ea-9ec7-9ff298c14d8c.jpg
            const allowedImageTypes = ["jpg", "jpeg", "png"]
            if(! allowedImageTypes.includes(result.ext)){
                return res.status(500).send({error:"Only image files allowed"})
            }
            const oldPath = files.picture.path
            const newPath = path.join(__dirname,"..", "pictures", "profilePictures", pictureName)
            fs.rename(oldPath, newPath, async err => {
                if(err){console.log("cannot move file"); return res.status(500).send({error:"Cannot move file"});}
                userCollection.findOneAndUpdate({_id:ObjectId(user._id)}, {$set:{'profilePicture': pictureName}}, (err, dbResponse) => {
                    if(err){
                        return res.status(500).send({error:'Something went wrong, please try again'})
                    }
                    const user = dbResponse.value;
                    jwt.sign({user}, config.secretKey, { expiresIn: '12h' } ,(err, token) => {
                        if(err) {
                        console.log(err) 
                        return res.status(500).send({error: 'Could not create token'})
                        } 
                        return res.send({token, dbResponse})
                    })
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

router.put('/user/friend', auth.checkToken, async (req, res) => {
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
                "update": { "$push": { "friends": {'friendID': friendID, firstname: friend.firstname, lastname: friend.lastname} } } 
            }
        },
        {
            "updateOne": {
                "filter": { "_id": ObjectId(friend._id) },
                "update": { "$push": { "friends":  {'friendID': user._id, firstname: user.firstname, lastname: user.lastname} } }
            }
        }
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
                    
                    // jwt.sign({user}, config.secretKey, { expiresIn: '12h' } ,(err, token) => {
                    //     if(err) {
                    //     console.log(err) 
                    //     return res.status(500).send({error: 'Could not create token'})
                    //     } 
                    //     return res.send({token, dbResponse})
                    // })
                    return res.status(200).send({response: 'Success'})
                })
            })
        })
    })
})


module.exports = router;