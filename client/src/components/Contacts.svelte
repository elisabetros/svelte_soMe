<style>
.contacts{
    position: fixed;
    top:-0;
    right:0;
    height:100%;
    padding:6% 2% 2%;
    width:18vw;
    border-left: 1px solid rgba(0,0,0,.1);
    /* background:white; */
    overflow-y: scroll;
}
.contact{
    display: grid;
    grid-template-columns: 3fr 10fr 1fr;
    align-items: center;
    cursor: pointer;
    margin:.5em 0;
}
p{
    margin:0;
}
h4{
     margin:8% 0 4% 0;
}
.status{
       border:1px solid white;
       background:green;
       border-radius: 50%;
       width:10px;
       height:10px;
       left:calc(45px + 2%);
   }
</style>

<!-- ########################### -->

<div class="contacts">
<h4>Contacts</h4>
    {#if $user.friends}
        {#each $user.friends as friend}
        <div class="contact" on:click={()=>showChat(friend.friendID)}>
            <img src={"http://localhost/userImg/"+ friend.profilePicture} class="profilePicture small"/>
            <p> {friend.firstname} {friend.lastname}</p>  
            {#if friend.isLoggedIn}
                <div class="status"></div>          
            {/if}
        </div>
        {/each}
    {/if}
</div>

<!-- ########################### -->

<script>
import { user } from '../data.js'
// export let friends;
export let onChat;

const showChat = (id) => {
    console.log('chat')
    const friend = $user.friends.find(friend=> friend.friendID === id)
    // console.log(friend)
    let data = {
        firstname: friend.firstname,
        lastname: friend.lastname,
        id: friend.friendID,
        profilePicture: friend.profilePicture
    }
    console.log(data)
    onChat(data)
}
if($user.friends){
    $user.friends.forEach(friend => {
        console.log(friend)
        if(!friend.profilePicture){
            friend.profilePicture = 'standard.png'
        }
    });
}
</script>