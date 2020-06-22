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
		 userResponse = await axios('http://localhost/user/')
		console.log(userResponse.data)
	}catch(err){
		if(err){console.log(err); }
	}
}
async function fetchPosts(){
	try{
		userPosts = await axios('http://localhost/posts/')
	   console.log(userPosts.data)
   }catch(err){
	   if(err){console.log(err); }
   }
}
fetchUser()
fetchPosts()
export let user1 = writable({userResponse})
export let friendPosts = writable({userPosts})
