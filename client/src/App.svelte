<script>
import Nav from './components/Nav.svelte'
import Signup from './components/Signup.svelte'
import Main from './components/Main.svelte'
import axios from 'axios'
$: isLoggedIn= false
$: user = {}


const checkIfUserOnline = async ()=>{
	if(sessionStorage.getItem('token')){
		let token = sessionStorage.getItem('token')
		
axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
		// const config = {headers: { Authorization: `Bearer ${token}` }};
		try{
			const response = await axios('http://localhost/user/data')
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
}
// console.log(user)
</script>

{#if isLoggedIn}
<Nav {...user}/>
<Main {...user}/>
{:else}
<Signup  onLogin={handleLogin}/>
{/if}