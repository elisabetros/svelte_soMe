<style>
.posts{
    display: grid;
    margin:3vh auto 0;
    justify-content: center;
    grid-gap: 2%;
}
.addPost{
    width: 55vw;
    margin:10vh auto 0;
    background: white;
    border-radius: 5px;
}

</style>

<!-- ########################### -->

{console.log(allPosts)}
<div class="addPost">
    <form enctype='multipart/form-data' class="frmPost">
    <img src={"http://localhost/userImg/"+ profilePicture} class="profilePicture small"/>
    <textarea type="text" placeholder={"What's on your mind, "+ firstname + '?'} name="post" bind:value={post}/>
    <label class="customLabel"><i class="far fa-image"></i> Add image<input type="file" name="picture" on:change={handleChange}></label>
    <button on:click={handlePost}>Post</button>
    </form>
</div>
<div class="posts">
{#each allPosts as post}
    <Post onDelete={handleDelete} {...post} name={post.name} isLoggedIn={post.isLoggedIn} userID={post.userID} profilePicture={post.profilePicture} date={post.date} isUsers={post.isUsers}/>

{/each}
</div>

<!-- ########################### -->

<script>
import Post from '../components/Post.svelte'
import axios from 'axios'

export let posts;
export let firstname;
export let lastname;
export let isLoggedIn;
export let profilePicture;
export let _id;
let post = ""
let picture;
let allPosts = [];

const handleDelete = (id) => {
    newPosts = allPosts.filter(post => {
        if(post._id !== id) return post
    })
    allPosts = newPosts
}
const handleChange = (event) => {
    picture = event.target.files
    // console.log(event.target.files)
    if(event.target.name === 'picture'){
        let fileName= event.target.value.split("\\").pop();
        document.querySelector('.customLabel').innerHTML ="<span></span>"+ fileName;
    }
}

const convertUserPosts = () => {
    if(posts){
        let aPosts = Array.from(posts)
            aPosts.forEach(post => {
                const date =  dateFromObjectId(post._id)
                 allPosts = [...allPosts, {...post,'userID':_id, 'name': firstname +' ' + lastname, 'profilePicture': profilePicture, date, 'isUsers':true, 'isLoggedIn': isLoggedIn  } ]
                 
            })
    }
}
const fetchAllFriendPosts = async () => {
    try{
        const response = await axios('http://localhost/posts')
        console.log(response.data)
        response.data.friends.forEach(friend => {
            if(friend.hasOwnProperty('posts')){
                friend.posts.map(post => {
                    const date = dateFromObjectId(post._id)
                    // console.log(date)
                    // console.log(friend.profilePicture)
                    allPosts = [...allPosts, {...post,'userID': friend._id, 'name': friend.firstname + ' '+friend.lastname, 'profilePicture': friend.profilePicture, date, 'isUsers':false, 'isLoggedIn':friend.isLoggedIn  } ]
                
                })
            }
            allPosts = orderPosts()
        })
    }catch(err){
        if(err){console.log(err.response); return; }
    }
}
const handlePost = async (event) => {
    event.preventDefault()
    if(post || picture){
        console.log(post)
        if(!picture){
            try{
                const response= await axios.post('http://localhost/post', {post})
                console.log(response.data)
            }catch(err){
                if(err){console.log(err.response); return; }
            }
        }else{
            let formData = new FormData
            formData.set('post', post);
            formData.set('picture', picture[0]);
              try{
                const response= await axios.post('http://localhost/postWithImage', formData,{ headers: {
            'content-type': 'multipart/form-data' }})
                console.log(response.data)
            }catch(err){
                if(err){console.log(err.response); return; }
            }
        }
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
    date = date.toString().substring(0,21)
    return date
};

convertUserPosts()
fetchAllFriendPosts()


</script>