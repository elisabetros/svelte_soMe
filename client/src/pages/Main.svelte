<style>
.posts{
    display: grid;
    margin:3vh auto 0;
    justify-content: center;
    grid-gap: 2%;
}
.addPost{
    width: 60vw;
    margin:10vh auto 0;
    background: white;
    border-radius: 5px;
  
}
.addPost input[type=text] {
    grid-column: 1/-1;
    width:100%;
    height:10vh;
    border:none;
    padding-left:10%;
    border-bottom: 1px solid #eee;
    border-radius: none;
}
form button{
    width: 10vw;
    margin:0;
    background:none;
    color:#009688;
    justify-self: right;
    text-decoration: underline;
}

.profilePicture{
    position: absolute;
    top:20%;
    left:2%;
}
input[type=file]{
   	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}
form{
    display: grid;
    grid-template-columns: .1fr 1fr;
    position: relative;
    grid-gap: 2%;
}
.customLabel{
    border:none;
    border-radius: 25px;
    background-color:#e2e5e8;
    align-items: center;
    font-weight: bold;
    font-size: 80%;
    padding: 5%;
    height: 32px;
   display: grid;
   grid-template-columns: 1fr 3fr;
   align-items: start;
   align-content: center;
    width:120px;
    margin:0 5% 5%;
    cursor: pointer;
}
.customLabel i{
    font-size: 170% !important;
    color: #009688;
}
</style>

<!-- ########################### -->
<div class="addPost">
    <form enctype='multipart/form-data'>
    <img src={"http://localhost/userImg/"+ profilePicture} class="profilePicture small"/>
    <input type="text" placeholder={"What's on your mind, "+ firstname + '?'} name="post" bind:value={post}>
    <label class="customLabel"><i class="far fa-image"></i> Add image<input type="file" name="picture" on:change={handleChange}></label>
    <button on:click={handlePost}>Post</button>
    </form>
    </div>
<div class="posts">
{#each allPosts as post}
    <Post {...post} name={post.name} isLoggedIn={post.isLoggedIn} profilePicture={post.profilePicture} date={post.date}/>

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
let post = ""
let picture;
let allPosts = [];

const handleChange = (event) => {
    picture = event.target.files
    console.log(event.target.files)
    if(event.target.name === 'picture'){
        let fileName= event.target.value.split("\\").pop();
        
        document.querySelector('.customLabel').innerHTML ="<span></span>"+ fileName;
    }
}

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
const handlePost = async (event) => {
    event.preventDefault()
    if(post || picture){
        console.log(post)
        
        console.log(picture[0])
        // return;
        if(!picture){
            try{
                const response= await axios.post('http://localhost/post', post)
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
       'content-type': 'multipart/form-data' // do not forget this 
      }})
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
    date = date.toDateString()
    return date
};

convertUserPosts()
fetchAllFriendPosts()


</script>