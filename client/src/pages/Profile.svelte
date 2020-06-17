<style>
    .profile{
        margin-top:10vh;
        width:55vw;
        margin:10vh auto 3vh;
    }
    .coverImg{
        background-repeat: no-repeat;
        background-size: cover;
        height:40vh;
        border-radius: 5px;
        display: grid;
        grid-template-columns: 2.5fr 4fr 2fr;
        align-content: end;
        position: relative;
    }
    .coverImg img{
        position: absolute;
        bottom:-5vh;
        left:5px;
        border: 4px solid white;
        width:200px;
        height:200px;
    }
    h1{
        color :white;
        grid-column: 2;
    }
    .btnUpdate{
        background:#ddd;
        align-self: end;
        width:auto;
        margin:5%;
        padding:2%;
        border-radius: 2px;
        border:1px solid rgba(0,0,0,.3);
    }
    .btnUpdate p{
        margin:0;
        text-align: center;
    }
</style>

<!-- ########################### -->

<div class="profile">
        <div class="coverImg" style={'background-image:url(http://localhost/coverImg/'+user.coverPicture +');'}>
        <img src={"http://localhost/userImg/"+ user.profilePicture} class="profilePicture" alt="Profile photo">
        <h1>{user.firstname} {user.lastname}</h1>
        {#if isUsers}
            <div class="btnUpdate"><Link to="/updateprofile"><p>Update Information</p></Link></div>
        {/if}
    </div>

</div>

<!-- ########################### -->

<script>
    import axios from 'axios'
    import { Link } from "svelte-routing";

    // export let firstname;
    // export let lastname;
    export let _id;
    // export let email;
    // export let profilePicture;
    // export let coverPicture;
    export let userID;
    let user = {}
    let isUsers = false;


        const fetchUser = async () => {
            const response = await axios(`http://localhost/user/${userID}`)
            console.log(response.data.user)
            user= await response.data.user
            if(!user.coverPicture){
                user.coverPicture = 'standard.jpg'
            }
        }

    if(_id === userID){
        isUsers = true;
    }
        
    fetchUser()
    


</script>