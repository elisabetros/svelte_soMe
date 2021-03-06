const router = require('express').Router();
const formidable = require("formidable")
const detect = require("detect-file-type")
const {v1: uuidv1} = require("uuid")
const path = require("path")
const fs = require("fs") //part of node.js
const ObjectId = require('mongodb').ObjectId
const auth = require('../middleware/checkToken')



router.post('/post', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { user } = req.decoded
    const { post } = req.body
    if(!post){
        return res.status(500).send({error: 'Missing fields'})
    }
    userCollection.findOneAndUpdate({_id:ObjectId(user._id)}, {$push:{'posts': {_id: new ObjectId(), 'postContent':post}}}, (err, dbresponse) => {
        if(err){
            return res.status(500).send({error: 'Something went wrong, please try again'})
        }
        return res.status(200).send({ dbresponse })
    })
})

router.post('/postWithImage', auth.checkToken, (req, res) => {
    const userCollection = db.collection('users')
    const { user } = req.decoded
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if(err){return res.send("error in file")}
        
        detect.fromFile(files.picture.path, (err, result) => {
            // console.log(result.ext)
            const pictureName = uuidv1()+"."+result.ext
            // console.log(pictureName) // ed671140-69ea-11ea-9ec7-9ff298c14d8c.jpg
            const allowedImageTypes = ["jpg", "jpeg", "png"]
            if(!allowedImageTypes.includes(result.ext)){
                return res.send("image not allowed")
            }
            const oldPath = files.picture.path
            const newPath = path.join(__dirname,"..", "pictures", "postPictures", pictureName)
            fs.rename(oldPath, newPath, async err => {
                if(err){console.log("cannot move file"); return;}
            
            userCollection.findOneAndUpdate({_id:ObjectId(user._id)}, {$push:{'posts': {_id: new ObjectId(), 'postContent':fields.post, 'postImg': pictureName}}}, (err, dbresponse) => {
                if(err){
                    return res.send({err})
                }
                return res.send({response: pictureName})
            })
            })
        })
    })
})


router.put('/updatePost', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { postID, newPostContent } = req.body
    // console.log(postID, newPostContent)
    try{
       await userCollection.findOneAndUpdate({'posts._id': ObjectId(postID)}, {$set:{'posts.$.postContent': newPostContent}})
       return res.status(200).send({response : 'success'})
        
    }catch(err){
        if(err){
            console.log(err); 
        return res.status(500).send({error: err}); }
    }
       
   
})
router.put('/updatePostWithImage', auth.checkToken, (req, res) => {
    console.log('edit post with image')
    const userCollection = db.collection('users')
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        console.log('parse form')
        if(err){return res.send({error:"error in file"})}
        if(!fields.postID ){
            return res.send({error: 'missing ID'})
        }
        detect.fromFile(files.newPostImg.path, (err, result) => {
            console.log(result.ext)
            const pictureName = uuidv1()+"."+result.ext
            const allowedImageTypes = ["jpg", "jpeg", "png", "gif"]

            if(!allowedImageTypes.includes(result.ext)){
                return res.send({error:"image not allowed"})
            }
            const oldPath = files.newPostImg.path
            const newPath = path.join(__dirname,"..", "pictures", "postPictures", pictureName)
            fs.rename(oldPath, newPath, async err => {
                if(err){console.log("cannot move file"); return res.send({error: err});}
            
                console.log(pictureName)
            try{
                await userCollection.findOneAndUpdate({'posts._id': ObjectId(fields.postID)}, {$set:{'posts.$.postContent': fields.newPostContent, 'posts.$.postImg': pictureName}})
                return res.send({response:pictureName})
                
            }catch(err){
                if(err){
                    console.log(err); 
                return res.status(500).send({error:'something went wrong'}); }
            }
              
            })
        })
    })
})

router.delete('/post', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { postID } = req.body
    const { user } = req.body
    userCollection.findOneAndUpdate({'posts._id': ObjectId(postID)}, {$pull:{'posts':{_id: ObjectId(postID)}}}, (err, dbResponse) => {
        if(err){
            return res.status(500).send({error: err})
        }
        return res.status(200).send({response: 'Post deleted'})
    })
})

router.post('/likePost', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { postID } = req.body
    const { user } = req.decoded
    let error;
    try{
        const alreadyLiked = await userCollection.find({'posts._id': ObjectId(postID)}, {'userID': user._id}).project({'posts.likes':1, 'posts._id':1, 'posts.postContent':1 }).toArray()
       alreadyLiked[0].posts.map(post => {
            if(post._id.toString() === postID){
                if(post.hasOwnProperty('likes')){
                    post.likes.map(like => {
                        if(like.userID === user._id){
                            return res.status(500).send({error: 'Already liked by you'})
                        }                
                    })         
                }
            }
        })        
    }catch(err){
        if(err){console.log(err); 
        return res.status(500).send({error: err}) }
    }   
    try{            
        const like = await userCollection.findOneAndUpdate({'posts._id': ObjectId(postID)}, {$push:{'posts.$.likes':{'userID': user._id,  'firstname': user.firstname, 'lastname': user.lastname }}})
        return res.status(200).send({response: 'Post liked'})
    }catch(err){
        if(err){
            console.log(error); 
            return res.status(500).send({error: err}) 
        }
    } 
})

router.delete('/likePost', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { postID } = req.body
    const { user } = req.decoded
    if(!postID){
        return res.status(500).send({error: 'Missing ID'})
    }
    // console.log(postID, user._id)
    userCollection.findOneAndUpdate({'posts._id': ObjectId(postID)}, {$pull:{'posts.$.likes':{ 'userID': user._id, 'firstname': user.firstname, 'lastname': user.lastname }}}, (err, dbResponse) => {
        if(err){
            return res.status(500).send({error: err})
        }else{
            return res.status(200).send({response: 'Post unliked'})

        }
    })
})

router.post('/comment', auth.checkToken, async (req, res) => {
    console.log('comment')
    const userCollection = db.collection('users')
    const { postID, comment } = req.body
    const{ user } = req.decoded
    if(!postID || !comment){
        return res.status(500).send({error: 'Missing fields'})
    }
    try{
        await userCollection.findOneAndUpdate({'posts._id': ObjectId(postID)}, {$push:{'posts.$.comments':{ _id: new ObjectId(), 'userID': user._id, 'firstname': user.firstname, 'lastname': user.lastname, 'comment': comment, 'profilePicture': user.profilePicture }}})
    //    console.log(update)
        return res.status(200).send({response: 'success'})

    }catch(err){
        if(err){console.log(err)
            return res.status(500).send({error: err})
        }
    }
    // return res.status(200).send({response: 'success'})
   
})

router.delete('/comment', auth.checkToken, async (req, res) => {
    console.log('comment')
    const userCollection = db.collection('users')
    const { postID, commentID } = req.body
    
    userCollection.findOneAndUpdate({'posts._id': ObjectId(postID)}, {$pull:{'posts.$.comments':{ '_id': ObjectId(commentID) }}}, (err, dbResponse) => {
        if(err){
            return res.status(500).send({error: err})
        }
        return res.status(200).send({dbResponse})
    })
})

router.put('/comment', auth.checkToken, async (req, res) => {
    // console.log('update')
    // const userCollection = db.collection('users')
    const { postID, commentID, updatedComment } = req.body
    const { user } = req.decoded
    try{
       await  userCollection.updateOne(
            { 'posts._id': ObjectId(postID) },
            { $set: { "posts.$.comments.$[inner].comment": updatedComment } },
            { arrayFilters: [ { 'inner._id': ObjectId(commentID) } ],
              upsert: true })
              return res.status(200).send({response: updatedComment})
    }catch(err){
        if(err){
            console.log(err);
            return res.status(500).send({error:'Something went wrong, please try again'})
        }
    }
   
})

router.get('/posts', auth.checkToken, async (req, res) => {
    const userCollection = db.collection('users')
    const { user } = req.decoded
    try{        
        const friends = await userCollection.find({'friends': {$elemMatch: {'friendID': user._id}}}).project({'posts':1, 'firstname':1, 'lastname':1, 'profilePicture': 1, 'isLoggedIn':1}).toArray()
       
        return res.send({friends})

    }catch(err){
        if(err){console.log(err);  return res.status(500).send({error: 'Something went wrong, please try again'});}
    }
})

module.exports = router;