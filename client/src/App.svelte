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

import { user } from './data.js'
import { chats } from './data.js'
// console.log(user1)

import axios from 'axios'
import { Router, Route, Link } from "svelte-routing";


$: isLoggedIn= false

// let user = {}
// $: chats = $chats
let isLoading = true;

export let url = "";

const checkIfUserOnline = async ()=>{
	console.log('message')
	if(sessionStorage.getItem('token')){
		let token = sessionStorage.getItem('token')		
		axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
		try{
			const response = await axios('http://localhost/user')
			console.log(response)
			// if(response.data.token){
				isLoggedIn = true
				console.log(user)
				isLoading=false;
				$user = await response.data.user
				console.log($user)
				if(!$user.profilePicture){
					  $user.profilePicture = 'standard.png'
				}	
				console.log($user.posts)
				// socket.emit('come-online', user._id)	

			// }
		}catch(err){
			if(err){console.log(err.response); return; }
		}
	}else{
		isLoading = false
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
			socket.emit('disconnect')
		}
	}catch(err){
		if(err){console.log(err.respons); return; }
	}
}

const handleOpenChat = (data) => {
	// console.log('show chat window with ', id)
	$chats = [...$chats, {...data}]
	console.log($chats)
}





</script>

<Router url="{url}">
	{#if isLoading}
			<Loader />			
	{:else}
		{#if isLoggedIn}
			<Nav {...$user} onLogout={handleLogout} />
			<Route path="/updateprofile">
					<UpdateProfile />
			</Route> 
			<Route path="/">
					<Main {...$user} posts={$user.posts}/>
			</Route> 
			<Route path="/profile/:id" let:params>
					<Profile {...$user} userID={params.id}/>
			</Route> 
			<Route path="/activitylog" >
					<ActivityLog {...$user} />
			</Route> 
			<Contacts onChat={handleOpenChat} />
			<Left />
			{#if chats}
				<div class="chatContainer">
					{#each $chats as chat}
						<Chat chat={chat} userID={$user._id} />
					{/each}
				</div>
			{/if}
		{:else}
		<Signup onLogin={handleLogin}/>
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