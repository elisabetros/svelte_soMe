const router = require('express').Router();
const auth = require('../middleware/checkToken');
const { ObjectId } = require('mongodb');


router.get('/chats/:friendID', auth.checkToken, async (req, res) => {
    const { user } = req.decoded;
    const { friendID } = req.params;

    let jUser = await userCollection.findOne({_id: ObjectId(user._id), 'friends.friendID': friendID.toString()})
    // console.log(jUser)
    let friend = jUser.friends.find(friend => friend.friendID === friendID)
    console.log(friend)
    
    if(!friend){
        return res.status(500).send({error: 'not a friend'})
    }
    return res.status(200).send({'chats': friend.chat})
} )


module.exports = router;