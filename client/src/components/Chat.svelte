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
    align-content:end;
}


input{
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
</style>

<!-- ########################### -->

<div class={'chat ' + 'chat-'+chat.id} id={chat.id}>
    <div class="chatHeader" on:click={minimizeChat}>
        <div class="user">
            <img src={"http://localhost/userImg/"+ chat.profilePicture} alt="user image" class="profilePicture small">
            <Link to={'/profile/'+ chat.id}> {chat.firstname} {chat.lastname}</Link>
        </div>
        <span class="closeChat" on:click={closeChat}>×</span>
    </div>
    <div class="chatContent"  bind:this={chatHistory}>
    {#each chatMessages as chatMessage}
          {#if chatMessage.sender === currentContact.friendID}
                <p class="incoming">{chatMessage.message} </p>
           {:else if chatMessage.sender === $user._id}
                <p class="outgoing">{chatMessage.message} </p>
          {/if}
    {/each}
    </div>
    <form>
        <input type="text" class="chatTxt" name="chatTxt" placeholder="Write message" bind:value={message}>
        <i class="fas fa-paper-plane" on:click={handleSend}></i>
    </form>
</div>

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

let now = Math.round(new Date().getTime() / 1000);

let reaction;
let chatHistory;

// let chatTxt = ""
$: timePast = "";
$: chatMessages = [];
$: isActive = $chats.filter(activeChat => activeChat._id === $user._id)[0];
$: currentContact = $user.friends.filter(friend => friend.friendID === chat.id)[0];

const fetchChatMessages = async () => {
    console.log("fetching chat messages");
    try {
      let response = await axios(`http://localhost/chats/${currentContact.friendID}` );
      let data = response.data;
      console.log(data);
      currentContact.chat = data.chats;
      chatMessages = [];
      chatMessages = data.chats;
      chatHistory.scrollTop = chatHistory.scrollHeight + chatHistory.scrollHeight;
      console.log(data.chats);
    //   console.log(currentContact.friendID);
      console.log(currentContact.chat);
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
    document.querySelector(`.chat-${chat.id} input`).value = "";
    let timestamp = Math.round(new Date().getTime() / 1000);
    console.log(sender._id);
    console.log(currentContact.friendID);
    message = {
      sender: sender._id,
      message: message,
      timestamp: timestamp
    };
    chatHistory.scrollTop = chatHistory.scrollHeight + chatHistory.scrollHeight;
    socket.emit("message", $user._id, currentContact.friendID, message);
}

// function appendMessage(sender, message) {
//     console.log(sender, message)
//     const messageContainer = document.querySelector('.chatContent')
//     const messageElement = document.createElement('p');
//     // messageElement.className = type
//     messageElement.innerText = message;
//     messageContainer.append(messageElement)
// }

socket.on("message", data => {
    console.log("message", data);
    chatMessages = [...chatMessages, data.message];
    currentContact.chat.messages = chatMessages;
    console.log(currentContact);
  });

const minimizeChat = () => {
    console.log(document.querySelector(`.chat-${id}`))
    document.querySelector(`.chat-${id}`).classList.toggle('minimize')
}
const closeChat = (event) => {
    event.target.parentElement.parentElement.className="hidden"
    let updatedChats = $user.chats.filter(
      currentChat => currentChat._id !== user._id
    );
    $user.chats = updatedChats;
    socket.emit("leaveRoom", $user._id, currentContact.friendID);
    console.log($user.chats);
}


</script>