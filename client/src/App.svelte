<script>
import Nav from './components/Nav.svelte'
import Signup from './pages/Signup.svelte'
import Main from './pages/Main.svelte'
import UpdateProfile from './pages/UpdateProfile.svelte'
import Contacts from './components/Contacts.svelte'
import Left from './components/Left.svelte'
import Profile from './pages/Profile.svelte'
import ActivityLog from './pages/ActivityLog.svelte'
import Chat from './components/Chat.svelte'
import Loader from './components/Loader.svelte'

import { user1 } from './data.js'
console.log(user1)

import axios from 'axios'
import { Router, Route, Link } from "svelte-routing";

$: isLoggedIn= false
$: update = false;

let user = {}
let chats = []
let isLoading = true;

export let url = "";

const checkIfUserOnline = async ()=>{
	if(sessionStorage.getItem('token')){
		let token = sessionStorage.getItem('token')		
		axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
		try{
			const response = await axios('http://localhost/user')
			// console.log(response)
			user = await response.data.user
			if(!user.profilePicture){
  				user.profilePicture = 'standard.png'
			}		
			isLoggedIn = true
			console.log(user)
			isLoading=false;
		}catch(err){
			if(err){console.log(err.response); return; }
		}
	}
}

window.addEventListener('load',()=> {
	checkIfUserOnline()
})
const handleLogin = (data) =>{
	isLoggedIn = data
	checkIfUserOnline()
}
const handleLogout = async (data) => {
	console.log('lgout app')
	try{
		const response = await axios.put('http://localhost/user/logout')
		console.log(response.data)
		if(response.data.response === 'success'){
			isLoggedIn = data
			sessionStorage.clear()
		}
	}catch(err){
		if(err){console.log(err.respons); return; }
	}
}
const handleUpdate = (data) => {
	update = data
}
const handleChat = (id) => {
	console.log('show chat window with ', id)
	chats = [...chats, {'id':id}]
}
// console.log(user)

</script>

<Router url="{url}">
	{#if isLoading}
			<Loader />			
	{:else}
		{#if isLoggedIn}
			<Nav {...user} onLogout={handleLogout} onUpdate={handleUpdate}/>
			<Route path="/updateprofile">
					<UpdateProfile {...user}/>
			</Route> 
			<Route path="/">
					<Main {...user}/>
			</Route> 
			<Route path="/profile/:id" let:params>
					<Profile {...user} userID={params.id}/>
			</Route> 
			<Route path="/activitylog" >
					<ActivityLog {...user} />
			</Route> 
			<Contacts {...user} onChat={handleChat} />
			<Left {...user} />
			{#if chats}
				<div class="chatContainer">
					{#each chats as chat}
						<Chat {...chat}/>
					{/each}
				</div>
			{/if}
		{:else}
		<Signup  onLogin={handleLogin}/>
		{/if}
	{/if}

	</Router>


	<!-- ################# -->

	<style>
	.chatContainer{
		position: fixed;
		z-index: 20;
		bottom:0;
		right:18vw;
		height:300px;
		display: grid;
		grid-gap:1em;
		grid-template-rows: 1fr;
	}
	</style>