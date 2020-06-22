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
    .hoverCover, .hover{
        transition: all .2s;
        z-index: 10;
        position: absolute;
        text-align: center;
        box-sizing: border-box;
        color:white;
        max-width: 5vw;
        height:40px;
        overflow: hidden;
        cursor: pointer;
    }
    .hoverCover{
        top:1vw;
        left:1vw;
        padding: 1em;        
    }
    .hover{
        padding: 1em;
        bottom:0;
        left:0;
        border-radius: 0 0 100px 100px;
    }
    .profilePicture{
        cursor: pointer;
    }
    .hoverCover:hover,
     .hover:hover {
         background: rgba(0,0,0,.5);
         max-width: 100%;
     }
    .hoverCover:hover{
        line-height: 10px;
        border:1px solid white;
    }
    .hover:hover {
        height:100px;
        width: 192px;
        left:8px;    
        padding: 1em 0 0;
        bottom: calc(-5vh + 4px);
    }
    .modelContent {
        height: 20vh;
        display: grid;
    }
    .modelContent form{
        display: grid;
        grid-template-columns: 4fr 4fr;
        align-content: center;
        margin: 2em ;
    }
    .modelContent .customLabel{
        margin: 2em;
        width: 172px;
        height:50px;
        justify-self: right;
    }
    .modelContent button{
        justify-self: left;
        margin:auto 0;
        height:50px;
        width:10vw;
    }
</style>

<!-- ########################### -->

<div class="profile">
        <div class="coverImg" style={'background-image:url(http://localhost/coverImg/'+user.coverPicture +');'}>
        
        <img src={"http://localhost/userImg/"+ user.profilePicture} class="profilePicture" alt="Profile photo">
        {#if isUsers}
        <div class="hover" on:click={()=>showModel('profile')}>
            <i class="fas fa-camera"></i> Update Picture
        </div>
        <div class="hoverCover" on:click={()=>showModel('cover')}>
            <i class="fas fa-camera"></i> Update Cover Picture
        </div>
            <div class="model hidden">
                <div class="modelContent">
                <span class="close" on:click={showModel}>X</span>
                    <form id="frmImg" enctype="multipart/form-data">
                    {#if modelType === 'cover'}
                     <label class="customLabel" for="coverPicture"><i class="far fa-image"></i> Add image</label><input type="file" id="coverPicture" name="coverPicture" on:change={handleChange}>
                    <button on:click={handleCoverPicture}>Set Cover Picture</button>
                    {:else}
                     <label class="customLabel" for="profilePicture"><i class="far fa-image"></i> Add image</label><input type="file" id="profilePicture" name="profilePicture" on:change={handleChange}>
                    <button on:click={handleProfilePicture}>Set Profile Picture</button>
                    {/if}
                    </form>
                </div>
            </div>
        {/if}
        <h1>{user.firstname} {user.lastname}</h1>
        {#if isUsers}
            <div class="btn btnUpdate" use:links><a href="/updateprofile"><p>Update Information</p></a></div>
        {:else}
            {#if friends}
                {#if friends.includes(_id)}
                    <div class="btn btnRemoveFriend" on:click={handleRemoveFriend}> Friends</div>
                 {:else if friendRequests && friendRequests.some( request => request.friendID === user._id)}
                    <div class="btn btnAddFriend" on:click={handleCancelRequest}>Cancel friend Request</div>
                {:else}
                    <div class="btn btnAddFriend" on:click={handleAddFriend}>Send friend Request</div>
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
            <label class="customLabel" for="picture"><i class="far fa-image"></i> Add image</label><input type="file" id="picture" name="picture" on:change={handleChange}>
            <button on:click={handlePost}>Post</button>
            </form>
        </div>
    {/if}
    <div class="posts">
        {#if user.posts}
            {#each user.posts as post}
                 <Post onDelete={handleDelete} {...post} name={user.firstname + ' ' + user.lastname} isLoggedIn={user.isLoggedIn} userID={post.userID} profilePicture={user.profilePicture} date={post.date} isUsers={isUsers}/>
            {/each}
        {/if}
    </div>

</div>
<!-- ########################### -->

<script>
    import axios from 'axios'
    import { links } from "svelte-routing";
    import Post from '../components/Post.svelte'

    export let _id;
    export let userID;
    export let friends;
    export let friendRequests

    $: user = {}
    let isUsers = false;
    let values = {}
    let modelType = "";

    const handleChange = (event) => {
        console.log(event.target.name, values)
        if(event.target.files){
            let fileName= event.target.value.split("\\").pop();
            event.target.parentElement.querySelector('.customLabel').innerHTML ='<span></span>' + fileName;
            values[event.target.name] = event.target.files
        }else{
            values[event.target.name] = event.target.value
        }
    }

    const handleCoverPicture = async (event) => {
        event.preventDefault()
        if(values.coverPicture){
            let formData = new FormData
            formData.set('picture', values.coverPicture[0]);
            try{
                const response = await axios.post('http://localhost/user/coverImg', formData)
                console.log(response.data)
                showModel()
                user.coverPicture = response.data.response
            }catch(err){
                if(err){console.log(err.response.data) }
            }
        }
    }

    const handlePost = async () => {
    console.log(values)
    event.preventDefault()
    if(values.post || values.picture){
        console.log(values)
        if(!values.picture){
            try{
                const response= await axios.post('http://localhost/post', {'post': values.post})
                console.log(response.data)
                user.posts = [...user.posts, {'postContent': values.post}]
            }catch(err){
                if(err){console.log(err.response); return; }
            }
        }else{
            let formData = new FormData
            formData.set('post', values.post);
            formData.set('picture', values.picture[0]);
              try{
                const response= await axios.post('http://localhost/postWithImage', formData,{ headers: {
            'content-type': 'multipart/form-data' }})
                console.log(response.data)
                user.posts = [...user.posts, {'postContent': values.post, 'postImg': response.data.response }]
            }catch(err){
                if(err){console.log(err.response); return; }
            }
        }
    }
}

    const handleDelete = (id) => {
    newPosts = user.posts.filter(post => {
        if(post._id !== id) return post
    })
    user.posts = newPosts

    }
    const handleProfilePicture = async (event) => {
        event.preventDefault()
        // console.log(values)
        if(values.profilePicture){
            try{
                let formData = new FormData
                formData.set('picture', values.profilePicture[0]);
                const response = await axios.post('http://localhost/user/profilePicture', formData,{ headers: {
                    'content-type': 'multipart/form-data'  }})
                console.log(response.data)
                sessionStorage.setItem('token', response.data.token)
                user.profilePicture = response.data.pictureName
                
                showModel()
            }catch(err){
                if(err){
                    console.log(err.response.data);
                 }
        }
     }
    }

    const showModel = (type) => {
        console.log(values)
        modelType = type;
        document.querySelector('.model').classList.toggle('hidden');
    }

    const handleCancelRequest = async () => {
           try{
            const response = await axios.delete('http://localhost/user/friendRequest',  {data:{'friendID': userID}})
            console.log(response.data)
            newFriendRequests = friendRequests.filter(request => {
                if(request.friendID !== user._id){
                    return request
                }
            })
            friendRequests = newFriendRequests
        }catch(err){
            if(err){console.log(err.response); }
        }
    }
    
    const handleRemoveFriend = async () => {
        try{
            const response = await axios.delete('http://localhost/user/friend',  {data:{'friendID': userID}})
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
           friendRequests = [...friendRequests, {'friendID': user._id, 'firstname': user.firstname, 'lastname': user.lastname}]
        }catch(err){
            if(err){console.log(err.response.data); return; }
        }
    }
    const fetchUser = async () => {
        const response = await axios(`http://localhost/user/${userID}`)
        console.log(response.data.user)
        user = response.data.user
        if(!user.coverPicture){
            user.coverPicture = 'standard.jpg'
        }
        if(!user.profilePicture){
            user.profilePicture = 'standard.png'
        }
        if(user.posts){
            convertUserPosts()
        }
    }
    const convertUserPosts = () => {
        user.posts.forEach(post => {
            const date =  dateFromObjectId(post._id)
            post.date = date
        })
    }
    const dateFromObjectId = function (objectId) {
        let date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
        date = date.toString().substring(0,21)
        return date
    };
    if(_id === userID){
        isUsers = true;
    }
        
    fetchUser()
    


</script>