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
       border:2px solid white;
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
    {#if friends}
        {#each friends as friend}
{console.log(friend.isLoggedIn)}
        <div class="contact" on:click={showChat}>
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
export let friends;

const showChat = () => {
    console.log('chat')
}
if(friends){
    friends.forEach(friend => {
        console.log(friend)
        if(!friend.profilePicture){
            friend.profilePicture = 'standard.png'
        }
    });
}
</script>