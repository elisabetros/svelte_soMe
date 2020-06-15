<style>
    .main{
        padding-top:20vh;
        display: grid; 
        background: rgb(215,219,234);
        background: linear-gradient(4deg, rgba(215,219,234,1) 0%, rgba(251,251,253,1) 100%);
        height:80vh;
        width: 100vw;
        align-content: start;
    }
    label{
        display: grid;
        grid-template-columns: 1fr 1fr;
         padding:1%;
    }
    label>p{
        text-align: right;
       padding-right:2%;
    }
    input{
        width:300px;
        padding-bottom: 0;
        margin-bottom: 0;
    }
    button{
        justify-self: right;
        margin-right: 150px;
        background-color: #009688;
        color:white;
    }
    form{
        justify-self: right;
        display: grid;
        height:auto;
    }
    .inError{
        font-size: 80%;
        color:red;
        padding:0;
        margin:0;
        grid-column:2;
        text-align: left;
    }
    .loginBtn{
        background:none;
        color:#009688;
        text-decoration: underline;
        text-align: right;
    }
    h1, h2, .loginBtn{
        text-align: right;
        padding-right:300px;
        margin-right:0;
    }
</style>

<!-- ########################### -->

<div class="main">
    {#if !login}

    <h1>Signup</h1>
    <h2>It's free!</h2>
    <button class="loginBtn" on:click="{()=>login=true}" >Already a user? Log in here</button>
    <form>
    <label>
        <p>Firstname:</p>
        <input type="text" name="firstname" bind:value={firstname}/>
        {#if errors.firstname}
        <p class="inError">{errors.firstname}</p>
        {/if}
    </label>
    <label>
        <p>Lastname:</p>
        <input type="text" name="lastname" bind:value={lastname}/>
        {#if errors.lastname}
        <p class="inError">{errors.lastname}</p>
        {/if}
    </label>
    <label>
        <p>Email:</p>
        <input type="text" name="email" bind:value={email}/>
        {#if errors.email}
        <p class="inError">{errors.email}</p>
        {/if}
    </label>
    <label>
        <p>Password:</p>
        <input type="password" name="password" bind:value={password}/>
        {#if errors.password}
        <p class="inError">{errors.password}</p>
        {/if}
    </label>
    <label>
        <p>Repeat Password:</p>
        <input type="password" name="repeatPassword" bind:value={repeatPassword} />
        {#if errors.repeatPassword}
        <p class="inError">{errors.repeatPassword}</p>
        {/if}
    </label>
    <button on:click={validateAndSubmit}>Sign Up</button>
    </form>
    {/if}
    {#if login}
    <h1> Log in </h1>
    <button class="loginBtn" on:click="{()=>login=false}">Not registered? Sign up here</button>
    <form>
        <label>
            <p>Email:</p>
            <input type="text" name="email" bind:value={loginEmail}/>
            {#if errors.loginEmail}
            <p class="inError">{errors.loginEmail}</p>
            {/if}
        </label>
        <label>
            <p>Password:</p>
            <input type="password" name="password" bind:value={loginPassword}/>
            {#if errors.loginPassword}
            <p class="inError">{errors.loginPassword}</p>
            {/if}
        </label>        
        <button on:click={validateAndLogin}>Log In</button>
    </form>
    {/if}
</div>

<!-- ########################### -->

<script>
import axios from '../../node_modules/axios'
$: login = false
let firstname = ""
let lastname = ""
let email = ""
let password = ""
let repeatPassword = ""
let loginEmail = ""
let loginPassword = ""
let errors = {}
export let onLogin

const handleClick = () => {
    login  = true;
}

const validateAndLogin = async (event) => {
    console.log('login')
    event.preventDefault()
      errors = {}
     if(!loginEmail){
        errors.loginEmail = "Email is required"
    }
    if(!/\S+@\S+\.\S+/.test(loginEmail)){
        errors.loginEmail = "Email is invalid"
    }
    if(!loginPassword){
        errors.loginPassword = "Password is required"
    }
      if(loginPassword <8){
        errors.loginPassword = "Password must be 8 characters or more"
    }
    if(Object.keys(errors).length === 0){
    console.log(errors)
      try{
       const response = await axios.post('http://localhost:80/user/login', {email:loginEmail, password:loginPassword})
        // console.log(response.data.token)
       sessionStorage.setItem('token', response.data.token)
        onLogin(true)
    
      }catch(err){
          if(err){console.log(err); return; }
      }
    }    
}

const validateAndSubmit = async (event) => {
    event.preventDefault()
    errors = {}
    if(!firstname){
        errors.firstname = "Firstname is required"
    }
    if(!lastname){
        errors.lastname = "Lastname is required"
    }
    if(!email){
        errors.email = "Email is required"
    }
    if(!/\S+@\S+\.\S+/.test(email)){
        errors.email = "Email is invalid"
    }
    if(!password){
        errors.password = "Password is required"
    }
    if(!repeatPassword){
        errors.repeatPassword = "Repeat password is required"
    }
    if(password <8){
        errors.password = "Password must be 8 characters or more"
    }
    if(password !== repeatPassword){
        errors.password = "Passwords must match"
        errors.repeatPassword = "Passwords must match"
    }
    console.log(errors)
    if(Object.keys(errors).length === 0){
        console.log('signup')
      try{
         const reponse = await axios.post('http://localhost:80/user/register', {firstname, lastname, email, password, repeatPassword})
       console.log(response)
       login = true
      }catch(err){
          if(err){console.log(err.response); return; }
      }
        
    }
}

</script>