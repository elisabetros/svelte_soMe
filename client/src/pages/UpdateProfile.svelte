<style>
    .updateWrapper{
        margin:10vh 20vw 0;
        justify-content: center;
        background:white;
        padding:2em;
    }
    .updateWrapper>div{
        display: grid;
        grid-template-columns: 25fr 50fr 10fr;
        border-bottom:1px solid #eee;
    }
    .updateWrapper>div p:first-child{
        font-weight: bold;
    }
    button{
        margin:auto;
    }
    .hidden{
        display: none;
    }
    form{
        grid-row:2;
        grid-column: 1/-1;
        padding-bottom: 5%;
    }
    form p{
        font-weight: 100;
        padding:0;
        margin:0;
    }
    .btnWrapper button{
        width:100%;
        margin:auto 0;
    }
    .btnWrapper{
        display: grid;
        grid-template-columns: 1fr 1fr 2fr;
        /* float: left;         */
        grid-gap:1%;
    }
    .btnCancel{
        background:#8c8c8c;
    }
</style>

<!-- ########################### -->

<div class="updateWrapper">
        <h2>General Settings</h2>
    <div>
        <p>Name</p>
        <p>{firstname} {lastname}</p>
        <button on:click={()=>showForm('frmName')}>Change</button>
          <form class="hidden" id="frmName">
          <label>
            <p>Firstname</p>
            <input type="text" name="newFirstname"  value={firstname} on:change={handleChange}>
          </label>
          <label>
            <p>Lastname</p>
            <input type="text" name="newLastname"  value={lastname} on:change={handleChange}>
          </label>
          <div class="btnWrapper">
            <button class ="btnCancel"  on:click={()=>showForm('frmName')}>Cancel</button>
            <button on:click={submitFrm}>Submit changes</button>
          </div>
        </form>
    </div>
    <div>
        <p>Contact Information</p>
        <p>{email}</p>
        <button on:click={()=>showForm('frmEmail')}>Change</button>
          <form class="hidden" id="frmEmail">
          <label>
            <p>Email</p>
            <input type="email" name="newEmail"  value={email} on:change={handleChange}>
          </label>
         <div class="btnWrapper">
            <button class ="btnCancel" on:click={()=>showForm('frmEmail')}>Cancel</button>
            <button on:click={submitFrm}>Submit changes</button>
          </div>
        </form>
    </div>
    <div>
        <p>Password</p>
        <p>*****************</p>
        <button on:click={()=>showForm()}>Change</button>
      
    </div>
</div>

<!-- ########################### -->

<script>
    import axios from 'axios'
    export let firstname;
    export let lastname;
    export let email;
     let values = {newEmail: email, newFirstname: firstname, newLastname: lastname};


    const showForm = (id) => {
        document.querySelector(`#${id}`).classList.toggle('hidden')
        document.querySelector(`#${id}`).previousElementSibling.classList.toggle('hidden')
        document.querySelector(`#${id}`).previousElementSibling.previousElementSibling.classList.toggle('hidden')
        document.querySelector(`#${id}`).previousElementSibling.previousElementSibling.previousElementSibling.classList.toggle('hidden')
    }
    const submitEmailForm = (event) => {
        event.preventDefault()
        console.log(values)
    }
    const handleChange = (event) => {
        console.log(event.target.name)
        values[event.target.name] = event.target.value
    }
    const submitFrm = async (event) => {
        event.preventDefault()
        console.log(values)
            try{
                const response = await axios.put('http://localhost/user/update', {...values})
                console.log(response)
                sessionStorage.setItem('token', response.data.token)
            }catch(err){
                if(err){console.log(err.response); return; }
            }
        
    }

</script>