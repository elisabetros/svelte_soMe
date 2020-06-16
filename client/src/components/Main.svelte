<style>
.posts{
    display: grid;
    margin:10vh 30vw 0;
    justify-content: center;
    grid-gap: 2%;
}
</style>

<!-- ########################### -->

<div class="posts">
{#each allPosts as post}
    <Post {...post} name={post.name} isLoggedIn={post.isLoggedIn} profilePicture={post.profilePicture} date={post.date}/>

{/each}
{console.log(allPosts)}
{console.log(posts)}

</div>

<!-- ########################### -->

<script>
import Post from './Post.svelte'
import axios from 'axios'

export let posts;
export let firstname;
export let lastname;
export let isLoggedIn;
export let profilePicture;


let allPosts = [];

const convertUserPosts = () => {
let aPosts = Array.from(posts)
    aPosts.forEach(post => {
        const date =  dateFromObjectId(post._id)
         allPosts = [...allPosts, {...post, 'name': firstname +' ' + lastname, 'profilePicture': profilePicture, date  } ]
         
    })
}
const fetchAllFriendPosts = async () => {
    try{
        const response = await axios('http://localhost/posts')
        console.log(response.data)
        response.data.friends.forEach(friend => {
            if(friend.hasOwnProperty('posts')){
                friend.posts.map(post => {
                    const date = dateFromObjectId(post._id)
                    console.log(date)
                        console.log(friend.profilePicture)
                        allPosts = [...allPosts, {...post, 'name': friend.firstname + ' '+friend.lastname, 'profilePicture': friend.profilePicture, date  } ]
                
                })
            }
            allPosts = orderPosts()
        })
    }catch(err){
        if(err){console.log(err.response); return; }
    }
}

const orderPosts = () =>{
    let sortedPosts = allPosts.sort((a,b) => {
        return new Date(b.date) - new Date(a.date);

    })
    return sortedPosts
}
const dateFromObjectId = function (objectId) {
    let date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    date = date.toDateString()
    return date
};

convertUserPosts()
fetchAllFriendPosts()


</script>