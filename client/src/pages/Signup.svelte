<style>
    .main{
        display: grid; 
        grid-template-columns: 1fr 1fr;
        background: rgb(215,219,234);
        background: linear-gradient(4deg, rgba(215,219,234,1) 0%, rgba(251,251,253,1) 100%);
        height:100vh;
        max-height: 100vh;
        max-width: 100vw;
        padding: 20vh 10% 0;
        overflow: hidden;
        align-content: start;
    }
    .main div:first-child{
        border-right: .5px solid white
    }
    label{
        display: grid;
        grid-template-columns: 1fr;
         padding:1%;
    }
    label>p{
       margin:0;
    }
    input{
        width:300px;
        margin-bottom: 0;
    }
   
    form{
        justify-self: center;
        display: grid;
        height:auto;
        
    }
    .inError{
        font-size: 80%;
        color:red;
        padding:0;
        margin:0;
        grid-column:1/-1;
        text-align: left;
    }
    .loginBtn{
        background:none;
        color:#009688;
        text-decoration: underline;
        padding:0;
    }
    h1, h2, .loginBtn{
        margin:1% 0;
    }
    .frmFail{
        text-align: center;
        font-size: 90%;
        grid-column: 1/-1;
    }
</style>

<!-- ########################### -->

<div class="main">
    {#if !login}
    <div>
        <h1>Signup</h1>
        <h2>It's free!</h2>
        <button class="loginBtn" on:click="{()=>login=true}" >Already a user? Log in here</button>
    </div>
    <form>
     {#if errors.signupGlobal}
            <p class="inError frmFail">{errors.signupGlobal}</p>
        {/if}
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
    <button on:click={validateAndSubmit}>{#if isLoading}...loading{:else}Sign Up {/if}</button>
    </form>
    
    {/if}
    {#if login}
    <div>
        <h1> Log in </h1>
        <button class="loginBtn" on:click="{()=>login=false}">Not registered? Sign up here</button>
    </div>
    <form>
    {#if errors.loginGlobal}
            <p class="inError frmFail">{errors.loginGlobal}</p>
        {/if}
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
        <button on:click={validateAndLogin}>{#if isLoading}...loading{:else}Log In{/if}</button>
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
let isLoading = false
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
        isLoading = true;
    // console.log(errors)
      try{
        const response = await axios.put('http://localhost:80/user/login', {email:loginEmail, password:loginPassword})
        // console.log(response.data.token)
        sessionStorage.setItem('token', response.data.token)
        onLogin(true)
        isLoading = false;
      }catch(err){
          if(err){
            console.log(err.response.data); 
            isLoading = false;
            errors.loginGlobal = err.response.data.error
          }
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
    // console.log(errors)
    if(Object.keys(errors).length === 0){
          isLoading = true;
        console.log('signup')
      try{
        const response = await axios.post('http://localhost:80/user/register', {firstname, lastname, email, password, repeatPassword})
        console.log(response.data)
        if(response.data.response === 'success'){
            login = true
            isLoading = false;
        }
      }catch(err){
          if(err){
            // console.log(err.response.data);
            isLoading = false;
            // errors.signupGlobal = err.response.data.error
        }
      }
        
    }
}

</script>