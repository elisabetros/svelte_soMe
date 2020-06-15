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
       justify-content: left;
       position: relative;
        font-weight: bold;
        width: 40%;
     
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
   .postText{
       padding: 0 2%;
       margin: 1% 0;
   }
</style>

<!-- ########################### -->

<div class="post">
    <div class="user">
    <img src={"http://localhost/userImg/"+ profilePicture} class="profilePicture">
    {#if isLoggedIn}
        <div class="status"></div>
    {/if}
    <p>{name}</p>
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
            <div>
                <i class="fa fa-thumbs-up"></i>
                <div class="likeCount">{likeCount()}</div>
            </div>
        {/each}
    {/if}
    </div>
    <div class="actions">
    </div>
    <div class="comments">
    </div>
</div>

<!-- ########################### -->

<script>
export let postContent;
export let likes;

export let postImg;
export let name;
export let isLoggedIn;
export let profilePicture;

const likeCount = () => {
    let count = 0
    if(likes){
        count = likes.length 
    }
    return count
}
</script>