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

<div class={'chat ' + 'chat-'+id} id={id}>
    <div class="chatHeader" on:click={minimizeChat}>
        <div class="user">
            <img src={"http://localhost/userImg/"+ profilePicture} alt="user image" class="profilePicture small">
            <Link to={'/profile/'+ id}> {firstname} {lastname}</Link>
        </div>
        <span class="closeChat" on:click={closeChat}>×</span>
    </div>
    <div class="chatContent">
    </div>
    <form>
        <input type="text" class="chatTxt" name="chatTxt" placeholder="Write message" bind:value={chatTxt}>
        <i class="fas fa-paper-plane" on:click={handleSend}></i>
    </form>
</div>

<!-- ########################### -->


<script>
import { Link } from "svelte-routing";
import io from 'socket.io-client';
const socket = io('http://localhost');

export let id;
export let firstname;
export let lastname;
export let profilePicture;
export let userID;
export let onChat;
export let message;
export let sender;
export let onOpenChat;

const loggedInUser = userID
const friendID = id
console.log(loggedInUser, friendID)
// const socket = io()
let chatTxt = ""
// socket.emit('private-chat', id)
// socket.emit('come-online', `${userID}`)
console.log(message, sender)

const handleSend = (event) => {
    event.preventDefault()
    console.log(chatTxt)
    const message = chatTxt
    appendMessage(loggedInUser, message)
    document.querySelector('.chatTxt').value= ""
    onOpenChat(message, friendID, loggedInUser)

    // socket.emit('chat-message', message, friendID, loggedInUser);
}

function appendMessage(sender, message) {
    console.log(sender, message)
    const messageContainer = document.querySelector('.chatContent')
    const messageElement = document.createElement('p');
    // messageElement.className = type
    messageElement.innerText = message;
    messageContainer.append(messageElement)
}

// socket.on('user-connected', name => {
//     appendMessage(`${name} connected`, 'incoming')
// })
// socket.on('user-disconnected', name => {
//     appendMessage(`${name} disconnected`, 'incoming')
// })

const minimizeChat = () => {
    console.log(document.querySelector(`.chat-${id}`))
    document.querySelector(`.chat-${id}`).classList.toggle('minimize')
}
const closeChat = (event) => {
    event.target.parentElement.parentElement.className="hidden"
}


</script>