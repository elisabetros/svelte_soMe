<script>
import Nav from './components/Nav.svelte'
import Signup from './pages/Signup.svelte'
import Main from './pages/Main.svelte'
import UpdateProfile from './pages/UpdateProfile.svelte'
import Contacts from './components/Contacts.svelte'
import Left from './components/Left.svelte'
import Profile from './pages/Profile.svelte'
import axios from 'axios'
import { Router, Route, Link } from "svelte-routing";

$: isLoggedIn= false
$: user = {}
$: update = false;

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
// console.log(user)

</script>

<Router url="{url}">
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
	<Contacts {...user} />
	<Left {...user} />
	{:else}
		<Signup  onLogin={handleLogin}/>
	{/if}

	</Router>