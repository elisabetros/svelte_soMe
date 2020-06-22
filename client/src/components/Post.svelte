<style>
    .postImg{
        width:50%;
        display: block;
        margin:auto;
        width:55vw;
        height:40vw;
        object-fit: cover;
    }
    .post{
        border:1px solid #F2F3F5;
        background:white;
        justify-self: center;
        justify-content: center;
        width:55vw;
        border-radius: 5px;
    }
   .post .user{
       padding:2% 2% 0;
       display: grid;
       grid-template-columns: .3fr 5fr 10fr;
       grid-template-rows: 1fr 1fr;
       justify-content: left;
       position: relative;
    /* width: 40%;      */
   }
   .post p{
       grid-column: 2
   }
   .post .user .time{ 
       font-size: 70%
   }      
   .post .user p:nth-child(2){       
        font-weight: bold;
        align-self: end;
   }
   .post .user img{
       grid-row: 1/3;
       justify-self: center
   }
      .editPost{
       font-size: 250%;
       color:#009688;
       grid-row: 1;
       grid-column: 3;
       align-self: start;
       justify-self: right;
       line-height: 0px;
       cursor: pointer;
   }
   .status{
       border:2px solid white;
       background:green;
       border-radius: 50%;
       width:15px;
       height:15px;
       position: absolute;
       bottom:5%;
       left:calc(45px + 2%);
   }
   p{
       padding: 0 2%;
       margin: 1% 0;
   }
   .likes, .actions, .comments{
       margin: 0 2%;
       padding: 1% 0;
       border-top: 1px solid #F2F3F5;
   }
   .likes{
       display:grid;
       grid-template-columns: 1fr 1fr 20fr;
       justify-content: right;
       cursor: pointer;
   }
   .actions{
       display: grid;
       grid-template-columns: 1fr 1fr;
       justify-content: center;
       padding:1% 20%;
       cursor: pointer;
   }
   .actions div{
       display: grid;
       grid-template-columns: 1fr 1fr;   
       grid-gap: 1%;   
   }
   .actions div i{
       justify-self: end;
   }
   i{ 
       align-self: center;
   }
   label{
       display: grid;
       grid-template-columns: .1fr 1.5fr .5fr;
       grid-gap:1%;
   }
   input{
       width:100%;
       border-radius:25px;
       margin-bottom: 0;
       padding-left:20px;
   }.comments{
       display: grid;
       grid-gap: 2%;
   }
   .comment{
       border-radius: 25px;
       background:#e2e5e8;
       display: flex;
       padding:.5%;
   }
   .comment p{
       padding:0 0 0 1%;
       margin:0;
       line-height: 20px;
   }
   .comment p:first-child{
       font-weight: bold;
       color: #009688;
   }
    
    .frmPost h2{
        text-align: center;
        grid-column: 1/-1;
        border-bottom: 1px solid #eee;
        padding-bottom: 2%;
    }
    .frmPost .profilePicture{
        top:40%;
    }
    .frmPost{
    grid-template-columns: 5fr 10fr !important;
    }
    
    .customLabel{
        width:80%;
    }
    a:visited, a{
        color:black;
    }
</style>

<!-- ########################### -->

<div class="post" use:links>
    <div class="user">
            <img src={"http://localhost/userImg/"+ profilePicture} class="profilePicture" alt="user image">
            {#if isLoggedIn}
                <div class="status"></div>
            {/if}
        <a href={"/profile/"+userID}>
            <p><strong>{name}</strong></p>
        </a>
            <p class="time">{convertDate()}</p>
        {#if isUsers}
            <div class="editPost" on:click={showEditModel}>...</div>
        {/if}
    </div>
    {#if postContent}
        <p class="postText">{postContent}</p>
    {/if}
    {#if postImg}
           <img  class="postImg" src={"http://localhost/postImg/"+ postImg}>
    {/if}
    <div class="likes">
    {#if likes && likes.length>0}
        <i class="fa fa-thumbs-up"></i> 
        <div class="likeCount">{likeCount()}</div>       
    {/if}
    </div>
    <div class="actions">
    
        {#if like}
           <div on:click={handleLike}><i class="fas fa-thumbs-up"></i> <p><strong>Like this</strong></p></div>
        {:else}
            <div on:click={handleLike}><i class="far fa-thumbs-up"></i> <p>Like this</p></div>
        {/if}
    <div on:click={()=> showComments=true}> <i class="far fa-comment-alt" ></i> <p>Comment</p></div>
    </div>
    {#if showComments}
        <div class="comments">
            {#if comments}
                {#each comments as comment}
                    <div class="comment">
                    <p>{comment.firstname} {comment.lastname}</p>
                    <p>{comment.comment}</p></div>
                {/each}
            {/if}
            <label>
                <img src={"http://localhost/userImg/"+ profilePicture} class="profilePicture small">
                <input type="text" placeholder="Write comment" bind:value={comment}/>
                <button on:click={()=>handleComment(_id)}>Comment</button>
            </label>
        </div>
    {/if}

   {#if editModel}
     <div class="model">
        <div class="modelContent">
        <span class="close" on:click={showEditModel}>X</span>
             <form enctype='multipart/form-data' class="frmPost">
             <h2>Edit your post</h2>
                <img src={"http://localhost/userImg/"+ profilePicture} class="profilePicture small"/>
                <textarea type="text" value={postContent} name="post" on:change={handleChange}/>
                <label class="customLabel"><i class="far fa-image"></i> Add image<input type="file" name="picture" on:change={handleChange}></label>
                <button on:click={handleEdit}>Edit Post</button>
                <button on:click={handleDelete}>Delete Post</button>
            </form>
        </div>
    </div>
   {/if}
</div>

<!-- ########################### -->

<script>

import axios from 'axios'
 import { links } from "svelte-routing";

export let postContent;
export let likes;
export let date;
export let postImg;
export let _id;
export let name;
export let isLoggedIn;
export let profilePicture;
export let comments; 
export let isUsers
export let userID;
let editModel = false
let values = {newPostContent: postContent, newPostImg: postImg}
let showComments = false;
let comment = ""
let like = false
$: count = ""

const checkIfLiked = () => {
    if(likes){
       const found = likes.find(like => like.userID === userID)
       if(found){
           like = true;
       }
    }
}

const convertDate = () => {
    const currDate = new Date().getTime()
    const postDate = new Date(date).getTime()
    // console.log(currDate, 'post date:',new Date(date))
    const timeDifference = Math.abs(currDate-postDate)/36e5
    if(timeDifference>24){
        return date.substring(0,11)
    }else{
        let dateString = `${Math.floor(timeDifference)} hours ago`
        return dateString
    }
}

const handleLike = async () => {
    if(!like){
        try{            
            const response = await axios.post('http://localhost/likePost', {'postID': _id})
            console.log(response.data)
            like= true
            let names = name.split(' ')
            console.log(names)
            if(names.lengt > 2){
                likes.push({ userID, firstname: names[0]+names[1], lastname:names[3] })
            }else{
                likes.push({userID, firstname: names[0], lastname: names[1]})
            }
        }catch(err){
            if(err){console.log(err.response.data.error); return; }
        }
    }else{
          try{            
              console.log(_id)
            const response = await axios.delete('http://localhost/likePost', {data:{'postID': _id}})
            console.log(response.data)
            like= false
            console.log(likes)
            let newLikes = likes.filter(like =>{
                if(like.userID !== userID){
                    return like
                }
            })
            likes = newLikes
        }catch(err){
            if(err){console.log(err.response.data.error); return; }
        }
    }
}

const showEditModel = async () => {
    !editModel? editModel=true: editModel=false
    console.log(editModel)
}
const handleChange = (event) => {
    if(event.target.name === 'picture'){
        let fileName= event.target.value.split("\\").pop();
        document.querySelector('.customLabel').innerHTML ="<span></span>"+ fileName;
        values.newPostImg = event.target.files
    }else{
        values.newPostContent = event.target.value
    }
}
const handleDelete = async (event) => {
    event.preventDefault()
    try{
        const response = await axios.delete('http://localhost/post', {data:{'postID': _id}})
        console.log(response.data)
        onDelete(_id)
        showEditModel()
    }catch(err){
        if(err){console.log(err.response); }
    }
}

const handleEdit = async (event) => {
    event.preventDefault()
    console.log(values)
        if(values.newPostImg !== undefined){
            console.log('with image')
            try{
                let formData = new FormData
            formData.set('postID', _id);
            formData.set('newPostContent', values.newPostContent);
            formData.set('newPostImg', values.newPostImg[0]);
                const response = await axios.put('http://localhost/updatePostWithImage', formData)
                console.log(response.data)
                editModel=false
            }catch(err){
                if(err){console.log(err.response); return; }
            }
        }else{
            try{
                const response = await axios.put('http://localhost/updatePost', {'postID': _id, 'newPostContent': values.newPostContent})
                console.log(response.data)
                editModel=false
            }catch(err){
                if(err){console.log(err.response); return; }
            }
        }
    
}

const handleComment = async (postID) => {
    if(comment && postID){
        console.log(comment, postID)
            const token = sessionStorage.getItem('token')
           const config = {headers: { Authorization: `Bearer ${token}` }};
           try{
               const reponse = await axios.post('http://localhost:80/comment', {postID, comment})
               console.log(response)
           }catch(err){
               if(err){console.log(err.response); return; }
           }
    }
}

const likeCount = () => {
    if(likes){
        count = likes.length 
    }
    return count
}

if(likes){
    checkIfLiked()
}

</script> 