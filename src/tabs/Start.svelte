<script>
  import { fly } from 'svelte/transition' 
  import { quadInOut } from 'svelte/easing'
  import { getContext, setContext } from 'svelte';

  export let setCurrentTab; // Change what the tab is.
  
  let opts = getContext('options')
  let chars = getContext('characters')
  let ques = getContext('questions')

  let loading = false
  let droppingFile = false
  let error



  function handleNewQuiz() {
    setCurrentTab(0)
  }

  // Handles when a user uploads a file
  function handleLoadFile() {
    loading = true
    error = undefined
    let file
    file = document.querySelector('input').files[0]

    loadQuiz(file)
  }

  // Handles when a user drops a file into the page
  function dropHandler(event) {
    event.preventDefault()
    droppingFile = false
    loading = true
    error = undefined
    let file

    if (event.dataTransfer.items && event.dataTransfer.items[0].kind === 'file') {
      file = event.dataTransfer.items[0].getAsFile()
    } else {
      file = event.dataTransfer.files[0]
    }

    loadQuiz(file)
  }

  // Handles when to show the "dropping" cover
  function dragOverHandler(event) {
    event.preventDefault()
    if (!loading) droppingFile = true
  }

  // Runs when a quiz file is available, checks the validity, and moves forward
  function loadQuiz(file) {
    // Check to see if file is JSON
    if (file.type === 'application/json') {

      let reader = new FileReader()
      reader.readAsText(file)

      reader.onload = (ev) => {
        let result = {}

        // Check if file can be parsed
        try {
          result = JSON.parse(ev.target.result)
        } catch (err) {
          error = 'Cannot Read File'
          loading = false
          return
        }

        // Check if valid quiz file
        if (typeof result.characters !== 'undefined'
          && typeof result.questions !== 'undefined'
          && typeof result.options !== 'undefined'
        ) {
          opts.set(result.options)
          chars.set(result.characters)
          ques.set(result.questions)
          setCurrentTab(0)
        }
        else {
          error = 'Cannot Read Quiz File'
          loading = false
          return
        }
      }

    } else {
      error = 'Invalid File'
      loading = false
      return
    }
  }
</script>



<div class='back' out:fly={{y: -window.innerHeight, duration: 1000, opacity: 1, easing: quadInOut}} on:drop={dropHandler} on:dragover={dragOverHandler}>
  <div class='box'>

    <!-- Title/Description -->
    <div class='span-2'>
      <h1>Quiz Overkill</h1>
      {#if error}
        <div class='error'>{error}</div>
      {/if}
    </div>

    {#if loading}

      <div class='span-2'>
        <h2 class='loading'>Loading</h2>
      </div>

    {:else}
    
      <!-- New Quiz -->
      <div on:click="{() => handleNewQuiz()}" >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg><br />
        New Quiz
      </div>

      <!-- Load Quiz -->
      <label>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up-circle"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg><br />
        Load Quiz
        <input type='file' hidden on:change='{() => handleLoadFile()}'/>
      </label>

    {/if}

    {#if droppingFile}
      <div class='drop'>Drop your project here</div>
    {/if}

  </div>
</div>



<style lang='scss'>
  .back {
    position: absolute;
    left: 0; top: 0;
    width: 100vw;
    height: 100vh;
    background: hotpink;
    background-image: linear-gradient(-45deg, rgb(141, 101, 139), rgb(195, 116, 214)); 
    display: grid;
    place-items: center;
    transition: transform 1s;
  }
  .box {
    background: white;
    border-radius: 2em;
    padding: 1em;

    display: grid;
    grid-template-columns: 50% 50%;
  }
  .span-2 {
    grid-column-start: span 2;
  }

  .error {
    background: rgb(175, 51, 19);
    color: rgb(212, 164, 164);
    border-radius: 1em;
    margin: 1em 2ch;
    padding: .5em 1ch;
  }

  .loading {
    background: rgb(141, 101, 139);
    background-image: linear-gradient(45deg, rgb(141, 101, 139), #000, rgb(141, 101, 139)); 
    background-repeat: no-repeat;
    background-clip: text;
    -webkit-background-clip: text;
    background-position-x: -100%;
    background-size: 10ch 2em;
    color: transparent;
    animation: loadingbg 3s ease infinite;
  }

  @keyframes loadingbg{
    0% {
      background-position-x: -10ch;
    }
    100% { 
      background-position-x: 10ch;
    }
  }

  .drop {
    position: fixed;
    background: rgba(0,0,0,.90);
    color: white;
    z-index: 5;
    left: 0; top: 0;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
  }
</style>