import { readable } from 'svelte/store';

export function initialValue() {
	return {
		users: new Map(),
	}
}

export function makeUserStore(args) {
	// 1. Build the store and initialize it as empty and error free
	let initial = initialValue();
	let store = readable(initial, makeSubscribe(initial, args)); 
	return store;
}

function unsubscribe() {
	// Nothing to do in this case
}

function makeSubscribe(data, _args) {
	// 2. Create a closure with access to the 
	// initial data and initialization arguments
	return set => {
		// 3. This won't get executed until the store has 
		// its first subscriber. Kick off retrieval.
		fetchUserData(data, set);
		
		// 4. We're not waiting for the response.
		// Return the unsubscribe function which doesn't do
		// do anything here (but is part of the stores protocol).
		return unsubscribe;
	};
}

async function fetchUserData(data, set) {
    if(!sessionStorage.getItem('token')){
        return;
    }
    token = sessionStorage.getItem('token')
	try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
    };
		// 5. Dispatch the request for the users
	  const response = await fetch('https://locahost/user/data', config);
		
		if(response) {
  	     const user = await response.json();
            console.log(user)
		  set(data);
			
		} else {
			const text = response.text();
			throw new Error(text);
		}
		
	} catch(error) {
		if(error){console.log(error); return;}
		set(data);
	}
}

