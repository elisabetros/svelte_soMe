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
{console.log(posts)}
{#each aPosts as post}
    <Post {...post} name={firstname+ " " + lastname} isLoggedIn={isLoggedIn} profilePicture={profilePicture}/>

{/each}
</div>

<!-- ########################### -->

<script>
import Post from './Post.svelte'
export let posts;
export let firstname;
export let lastname;
export let isLoggedIn;
export let profilePicture;


let aPosts = Array.from(posts)

</script>