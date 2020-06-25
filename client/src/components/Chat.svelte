<style>
.chat{
    background: white;
    border-radius: 5px 5px 0 0;
    grid-row: 1;   
    width:250px; 
    max-height: 100%;
    /* height:450px; */
    z-index: 20;
    align-self:end;
    box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
}
.chatHeader{
    border-radius: 5px 5px 0 0;
    display:grid;
    grid-template-columns: 5fr 1fr;
    background: #009688;
    padding:.5em;
    color: white;
    position: relative;
    height:50px;
    z-index: 5;
}
.chatHeader>div{
    display: grid;
     grid-gap: .5em;
    grid-template-columns: 1fr 5fr;
}
.closeChat{
    justify-self: right;
    font-size: 150%;
    line-height: 30px; 
    cursor: pointer;
}
.chatContent{
    padding:.5em;
    display: grid;
    grid-gap:1em;
    height: 200px;
    align-items:end;
    overflow-y:scroll;
}

textarea{
    width: 100%;
    font-size: 80%;
    border:none;
    border-radius:0;
    border-top:1px solid #eee;
}
form{
    height:50px
}
form > i{
    position: absolute;
    bottom:20px;
    right:.5em;
    color:#009688;
    cursor: pointer;
    z-index: 1;
}

.chatSender{
    display: grid;
    grid-template-columns: 1fr 5fr;
    align-content: end;
}
span.timestamp{
    font-size: 65%;
    grid-column: 1/-1;
    color:#b2b2b2;
    margin-bottom: .3em
}

</style>

<!-- ########################### -->
{#if open}
<div class={'chat ' + 'chat-'+chat.id} id={chat.id}>
    <div class="chatHeader" on:click={minimizeChat}>
        <div class="user">
            <img src={"http://localhost/userImg/"+ chat.profilePicture} alt="user image" class="profilePicture small">
            <Link to={'/profile/'+ chat.id}> {chat.name}</Link>
        </div>
        <span class="closeChat" on:click={closeChat}>×</span>
    </div>
    <div class="chatContent chatHistory"  bind:this={chatHistory}>
    {#each chatMessages as chatMessage}
          {#if chatMessage.sender === currentContact.friendID}
          <div class="chatSender">
          <span class="timestamp">{convertTimestamp(chatMessage.timestamp)}</span>
                <img src={"http://localhost/userImg/"+ chat.profilePicture} alt="user image" class="profilePicture small">
                <p class="incoming">{chatMessage.message} </p>
          </div>
           {:else if chatMessage.sender === $user._id}
                <p class="outgoing">{chatMessage.message} </p>
          {/if}
    {/each}
    </div>
    <form>
        <textarea class="chatTxt" bind:this={chatTxt} placeholder="Write message" on:change={handleChange}
        on:keyup={e => (e.keyCode == 13 ? handleSend(e) : null)} />
        <i class="fas fa-paper-plane" on:click={handleSend}></i>
    </form>
</div>
{/if}
<!-- ########################### -->


<script>
import { Link } from "svelte-routing";
import io from 'socket.io-client';
import axios from 'axios'
import { onMount } from 'svelte'

import { user } from '../data.js'
import { chats } from '../data.js'

const socket = io('http://localhost');


export let chat;
let message= "";
let sender = $user;

let currDate = new Date()

let reaction;
let chatHistory;
let chatTxt;

$: open = true;
$: timePast = "";
$: chatMessages = [];
$: currentContact = $user.friends.filter(friend => friend.friendID === chat.id)[0];


const handleChange = (event) => {
    message = event.target.value
}

const convertTimestamp = (timestamp) => {
    const chatDate = new Date(timestamp * 1000)
    const month = chatDate.toLocaleString('default', { month: 'long' });
    const minutes = chatDate.toTimeString().slice(3, 5); 
    const time = new Date(chatDate).getHours() +":" + minutes
    // console.log(time)
    const timeDifference = Math.abs(currDate.getTime()-chatDate.getTime())/36e5
    if(timeDifference<24){
        return time
    }
    else{
        let date = `${chatDate.getDate()}. ${month} ${time}`
       return date
    }    
} 

const markChatsAsSeen = async () => {
    // console.log('changing chats to seen')
    try{
        const response = await axios.put('http://localhost/chats', {'friendID': currentContact.friendID})
        // console.log(response.data)
    }catch(err){
        if(err){console.log(err.response.data)}
    }
}
const fetchChatMessages = async () => {
    // console.log("fetching chat messages");
    try {
        let response = await axios(`http://localhost/chats/${currentContact.friendID}`);
      let data = response.data;
      if(data.chats){
          currentContact.chat = data.chats;
          chatMessages = [];
          chatMessages = data.chats;
          chatHistory.scrollTop = chatHistory.scrollHeight;
            markChatsAsSeen()
      }    
      socket.emit("chatRoom", $user._id, currentContact.friendID);
      
    } catch (err) {
        if(err){
            console.log(err);
        }
      return;
    }
  };

// console.log(message, sender)
onMount(() => {
    setTimeout(() => {
    fetchChatMessages();
    }, 500);
  });

const handleSend = (event) => {
    chatTxt.value =""
    let timestamp = Math.round(new Date().getTime() / 1000);
    console.log(sender._id);
    console.log(currentContact.friendID);
    message = {
      sender: sender._id,
      message: message,
      timestamp: timestamp
    };
    console.log(event.target.parentElement.previousElementSibling)
    event.target.parentElement.previousElementSibling.scrollTop = event.target.parentElement.previousElementSibling.scrollHeight;
    socket.emit("message", $user._id, currentContact.friendID, message);
}

socket.on("message", data => {
    console.log("message", data);
    chatMessages = [...chatMessages, data.message];
    currentContact.chat.messages = chatMessages;
    console.log(currentContact);
  });

const minimizeChat = () => {   
    document.querySelector(`.chat-${id}`).classList.toggle('minimize')
}
const closeChat = (event) => {
    open = false   
    socket.emit("leaveRoom", $user._id, currentContact.friendID);
}


</script>