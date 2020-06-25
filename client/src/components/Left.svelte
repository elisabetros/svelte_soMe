<style>
.left{
    position: fixed;
    top:2vh;
    left:0;
    height:100%;
    padding:6% 2% 2%;
    width:19vw;
    border-left: 1px solid rgba(0,0,0,.1);
    overflow-y: scroll;
}

.user, .group, .news{
    color:black !important;
    display: grid;
    grid-template-columns: 2fr 10fr;
    align-items: center;
}
.news i{
    font-size: 140%
}
p{
    margin :3% 0;
}
i{
    font-size: 120%;
}
h4{
    margin:8% 0 4% 0;
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
a, a:visited{
    color:black
}
</style>

<!-- ########################### -->

<div class="left" use:links>
    <a href={"/profile/"+$user._id}>
        <div class="user">
            <img src={"http://localhost/userImg/"+ $user.profilePicture} class="profilePicture small"/>
            <p>{$user.firstname} {$user.lastname}</p>
        </div>
    </a>
    <a href="/">
        <div class="news">
            <i class="far fa-image"></i>
            <p>News feed</p>
        </div>
    </a>
    <h4>Your Groups:</h4>
    <div class="group">
        <i class="fas fa-flag"></i><p>Catch the flag</p>
    </div>
    <div class="group">
        <i class="fas fa-flask"></i><p>Biology help</p>
    </div>
    <div class="group">
        <i class="fas fa-beer"></i><p>Beer brewing</p>
    </div>
    <div class="group">
        <i class="fab fa-accessible-icon"></i><p>Accessibility group</p>
    </div>
    <h4>You might like:</h4>
    <div class="group">
        <i class="fas fa-bowling-ball"></i><p>Lady bowlers</p>
    </div>
    <div class="group">
        <i class="fas fa-campground"></i><p>Outdoor lovers</p>
    </div>
    <div class="group">
        <i class="fas fa-car-side"></i><p>Vintage cars</p>
    </div>
    <div class="group">
        <i class="fas fa-cat"></i><p>Copenhagen Cats</p>
    </div>
    <div class="group">
        <i class="fas fa-socks"></i><p>Knitting</p> 
    </div>
   
</div>

<!-- ########################### -->

<script>
// export let profilePicture
// export let firstname
// export let lastname
// export let _id
import { links } from 'svelte-routing'
import { user } from '../data.js'
</script>