<style>
nav{
  display: grid;
  grid-template-columns: 25fr 25fr 10fr;
  grid-gap: 8%;
  position: fixed;
  top: 0px;
  left: 0px;
  max-width: 100vw;
  height: 4rem;
  padding: 0px 2vw;
  font-size: 1.5rem;
  color: #fff !important;
  background: #009688;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  z-index: 5;
}
nav div.active{
  border-bottom: 0.2rem solid wite;
}
nav div.left{
  display: grid;
  grid-template-columns: 5fr 10fr;
  grid-gap: 1rem;
  align-items: center;
  position: relative;
}
nav div.left div.logo{
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  grid-gap: 0.5rem;
  font-weight: 400;
  color: white;
}
.left form > div{
  position: relative;
}
.left form  i{
  position: absolute;
  right: 0.5rem;
  font-size: 1rem;
   color:#009688;
  align-self: center;
  top:0.6rem;
}
input{
   margin:0;
  padding:0 0 0 10px;
  font-size: 80%;
  width:100%;
}
.middle{
  display: grid;
  grid-template-columns: 10fr 10fr;
  justify-items: center;
  grid-gap: 1%;
  align-items: center;
  font-size: 80%;
}
.username{
  grid-gap: 5%;
  grid-template-columns: 1fr 3fr;
}
.middle > div, .username{
  display: grid;
  align-items: center;
  position: relative;
  width: 100%;
  height:50%;
  margin:3% 0;
  border-right:.5px solid rgba(250, 250, 250, 0.3);
  cursor: pointer;
  color:white !important;
}
.middle>div:last-child{
  grid-template-columns: 1fr;
  justify-items: center;
}
.middle p{
  margin:0;
}
 div.right{
  display: grid;
  grid-template-columns: 8fr 8fr 5fr ;
  align-items: center;
  grid-gap: 2rem;
  align-items: center;
  justify-items: right;
}
.right > div{
  position: relative;
}
.right > div:last-child{
  text-align: right;
}
.chat-counter{
  display: grid;
  justify-content: center;
  align-content: center;

  position: absolute;
  top: -0.6rem;
  right: -1rem;

  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: #f02849;
  border-radius: 50%;
}
.notification-counter{
  display: grid;
  justify-content: center;
  align-content: center;
  position: absolute;
  top: -0.6rem;
  right: -1rem;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: #f02849;
  border-radius: 50%;
}
.searchDropdown{
  width: 64.5%;
  right: 0 !important;
  height:auto;
}
.notificationDropdown, .chatDropdown {
  width: 20vw;
  padding: .8em 0 !important;
  top: 5vh !important;
}
.chatDropdown {
  right: -1.5vw !important;
}
.notificationDropdown {
    right: -2.2vw !important;
    border-bottom: 1px solid #ddd;
}
.notificationDropdown h4, .chatDropdown h4{
  padding: 0 .8em;
  margin:.5em;
}
.dropDown{
  background:white;
  color:black;
  position: absolute !important;
  top:6vh;
  font-size: 60%;
  padding:.8em;
  right:1vw;
  color:black;
  border-radius: 5px;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
}
.dropDown.hidden{
  display: none;
}
.dropDown:after, .dropDown:before {
	bottom: 100%;
	left: 85%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
}
.dropDown p:hover{
  text-decoration: underline;
}

.dropDown:after {
	border-color: rgba(136, 183, 213, 0);
	border-bottom-color: #fff;
	border-width: 7px;
	margin-left: -7px;
}
.dropDown:before {
	border-color: rgba(194, 225, 245, 0);
	border-bottom-color: #c2e1f5;
	border-width: 7px;
	margin-left: -7px;
}
a:visited, a, a:hover{
  color:white;
}
</style>

<!-- ########################### -->

<!-- {console.log(notifications)} -->
<Router url="{url}">
 <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
	<nav>

    <div class="left" use:links>
      <a href="/" >
        <div class="logo">
          <i class="fas fa-utensil-spoon"></i> Clonebook
        </div>
      </a>
      <div>
        <form on:submit={handleSearch}>
          <div class="green">        
            <i class="fas fa-search" on:click={handleSearch}></i>
            <input type="text" name="search" bind:value={searchStr} autocomplete="off" >
          </div>
        </form>
            <div class="searchDropdown dropDown hidden">
            <!-- {#if searchUsers} -->
              
            <!-- {/if} -->
            </div>
      </div>
    </div>

    <div class="middle">
    <a href={"/profile/"+_id}>
      <div class="username" >
        <img src={"http://localhost/userImg/"+ profilePicture} class="profilePicture small"/>
        <p>{firstname}</p>    
      </div>
    </a>
      <div>
        <a href="/" use:links>Home</a>
      </div>
              
    </div>
    <div class="right">
      <div>
        <i class="far fa-comment" on:click={showUnSeenChats}></i>
        {#if notifications && chatCounter()}
           <div class="chat-counter">{cCounter}</div>       
        {/if}
        <div class="chatDropdown dropDown hidden">
         <h4>Messages</h4>
           {#if notifications && notifications.chats}
            {#each notifications.chats as chat}
              <p style='background-color:{chat.seen? 'white': '#e2e5e8'};' on:click={()=>openChat(chat.userID)}><strong>{chat.name}:</strong> sent you a message</p>
            {/each} 
          {/if} 
        </div>
      </div>
      <div>
        <i class="far fa-bell" on:click={showNotifications}></i> 
        {#if notifications && notificationCounter()}
          <div class="notification-counter">{counter}</div> 
        {/if}
          <div class="notificationDropdown dropDown hidden">
          {#if notifications}
          <h4>Notifications</h4>
          {#if notifications.hasOwnProperty('friendRequests')}
            {#each notifications.friendRequests as request}
            <!-- {if reqe} -->
              <a style='background-color:{request.seen? 'white': '#e2e5e8'};' href="/activitylog"><strong>{request.firstname} {request.lastname} </strong>sent you a friend request</a>
            {/each}
          {/if}
          {#if notifications.notification}
            {#each notifications.notification as notification}
              <a href="/activitylog" style='background-color:{notification.seen? 'white': '#e2e5e8'};'>{notification.message}</a>
            {/each}
          {/if}
        {/if}
      </div>           
        <!-- {/if} -->
      </div>
      <div on:click={showDropDown}>
       <i class="fas fa-sort-down"></i>      
      </div>  
      <div class="menuDropdown dropDown hidden">
          <p on:click={handleLogout}>Log out</p>
          <a href="/updateprofile">Update Information</a>
          <a href="/activitylog">Activity Log</a>
      </div>                
    </div>

  </nav>
</Router>
{
  console.log(notifications)
}
<!-- ########################### -->

<script>
  
import { Router, links } from "svelte-routing";
import axios from 'axios'

export let url = "";
export let firstname;
export let profilePicture;
export let onLogout;
export let _id;
export let notifications;
export let onOpenChat;

$: counter= 0
$: cCounter = 0;

const openChat = (senderID) => {
  let friend = notifications.chats.find(chat => chat.userID === senderID)
  // console.log(friend)
  let data = {
    name : friend.name,
    id : senderID,
    profilePicture : friend.profilePicture
  }  
  onOpenChat(data)
  showUnSeenChats()
  cCounter= cCounter - notifications.chats.filter(chat=> chat.userID === senderID).length
  // console.log(cCounter)
}

let chatCounter = () => {
  if(notifications.chats){
    notifications.chats.forEach(chat => {
      if(!chat.seen){
         cCounter++
      }
    })
  } 
  if(cCounter){
    return true
  }else{
    return false
  }
}
let notificationCounter = () => {
  
  if(notifications.notification){
    notifications.notification.forEach(notification => {
      if(!notification.seen){
        counter++
      }
    })
  }
  if(notifications.friendRequests){
    notifications.friendRequests.forEach(request => {
      if(!request.seen){
        counter++
      }
    })
  }
    // console.log(counter)
  if(!counter){
     return false
  }else{
    return true
  }
}

let searchStr = ""
$: searchUsers = ""

const showUnSeenChats = () => {
  document.querySelector('.chatDropdown').classList.toggle('hidden')
}
const showNotifications = () => {
//  console.log('drop down')
 document.querySelector('.notificationDropdown').classList.toggle('hidden')
}
const showDropDown = () => {
//  console.log('drop down')
 document.querySelector('.menuDropdown').classList.toggle('hidden')
}
const handleLogout = () => {
  console.log('logout')
  onLogout(false);
}
const handleUpdate = () => {
  onUpdate(true)
  showDropDown()
}

const handleSearch = async (event) => {
  event.preventDefault()
  document.querySelector('.searchDropdown').innerHTML = ""
  console.log(searchStr)
  if(searchStr){
    try{
      const response = await axios(`http://localhost/users/find/${searchStr}`)
      console.log(response.data)
      searchUsers = await response.data.users
      console.log(searchUsers)
      searchUsers.map(user => {
        let linkUser = document.createElement('a')
        linkUser.textContent = user.firstname + " " + user.lastname
        linkUser.setAttribute('href', `/profile/${user._id}`)
        document.querySelector('.searchDropdown').append(linkUser)
        document.querySelector('.searchDropdown').classList.remove('hidden')
      })
      if(searchUsers.length > 3){
      }
    }catch(err){
      if(err){console.log(err.response); return; }
    }
  }
}

</script>