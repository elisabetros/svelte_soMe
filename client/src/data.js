import { writable } from 'svelte/store';
import axios from 'axios';

if(sessionStorage.getItem('token')){
	let token = sessionStorage.getItem('token')		
	axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
}
let userResponse;
let userPosts;

async function fetchUser(){
	try{
		 let response = await axios('http://localhost/user/')
		 userResponse = await response.data.user
		// console.log(userResponse.data)
	}catch(err){
		if(err){console.log(err); }
	}
}
async function fetchPosts(){
	try{
		let response = await axios('http://localhost/posts/')
		userPosts = await response.data
	//    console.log(userPosts.data)
   }catch(err){
	   if(err){console.log(err); }
   }
}

fetchUser()
fetchPosts()
export let user = writable({userResponse})
export let friendPosts = writable({userPosts})
