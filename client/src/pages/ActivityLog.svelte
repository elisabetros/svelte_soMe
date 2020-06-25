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
        grid-template-columns: 5fr 4fr;
        border-bottom:1px solid #eee;
    }
    .friendRequest.incoming{
        grid-template-columns: 5fr 4fr 4fr;
    }
    button{
        margin:0;
        justify-self: right;
    }
    .btnDelete{
        background-color:#b2b2b2;
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
        {#if notifications.friendRequests}  
            {#each notifications.friendRequests as friendRequest}
                <div class="friendRequest incoming">
                    <p>{friendRequest.firstname} {friendRequest.lastname}</p>
                    <button on:click={()=>acceptRequest(friendRequest.friendID)}>Accept Friend Request</button>
                    <button class="btnDelete" on:click={()=>declineRequest(friendRequest.friendID)}>Decline Friend Request</button>
                </div>
            {/each}
        {/if}
        {#if notifications.notification}
            {#each notifications.notification as notification}
                <div class="message"> <p>{notification.message}</p></div>
            {/each}
        {/if}
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
const declineRequest = async (id) => {
    try{
        const response = await axios.delete('http://localhost/user/declineFriendRequest', {data:{'friendID': id}})
        console.log(response.data)
        let newFriendRequests = notifications.friendRequests.filter(friendRequest => {
        if(friendRequest.friendID !== id){
            return friendRequest
            }
        })
        notifications.friendRequests = newFriendRequests
    }catch(err){
        if(err){
            console.log(err.response.data.error); 
        }
    }
}
const acceptRequest = async (id) => {
    try{
        const response = await axios.put('http://localhost/user/friend', {'friendID': id})
        console.log(response.data)
        let newFriendRequests = notifications.friendRequests.filter(friendRequest => {
            if(friendRequest.friendID !== id){
                return friendRequest
            }
        })
        notifications.friendRequests = newFriendRequests
    }catch(err){
        if(err){
            console.log(err.response.data.error); 
        }
    }
}

const fetchNotificationsSeen = async () => {

    try{
        const response = await axios.put('http://localhost/user/notifications')
        console.log(response.data)
    }catch(err){
        if(err){console.log(err.response.data.error);  }
    }
}

fetchNotificationsSeen()
</script>