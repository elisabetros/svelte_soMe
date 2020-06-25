<style>
   .comment{
       display: grid;
       grid-template-columns: 1fr 20fr;
       padding:.5em;
   }
   .commentBG{
       padding:.5em;
       border-radius: 25px;
       background:#e2e5e8;
       width:100%;
       width: max-content;
       display: grid;
       grid-template-columns: 8fr 1fr;
   }
   .comment span{
        font-size: 90%;
   }
   .comment .name strong{
       color: #009688;
       font-size: 100%;
   }
   .editComment{
       margin-top: 0.4em;
       justify-self: right;
   }
   input{
    width: 200px;
    background: none;
    border-radius: 25px;
    font-size: 90%;
   }

   button{
    margin: 0;
    background: none;
    color: #009688;
    text-decoration: underline;
   }
   form{
    grid-column: 1/-1;
    grid-template-columns: 5fr 1fr 1fr;
    width: 300px;
    display: grid;
    grid-template-columns: 10fr 1fr 1fr;
   }
</style>

<!-- ######################### -->
<div class="comment comment-{_id}">
    <img src={"http://localhost/userImg/"+ profilePicture} class="profilePicture small">
     <div class="commentBG">
        {#if !editComment}
            <span class="name"><strong>{firstname} {lastname}</strong>    {comment}</span>
        {:else if editComment}
            <form>
                <input type="text" name="newComment" value={comment} on:change={handleChange}>
                <button on:click={handleEdit}>Edit</button>
                <button on:click={handleDelete}>Delete</button>
            </form>
        {/if}
        {#if userID === $user._id && !editComment}
            <div class="btnEdit editComment" on:click={handleEditComment}>...</div>
       
        {/if}
    </div>
</div>

<!-- ######################### -->

<script>
import axios from 'axios';
import { user } from '../data.js'

export let comment;
export let profilePicture;
export let firstname;
export let lastname;
export let userID;
export let _id;
export let postID;
export let onDeleteComment;

$: editComment = false;

let values= {newComment: comment}

const handleChange = (event) => {   
    values[event.target.name] = event.target.value
}

const handleEditComment = () => {
    editComment? editComment=false : editComment=true
}

const handleEdit = async (event) => {
    try{
        const response = await axios.put('http://localhost/comment', {postID, 'commentID': _id, 'updatedComment': values.newComment})
        console.log(response.data)
        editComment=false;
        comment = response.data.response
    }catch(err){
        if(err){console.log(err); return; }
    }
}
const handleDelete = async (event) => {
    try{
        const response = await axios.delete('http://localhost/comment', {data:{postID,'commentID': _id }})
        console.log(response.data)
        editComment=false;
        onDeleteComment(_id)
    }catch(err){
        if(err){console.log(err); return; }
    }
}
</script>