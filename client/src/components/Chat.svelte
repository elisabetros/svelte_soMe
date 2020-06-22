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
    line-height: 18px; 
    cursor: pointer;
}
.chatContent{
    padding:.5em;
    display: grid;
    grid-gap:1em;
    height: 200px;
    align-content:end;
}
.chatContent p{
    border-radius: 5px;
    background-color:#009688;
    color:white;
    margin: 0;
    max-width: 164px;
    font-size: 13px;
    line-height: 16px;
    padding:.1em;
        overflow-wrap: break-word;
}
p.outgoing{
    justify-self: left;
}
p.incoming{
    justify-self: right
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
            <img src="http://localhost/userImg/standard.png" alt="user image" class="profilePicture small">
            <Link to={'/profile/'+ id}> firstname lastname</Link>
        </div>
        <span class="closeChat" on:click={minimizeChat}>×</span>
    </div>
    <div class="chatContent">
    <p class="incoming">Chat with {id}</p>
    <p class="outgoing">Chat with {id}</p>
    </div>
    <form>
        <input type="text" class="chatTxt" name="chatTxt" placeholder="Write message" bind:value={chatTxt}>
        <i class="fas fa-paper-plane" on:click={handleSend}></i>
    </form>
</div>

<!-- ########################### -->

<script>
import { Link } from "svelte-routing";
export let id;

let chatTxt = ""

const handleSend = (event) => {
    event.preventDefault()
    console.log(chatTxt)
}

const minimizeChat = () => {
    console.log(document.querySelector(`.chat-${id}`))
    document.querySelector(`.chat-${id}`).classList.toggle('minimize')
}
</script>