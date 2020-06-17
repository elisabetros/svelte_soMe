<style>
    .profile{
        margin-top:10vh;
    }
</style>

<!-- ########################### -->

<div class="profile">
    <div class="coverImg">
          <img src={"http://localhost/userImg/"+ profilePicture} class="profilePicture" alt="Profile photo">
        <h1>{firstname} {lastname}</h1>
    </div>
</div>

<!-- ########################### -->

<script>
    import axios from 'axios'
    export let firstname;
    export let lastname;
    export let _id;
    export let email;
    export let profilePicture;
</script>