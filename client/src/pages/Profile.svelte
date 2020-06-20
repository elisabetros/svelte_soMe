<style>
    .profile{
        margin-top:10vh;
        width:55vw;
        margin:10vh auto 3vh;
    }
    .coverImg{
        background-repeat: no-repeat;
        background-size: cover;
        height:40vh;
        border-radius: 5px;
        display: grid;
        grid-template-columns: 2.5fr 4fr 2fr;
        align-content: end;
        position: relative;
        z-index: 1;
    }
    .coverImg img{
        position: absolute;
        bottom:-5vh;
        left:5px;
        border: 4px solid white;
        width:200px;
        height:200px;
    }
    h1{
        color :white;
        grid-column: 2;
    }
    .btn{
        background:#ddd;
        align-self: end;
        width:auto;
        margin:5%;
        padding:2%;
        border-radius: 2px;
        border:1px solid rgba(0,0,0,.3);
        text-align:center;
        cursor: pointer;
    }
    .btn p{
        margin:0;
        text-align: center;
    }
    .addPost{
        z-index: 0;
        width: 55vw;
        margin:3vh auto 0;
        background: white;
        border-radius: 5px;
    }
    .posts{
        display: grid;
        margin:3vh auto 0;
        justify-content: center;
        grid-gap: 2%;
    }
    .profilePicture:hover .customLabel{
        visibility:visible;
    }
</style>

<!-- ########################### -->

<div class="profile">
        <div class="coverImg" style={'background-image:url(http://localhost/coverImg/'+user.coverPicture +');'}>
        <img src={"http://localhost/userImg/"+ user.profilePicture} class="profilePicture" alt="Profile photo">
        <h1>{user.firstname} {user.lastname}</h1>
        {#if isUsers}
            <div class="btn btnUpdate"><Link to="/updateprofile"><p>Update Information</p></Link></div>
        {:else}
            {#if friends}
                {#if friends.includes(user._id)}
                <div class="btn btnRemoveFriend" on:click={handleRemoveFriend}> Friends</div>
                {/if}
            {:else}
                <div class="btn btnAddFriend" on:click={handleAddFriend}>Send friend Request</div>
            {/if}
        {/if}
    </div>
    {#if isUsers}
        <div class="addPost">
            <form enctype='multipart/form-data' class="frmPost">
            <img src={"http://localhost/userImg/"+ user.profilePicture} class="profilePicture small"/>
            <textarea type="text" placeholder={"What's on your mind, "+ user.firstname + '?'} name="post" on:change={handleChange}/>
            <label class="customLabel"><i class="far fa-image"></i> Add image<input type="file" name="picture" on:change={handleChange}></label>
            <button on:click={handlePost}>Post</button>
            </form>
        </div>
    {/if}
    <div class="posts">
        {#if user.posts}
            {#each user.posts as post}
                 <Post {...post} name={user.firstname + user.lastname} isLoggedIn={user.isLoggedIn} userID={post.userID} profilePicture={user.profilePicture} date={post.date} isUsers={isUsers}/>
            {/each}
        {/if}
    </div>

</div>
<!-- ########################### -->

<script>
    import axios from 'axios'
    import { Link } from "svelte-routing";
    import Post from '../components/Post.svelte'

    export let _id;
    export let userID;
    export let friends;

    let user = {}
    let isUsers = false;
    let values = {}

    const handleChange = () => {

    }
    const handlePost = () => {

    }

    const handleRemoveFriend = async () => {
        try{
            const response = await axios.delete('http://localhost/friend',  {data:{'friendID': userID}})
            console.log(response.data)
        }catch(err){
            if(err){console.log(err.response); }
        }
    }
    const handleAddFriend = async () => {
        console.log('add friend')
        try{
            const response = await axios.put('http://localhost/user/friendRequest', {'friendID': userID})
            console.log(response.data)
        }catch(err){
            if(err){console.log("message"); return; }
            console.log("message")
        }
    }
    const fetchUser = async () => {
        const response = await axios(`http://localhost/user/${userID}`)
        console.log(response.data.user)
        user= await response.data.user
        if(!user.coverPicture){
            user.coverPicture = 'standard.jpg'
        }
        if(!user.profilePicture){
            user.profilePicture = 'standard.png'
        }
        convertUserPosts()
    }
    const convertUserPosts = () => {
        user.posts.forEach(post => {
            const date =  dateFromObjectId(post._id)
            post.date = date
        })
    }
    const dateFromObjectId = function (objectId) {
        let date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
        date = date.toDateString()
        return date
    };
    if(_id === userID){
        isUsers = true;
    }
        
    fetchUser()
    


</script>