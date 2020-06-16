<script>
import Nav from './components/Nav.svelte'
import Signup from './components/Signup.svelte'
import Main from './components/Main.svelte'
import UpdateProfile from './components/UpdateProfile.svelte'
import axios from 'axios'
$: isLoggedIn= false
$: user = {}
$: update = false;


const checkIfUserOnline = async ()=>{
	if(sessionStorage.getItem('token')){
		let token = sessionStorage.getItem('token')		
		axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
		try{
			const response = await axios('http://localhost/user')
			// console.log(response)
			user = await response.data.user
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

	{#if isLoggedIn}
		<Nav {...user} onLogout={handleLogout} onUpdate={handleUpdate}/>
		{#if update}
			<UpdateProfile {...user} onUpdate={handleUpdate}/>
		{:else}
			<Main {...user}/>
		{/if}	
	{:else}
		<Signup  onLogin={handleLogin}/>
	{/if}