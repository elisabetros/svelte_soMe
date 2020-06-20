<style>
.contacts{
    position: fixed;
    top:-0;
    right:0;
    height:100%;
    padding:6% 2% 2%;
    width:15vw;
    border-left: 1px solid rgba(0,0,0,.1);
    /* background:white; */
    overflow-y: scroll;
}
.contact{
    display: grid;
    grid-template-columns: 4fr 10fr;
    align-items: center;
    cursor: pointer;
}
p{
    margin:0;
}
h4{
     margin:8% 0 4% 0;
}
</style>

<!-- ########################### -->

<div class="contacts">
<h4>Contacts</h4>
    {#if friends}
        {#each friends as friend}
        <div class="contact" on:click={showChat}>
            <img src={"http://localhost/userImg/"+ friend.profilePicture} class="profilePicture small"/>
            <p> {friend.firstname} {friend.lastname}</p>
            
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
        if(!friend.profilePicture){
            friend.profilePicture = 'standard.png'
        }
    });
}
</script>