<style>
    .postImg{
        width:50%;
        display: block;
        margin:auto;
        width:60vw;
        height:40vw;
        object-fit: cover;
    }
    .post{
        border:1px solid #F2F3F5;
        background:white;
        justify-self: center;
        justify-content: center;
        width:60vw;
        border-radius: 5px;
    }
   .post .user{
       padding:2% 2% 0;
       display: grid;
       grid-template-columns: .3fr 1fr;
       grid-template-rows: 1fr 1fr;
       justify-content: left;
       position: relative;
    width: 40%;     
   }
   .post .user p:last-child{ 
       font-size: 70%
   }      
   .post .user p:first-child{       
        font-weight: bold;
        align-self: end;
   }
   .post .user img{
       grid-row: 1/3;
       justify-self: center
   }
   .status{
       border:2px solid white;
       background:green;
       border-radius: 50%;
       width:10px;
       height:10px;
       position: absolute;
       bottom:17%;
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
</style>

<!-- ########################### -->

<div class="post" >
    <div class="user">
    <img src={"http://localhost/userImg/"+ profilePicture} class="profilePicture">
    {#if isLoggedIn}
        <div class="status"></div>
    {/if}
    <p>{name}</p>
    <p>{date}</p>
    </div>
    {#if postContent}
        <p class="postText">{postContent}</p>
    {/if}
    {#if postImg}
           <img  class="postImg" src={"http://localhost/postImg/"+ postImg}>
    {/if}
    <div class="likes">
    {#if likes}
        {#each likes as like}
                <i class="fa fa-thumbs-up"></i>
                <div class="likeCount">{likeCount()}</div>
        {/each}
    {/if}
    </div>
    <div class="actions">
    <div><i class="far fa-thumbs-up"></i> <p>Like this</p></div>
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
</div>

<!-- ########################### -->

<script>
import axios from 'axios'
export let postContent;
export let likes;
export let date;
export let postImg;
export let _id;
export let name;
export let isLoggedIn;
export let profilePicture;
export let comments; 
let showComments = false;
let comment = ""

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
    let count = 0
    if(likes){
        count = likes.length 
    }
    return count
}



</script> 