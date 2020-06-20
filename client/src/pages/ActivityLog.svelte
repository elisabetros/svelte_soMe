<style>
    .activities{
        display: grid;
        margin:10vh auto 0;
        grid-gap: 2%;
        padding:2em;
        background:white;
         width:55vw;
        border-radius:5px;
        text-align: left;
    }
    h2{
        border-bottom:1px solid #eee;
    }
    h4{
        margin:0;
    }
     .friendRequest{
        justify-content: center;
        display: grid;
        grid-template-columns: 25fr 10fr;
        border-bottom:1px solid #eee;
    }
    button{
        margin:0;
        justify-self: right;
    }
    .friendRequest>div p:first-child{
        font-weight: bold;
    }
</style>

<!-- ################### -->

<div class="activities">
    <h2>Your Activities</h2>
    {#if friendRequests}
        <h4>Friend requests</h4>
        {#each friendRequests as friendRequest}
            <div class="friendRequest">
                <p>{friendRequest.firstname} {friendRequest.lastname}</p>
                <button on:click={()=>cancelRequest(friendRequest.friendID)}>Cancel Friend Request</button>
            </div>
        {/each}
    {/if}
    {#if notifications}  
        {#each notifications.friendRequests as friendRequest}
            <div class="friendRequest">
                <p>{friendRequest.firstname} {friendRequest.lastname}</p>
                <button on:click={()=>acceptRequest(friendRequest.friendID)}>Accept Friend Request</button>
            </div>
        {/each}
    {/if}
</div>
<!-- ################### -->

<script>
import axios from 'axios'

export let friendRequests;
export let notifications;
export let firstname;
export let lastname;
export let _id;

const cancelRequest = async (id) => {
    console.log(id)
    try{
            const response = await axios.delete('http://localhost/user/friendRequest', {data:{'friendID': id}})
            console.log(response.data)
            let newFriendRequests = friendRequests.filter(friendRequest => {
                if(friendRequest.friendID !== id){
                    return friendRequest
                }
            })
            friendRequests = newFriendRequests
            console.log(newFriendRequests)
        }catch(err){
            if(err){
                console.log(err)
             }
    }
}

const acceptRequest = async (id) => {
try{
            const response = await axios.put('http://localhost/user/friendRequest', {'friendID': id})
            console.log(response.data)
        }catch(err){
            if(err){
                console.log(err.response); 
            }
        }
}

</script>